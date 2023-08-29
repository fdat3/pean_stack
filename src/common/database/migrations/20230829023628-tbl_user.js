
const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true
      },
      fullname: {
        type: DataTypes.STRING,
        field: 'fullname'
      },
      password: {
        type: DataTypes.STRING,
        field: 'password'
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
    await queryInterface.dropTable('users');
  },
};