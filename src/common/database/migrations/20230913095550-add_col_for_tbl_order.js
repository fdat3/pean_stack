'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'total_item', {
      type: Sequelize.INTEGER,
      field: 'total_item'
    });
    await queryInterface.addColumn('orders', 'total_cost', {
      type: Sequelize.INTEGER,
      field: 'total_cost'
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'total_item');
    await queryInterface.removeColumn('orders', 'total_cost');
  },
};
