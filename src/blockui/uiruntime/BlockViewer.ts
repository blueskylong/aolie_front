import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {Component} from "./Component";
import {PopulateBean} from "../../decorator/decorator";
import {CommonUtils} from "../../common/CommonUtils";
import {SchemaFactory} from "../../datamodel/SchemaFactory";
import {StringMap} from "../../common/StringMap";
import {TableInfo} from "../../datamodel/DmRuntime/TableInfo";

export class BlockViewer {

    private blockViewDto: BlockViewDto;
    /**
     * 字段显示信息列表
     */
    private lstComponent: Array<Component>;

    getBlockViewDto(): BlockViewDto {
        return this.blockViewDto;
    }

    @PopulateBean(BlockViewDto)
    setBlockViewDto(value: BlockViewDto) {
        this.blockViewDto = value;
    }

    getLstComponent(): Array<Component> {
        if (!(this.lstComponent != null)) {
            this.lstComponent = new Array<Component>();
        }
        return this.lstComponent;
    }

    @PopulateBean(Component)
    setLstComponent(value: Array<Component>) {
        this.lstComponent = value;
    }

    findFieldIdByName(fieldName): number {
        if (fieldName == null || !this.getLstComponent()) {
            return null;
        }
        let isNeedConvert = !!this.blockViewDto.fieldToCamel;
        if (isNeedConvert) {
            fieldName = CommonUtils.toUnderLine(fieldName);
        }
        for (let com of this.lstComponent) {
            if (com.getColumn().getColumnDto().fieldName === fieldName) {
                return com.getColumn().getColumnDto().columnId;
            }
        }
        return null;
    }

    /**
     * 查询视图所包含的表信息
     */
    findTables(): Array<TableInfo> {
        if (!this.lstComponent) {
            return null;
        }
        let mapAlready = new StringMap();
        let tableId;
        let tables = new Array<TableInfo>();
        for (let com of this.lstComponent) {
            tableId = com.column.getColumnDto().tableId;
            if (mapAlready.has(tableId + "")) {
                continue;
            }
            mapAlready.set(tableId + "", null);
            tables.push(SchemaFactory.getTableByTableId(tableId, com.column.getColumnDto().versionCode));
        }
        return tables;
    }
}
