import { BaseError } from './base';
class RouterException extends BaseError {
    constructor(key: string, message: string, code?: number) {
        super({
            code: code || 500,
            type: `router_exception_${key}`,
            message,
        });
    }
}

export class RouterErrorService {
    somethingWentWrong() {
        return new RouterException('something_went_wrong', 'Sorry! Something went wrong.');
    }
    badRequest() {
        return new RouterException('bad_request', 'Bad Request.', 400);
    }
    requestDataInvalid(message: string) {
        return new RouterException('data_invalid', message, 403);
    }
}
