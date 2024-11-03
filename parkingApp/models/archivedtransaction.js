'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArchivedTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ArchivedTransaction.init({
    regNum: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    timeIn: DataTypes.DATE,
    timeOut: DataTypes.DATE,
    reason: DataTypes.STRING,
    charges: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ArchivedTransaction',
  });
  return ArchivedTransaction;
};