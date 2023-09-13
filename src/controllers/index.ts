import { CrudController } from './crudController';
import { ProductController } from './product.controller';
import { UserController } from './user.controller';
import { OrderController } from './order.controller';

// SECTION
const userController = new UserController();
const productController = new ProductController();
const orderController = new OrderController();
// Crud

// SECTION

export {
  CrudController,
  userController,
  productController,
  orderController
};
