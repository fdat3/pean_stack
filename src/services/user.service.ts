import { User } from "@/models/tables";
import { CrudService } from "./crudService.pg";
import { ICrudOption } from "@/interfaces";
import userSecurity from "@/security/user";
import { error } from "console";
import { errorService } from ".";
export class UserService extends CrudService<typeof User> {
    private userSecurity: userSecurity

    constructor() {
        super(User);
        this.userSecurity = new userSecurity()
    }
    async updateRefreshToken(params: any, option?: ICrudOption) {
        const item = await this.exec(this.model.findByPk(option.filter.id), {
            allowNull: false,
        });
        await this.exec(item.update(params));
        return await this.getItem(option);
    }

    async register(params: any, option?: ICrudOption) {
        let newUser: any;
        const user = await User.count({
            where: {
                fullname: params.fullname
            }
        })
        if (user > 0) {
            throw errorService.database.customError('Username already exists', 500);
        }
        if (params.password) {
            const encryptedPassword = this.userSecurity.encrypt(params.password)
            newUser = {
                ...params,
                password: encryptedPassword,
            }
        } else {
            newUser = {
                ...params,
            }
        }
        const savedUser = await this.exec(this.create(newUser))
        return savedUser
    }
    async login(params: any, option?: ICrudOption) {
        const user: any = await User.findOne({
            where: {
                fullname: params.fullname
            },
            attributes: ['id', 'fullname', 'password'],
        })
        const checkPass = this.userSecurity.comparePassword(params.password, user.password)
        if (!checkPass || params.fullname !== user.fullname) {
            throw errorService.database.customError('Wrong Password or Wrong name', 500);
        } else {
            return user
        }
    }
}