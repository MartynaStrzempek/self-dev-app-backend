'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    data: DataTypes.DATE,
    note: DataTypes.STRING
  }, {});
  Result.associate = function(models) {
    Result.belongsTo(models.Goal, {
        foreignKey: {
            allowNull: false
        }
    })
    Result.belongsTo(models.Status, {
        foreignKey: {
            allowNull: false
        }
    })
  };
  return Result;
};