import { CrudController } from './crudController';
import { ProductController } from './product.controller';
import { UserController } from './user.controller';

// SECTION
const userController = new UserController();
const productController = new ProductController();
// Crud

// SECTION

export {
  CrudController,
  userController,
  productController
};
