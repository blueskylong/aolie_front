import TableDto from "../dto/TableDto";
import {Column} from "./Column";
import {Formula} from "../../blockui/uiruntime/Formula";
import FormulaDto from "../dto/FormulaDto";
import {PopulateBean} from "../../decorator/decorator";
import {ReferenceDto} from "../dto/ReferenceDto";

export class TableInfo {
    private tableDto: TableDto;
    private lstColumn: Array<Column>;

    private lstReference: Array<ReferenceDto>;


    getTableDto(): TableDto {
        return this.tableDto;
    }

    @PopulateBean(TableDto)
    setTableDto(value: TableDto) {
        this.tableDto = value;
    }

    @PopulateBean(ReferenceDto)
    setLstReference(value: Array<ReferenceDto>) {
        this.lstReference = value;
    }

    getLstReference() {
        return this.lstReference;
    }

    getLstColumn(): Array<Column> {
        return this.lstColumn;
    }

    @PopulateBean(Column)
    setLstColumn(value: Array<Column>) {
        this.lstColumn = value;
    }

    getColFormulas() {
        if (this.lstColumn) {
            let formulas = new Array<FormulaDto>();
            for (let column of this.lstColumn) {
                let dtos = column.getLstFormulaDto();
                if (dtos.length > 0) {
                    formulas.push(...dtos);
                }
            }
            return formulas;
        }
        return null;
    }

    findColById(colId: number) {
        if (this.lstColumn && this.lstColumn.length > 0) {
            for (let column of this.lstColumn) {
                if (column.getColumnDto().columnId == colId) {
                    return column;
                }
            }
        }
        return null;
    }

    /**
     * 取得主键字段,不包含version
     */
    findKeyColumns() {
        if (this.lstColumn && this.lstColumn.length > 0) {
            let result = new Array<Column>();
            for (let column of this.lstColumn) {
                if (column.getColumnDto().isKey == 1 && "version_code" != column.getColumnDto().fieldName) {
                    result.push(column);
                }
            }
            return result;
        }
        return null;
    }

    /**
     * 本表是否有字段使用了指定的引用
     */
    hasColRelationToRef(refId) {
        if (!this.lstColumn) {
            return false;
        }
        for (let col of this.lstColumn) {
            if (col.getReference() && col.getReference().getReferenceDto().refId == refId) {
                return true;
            }
        }
        return false;
    }


}
