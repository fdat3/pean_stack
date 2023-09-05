
const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true
      },
      productName: {
        type: DataTypes.STRING,
        field: 'product_name'
      },
      productPrice: {
        type: DataTypes.FLOAT,
        field: 'product_price'
      },
      productType: {
        type: DataTypes.STRING,
        field: 'product_type'
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
    await queryInterface.dropTable('products');
  },
};