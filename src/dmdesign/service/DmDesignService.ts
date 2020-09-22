import {NetRequest} from "../../common/NetRequest";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {BeanFactory} from "../../decorator/decorator";
import {Schema} from "../../datamodel/DmRuntime/Schema";


export class DmDesignService {
    static URL_ROOT = "/dm";
    static COL_ID_SER = -1;
    static TABLE_ID_SER = -1;
    static ID_SER = -1;

    /**
     * 查询一表的字段信息,用于新增表
     * @param tableName
     * @param schemaId
     * @param version
     * @param tableId
     * @param callback
     */
    static findTableFieldAsColumnDto(tableName, schemaId, version, tableId, callback: (result: Array<ColumnDto>) => void) {
        NetRequest.axios.get(DmDesignService.URL_ROOT + "/findTableFieldAsColumnDto/"
            + tableName).then((response) => {

            if (!response.data) {
                callback([]);
            }
            let lstDto = new Array<ColumnDto>();
            for (let item of response.data) {
                let dto = BeanFactory.populateBean(ColumnDto, item);
                dto.schemaId = schemaId;
                dto.versionCode = version;
                dto.columnId = DmDesignService.genColId();
                dto.tableId = tableId;
                lstDto.push(dto);
            }
            callback(lstDto);
        });
    }

    static saveSchema(schema: Schema, callback?: (data: string) => void) {
        NetRequest.axios.post(DmDesignService.URL_ROOT + "/saveSchema", schema)
            .then((result) => {
                if (callback) {
                    callback(result.data);
                }
            });
    }

    /**
     * 生成一个Table id
     */
    static genTableId() {
        return DmDesignService.TABLE_ID_SER--;
    }

    /**
     * 生成列ID
     */
    static genColId() {
        return DmDesignService.COL_ID_SER--;
    }

    static genId() {
        return DmDesignService.ID_SER--;
    }
}
