import {CommonUtils} from "./CommonUtils";
import {StringMap} from "./StringMap";

export class GlobalParams {

    private static pageSchema = new StringMap<number>();
    /**
     * 默认的登录的数据版本
     */
    static loginVersion = "000000";

    static getLoginVersion() {
        return GlobalParams.loginVersion;
    }

    static getPageSchemaInfo(pageId, version?) {
        let key = CommonUtils.genKey(pageId, version ? version : GlobalParams.getLoginVersion());
        return this.pageSchema.get(key);
    }
}
