import { ErrorService } from './errorService';
import { UtilService } from "@/services/utilService";
// Crud
import { ICrudExecOption, CrudService } from './crudService';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { ScheduleService } from './scheduleService';

// SECTION

const errorService = new ErrorService();
const utilService = new UtilService();
const userService = new UserService();
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
};
