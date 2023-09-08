import { ICrudOption } from '../interfaces';
import { CrudController } from '../controllers/crudController';
import { cartService } from '@/services';
import { Request, request } from 'express';

export class CartController extends CrudController<typeof cartService> {
    constructor() {
        super(cartService);
    }
}
