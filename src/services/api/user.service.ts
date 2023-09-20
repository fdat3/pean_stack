import { User } from "@/models/tables";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import userSecurity from "@/security/user";
import { errorService } from "..";
import moment from "moment";
import { Sequelize } from "sequelize";
export class UserService extends CrudService<typeof User> {
    private userSecurity: userSecurity

    constructor() {
        super(User);
        this.userSecurity = new userSecurity()
    }
    async getCancelOrder(params: any, option?: ICrudOption) {
        const result = await User.findOne({
            where: {
                id: params
            },
            include: {
                association: 'orders',
                where: {
                    deleted_at: null
                }
            }
        })
        return result
    }
    async updateRefreshToken(params: any, option?: ICrudOption) {
        const item = await this.exec(this.model.findByPk(option.filter.id), {
            allowNull: false,
        });
        await this.exec(item.update(params));
        return await this.getItem(option);
    }
    async checkRefreshToken(params: any, option?: ICrudOption) {
        const item = await this.exec(this.model.findByPk(params.user_id), {
            allowNull: false,
        });
        return item;
    }
    async validateUsername(params: any) {
        const checkUsername = await User.count({
            where: {
                fullname: params
            }
        })
        if (checkUsername > 0) {
            throw errorService.database.customError('Username already exist!', 500);
        } else {
            return;
        }
    }
    async validateEmail(params: any) {
        const checkEmail = await User.count({
            where: {
                email: params
            }
        })
        if (checkEmail > 0) {
            throw errorService.database.customError('Email already exist!', 500);
        } else {
            return;
        }
    }
    async register(params: any, option?: ICrudOption) {
        try {
            let newUser: any;
            const checkUsername: any = await this.validateUsername(params.fullname)
            const checkEmail: any = await this.validateEmail(params.email)
            if (checkUsername > 0 || checkEmail > 0) {
                throw errorService.database.customError('Can not register user !', 500)
            } else {
                const encryptedPassword = this.userSecurity.encrypt(params.password)
                newUser = {
                    ...params,
                    password: encryptedPassword,
                }
            }
            const savedUser = await this.exec(this.create(newUser))
            return savedUser
        } catch (error) {
            throw error
        }
    }
    async login(params: any, option?: ICrudOption) {
        const user: any = await User.findOne({
            where: {
                email: params.email
            },
            attributes: ['id', 'email', 'password'],
        })
        const checkPass = this.userSecurity.comparePassword(params.password, user.password)
        if (!checkPass || params.email !== user.email) {
            throw errorService.database.customError('Wrong Password or Wrong name', 500);
        } else {
            delete user.dataValues.password
            return user
        }
    }
}