import { Order, OrderDetails } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import { error } from "console";
import { errorService } from "..";
import { Request, Response, BaseRouter } from "@/routers/base";
import { UUID, or } from "sequelize";
import { UUIDV1 } from "sequelize";

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
        return check
    }
}