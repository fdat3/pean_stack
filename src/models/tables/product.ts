import { DataTypes } from 'sequelize';
import { sequelize } from '../base';

export const Product = sequelize.define(
    'products',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        productName: {
            type: DataTypes.STRING
        },
        productPrice: {
            type: DataTypes.FLOAT
        },
        productType: {
            type: DataTypes.STRING
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
