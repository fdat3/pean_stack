const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_details', {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true
      },
      orderId: {
        type: DataTypes.UUID,
        field: 'order_id'
      },
      pdName: {
        type: DataTypes.STRING,
        field: 'pd_name'
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'quantity'
      },
      totalCost: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'total_cost'
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
    await queryInterface.dropTable('order_details');
  },
};