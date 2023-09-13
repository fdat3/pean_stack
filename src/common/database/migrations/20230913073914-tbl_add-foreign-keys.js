const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'orders_user_id_fkey',
      references: {
        table: 'users',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('order_details', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'order_details_order_id_fkey',
      references: {
        table: 'orders',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('carts', 'carts_id_fkey')
    await queryInterface.removeConstraint('orders', 'orders_user_id_fkey')
    await queryInterface.removeConstraint('order_details', 'order_details_order_id_fkey')
  }
};