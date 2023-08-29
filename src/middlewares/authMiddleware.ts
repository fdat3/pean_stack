import { BaseMiddleware } from './base';
import { errorService, tokenService, userService } from '@/services';
import { ICrudOption } from '../interfaces'
import * as express from 'express';
import { Request, Response } from '@/routers/base';
const HEADERS = 'authorization';
export class AuthInfoMiddleware extends BaseMiddleware {
    async use(req: Request, res: Response, next: express.NextFunction, providers: string[] = []) {
        if (!!req.headers[HEADERS]) {
            const bearerHeader = req.headers[HEADERS].toString();
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            const result = await tokenService.decodeToken(bearerToken);

            if (result.payload.role === 'USER') {
                const result_from_refresh_token = await tokenService.decodeToken(result.payload.refresh_token);
                const refresh_token = result_from_refresh_token.payload.refresh_token;
                const user_id = result_from_refresh_token.payload.user_id;
                const user = await userService.checkRefreshToken({ user_id });
                if (user) {
                    if (refresh_token != user.refresh_token) {
                        throw errorService.auth.permissionDeny();
                    }
                }
                req.tokenInfo = result_from_refresh_token;
            } else {
                req.tokenInfo = result;
            }
            if (req.tokenInfo.payload.role === 'VISITOR') {
                throw errorService.auth.permissionDeny();
            }
            next();
        } else {
            throw errorService.auth.unauthorized();
        }
    }
}
