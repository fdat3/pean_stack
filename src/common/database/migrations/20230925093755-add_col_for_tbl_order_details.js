'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_details', 'pd_id', {
      type: Sequelize.UUID,
      field: 'pd_id',
      primaryKey: true
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_details', 'pd_id');
  },
};
