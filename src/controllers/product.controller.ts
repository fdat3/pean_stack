import { ICrudOption } from '../interfaces';
import { CrudController } from '../controllers/crudController';
import { errorService, productService } from '@/services';
import { ProductService } from '@/services/api/product.service';

export class ProductController extends CrudController<typeof productService> {
    constructor() {
        super(productService);
    }
    async add(params: any, option?: ICrudOption) {
        return await this.service.add(params, option);
    }
}
