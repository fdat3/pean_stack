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
            group: ['id']
        })
        const findMax = Math.max(...result.map(item => item.dataValues.sum_qty))
        const bestSeller = result.filter((item) => {
            if (parseInt(item.dataValues.sum_qty) === findMax) {
                return item
            }
        })
        return bestSeller
    }
}