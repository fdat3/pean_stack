import { Request, Response } from "@/routers/base";
import { productController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { CrudRouter } from "../crud.pg";
import * as express from 'express';


export default class ProductRouter extends CrudRouter<typeof productController> {
    router: express.Router;
    constructor() {
        super(productController);
        this.router = express.Router();
        this.router.get('/chart/best-seller', this.createMiddlewares(), this.route(this.bestSeller))
    }
    createMiddlewares(): any[] {
        return [authMiddleware.run()];
    }
    async bestSeller(req: Request, res: Response) {
        const data = await productController.bestSeller(req.body);
        this.onSuccess(res, data);
    }
}   