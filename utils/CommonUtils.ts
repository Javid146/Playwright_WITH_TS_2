import cryptoJs from "crypto-js"

export default class CommonUtils {

    private secretKey: string;

    /* The constructor initializes the secret key from the environment variable so it’s available to all methods in this class. 
        secret key will be provided in runtime. 
        CMD: set SECRET_KEY=javid5 && npm run demo_cr
        Powershell: $env:SECRET_KEY = "javid5"; npm run demo_cr
        Bash: SECRET_KEY=javid5 npm run demo_cr  

    */
    constructor() {

        if (process.env.SECRET_KEY) {
            this.secretKey = process.env.SECRET_KEY
        }
        else {
            throw new Error("SECRET KEY IS NOT INSERTED!!! Please provide one")
        }
    }

    /**
     * Provides Encrypted data from String
     * @param data 
     * @returns encryptedData
     */
    public encryptedData(data: string) {
        const encrptdData = cryptoJs.AES.encrypt(data, this.secretKey).toString()
        console.log({ encrptdData })
        return encrptdData;
    }


    public decryptedData(data: string) {
        const dcryptdData = cryptoJs.AES.decrypt(data, this.secretKey).toString(cryptoJs.enc.Utf8)
        console.log({ dcryptdData })
        return dcryptdData
    }
}