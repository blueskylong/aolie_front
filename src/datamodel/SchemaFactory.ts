import {Schema} from "./DmRuntime/Schema";
import {ReferenceData} from "./dto/ReferenceData";
import {CommonUtils} from "../common/CommonUtils";

export class SchemaFactory {

    /**
     * 方案缓存
     */
    static CACHE_SCHEMA = new Map<String, Schema>();



    /**
     * 取得方案信息,这里的缓存在程序启动时就向客户端申请
     * @param schemaId
     * @param version
     */
    static getSchema(schemaId: number, version: string) {
        return SchemaFactory.CACHE_SCHEMA.get(CommonUtils.genKey(schemaId, version));
    }
}

let ResultHandler = (data: Object, success: boolean, errMessage: string) => {
};





