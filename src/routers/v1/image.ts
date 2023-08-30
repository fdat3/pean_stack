import { Request, Response, BaseRouter } from '../base';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as multer from 'multer';
import * as express from 'express';
import config from "../../config/firebase"
import * as _ from 'lodash';
var admin = require("firebase/app");
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
        const storage = getStorage();
        const filesList: any = [];
        const tmpFile: any = [];
        const files: any = req.files;
        for (let i = 0; i < files.length; i++) {
            const type: any = files[i].mimetype.split('/')[1];
            const originalFile: any = files[i].filename;
            const metadata = {
                contentType: files[i].mimetype.split('/')[1],
            };
            const file = files[i].filename;
            const storageRef = ref(storage, `image/${files[i].originalname}`);
            const snapshot = await uploadBytesResumable(storageRef, files[i].buffer, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);
            filesList.push({
                originalFile: originalFile,
                file: file,
                typeFile: type,
                path: files[i].path,
                link: downloadURL
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
