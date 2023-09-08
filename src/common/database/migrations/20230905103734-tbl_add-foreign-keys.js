const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('carts', {
      fields: ['pd_id'],
      type: 'foreign key',
      name: 'carts_id_fkey',
      references: {
        table: 'products',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('carts', 'carts_id_fkey')
  }
};