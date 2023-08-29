import { Request, Response, BaseRouter } from '../base';
import { queryMiddleware, authMiddleware, blockMiddleware } from '@/middlewares';
import { errorService } from '@/services';

import * as multer from 'multer';
import * as fs from 'fs';
import * as express from 'express';
import { config } from '@/config';
import * as _ from 'lodash';

const { execFile } = require('child_process');
const IMAGE_URL_SERVER_FOR_PRODUCTION = `https://localhost:4000` + '/api/v1/image/get/';
const TYPE_IMAGE_PNG = '.png';
const TYPE_IMAGE_GIF = '.gif';
const FILE_IMAGE_PATH = 'image/';
export default class ImageRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super()
        this.router = express.Router()
        const storage = multer.diskStorage({
            destination: function (req: Request, file: any, cb: any) {
                cb(null, FILE_IMAGE_PATH)
            },
            filename: function (req: Request, file: any, cb: any) {
                const getTypeImage = file.mimetype.split('/')[1]

                if (getTypeImage === "gif") {
                    cb(null, file.fieldname + '-' + Date.now() + TYPE_IMAGE_GIF)
                } else {
                    cb(null, file.fieldname + '-' + Date.now() + TYPE_IMAGE_PNG)
                }
            }
        })
        const upload = multer({ storage: storage })
        this.router.post('/upload', upload.single('image'), this.route(this.uploadImage));
        this.router.post('/multi-upload', upload.array('image'), this.route(this.multiUploadImage));
    }
    async uploadImage(req: Request, res: Response) {
        const fileUrl = IMAGE_URL_SERVER_FOR_PRODUCTION;
        let filename = req.file.filename;
        filename = 'resized-' + req.file.filename;
        const url = fileUrl + filename;
        if (req.tokenInfo && req.tokenInfo.payload && req.tokenInfo.payload.user_id !== undefined) {
            req.body.user_id = req.tokenInfo.payload.user_id;
            req.body.file_url = url;
        }
        // fs.unlinkSync(FILE_IMAGE_PATH + req.file.filename);
        this.onSuccess(res, { url, filename });
    }

    async multiUploadImage(req: Request, res: Response) {
        const sizeImage = req.params.size ? parseInt(req.params.size) : 400;
        // const sizeThumbnail = req.params.sizeThumbnail
        //   ? parseInt(req.params.sizeThumbnail)
        //   : 200;
        const filesList: any = [];
        // const resizePromise = [];
        const tmpFile: any = [];
        const files: any = req.files;
        for (let i = 0; i < files.length; i++) {
            const type: any = files[i].mimetype.split('/')[1];
            const originalFile: any = files[i].filename;
            const file = 'resized-' + sizeImage + '-' + files[i].filename;
            filesList.push({
                originalFile: originalFile,
                file: file,
                typeFile: type,
                path: files[i].path,
                sizeImage: sizeImage,
                // sizeThumbnail: sizeThumbnail,
                link: IMAGE_URL_SERVER_FOR_PRODUCTION + file,
            });
            tmpFile.push(originalFile);
            tmpFile.push(file);
        }

        try {
            const tmpImg: string[] = [];
            await filesList.map((item: any) => {
                tmpImg.push(item.link);
            });

            return res.send({
                code: 200,
                results: {
                    images: tmpImg,
                },
            });
        } catch (err) {
            return res.send(err);
        }
    }

}
