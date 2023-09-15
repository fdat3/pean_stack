'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      field: 'email'
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'email');
  },
};
