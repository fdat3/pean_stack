import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenService } from "@/services";
import { adminMiddleware } from "@/middlewares";

export default class CartRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/add', this.createMiddlewares(), this.route(this.add));
    }
    async add(req: Request, res: Response) {

    }
    createMiddlewares(): any[] {
        return [adminMiddleware.run()];
    }
}   