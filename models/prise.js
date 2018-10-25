'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prise = sequelize.define('Prise', {
    description: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {});
  Prise.associate = function(models) {
    Prise.hasOne(models.Goal)
  };
  return Prise;
};