import { errorService, userService } from '@/services';
import { config } from '@/config';
import * as moment from "moment";
import * as jwt from 'jwt-simple';
import { ERROR_CODE } from '../../const';
import { v1 as uuidv1 } from 'uuid';

export interface IGenerateTokenOption {
    exp?: moment.Moment;
    secret?: string;
}
export interface IDecodeTokenOption {
    secret?: string;
}
export class TokenService {
    constructor() { }

    async generateAndUpdateRefreshToken(
        payload: any,
        role: string,
        option: IGenerateTokenOption = {
            exp: moment().add(99, 'years'),
        },
    ) {
        const secret_refresh_token = uuidv1();
        const secret = option.secret || config.server.secret;

        const result = jwt.encode(
            {
                payload: {
                    refresh_token: secret_refresh_token,
                    user_id: payload.user_id,
                    role: role,
                },
                role: role,
                exp: option.exp,
            },
            secret,
        );
        const user = await userService.updateRefreshToken(
            { refresh_token: [secret_refresh_token] },
            {
                filter: {
                    id: payload.user_id,
                },
                where: undefined
            },
        );
        if (!user) {
            throw errorService.database.customError('Update refresh token fail!', 503);
        }
        return result;
    }


    async decodeRefreshToken(token: string, option?: IDecodeTokenOption) {
        let result = undefined;
        try {
            const secret = (option && option.secret) || config.server.secret;
            result = jwt.decode(token, secret);
        } catch (err) {
            throw errorService.auth.badToken();
        }
        if (result) {
            if (new Date(result.exp).getTime() <= Date.now()) {
                throw errorService.auth.tokenExpired();
            }
            return result;
        } else {
            throw errorService.auth.badToken();
        }
    }

    async generateToken(
        payload: any,
        role: string,
        option: IGenerateTokenOption = {
            exp: moment().add(99, 'years'),
        },
    ) {
        const secret = option.secret || config.server.secret;
        return jwt.encode(
            {
                payload: payload,
                role: role,
                exp: option.exp,
            },
            secret,
        );
    }

    async decodeToken(token: string, option?: IDecodeTokenOption) {
        let result = undefined;
        try {
            const secret = (option && option.secret) || config.server.secret;
            result = jwt.decode(token, secret);
        } catch (err) {
            throw errorService.auth.badToken();
        }
        if (result) {
            if (new Date(result.exp).getTime() <= Date.now()) {
                throw errorService.auth.tokenExpired();
            }

            if (result.role == 'USER') {
                const user = await userService.getItem({
                    filter: { id: result.payload.user_id },
                    paranoid: false,
                    where: undefined
                });

                if (user?.deleted_at) {
                    throw errorService.database.customError('존재하지 않는 계정입니다.', ERROR_CODE.USER_DELETED);
                }
            }
            return result;
        } else {
            throw errorService.auth.badToken();
        }
    }
    async decodeCode(token: string, option?: IDecodeTokenOption) {
        let result = undefined;
        const secret = config.server.secret || '';
        result = jwt.decode(token, secret);
        if (new Date(result?.exp).getTime() <= Date.now()) {
            throw errorService.auth.codeExpired();
        }

        if (result) {
            if (result.payload.code !== option.secret) {
                throw errorService.auth.badCode();
            }
            if (new Date(result?.payload.exp).getTime() <= Date.now()) {
                throw errorService.auth.codeExpired();
            }

            if (result.role == 'USER') {
                const user = await userService.getItem({
                    filter: { id: result.payload.user_id },
                    paranoid: false,
                    where: undefined
                });
            }
            return result;
        } else {
            throw errorService.auth.badToken();
        }
    }
    async getAdminToken(user_id: string, secret: string = '') {
        secret = secret + config.server.secret;
        const refresh_token = await this.generateAndUpdateRefreshToken({ user_id }, 'ADMIN');
        return await this.generateToken(
            {
                user_id,
                role: 'ADMIN',
                refresh_token
            },
            'ADMIN',
            {
                exp: moment().add(99, 'years'),
                secret,
            }
        );
    }
    async getWriteToken(secret: string = '') {
        secret = secret + config.server.secret;
        return await this.generateToken({}, 'write', {
            exp: moment().add(99, 'years'),
            secret,
        });
    }
    async getReadToken(secret: string = '') {
        secret = secret + config.server.secret;
        return await this.generateToken({}, 'read', {
            exp: moment().add(99, 'years'),
            secret,
        });
    }
    async getUserToken(user_id: string, secret: string = '') {
        secret = secret + config.server.secret;
        const user = await userService.getItem({
            filter: {
                id: user_id,
            },
            where: undefined
        });
        if (!user) {
            throw errorService.database.queryFail('User not found to generate jwt token');
        }
        const refresh_token = await this.generateAndUpdateRefreshToken({ user_id }, 'USER');
        return await this.generateToken(
            {
                user_id,
                role: 'USER',
                refresh_token,
            },
            'USER',
            {
                exp: moment().add(99, 'years'),
                secret,
            },
        );
    }


