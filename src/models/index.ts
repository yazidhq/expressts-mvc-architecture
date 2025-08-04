import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config";
import userModel from "./user.model";
import refreshTokenModel from "./refresh_token.model";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

interface DB {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  user: ReturnType<typeof userModel>;
  refreshToken: ReturnType<typeof refreshTokenModel>;
}

const User = userModel(sequelize);
const RefreshToken = refreshTokenModel(sequelize);

const db: DB = {
  Sequelize,
  sequelize,
  user: User,
  refreshToken: RefreshToken,
};

db.user.hasMany(db.refreshToken, { foreignKey: "userId", as: "refresh_token" });
db.refreshToken.belongsTo(db.user, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default db;
