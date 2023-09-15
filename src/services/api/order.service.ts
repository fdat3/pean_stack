import { Order, OrderDetails } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import { error } from "console";
import { errorService } from "..";
const nodemailer = require('nodemailer');



export class OrderService extends CrudService<typeof Order> {

    constructor() {
        super(Order);
    }

    async order(params: any, user_id: any, totalCost: number, totalItem: number) {
        const data: Array<String | Number>[] = params.cart;
        const check = await this.exec(this.model.create({
            user_id: user_id,
            total_item: totalItem,
            total_cost: totalCost,
            isPay: false
        }))
        for (let index = 0; index < data.length; index++) {
            const element: any = data[index];
            await OrderDetails.create({
                order_id: check.id,
                quantity: element.qty,
                totalCost: element.cost,
                pdName: element.pd_name
            })
        }
        const sendEmail = await this.model.findOne({
            where: {
                id: check.id
            },
            include: [
                {
                    association: 'user'
                }
            ]
        })
        await this.sendEmail(sendEmail);
        return check
    }

    async sendEmail(data: any) {
        const convertDateTime = new Date(data.createdAt).toLocaleString("vi-VI");
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: 'omln coak wihn dycc',
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: data.user.email,
            subject: 'PEAN-Stack - XÁC NHẬN ĐƠN HÀNG',
            text: `Xin chào, ${data.user.fullname}`,
            html: `${convertDateTime}`,
        };
        transporter.sendMail(mailOptions);
    }
}