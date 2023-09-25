const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('order_details', {
      fields: ['pd_id'],
      type: 'foreign key',
      name: 'order_details_id_fkey',
      references: {
        table: 'products',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('order_details', 'order_details_id_fkey')
  }
};