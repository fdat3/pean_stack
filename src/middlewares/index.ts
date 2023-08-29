import { BlockMiddleware } from "./blockMiddleware";
import { QueryMiddleware } from "./queryMiddleware";
import { AuthInfoMiddleware } from './authMiddleware'


const blockMiddleware = new BlockMiddleware();
const queryMiddleware = new QueryMiddleware();
const authMiddleware = new AuthInfoMiddleware();

export {
    blockMiddleware,
    queryMiddleware,
    authMiddleware
};
