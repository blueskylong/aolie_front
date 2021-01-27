import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {DmConstants} from "../../../DmConstants";
import {Schema} from "../../Schema";
import {FormulaTools} from "../FormulaTools";
import {SchemaFactory} from "../../../SchemaFactory";
import {Column} from "../../Column";

@FormulaElement()
export class ColumnElement implements TransElement {

    getElementType(): number {
        return DmConstants.FormulaElementType.column;
    }

    getName(): string {
        return "列参数";
    }

    getExpressionCN() {
        return this.getName();
    }

    getOrder(): number {
        return this.getElementType();
    }

    isMatchCn(str): boolean {
        return FormulaTools.isColumnParam(str.trim());
    }

    isMatchInner(str): boolean {
        return FormulaTools.isColumnParam(str.trim());
    }

    transToCn(curElement: string, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        /**
         * 这里要注意,会有临时列,这里是查询不到的
         * @param exp
         */

        let columnParams = FormulaTools.getColumnParams(curElement);
        if (!columnParams || columnParams.length < 1) {
            return curElement;
        }
        for (let param of columnParams) {
            let column = SchemaFactory.getColumnById(param);
            let tableInfo = SchemaFactory.getTableByTableId(column.getColumnDto().tableId);
            curElement = FormulaTools.replaceColumnNameStr(curElement, param,
                tableInfo.getTableDto().title + "." + column.getColumnDto().title);
        }
        return curElement;
    }

    transToInner(curElement: string, schema: Schema, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        let columnParams = FormulaTools.getColumnParams(curElement);
        if (!columnParams || columnParams.length < 1) {
            return curElement;
        }
        for (let paramName of columnParams) {
            let names = paramName.split(".");
            if (names.length != 2) {
                throw new Error("列全名不正确");
            }
            let table = schema.findTableByTitle(names[0]);
            if (!table) {
                throw new Error("方案[" + schema.getSchemaDto().schemaName + "]中,表不存在[" + names[0] + "]");
            }
            let column = table.findColumnByColTitle(names[1]);
            if (column == null) {
                throw new Error("方案[" + schema.getSchemaDto().schemaName + "]中,列不存在[" + paramName + "]");
            }
            let tableInfo = SchemaFactory.getTableByTableId(column.getColumnDto().tableId);
            curElement = FormulaTools.replaceColumnNameStr(curElement, paramName,
                column.getColumnDto().columnId + "");
        }
        return curElement;
    }


    transToValue(curElement: string, rowData, schema?: Schema, transcenter?: TransCenter): string {
        console.log(this.getName() + "  matched!");
        /**
         * 这里要注意,会有临时列,这里是查询不到的
         * @param exp
         */

        let columnParams = FormulaTools.getColumnParams(curElement);
        if (!columnParams || columnParams.length < 1) {
            return curElement;
        }
        for (let param of columnParams) {
            let column = SchemaFactory.getColumnById(param);
            let tableInfo = SchemaFactory.getTableByTableId(column.getColumnDto().tableId);

            curElement = FormulaTools.replaceColumnValueStr(curElement, param,
                this.getFieldValue(column, rowData));
        }
        return curElement;
    }

    private getFieldValue(column: Column, rowData) {
        let value = rowData[column.getColumnDto().fieldName];
        if (value == null) {
            if (column.isNumberColumn()) {
                value = 0;
            } else {
                value = "";
            }
        }
        //给字符串包裹引号
        if (!column.isNumberColumn()) {
            value = "'" + value + "'";
        }
        return value;
    }

    isOnlyForFilter(): boolean {
        return false;
    }
}
