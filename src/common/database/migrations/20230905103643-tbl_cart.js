const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carts', {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true
      },
      pdId: {
        type: DataTypes.UUID,
        field: 'pd_id'
      },
      pdName: {
        type: DataTypes.STRING,
        field: 'pd_name'
      },
      pdQuantity: {
        type: DataTypes.STRING,
        field: 'pd_quantity'
      },
      pdPrice: {
        type: DataTypes.STRING,
        field: 'pd_price'
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
    await queryInterface.dropTable('carts');
  },
};