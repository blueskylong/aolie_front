import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {Component} from "./Component";
import {PopulateBean} from "../../decorator/decorator";
import {CommonUtils} from "../../common/CommonUtils";
import {SchemaFactory} from "../../datamodel/SchemaFactory";
import {StringMap} from "../../common/StringMap";
import {TableInfo} from "../../datamodel/DmRuntime/TableInfo";
import {ComponentDto} from "../../uidesign/dto/ComponentDto";

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

    findComponent(compId) {
        if (!this.lstComponent) {
            return null;
        }
        for (let component of this.lstComponent) {
            if (component.getComponentDto().componentId == compId) {
                return component;
            }
        }
        return null;
    }

    deleteComp(compId) {
        if (!this.lstComponent) {
            return;
        }
        let comp: Component;
        for (let i = 0; i < this.lstComponent.length; i++) {
            comp = this.lstComponent[i];
            if (comp.getComponentDto().componentId == compId) {
                this.lstComponent.splice(i, 1);
                return;
            }
        }
    }

    getAllComponentDto(): Array<ComponentDto> {
        if (!this.lstComponent) {
            return null;
        }
        let lstResult = new Array<ComponentDto>();
        for (let component of this.lstComponent) {
            lstResult.push(component.getComponentDto());
        }
        return lstResult;
    }

    setShowSearch(isShow) {
        if (!this.lstComponent) {
            return null;
        }
        let showSearch = isShow ? 1 : 0;
        for (let component of this.lstComponent) {
            component.getComponentDto().showSearch = showSearch;
        }
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
