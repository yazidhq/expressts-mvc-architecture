import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config";
import userModel from "./user.model";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const User = userModel(sequelize);

interface DB {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  user: ReturnType<typeof userModel>;
}

const db: DB = {
  Sequelize,
  sequelize,
  user: User,
};

export default db;
