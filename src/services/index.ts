import { ErrorService } from './errorService';
import { UtilService } from "@/services/utilService";
// Crud
import { ICrudExecOption, CrudService } from './crudService';
import { UserService } from './api/user.service';
import { TokenService } from './token/token.service';
import { ScheduleService } from './scheduleService';
import { ProductService } from './api/product.service';

// SECTION

const errorService = new ErrorService();
const utilService = new UtilService();
const userService = new UserService();
const productService = new ProductService();
const tokenService = new TokenService();
const scheduleService = new ScheduleService();
// Crud


// SECTION

export {
  CrudService,
  ICrudExecOption,
  utilService,
  errorService,
  userService,
  tokenService,
  scheduleService,
  productService
};
