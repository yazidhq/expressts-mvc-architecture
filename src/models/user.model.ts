import { Sequelize, DataTypes, Model } from "sequelize";
import { UserType } from "../types/user.type";

export default (sequelize: Sequelize) => {
  const User = sequelize.define<Model<UserType>>("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  });

  return User;
};
