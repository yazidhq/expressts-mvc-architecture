import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../models";
import { Op } from "sequelize";
import jwt, { Algorithm, JwtPayload, SignOptions } from "jsonwebtoken";

const UserModel = db.user;

const generateToken = (payload: JwtPayload | object) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as Number | String,
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
    } as SignOptions
  );
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
        return res.status(400).json({
          success: false,
          message: `Email or username has already registered`,
          data: {},
        });
      }

      if (data.password === data.confirmPassword) {
        data.password = bcrypt.hashSync(data.password, 10);
      } else {
        return res.status(400).json({
          success: false,
          message: `Password and password confirmation must be same`,
          data: {},
        });
      }

      const created = await UserModel.create(data);

      return res.status(201).json({
        success: true,
        message: "Data created successfully",
        data: created,
        dataCount: 0,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
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
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
          data: {},
        });
      }

      const token = generateToken({
        id: user.get("id"),
        username: user.get("username"),
        email: user.get("email"),
      });

      const result = { token, user };

      return res.status(200).json({
        success: true,
        message: "Token generated successfully",
        data: result,
        dataCount: 0,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
        stack: error.stack,
      });
    }
  }
}
