var CryptoJS = require("crypto-js");
const AES = require('crypto-js/aes');
import { env } from 'process'

class userSecurity {
    public encrypt(password: string): string {
        const encrypt = AES.encrypt(password, env.PASS_SECRET).toString()
        return encrypt
    }

    public decrypt(password: string): string {
        const decrypt = CryptoJS.AES.decrypt(password, env.PASS_SECRET)
        return decrypt.toString(CryptoJS.enc.Utf8)
    }

    public comparePassword(password: string, decryptedPassword: string): boolean {
        return password === this.decrypt(decryptedPassword)
    }
}

export default userSecurity
