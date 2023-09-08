import { Cart, Product } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import userSecurity from "@/security/user";
import { error } from "console";
import { errorService } from "..";
import { request, response } from "express";
import { Request } from "node-fetch";
export class CartService extends CrudService<typeof Cart> {
    constructor() {
        super(Cart);
    }
}