import { Request, Response, BaseRouter } from '../base';
import { queryMiddleware, authMiddleware, blockMiddleware } from '@/middlewares';
import { errorService } from '@/services';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as multer from 'multer';
import * as fs from 'fs';
import * as express from 'express';
import config from "../../config/firebase"
import * as _ from 'lodash';
var admin = require("firebase/app");
const { execFile } = require('child_process');
const IMAGE_URL_SERVER_FOR_PRODUCTION = `https://localhost:4000` + '/api/v1/image/get/';
const TYPE_IMAGE_PNG = '.png';
const TYPE_IMAGE_GIF = '.gif';
const FILE_IMAGE_PATH = 'image/';
admin.initializeApp(config.firebaseConfig);

export default class ImageRouter extends BaseRouter {
    router: express.Router;
    constructor() {
        super()
        this.router = express.Router()
        const upload = multer({ storage: multer.memoryStorage() });
        this.router.post('/upload', upload.single('image'), this.route(this.uploadImage));
        this.router.post('/multi-upload', upload.array('image'), this.route(this.multiUploadImage));
    }
    async uploadImage(req: Request, res: Response) {
        const storage = getStorage();
        const storageRef = ref(storage, `image/${req.file.originalname}`);
        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
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
