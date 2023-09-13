import { DataTypes } from 'sequelize';
import { sequelize } from '../base';

export const OrderDetails = sequelize.define(
    'order_details',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        orderId: {
            type: DataTypes.UUID
        },
        pdName: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        totalCost: {
            type: DataTypes.INTEGER.UNSIGNED
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



