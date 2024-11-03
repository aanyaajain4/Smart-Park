'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ArchivedTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      regNum: {
        type: Sequelize.STRING,
        allowNull:false
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      timeIn: {
        type: Sequelize.DATE,
        allowNull:false
      },
      timeOut: {
        type: Sequelize.DATE,
        allowNull:false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull:false
      },
      charges: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,             
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ArchivedTransactions');
  }
};