import { DataTypes } from 'sequelize';
import { sequelize } from '../base';

export const Order = sequelize.define(
    'orders',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID
        },
        isPay: {
            type: DataTypes.BOOLEAN
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
})
