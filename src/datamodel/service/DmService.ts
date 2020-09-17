import {NetRequest} from "../../common/NetRequest";

export class DmService {
    static URL_ROOT = "/dm"

    /**
     * 查询一个方案的全部信息
     * @param schemaId
     * @param version
     */
    static findSchemaInfo(schemaId, version) {
        return NetRequest.axios.get(DmService.URL_ROOT + "/findSchemaInfo/"
            + schemaId + "/" + version);
    }

    static findCanSelectTable(schemaId){
        return NetRequest.axios.get(DmService.URL_ROOT + "/findDefaultDBTablesNotInSchema/"
            + schemaId );
    }

}
