import { Request, Response } from "express";
import db from "../models";
import Helper from "../helpers";

const UserModel = db.user;

export class UserController {
  public static async create(req: Request, res: Response) {
    const data = req.body;

    try {
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

  public static async read(req: Request, res: Response) {
    try {
      const result = await Helper.filter({
        model: UserModel,
        query: req.query,
        concatFields: ["username", "email", "name"],
      });

      return res.status(200).json({
        success: true,
        message: "Get all data successfully",
        page: result.page,
        totalPages: result.totalPages,
        data: result.data,
        dataCount: result.count,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async readOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await UserModel.findByPk(id);

      return res.status(200).json({
        success: true,
        message: "Get one data successfully",
        data: data,
        dataCount: 1,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async update(req: Request, res: Response) {
    const data = req.body;
    const { id } = req.params;

    try {
      const old_data = await UserModel.findByPk(id);
      const updated = await old_data?.update(data);

      return res.status(200).json({
        success: true,
        message: "Data updated successfully",
        data: updated,
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

  public static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const old_data = await UserModel.findByPk(id);
      const deleted = await old_data?.destroy();

      return res.status(200).json({
        success: true,
        message: "Data deleted successfully",
        data: deleted,
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

  public static async truncate(req: Request, res: Response) {
    try {
      const truncated = await UserModel.truncate({
        cascade: true,
        restartIdentity: true,
      });

      return res.status(200).json({
        success: true,
        message: "Data truncated successfully",
        data: truncated,
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
}
