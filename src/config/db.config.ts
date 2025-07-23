import { DBConfig } from "../types/db_config.type";
import { Dialect } from "sequelize";

let dbConfig: DBConfig;
switch (process.env.APP_ENV) {
  case "development":
    dbConfig = {
      HOST: process.env.DB_HOST_DEV || "",
      USER: process.env.DB_USERNAME_DEV || "",
      PASSWORD: process.env.DB_PASSWORD_DEV || "",
      DB: process.env.DB_NAME_DEV || "",
      dialect: process.env.DB_DIALECT_DEV as Dialect,
      timezone: "+07:00",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };
    break;

  case "production":
    dbConfig = {
      HOST: process.env.DB_HOST_PROD || "",
      USER: process.env.DB_USERNAME_PROD || "",
      PASSWORD: process.env.DB_PASSWORD_PROD || "",
      DB: process.env.DB_NAME_PROD || "",
      dialect: process.env.DB_DIALECT_PROD as Dialect,
      timezone: "+07:00",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };
    break;

  default:
    dbConfig = {
      HOST: process.env.DB_HOST_PROD || "",
      USER: process.env.DB_USERNAME_PROD || "",
      PASSWORD: process.env.DB_PASSWORD_PROD || "",
      DB: process.env.DB_NAME_PROD || "",
      dialect: process.env.DB_DIALECT_PROD as Dialect,
      timezone: "+07:00",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };
    break;
}

export default dbConfig;
