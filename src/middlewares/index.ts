import { BlockMiddleware } from "./blockMiddleware";
import { QueryMiddleware } from "./queryMiddleware";
import { AuthMiddleware } from './authMiddleware'
import { TokenMiddleware } from "./tokenMiddleware";


const blockMiddleware = new BlockMiddleware();
const queryMiddleware = new QueryMiddleware();
const authMiddleware = new AuthMiddleware();
const tokenMiddleware = new TokenMiddleware();

export {
    blockMiddleware,
    queryMiddleware,
    authMiddleware,
    tokenMiddleware
};
