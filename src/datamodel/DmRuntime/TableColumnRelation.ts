import Table = WebAssembly.Table;
import {TableColumnRelationDto} from "../dto/TableColumnRelationDto";
import {PopulateBean} from "../../decorator/decorator";
import {ReferenceDto} from "../dto/ReferenceDto";

export class TableColumnRelation {
    /**
     * 表关系原始数据
     */
    private dto: TableColumnRelationDto;
    /**
     * 起始表信息
     */
    private tableFrom: Table;
    /**
     * 终止表信息
     */
    private tableTo: Table;


    getDto(): TableColumnRelationDto {
        return this.dto;
    }
    @PopulateBean(TableColumnRelationDto)
    setDto(value: TableColumnRelationDto) {
        this.dto = value;
    }

    getTableFrom(): Table {
        return this.tableFrom;
    }
    @PopulateBean(Table)
    setTableFrom(value: Table) {
        this.tableFrom = value;
    }

    getTableTo(): Table {
        return this.tableTo;
    }
    @PopulateBean(Table)
    setTableTo(value: Table) {
        this.tableTo = value;
    }
}
