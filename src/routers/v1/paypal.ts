import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { tokenMiddleware } from "@/middlewares";
const paypal = require('paypal-rest-sdk');


export default class PaypalRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/', this.route(this.pay));
        this.router.get('/success', this.route(this.success));
    }

    async pay(req: Request, res: Response) {
        const data: Array<String | Number>[] = req.session.cart;
        const totalCost: number = req.session.totalCost
        let payload;
        for (let index = 0; index < data.length; index++) {
            const value: any = data[index];
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:4000/success",
                    "cancel_url": "http://localhost:4000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": `${value.pd_name}`,
                            "price": `${value.pd_price}`,
                            "currency": "USD",
                            "quantity": `${value.qty}`
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": `${totalCost}`
                    },
                    "description": "This is the payment description."
                }]
            }
            payload = create_payment_json
        }
        paypal.payment.create(payload, (error: any, payment: any) => {
            if (error) throw error;

            payment.links.forEach((link: any) => {
                if (link.rel === 'approval_url') {
                    res.redirect(link.href);
                }
            });
        });
    }
    async success(req: Request, res: Response) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const data = req.session.totalCost

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions":
                [
                    {
                        "amount": { "currency": "USD", "total": `${data}` }
                    }
                ]
        }

        paypal.payment.execute(paymentId, execute_payment_json, (error: any, payment: any) => {
            if (error) throw error;
            res.send('success payment');
        });
    }

    createMiddlewares(): any[] {
        return [tokenMiddleware.run()];
    }
}