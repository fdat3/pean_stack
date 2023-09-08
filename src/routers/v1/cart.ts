import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { tokenMiddleware } from "@/middlewares";
import { cartController } from "@/controllers";

export default class CartRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/add', this.createMiddlewares(), this.route(this.add));
        this.router.get('/', this.createMiddlewares(), this.route(this.get));
    }

    async add(req: Request, res: Response) {
        try {
            const data = req.body;
            let qty = 0;
            let cost = 0;
            let cart = req.session.cart ? req.session.cart : [];
            req.session.cart = cart
            const checkItem = cart.find((item: any) => item.pd_id === data.pd_id)
            if (!checkItem) {
                cart.push({ ...data, qty, cost })
            }
            for (let index = 0; index < cart.length; index++) {
                const element = cart[index];
                if (element.pd_id === data.pd_id) {
                    element.qty++;
                    element.cost = element.qty * element.pd_price;
                }
            }
            this.onSuccessAsList(res, cart)
        } catch (error) {
            throw error
        }
    }

    async get(req: Request, res: Response) {
        const data: Array<String | Number>[] = req.session.cart;
        const initialValue = 0;
        const totalCost = data.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.cost, initialValue);
        this.onSuccess(res, { ...data, totalCost })
    }
    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}   