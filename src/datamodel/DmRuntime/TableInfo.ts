import TableDto from "../dto/TableDto";
import {Column} from "./Column";
import {Formula} from "../../blockui/uiruntime/Formula";
import FormulaDto from "../dto/FormulaDto";
import {PopulateBean} from "../../decorator/decorator";

export class TableInfo {
    private tableDto: TableDto;
    private lstColumn: Array<Column>;


    getTableDto(): TableDto {
        return this.tableDto;
    }

    @PopulateBean(TableDto)
    setTableDto(value: TableDto) {
        this.tableDto = value;
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
}
