'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Slot.init({
    number: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    isFree: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Slot',
  });
  return Slot;
};