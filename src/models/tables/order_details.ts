import { DataTypes } from 'sequelize';
import { sequelize } from '../base';

export const OrderDetails = sequelize.define(
    'order_details',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        orderId: {
            type: DataTypes.UUID
        },
        pdId: {
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



