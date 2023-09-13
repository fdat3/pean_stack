
const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        field: 'user_id'
      },
      isPay: {
        type: DataTypes.BOOLEAN,
        field: 'is_pay'
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};