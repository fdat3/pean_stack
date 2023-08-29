import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenService } from "@/services";

export default class AuthRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/login', this.route(this.login));
        this.router.post('/register', this.route(this.register));
    }
    async login(req: Request, res: Response) {
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'USER';
        }
        const token = await tokenService.getUserToken(data.id);
        this.onSuccess(res, { result: data, token });
    }
    async register(req: Request, res: Response) {
        const result = await userController.register(req.body);
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'USER';
        }
        const token = await tokenService.getUserToken(data.id);
        this.onSuccess(res, { result: result, token });
    }
}