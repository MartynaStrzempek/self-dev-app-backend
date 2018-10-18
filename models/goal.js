'use strict';
module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    name: DataTypes.STRING,
    subname: DataTypes.STRING,
    prise: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {});
  Goal.associate = function(models) {
    Goal.hasMany(models.Result);
  };
  return Goal;
};