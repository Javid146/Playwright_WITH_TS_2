import CryptoJS from "crypto-js"

export class PracticeCommonUtil {

    private secretKey: string

    constructor() {

        if (process.env.SECRET_KEY) {
            this.secretKey = process.env.SECRET_KEY
            console.log("secretKey: " + this.secretKey)
        }
        else {
            throw new Error("SECRET KEY IS NOT INSERTED!!! Please provide one")
        }
    }

    encryptData(data: string) {
        const decryptedData = CryptoJS.AES.encrypt(data, this.secretKey).toString()
        console.log("decryptedData: " + decryptedData)
        return decryptedData
    }

    decryptData(data: string) {
        const encryptedData = CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8)
        console.log("decryptedData: " + encryptedData)
        return encryptedData;

    }
}