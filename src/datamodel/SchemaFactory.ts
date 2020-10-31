import {Schema} from "./DmRuntime/Schema";
import {CommonUtils} from "../common/CommonUtils";
import {DmService} from "./service/DmService";
import {GlobalParams} from "../common/GlobalParams";
import {BeanFactory} from "../decorator/decorator";
import {StringMap} from "../common/StringMap";
import {TableInfo} from "./DmRuntime/TableInfo";

export class SchemaFactory {
    static schemaId = 2;


    /**
     * 方案缓存
     */
    static CACHE_SCHEMA = new StringMap();
    /**
     * 其它用于便利查询的缓存
     */
    static CACHE_OTHER = new StringMap();

    static KEY_COL_TABLE = "COL_TABLE";
    static KEY_COLID_COL = "COLID_COL";
    static KEY_TABLEID_TABLE = "TABLEID_TABLE";


    /**
     * 取得方案信息,这里的缓存在程序启动时就向客户端申请
     * @param schemaId
     * @param version
     */
    static getSchema(schemaId: number, version: string) {
        return SchemaFactory.CACHE_SCHEMA.get(CommonUtils.genKey(schemaId, version));
    }

    init() {
        DmService.findSchemaInfo(SchemaFactory.schemaId, GlobalParams.loginVersion).then(
            (result) => {
                let schema = BeanFactory.populateBean(Schema, result.data);
                SchemaFactory.CACHE_SCHEMA
                    .set(CommonUtils.genKey(SchemaFactory.schemaId, GlobalParams.loginVersion), schema);
                this.initShortSearchInfo(schema);
            }
        )
    }

    /**
     * 整理查询用的缓存信息
     * @param schema
     */
    private initShortSearchInfo(schema: Schema) {
        SchemaFactory.CACHE_OTHER.delete(schema.getSchemaDto().schemaId + "");
        let mapColIdToTable = new StringMap();
        let mapColIdToCol = new StringMap();
        let mapTableIdToTable = new StringMap();
        if (schema.getLstTable()) {
            for (let table of schema.getLstTable()) {
                mapTableIdToTable.set(table.getTableDto().tableId + "", table);
                if (table.getLstColumn()) {
                    for (let col of table.getLstColumn()) {
                        mapColIdToCol.set(col.getColumnDto().columnId + "", col);
                        mapColIdToTable.set(col.getColumnDto().columnId + "", table);
                    }
                }
            }
        }
        SchemaFactory.CACHE_OTHER.set(SchemaFactory.KEY_COL_TABLE, mapColIdToTable);
        SchemaFactory.CACHE_OTHER.set(SchemaFactory.KEY_COLID_COL, mapColIdToCol);
        SchemaFactory.CACHE_OTHER.set(SchemaFactory.KEY_TABLEID_TABLE, mapTableIdToTable);
    }

    /**
     * 根据列ID查询相应的表(视图)信息
     * @param colId
     */
    static getTableByColId(colId): TableInfo {
        return (<StringMap<any>>SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_COL_TABLE)).get(colId + "");
    }

    /**
     * 根据表(视图)ID查询表(视图)信息
     * @param tableid
     */
    static getTableByTableId(tableid): TableInfo {
        return (<StringMap<any>>SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_TABLEID_TABLE)).get(tableid + "");
    }


}




