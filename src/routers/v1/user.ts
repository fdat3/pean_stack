import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenMiddleware } from "@/middlewares";

export default class UserRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.get('/get-total-order', this.createMiddlewares(), this.route(this.getTotalOrder));
    }

    async getTotalOrder(req: Request, res: Response) {
        const data = await userController.getTotalOrder(req.tokenInfo.payload.user_id);
        this.onSuccess(res, data)
    }

    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}