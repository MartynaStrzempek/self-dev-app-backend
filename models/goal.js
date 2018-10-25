'use strict';
module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    goalName: DataTypes.STRING,
    subgoalName: DataTypes.STRING
  }, {});
  Goal.associate = function(models) {
    Goal.hasMany(models.Result);
    Goal.belongsTo(models.Prise, {
        foreignKey: {
            allowNull: false
        }
    });
    Goal.belongsTo(models.User, {
        foreignKey: {
            allowNull: false
        }
    });
  };
  return Goal;
};