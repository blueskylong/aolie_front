import {TableColumnRelationDto} from "../dto/TableColumnRelationDto";
import {PopulateBean} from "../../decorator/decorator";
import {TableInfo} from "./TableInfo";

export class TableColumnRelation {
    /**
     * 表关系原始数据
     */
    private dto: TableColumnRelationDto;
    /**
     * 起始表信息
     */
    private tableFrom: TableInfo;
    /**
     * 终止表信息
     */
    private tableTo: TableInfo;


    getDto(): TableColumnRelationDto {
        return this.dto;
    }
    @PopulateBean(TableColumnRelationDto)
    setDto(value: TableColumnRelationDto) {
        this.dto = value;
    }

    getTableFrom(): TableInfo {
        return this.tableFrom;
    }
    @PopulateBean(TableInfo)
    setTableFrom(value: TableInfo) {
        this.tableFrom = value;
    }

    getTableTo(): TableInfo {
        return this.tableTo;
    }
    @PopulateBean(TableInfo)
    setTableTo(value: TableInfo) {
        this.tableTo = value;
    }
}
