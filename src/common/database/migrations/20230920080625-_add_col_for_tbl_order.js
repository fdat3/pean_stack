'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'status', {
      type: Sequelize.ENUM,
      values: ['ACTIVE', 'PENDING', 'DELETE'],
      field: 'status'
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'status');
  },
};
