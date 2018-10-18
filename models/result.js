'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    status: DataTypes.STRING
  }, {});
  Result.associate = function(models) {
    Result.belongsTo(models.Goal, {
      foreignKey: {
          allowNull: false
      }
    });
    Result.hasOne(models.Note);
  };
  return Result;
};