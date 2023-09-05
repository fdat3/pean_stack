import { BaseMiddleware } from './base';
import { errorService, tokenService, userService } from '@/services';
import * as express from 'express';
import { Request, Response } from '@/routers/base';
const HEADERS = 'authorization';
export class AdminMiddleware extends BaseMiddleware {
    async use(req: Request, res: Response, next: express.NextFunction, providers: string[] = []) {
        if (!!req.headers[HEADERS]) {
            console.log("🚀 ~ file: authMiddleware.ts:9 ~ AuthMiddleware ~ use ~ !!req.headers[HEADERS]:", !!req.headers[HEADERS])
            const bearerHeader = req.headers[HEADERS].toString();
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            const result = await tokenService.decodeToken(bearerToken);

            if (result.tokenInfo.payload.role === 'USER') {
                throw errorService.auth.permissionDeny();
            }
            next();
        } else {
            throw errorService.auth.unauthorized();
        }
    }
}
