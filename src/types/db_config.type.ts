import { Dialect } from "sequelize";

export interface DBConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  DB: string;
  dialect: Dialect;
  timezone: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}
