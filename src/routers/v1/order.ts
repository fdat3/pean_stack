import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { tokenMiddleware } from "@/middlewares";
import { orderController } from "@/controllers";

export default class OrderRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.get('/', this.createMiddlewares(), this.route(this.get));
        this.router.post('/', this.createMiddlewares(), this.route(this.order));
        this.router.put('/update-status/:id', this.createMiddlewares(), this.route(this.updateOrderStatus));
        this.router.get('/get-total-order-by-day', this.createMiddlewares(), this.route(this.getTotalOrderbyDay))
    }

    async get(req: Request, res: Response) {
        const data: Array<String | Number>[] = req.session.cart;
        const totalCost = req.session.totalCost;
        const totalItem = req.session.totalItem;
        this.onSuccessAsList(res, { data, totalCost, totalItem });
    }
    async getTotalOrderbyDay(req: Request, res: Response) {
        req.body.user_id = req.tokenInfo.payload.user_id;
        const data = await orderController.getTotalOrderbyDay(req.body, req.body.user_id);
        this.onSuccessAsList(res, data);
    }

    async order(req: Request, res: Response) {
        req.body.user_id = req.tokenInfo.payload.user_id;
        const totalItem: number = req.session.totalItem;
        const totalCost: number = req.session.totalCost;
        const data = await orderController.order(req.session, req.body.user_id, totalCost, totalItem);
        this.onSuccessAsList(res, data)
    }

    async updateOrderStatus(req: Request, res: Response) {
        const data = await orderController.updateOrderStatus(req.params, req.body);
        this.onSuccess(res, data)
    }

    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}