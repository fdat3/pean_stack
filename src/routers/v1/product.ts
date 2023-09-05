import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { productController, userController } from "@/controllers";
import { tokenService } from "@/services";
import { adminMiddleware, authMiddleware } from "@/middlewares";
import { CrudRouter } from "../crud.pg";

export default class ProductRouter extends CrudRouter<typeof productController> {
    constructor() {
        super(productController);
    }
    async add(req: Request, res: Response) {
        req.body.user_id = req.tokenInfo.payload.user_id;
        const data = await productController.add(req.body);
        this.onSuccess(res, data);
    }
    createMiddlewares(): any[] {
        return [authMiddleware.run()];
    }
}   