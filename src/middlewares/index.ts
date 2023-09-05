import { BlockMiddleware } from "./blockMiddleware";
import { QueryMiddleware } from "./queryMiddleware";
import { AuthMiddleware } from './authMiddleware'
import { AdminMiddleware } from "./adminMiddleware";


const blockMiddleware = new BlockMiddleware();
const queryMiddleware = new QueryMiddleware();
const authMiddleware = new AuthMiddleware();
const adminMiddleware = new AdminMiddleware();

export {
    blockMiddleware,
    queryMiddleware,
    authMiddleware,
    adminMiddleware
};
