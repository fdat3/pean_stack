import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { tokenMiddleware } from "@/middlewares";
import { CONST } from "@/config/const";
const paypal = require('paypal-rest-sdk');
paypal.configure({
    mode: 'sandbox', //sandbox or live
    client_id: CONST.client_id,
    client_secret: CONST.client_secret,
});

export default class PaypalRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/', this.route(this.pay));
        this.router.get('/success', this.route(this.success));
    }

    async pay(req: Request, res: Response) {
        var create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `https://server.fansome.kr:9877/api/v1/paypal/success/${req.body.sku}`,
                cancel_url: `https://server.fansome.kr:9877/api/v1/paypal/cancel/${req.body.sku}`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: `${req.body.name}`,
                                price: `${req.body.price}`,
                                currency: `${req.body.currency}`,
                                quantity: `${req.body.quantity}`,
                            },
                        ],
                    },
                    amount: {
                        currency: `${req.body.currency}`,
                        total: `${req.body.total}`,
                    },
                },
            ],
        };

        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
            if (error) {
                throw error;
            } else {
                res.redirect(payment.links[1].href);
            }
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