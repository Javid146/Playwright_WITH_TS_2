import { APIRequestContext } from '@playwright/test';
import apiPathData from "../test-data/api-data/api-path-data.json";
import CommonUtils from './CommonUtils';

export default class commonApiUtils {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    public async createToken() {
        const commonUtilsObj = new CommonUtils();
        //decrpyted encrypted username/password via CommonUtils
        const apiUserName = commonUtilsObj.decryptedData(process.env.API_USERNAME!);
        const apiPassword = commonUtilsObj.decryptedData(process.env.API_PASSWORD!);
        const createTokenResponse = await this.request.post(apiPathData.auth_path, {
            data: {
                "username": apiUserName,
                "password": apiPassword
            }
        });
        const createTokenJsonResp = await createTokenResponse.json()
        console.log({ createTokenJsonResp })
        return createTokenJsonResp.token
    }
}