    async getUserAccessToken(token: string, secret: string = '') {
        secret = secret + config.server.secret;
        let result = undefined;
        try {
            result = jwt.decode(token, secret);
        } catch (err) {
            throw errorService.auth.badToken();
        }
        if (result) {
            if (result.role == 'USER') {
                const user = await userService.getItem({
                    filter: { id: result.payload.user_id },
                    paranoid: false,
                    where: undefined
                });

                const result_from_result_token = await this.decodeRefreshToken(result.payload.refresh_token);
                if (
                    result_from_result_token.payload.user_id === result.payload.user_id &&
                    result_from_result_token.payload.refresh_token === user.refresh_token[0]
                ) {
                    return await this.generateToken(
                        {
                            user_id: result_from_result_token.payload.user_id,
                            role: 'USER',
                            refresh_token: result.payload.refresh_token,
                        },
                        'USER',
                        {
                            exp: moment().add(99, 'years'),
                            secret,
                        },
                    );
                } else {
                    throw errorService.auth.badToken();
                }
            }
        } else {
            throw errorService.auth.badToken();
        }
    }

    async getUserTokenForForgetPassWord(email: string, code: string = '') {
        const user = await userService.getItem({
            filter: {
                email,
                login_type: 'INAPP',
            },
            where: undefined
        });
        if (!user) {
            throw errorService.database.customError('User not found to generate code', 404);
        }
        return await this.generateToken(
            {
                user_id: user.id,
                password_md5: user.password,
                role: 'USER',
                code,
            },
            'USER',
            {
                exp: moment().add(3, 'minutes'),
                secret: config.server.secret || '',
            },
        );
    }
    async getUserTokenForForgetPassWordByPhone(phone: string, secret: string = '') {
        secret = secret + config.server.secret;
        const user = await userService.getItem({
            filter: {
                phone,
            },
            where: undefined
        });
        if (!user) {
            throw errorService.database.queryFail('User not found to generate jwt token');
        }
        return await this.generateToken(
            {
                user_id: user.id,
                password_md5: user.password,
                role: 'USER',
            },
            'USER',
            {
                exp: moment().add(30, 'minutes'),
                secret,
            },
        );
    }
    async getUserTokenForEmailVerify(email: string, secret: string = '') {
        secret = secret + config.server.secret;
        const user = await userService.getItem({
            filter: {
                email,
            },
            where: undefined
        });
        if (!user) {
            throw errorService.database.queryFail('User not found to generate jwt token');
        }
        return await this.generateToken(
            {
                user_id: user.id,
                role: 'USER',
            },
            'USER',
            {
                exp: moment().add(30, 'minutes'),
                secret,
            },
        );
    }
    async getTokenSyncSever(user_id: string, secret: string = '') {
        secret = secret || config.server.secret;

        const token = await this.generateToken(
            {
                user_id,
                role: 'SUPERADMIN',
            },
            'SUPERADMIN',
            {
                exp: moment().add(5, 'minutes'),
                secret,
            },
        );

        return `Bearer ${token}`;
    }

    async generateRefreshToken(
        payload: any,
        role: string,
        option: IGenerateTokenOption = {
            exp: moment().add(12, 'months'),
        },
    ) {
        try {
            const secret_refresh_token = uuidv1();
            const secret = option.secret || config.server.secret;

            const result = jwt.encode(
                {
                    payload: {
                        refresh_token: secret_refresh_token,
                        user_id: payload.user_id,
                        role: role,
                    },
                    role: role,
                    exp: option.exp,
                },
                secret,
            );

            return result;
        } catch (e) {
            throw e;
        }
    }

    async getTokenEgency(params: any) {
        const { id } = params;
        const secret = config.server.secret;

        return await this.generateToken(
            {
                user_id: id,
                role: 'AGENCY',
            },
            'AGENCY',
            {
                exp: moment().add(99, 'years'),
                secret,
            },
        );
    }
}
