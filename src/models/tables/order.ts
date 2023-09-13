import { DataTypes } from 'sequelize';
import { sequelize } from '../base';

export const Order = sequelize.define(
    'orders',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID
        },
        total_item: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        total_cost: {
            type: DataTypes.INTEGER.UNSIGNED
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
