import * as errors from './errors';
// import { error } from 'util';
export class ErrorService {
    constructor() {
        this.router = new errors.RouterErrorService();
        this.auth = new errors.AuthErrorService();
        this.database = new errors.DatabaseErrorService();
        this.firebase = new errors.FirebaseErrorService();
    }
    router: errors.RouterErrorService;
    auth: errors.AuthErrorService;
    database: errors.DatabaseErrorService;
    firebase: errors.FirebaseErrorService;
    validateInAppPurchase(error: any) {
        throw new errors.BaseError({
            code: 500,
            type: 'validate receipt fail',
            message: error,
        });
    }
    setUpIapFail(error: any) {
        throw new errors.BaseError({
            code: 500,
            type: 'setup in app purchase Fail',
            message: error,
        });
    }
    unknownErrorInAppPurchase() {
        throw new errors.BaseError({
            code: 500,
            type: 'unknown error in app purchase',
            message: 'unknown error in app purchase',
        });
    }
}
