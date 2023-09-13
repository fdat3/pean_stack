import { ICrudOption } from '../interfaces';
import { CrudController } from './crudController';
import { errorService, orderService } from '@/services';

export class OrderController extends CrudController<typeof orderService> {
    constructor() {
        super(orderService);
    }

    async order(params: any, user_id: any, totalCost: number, totalItem: number) {
        return await this.service.order(params, user_id, totalCost, totalItem);
    }
}