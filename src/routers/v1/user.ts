import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenMiddleware } from "@/middlewares";

export default class UserRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.get('/get-cancel-order', this.createMiddlewares(), this.route(this.getCancelOrder));
    }

    async getCancelOrder(req: Request, res: Response) {
        const data = await userController.getCancelOrder(req.tokenInfo.payload.user_id);
        this.onSuccess(res, data)
    }

    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}