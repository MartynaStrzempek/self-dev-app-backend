'use strict';
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    content: DataTypes.STRING
  }, {});
  Note.associate = function(models) {
    Note.belongsTo(models.Result, {
      foreignKey: {
          allowNull: false
      }
    });
  };
  return Note;
};