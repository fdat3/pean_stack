import { Request, Response } from "@/routers/base";
import { productController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { CrudRouter } from "../crud.pg";

export default class ProductRouter extends CrudRouter<typeof productController> {
    constructor() {
        super(productController);
    }
    createMiddlewares(): any[] {
        return [authMiddleware.run()];
    }
}   