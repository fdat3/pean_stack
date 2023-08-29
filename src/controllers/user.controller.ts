import { ICrudOption } from '../interfaces';
import { CrudController } from '../controllers/crudController';
import { errorService, userService } from '@/services';
// const iap = require('in-app-purchase');

export class UserController extends CrudController<typeof userService> {
    constructor() {
        super(userService);
    }
    async login(params: any, option?: ICrudOption) {
        return await this.service.login(params, option);
    }
    async register(params: any, option?: ICrudOption) {
        return await this.service.register(params, option);
    }
}
