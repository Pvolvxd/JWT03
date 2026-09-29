import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return RefreshToken;
};