import { Order, OrderDetails } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
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
    async cancelOrder(params: any, body: any) {
        const result = await Order.update(
            {
                status: body.status
            },
            {
                where:
                {
                    id: params.id
                }
            })
        return result
    }
    async convertDateTime(data: any) {
        const options: any = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        };
        return new Date(data).toLocaleString('vi-VI', options);
    }
    async renderHTMLNodeMailer(data: any) {
        let message = (
            '<table style="font-family: arial, sans-serif; border-collapse: collapse; width: 100%;">' +
            '<tr>' +
            '<th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Tên sản phẩm </th>' +
            '<th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Số lượng </th>' +
            '<th style="border: 1px solid #dddddd; text-align: left; padding: 8px;"> Giá tiền </th>' +
            '</tr>'
        );

        for (const item of data) {
            message += (
                '<tr>' +
                '<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' + item.pdName + '</td>' +
                '<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' + item.quantity + '</td>' +
                '<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' + item.totalCost + '</td>' +
                '</tr>'
            );
        }
        message += '</table>';
        return message;
    }
    async sendEmail(data: any) {
        const convertDateTime = await this.convertDateTime(data.createdAt);
        // Get Order List Detail
        const listOrder: any = await OrderDetails.findAll({
            where: {
                order_id: data.id
            },
        })
        //Render Data from Order List Detail to HTML
        let renderListHTML = await this.renderHTMLNodeMailer(listOrder)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: data.user.email,
            subject: 'PEAN-Stack - XÁC NHẬN ĐƠN HÀNG',
            text: `Xin chào, ${data.user.fullname}`,
            html: `<h1>Xin chào, ${data.user.fullname}</h1>
            <p>Chúng tôi đến từ PEAN-Stack, vui lòng xác nhận đơn hàng của bạn: </p>
            <p>MÃ SỐ ĐƠN HÀNG: <strong>${data.id}</strong></p>
            <p>THỜI GIAN: <strong>${convertDateTime}</strong></p>
            <p>TỔNG SỐ SẢN PHẨM: <strong>${data.total_item}</strong></p>
            <p>TỔNG SỐ TIỀN: <strong>${data.total_cost}</strong></p>
            <p>TRẠNG THÁI THANH TOÁN: <strong>${data.isPay === false ? 'CHƯA THANH TOÁN' : 'ĐÃ THANH TOÁN'}</p></strong><br>
            ${renderListHTML}<br>
            Xin cám ơn, vui lòng xác nhận đơn hàng của bạn.
        `,
        };
        transporter.sendMail(mailOptions);
    }
}