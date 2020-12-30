import TableDto from "../dto/TableDto";
import {Column} from "./Column";
import {Formula} from "../../blockui/uiruntime/Formula";
import FormulaDto from "../dto/FormulaDto";
import {PopulateBean} from "../../decorator/decorator";
import {ReferenceDto} from "../dto/ReferenceDto";
import {SchemaFactory} from "../SchemaFactory";
import {DmConstants} from "../DmConstants";

export class TableInfo {
    private tableDto: TableDto;
    private lstColumn: Array<Column>;

    private lstReference: Array<ReferenceDto>;
    private keyField = null;


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

    getColById(colId: number) {
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
    getKeyColumns() {
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
     * 查询外键的字段,本表是从,外表是主
     */
    getOutMasterKeyColumns() {
        let tableId = this.getTableDto().tableId;
        let lstRelations = SchemaFactory.getTableRelations(tableId);
        if (!lstRelations || lstRelations.length == 0) {
            return null;
        }
        let cols = new Array<Column>();
        for (let relation of lstRelations) {
            if (relation.getDto().relationType == DmConstants.RelationType.multiToOne
                && relation.getTableFrom().getTableDto().tableId == tableId) {
                cols.push(SchemaFactory.getColumnById(relation.getDto().fieldFrom));
            }
            if (relation.getDto().relationType == DmConstants.RelationType.oneToMulti &&
                relation.getTableTo().getTableDto().tableId == tableId) {
                cols.push(SchemaFactory.getColumnById(relation.getDto().fieldTo));

            }
        }
        return cols;
    }

    /**
     * 本表是否有字段使用了指定的引用
     */
    hasColRelationToRef(refId) {
        if (!this.lstColumn) {
            return false;
        }
        for (let col of this.lstColumn) {
            if (col.getColumnDto().refId) {
                return true;
            }
        }
        return false;
    }

    public getKeyField() {
        if (this.keyField) {
            return this.keyField;
        }
        let keyColumns = this.getKeyColumns();
        if (!keyColumns) {
            throw new Error("没有主键信息");
        }
        if (keyColumns.length != 1) {
            throw new Error("主键信息不正确" + (keyColumns.length == 0 ? "没有主键字段" : "多于一个主键字段"));
        }
        this.keyField = keyColumns[0].getColumnDto().fieldName;
        return this.keyField;
    }

}
