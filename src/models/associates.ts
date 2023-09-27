import {
    Order,
    OrderDetails,
    Product,
    User,
} from '../models/tables/';

Order.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
})
User.hasMany(Order, {
    as: 'orders',
    foreignKey: 'user_id'
})
Order.hasMany(OrderDetails, {
    as: 'order_details',
    foreignKey: 'order_id'
})
OrderDetails.belongsTo(Order, {
    as: 'order',
    foreignKey: 'order_id'
})
OrderDetails.hasMany(Product, {
    as: 'products',
    foreignKey: 'id'
})