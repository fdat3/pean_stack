import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenService } from "@/services";
import { authMiddleware } from "@/middlewares";

export default class CartRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/add/:id', this.createMiddlewares(), this.route(this.add));
    }
    async add(req: Request, res: Response) {

    }
    createMiddlewares(): any[] {
        return [authMiddleware.run()];
    }
}   