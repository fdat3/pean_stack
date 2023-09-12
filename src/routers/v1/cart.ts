import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { tokenMiddleware } from "@/middlewares";
import { errorService } from "@/services";

export default class CartRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/add', this.createMiddlewares(), this.route(this.add));
        this.router.get('/', this.route(this.get));
        this.router.delete('/remove/:id', this.createMiddlewares(), this.route(this.remove));
    }

    async add(req: Request, res: Response) {
        try {
            const data = req.body;
            let qty = 1;
            let cost: number = data.pd_price;
            let cart = req.session.cart ? req.session.cart : [];
            req.session.cart = cart
            const checkItem = cart.find((item: any) => item.pd_id === data.pd_id)
            if (!checkItem) {
                cart.push({ ...data, qty, cost })
            } else {
                for (let index = 0; index < cart.length; index++) {
                    const element = cart[index];
                    if (element.pd_id === data.pd_id) {
                        element.qty++;
                        element.cost = element.qty * element.pd_price;
                    }
                }
            }
            this.onSuccessAsList(res, cart)
        } catch (error) {
            throw error
        }
    }

    async get(req: Request, res: Response) {
        const initialValue = 0;
        const data: Array<string | number>[] = req.session.cart;
        const totalCost = data.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.cost, initialValue);
        let total = req.session.totalCost ? req.session.totalCost : totalCost;
        req.session.totalCost = totalCost;
        this.onSuccess(res, { ...data, total })
    }

    async remove(req: Request, res: Response) {
        const data: Array<String | Number>[] = req.session.cart;
        const getId = req.params.id
        const checkItem = data.find((item: any) => item.pd_id === getId)
        try {
            if (checkItem) {
                data.map((item: any) => {
                    if (item.qty > 0) {
                        item.qty--;
                        item.cost = item.qty * item.pd_price;
                    }
                })
            } else {
                throw errorService.database.customError('Không tìm thấy giỏ hàng!', 500);
            }
        } catch (error) {
            throw error
        }
        this.onSuccess(res, data)
    }
    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}   