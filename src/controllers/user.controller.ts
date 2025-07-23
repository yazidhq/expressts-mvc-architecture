import { Request, Response } from "express";
import db from "../models";

const User = db.user;

export class userController {
  public static async create(req: Request, res: Response) {
    const data = req.body;

    try {
      const created = await User.create(data);

      res.status(201).json({
        success: true,
        message: "Data created successfully",
        data: created,
        data_count: 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async read(req: Request, res: Response) {
    try {
      const data = await User.findAll();

      res.status(200).json({
        success: true,
        message: "Get all data successfully",
        data: data,
        data_count: data.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async readOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await User.findByPk(id);

      res.status(200).json({
        success: true,
        message: "Get one data successfully",
        data: data,
        data_count: 1,
      });
    } catch (error) {
      res.status(500).json({
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
      const old_data = await User.findByPk(id);
      const updated = await old_data?.update(data);

      res.status(200).json({
        success: true,
        message: "Data updated successfully",
        data: updated,
        data_count: 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const old_data = await User.findByPk(id);
      const deleted = await old_data?.destroy();

      res.status(200).json({
        success: true,
        message: "Data deleted successfully",
        data: deleted,
        data_count: 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }

  public static async truncate(req: Request, res: Response) {
    try {
      const truncated = await User.truncate({
        cascade: true,
        restartIdentity: true,
      });

      res.status(200).json({
        success: true,
        message: "Data truncated successfully",
        data: truncated,
        data_count: 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error}`,
        data: {},
      });
    }
  }
}
