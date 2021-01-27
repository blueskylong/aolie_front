import {ConstraintDto} from "../dto/ConstraintDto";
import {PopulateBean} from "../../decorator/decorator";
import {CommonUtils} from "../../common/CommonUtils";
import {FilterExpression} from "./formula/FilterExpression";
import {FormulaTools} from "./formula/FormulaTools";
import {SchemaFactory} from "../SchemaFactory";

export class Constraint {
    private constraintDto: ConstraintDto;
    /**
     * 引用到的表,方便查询
     */
    private lstRefTable: Array<number>;

    /**
     * 引用到的列,方便查询
     */
    private lstRefColumn: Array<number>;

    getConstraintDto(): ConstraintDto {
        return this.constraintDto;
    }

    @PopulateBean(ConstraintDto)
    setConstraintDto(value: ConstraintDto) {
        this.constraintDto = value;
    }


    getLstRefTable(): Array<number> {
        if (this.lstRefTable == null) {
            this.initRef();
        }
        return this.lstRefTable;
    }

    setLstRefTable(value: Array<number>) {
        this.lstRefTable = value;
    }

    private initRef() {
        this.lstRefTable = new Array<number>();
        this.lstRefColumn = new Array<number>();
        let columnParams = FormulaTools.getColumnParams(this.constraintDto.expression + this.constraintDto.filter);
        if (columnParams == null) {
            return null;
        }
        let tableId: number;
        for (let colId of columnParams) {
            tableId = SchemaFactory.getTableByColId(colId).getTableDto().tableId;
            if (this.lstRefTable.indexOf(tableId) === -1) {
                this.lstRefTable.push(tableId);
            }
            if (this.lstRefColumn.indexOf(parseInt(colId)) === -1) {
                this.lstRefColumn.push(parseInt(colId));
            }
        }
    }

    getLstRefColumn(): Array<number> {
        if (this.lstRefColumn == null) {
            this.initRef();
        }
        return this.lstRefColumn;
    }

    setLstRefColumn(value: Array<number>) {
        this.lstRefColumn = value;
    }

    static genConstraintDto(schemaId?, versionId?) {
        let dto = new ConstraintDto();
        dto.id = CommonUtils.genId();
        dto.schemaId = schemaId;
        dto.versionCode = versionId;
        dto.disabled = 0;
        return dto;
    }
}
