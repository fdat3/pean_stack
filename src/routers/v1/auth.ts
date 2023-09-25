import { Request, Response, BaseRouter } from "@/routers/base";
import * as express from 'express';
import { userController } from "@/controllers";
import { tokenService } from "@/services";
const nodemailer = require('nodemailer');
const URL_PAGE = 'localhost:4000/forgot-password/reset?token=';

export default class AuthRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super();
        this.router = express.Router();
        this.router.post('/login', this.route(this.login));
        this.router.post('/login-auth', this.route(this.loginAuth));
        this.router.post('/register', this.route(this.register));
        this.router.post('/register-auth', this.route(this.registerAuth));
        this.router.post('/user-forget-password', this.route(this.userForgetPassword));
    }

    async userForgetPassword(req: Request, res: Response) {
        const token = await tokenService.getUserTokenForForgetPassWord(req.body.email);
        const url_get_password_replace = token.replace(/\./g, '@gmail');
        const url_get_password = URL_PAGE + url_get_password_replace;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: req.body.email,
            subject: 'PEAN-Stack reset password',
            text: `hello,${req.body.email}`,
            html: `<p>We heard that you lost your password. Sorry about that!</p></br>
                    <p>But don’t worry! You can use the following link to reset your password: <a href="${url_get_password}" style="color:red;">${url_get_password}</a></p></br>
                    <p>If you don’t use this link within 30 minutes, it will expire</p></br>
                    <p>Thank You</p>`,
        };
        transporter.sendMail(mailOptions);
        this.onSuccess(res, { url_get_password: url_get_password });
    }
    async login(req: Request, res: Response) {
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'USER';
        }
        const token = await tokenService.getUserToken(data.id);
        this.onSuccess(res, { result: data, token });
    }
    async loginAuth(req: Request, res: Response) {
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'ADMIN';
        }
        const token = await tokenService.getAdminToken(data.id);
        this.onSuccess(res, { result: data, token });
    }
    async register(req: Request, res: Response) {
        const result = await userController.register(req.body);
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'USER';
        }
        const token = await tokenService.getUserToken(data.id);
        this.onSuccess(res, { result: result, token });
    }
    async registerAuth(req: Request, res: Response) {
        const result = await userController.register(req.body);
        const data = await userController.login(req.body);
        if (data.dataValues) {
            data.dataValues.role = 'ADMIN';
        }
        const token = await tokenService.getAdminToken(data.id);
        this.onSuccess(res, { result: result, token });
    }
}