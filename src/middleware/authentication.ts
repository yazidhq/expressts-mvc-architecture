import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../models";

const UserModel = db.user;

export default class AuthenticationMiddleware {
  public static async authenticate(req: Request, res: Response, next: NextFunction) {
    let token;
    const headerAuth = req.headers.authorization;

    if (headerAuth && headerAuth.startsWith("Bearer")) {
      token = headerAuth.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: `Unauthorized`,
        data: {},
      });
    }

    const verified: JwtPayload = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const userInstance = await UserModel.findByPk(verified.id);
    const user = userInstance?.get({ plain: true });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User not found`,
        data: {},
      });
    }

    next();
  }

  public static async restrictTo(req: Request, res: Response, next: NextFunction) {}
}
