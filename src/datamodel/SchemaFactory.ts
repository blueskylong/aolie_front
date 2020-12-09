import {Schema} from "./DmRuntime/Schema";
import {CommonUtils} from "../common/CommonUtils";
import {DmService} from "./service/DmService";
import {GlobalParams} from "../common/GlobalParams";
import {BeanFactory} from "../decorator/decorator";
import {StringMap} from "../common/StringMap";
import {TableInfo} from "./DmRuntime/TableInfo";
import {Logger} from "../common/Logger";
import {TableColumnRelation} from "./DmRuntime/TableColumnRelation";
import {Column} from "./DmRuntime/Column";

export class SchemaFactory {
    static schemaId = 2;


    /**
     * 方案缓存
     */
    static CACHE_SCHEMA = new StringMap<Schema>();
    /**
     * 其它用于便利查询的缓存
     */
    static CACHE_OTHER = new StringMap<StringMap<any>>();

    static KEY_COL_TABLE = "COL_TABLE";
    static KEY_COLID_COL = "COLID_COL";
    static KEY_TABLEID_TABLE = "TABLEID_TABLE";


    /**
     * 取得方案信息,这里的缓存在程序启动时就向客户端申请
     * @param schemaId
     * @param version
     */
    static getSchema(schemaId: number, version: string): Schema {
        return SchemaFactory.CACHE_SCHEMA.get(CommonUtils.genKey(schemaId, version));
    }

    init() {
        DmService.findSchemaIds((data) => {
            if (data) {
                for (let id of data) {
                    DmService.findSchemaInfo(id, GlobalParams.loginVersion).then(
                        (result) => {
                            let schema = BeanFactory.populateBean(Schema, result.data);
                            SchemaFactory.CACHE_SCHEMA
                                .set(CommonUtils.genKey(id, GlobalParams.loginVersion), schema);
                            this.initShortSearchInfo(schema);
                        }
                    )
                }
            }
        });

    }

    /**
     * 整理查询用的缓存信息
     * @param schema
     */
    private initShortSearchInfo(schema: Schema) {
        let mapColIdToTable = SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_COL_TABLE)
            ? SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_COL_TABLE) : new StringMap<any>();
        let mapColIdToCol = SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_COLID_COL)
            ? SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_COLID_COL) : new StringMap<any>();
        let mapTableIdToTable = SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_TABLEID_TABLE)
            ? SchemaFactory.CACHE_OTHER.get(SchemaFactory.KEY_TABLEID_TABLE) : new StringMap<any>();
        let version = schema.getSchemaDto().versionCode;
        if (schema.getLstTable()) {
            for (let table of schema.getLstTable()) {
                mapTableIdToTable.set(table.getTableDto().tableId + "_" + version, table);
                if (table.getLstColumn()) {
                    for (let col of table.getLstColumn()) {
                        mapColIdToCol.set(col.getColumnDto().columnId + "_" + version, col);
                        mapColIdToTable.set(col.getColumnDto().columnId + "_" + version, table);
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
    static getTableByColId(colId, version?): TableInfo {
        version = version ? version : GlobalParams.getLoginVersion();
        return (<StringMap<any>>SchemaFactory.CACHE_OTHER
            .get(SchemaFactory.KEY_COL_TABLE)).get(colId + "_" + version);
    }

    static getColumnById(colId, version?): Column {
        version = version ? version : GlobalParams.getLoginVersion();
        return (<StringMap<any>>SchemaFactory.CACHE_OTHER
            .get(SchemaFactory.KEY_COLID_COL)).get(colId + "_" + version);
    }

    /**
     * 根据表(视图)ID查询表(视图)信息
     * @param tableid
     */
    static getTableByTableId(tableid, version?: string): TableInfo {
        version = version ? version : GlobalParams.getLoginVersion();
        return (<StringMap<any>>SchemaFactory
            .CACHE_OTHER.get(SchemaFactory.KEY_TABLEID_TABLE)).get(tableid + "_" + version);
    }

    static getTableRelation(tableId1, tableId2): TableColumnRelation {
        let tableInfo = this.getTableByTableId(tableId1);
        if (!tableInfo) {
            Logger.error("没有查询到表信息");
            return null;
        }
        let schemaId = tableInfo.getTableDto().schemaId;
        let schema = SchemaFactory.getSchema(schemaId, tableInfo.getTableDto().versionCode);
        let lstRelation = schema.getLstRelation();
        if (!lstRelation) {
            return null;
        }
        for (let relation of lstRelation) {
            if ((relation.getTableTo().getTableDto().tableId == tableId1 && relation.getTableFrom().getTableDto().tableId == tableId2)
                || (relation.getTableTo().getTableDto().tableId == tableId2 && relation.getTableFrom().getTableDto().tableId == tableId1)) {
                return relation;
            }
        }
        return null;

    }


}




