import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import jwt, { Algorithm, JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../helpers/appError";

import db from "../models";
const { user: UserModel, refreshToken: RefreshTokenModel } = db;

const generateAccessToken = (payload: JwtPayload | object) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as Number | String,
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
    } as SignOptions
  );
};

const generateRefreshToken = (payload: JwtPayload | object) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as Number | String,
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
    } as SignOptions
  );
};

const createRefreshToken = async (userId: number, token: string) => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  let parseExpires = 0;
  const unit = expiresIn.slice(-1);
  const valueStr = expiresIn.slice(0, -1);
  const value = Number(valueStr);

  if (isNaN(value)) {
    throw new Error("Invalid JWT_REFRESH_EXPIRES_IN format: numeric part is not a number");
  }

  switch (unit) {
    case "d":
      parseExpires = value * 24 * 60 * 60 * 1000;
      break;
    case "h":
      parseExpires = value * 60 * 60 * 1000;
      break;
    case "m":
      parseExpires = value * 60 * 1000;
      break;
    case "s":
      parseExpires = value * 1000;
      break;
    default:
      throw new Error(`Invalid time unit in JWT_REFRESH_EXPIRES_IN: ${unit}`);
  }
  const expiresAt: Date = new Date(Date.now() + parseExpires);

  await RefreshTokenModel.create({ userId, token, expiresAt } as any);
};

export default class AuthController {
  public static async signUp(req: Request, res: Response) {
    const data = req.body;

    try {
      const emailOrUsernameExist = await UserModel.findOne({
        where: {
          [Op.or]: {
            username: data.username,
            email: data.email,
          },
        },
      });

      if (emailOrUsernameExist) {
        throw new AppError("Email or username has already registered", 400);
      }

      if (data.password === data.confirmPassword) {
        data.password = bcrypt.hashSync(data.password, 10);
      } else {
        throw new AppError("Password and password confirmation must be same", 400);
      }

      const user = await UserModel.create(data);
      delete (user as any).password;
      delete (user as any).deletedAt;

      const accessToken = generateAccessToken({ id: user.get("id"), username: user.get("username"), email: user.get("email") });
      const refreshToken = generateRefreshToken({ id: user.get("id"), username: user.get("username"), email: user.get("email") });
      await createRefreshToken(user?.get("id") as number, refreshToken);

      const result = { user, accessToken, refreshToken };
      return res.status(201).json({
        success: true,
        message: "Data created successfully",
        data: result,
        dataCount: 0,
      });
    } catch (error) {
      throw new AppError(`Internal server error: ${error}`, 500);
    }
  }

  public static async signIn(req: Request, res: Response) {
    const { emailOrUsername, password } = req.body;

    try {
      const user = await UserModel.findOne({
        where: {
          [Op.or]: {
            username: emailOrUsername,
            email: emailOrUsername,
          },
        },
      });

      if (!user || !(await bcrypt.compare(password, user?.get("password") as string))) {
        throw new AppError("Invalid credentials", 401);
      }

      const accessToken = generateAccessToken({ id: user.get("id"), username: user.get("username"), email: user.get("email") });
      const refreshToken = generateRefreshToken({ id: user.get("id"), username: user.get("username"), email: user.get("email") });
      await createRefreshToken(user?.get("id") as number, refreshToken);

      const result = { user, accessToken, refreshToken };
      return res.status(200).json({
        success: true,
        message: "Access token generated successfully",
        data: result,
        dataCount: 0,
      });
    } catch (error: any) {
      throw new AppError(`Internal server error: ${error}`, 500);
    }
  }

  public static async refreshToken(req: Request, res: Response) {
    const { token } = req.query;

    if (!token) throw new AppError("Token is required", 400);

    try {
      const storedToken = await RefreshTokenModel.findOne({ where: { token: token } } as any);
      if (!storedToken || storedToken.getDataValue("expiresAt") < new Date()) {
        throw new AppError("Token expired or not found", 400);
      }

      let decoded;
      try {
        decoded = jwt.verify(token as string, process.env.JWT_REFRESH_SECRET as string);
      } catch (error) {
        throw new AppError("Invalid token", 400);
      }

      const user = await UserModel.findByPk((decoded as any).id);
      if (!user) throw new AppError("User not found", 400);

      const newAccessToken = generateAccessToken({ id: user?.get("id"), username: user?.get("username"), email: user?.get("email") });
      const newRefreshToken = generateRefreshToken({ id: user?.get("id"), username: user?.get("username"), email: user?.get("email") });
      await createRefreshToken(user?.get("id") as number, newRefreshToken);

      const result = { user, newAccessToken, newRefreshToken };
      return res.status(200).json({
        success: true,
        message: "Refresh token generated successfully",
        data: result,
        dataCount: 0,
      });
    } catch (error) {
      throw new AppError(`Internal server error: ${error}`, 500);
    }
  }
}
