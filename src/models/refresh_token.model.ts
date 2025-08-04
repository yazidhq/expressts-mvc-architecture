import { Sequelize, DataTypes, Model } from "sequelize";
import { RefreshTokenType } from "../types/refresh_token.type";

export default (sequelize: Sequelize) => {
  const RefreshToken = sequelize.define<Model<RefreshTokenType>>("refresh_token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  });

  return RefreshToken;
};
