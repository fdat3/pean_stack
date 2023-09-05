import { Product } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import userSecurity from "@/security/user";
import { error } from "console";
import { errorService } from "..";
export class ProductService extends CrudService<typeof Product> {

    constructor() {
        super(Product);
    }
    async add(params: any, option?: ICrudOption) {
        let newProduct = { ...params };
        const result = this.exec(this.model.create(newProduct));
        return result
    }
}