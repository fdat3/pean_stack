import { ERROR_CODE } from '@/const';
import { BaseError } from './base';
class AuthException extends BaseError {
    constructor(key: string, message: string, code?: number) {
        super({
            code: code || 401,
            type: `auth_exception_${key}`,
            message,
        });
    }
}
export class AuthErrorService {
    unauthorized() {
        return new AuthException('unauthorized', 'Unauthorized.');
    }
    permissionDeny() {
        return new AuthException('permission_deny', 'Permission Deny');
    }
    permissionDenyDevice() {
        return new AuthException('device_deny', 'Device Deny');
    }
    badToken() {
        return new AuthException('bad_token', 'Bad Token');
    }
    tokenExpired() {
        return new AuthException('token_expired', 'Token Expried');
    }

    codeExpired() {
        return new AuthException('code_expired', '인증번호가 유효하지 않습니다.', ERROR_CODE.EXPIRE_TOKEN);
    }

    badCode() {
        return new AuthException('bad_code', '인증번호를 확인해주세요.', ERROR_CODE.BAD_TOKEN);
    }
}
