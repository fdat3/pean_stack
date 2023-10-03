import { Product } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import userSecurity from "@/security/user";
import { error } from "console";
import { errorService } from "..";
import sequelize from "sequelize";
export class ProductService extends CrudService<typeof Product> {

    constructor() {
        super(Product);
    }
    async add(params: any, option?: ICrudOption) {
        let newProduct = { ...params };
        const result = this.exec(this.model.create(newProduct));
        return result
    }

    async bestSeller(params: any, option?: ICrudOption) {
        const sum_qty: any = [
            sequelize.literal(`(
              SELECT
              COALESCE(SUM("order_details"."quantity"), 0) as "sum_qty"
              FROM
              "order_details" as "order_details"
              where "products"."id" = "order_details"."pd_id"
            )`),
            'sum_qty',
        ];
        const result = await Product.findAll({
            logging: true,
            attributes: {
                include: [sum_qty],
            },
            order: [[sequelize.literal('sum_qty'), 'DESC']],
            limit: 1,
            group: ['id']
        })
        return result
    }
}