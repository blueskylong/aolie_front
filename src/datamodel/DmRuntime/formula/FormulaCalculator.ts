import {Schema} from "../Schema";
import {BlockViewer} from "../../../blockui/uiruntime/BlockViewer";
import {Form} from "../../../blockui/Form";
import {StringMap} from "../../../common/StringMap";
import {FormulaInfo} from "../../../blockui/uiruntime/FormulaInfo";
import {CommonUtils} from "../../../common/CommonUtils";
import {FilterExpression} from "./FilterExpression";
import {FormulaParse} from "./FormulaParse";
import {FormulaTools} from "./FormulaTools";
import {SchemaFactory} from "../../SchemaFactory";

/**
 * 公式计算器,目前的设计是一切合法的JS 表达式,业务上要求是 +_*\\/括号运算
 */
export class FormulaCalculator {

    private mapFieldToFormula: StringMap<Array<FormulaInfo>>;
    private filterParser: FormulaParse;
    private formulaParser: FormulaParse;

    constructor(private schema: Schema, private  viewerInfo: BlockViewer) {
        this.initFieldFormula();
    }


    //计算,只适合表内公式
    static calc(formula: string, row: object, schema: Schema) {
        let instance = FormulaParse.getInstance(false, schema);
        let valueExp = instance.transToValue(formula, row, schema);
        return eval(valueExp);
    }

    static getInstance(viewerInfo: BlockViewer) {
        let schema = SchemaFactory.getSchema(viewerInfo.getBlockViewDto().schemaId,
            viewerInfo.getBlockViewDto().versionCode);
        return new FormulaCalculator(schema, viewerInfo);
    }

    public fieldValueChanged(fieldId: number, row: object,
                             mapHasCalcFormula?: StringMap<FormulaInfo>, mapChangedField?: StringMap<any>): StringMap<any> {
        //记录已计算过的公式,防止循环的出现
        if (!mapHasCalcFormula) {
            mapHasCalcFormula = new StringMap<FormulaInfo>();
        }
        if (!mapChangedField) {
            mapChangedField = new StringMap<any>();
        }
        //查看此字段没有相关的公式
        let lstFormula = this.getFieldFormulas(fieldId);
        if (lstFormula == null || lstFormula.length > 1) {
            return mapChangedField;
        }
        for (let formula of lstFormula) {
            if (mapHasCalcFormula.has(formula.getFormulaDto().formulaId + "")) {
                throw new Error("公式[" + formula.getFormulaDto().memo + ":" +
                    formula.getFormulaDto().formulaId + "]存在循环调用.");
            }
            mapHasCalcFormula.set(formula.getFormulaDto().formulaId + "", null);
            this.calcOneFormula(row, formula, mapHasCalcFormula, mapChangedField);
        }
        return mapChangedField;

    }

    private getFieldFormulas(fieldId): Array<FormulaInfo> {
        return this.mapFieldToFormula.get(fieldId);
    }

    private calcOneFormula(row, formula: FormulaInfo, mapHasCalcFormula, mapChangedField) {
        //1.先计算本公式
        //1.1 计算过滤条件是不是满足
        if (formula.getFormulaDto().filter != null) {
            if (!this.calcExpresion(this.filterParser.transToValue(formula.getFormulaDto().filter, row), true))
                return;
        }
        //1.2 计算公式
        let formulaStr = this.formulaParser.transToValue(formula.getFormulaDto().formula, row);
        let value = this.calcExpresion(formulaStr, false);
        //比较一下此值有没有变化,如果变化了,则要将此变化进一步递归下去
        let column = SchemaFactory.getColumnById(formula.getFormulaDto().columnId, formula.getFormulaDto().versionCode);
        let fieldName = column.getColumnDto().fieldName;
        if (!!this.viewerInfo.blockViewDto.fieldToCamel) {
            //目标字段
            fieldName = CommonUtils.toCamel(fieldName);
        }
        let oldValue = row[fieldName];
        if (oldValue == null) {
            if (value == null) {
                return;
            }
        } else {
            if (oldValue == value) {
                return;
            }
        }
        //触发递归
        row[fieldName] = value;
        mapChangedField.set(fieldName, value);
        this.fieldValueChanged(column.getColumnDto().columnId, row, mapHasCalcFormula, mapChangedField);
    }

    private calcExpresion(str, isFilter) {
        return eval(str);
    }

    /**
     * 分析此视图中公式结构,一个字段关联相应的公式列表
     */
    private initFieldFormula() {
        this.mapFieldToFormula = new StringMap<Array<FormulaInfo>>();
        this.filterParser = FormulaParse.getInstance(true, this.schema);
        this.formulaParser = FormulaParse.getInstance(false, this.schema);
        let lstFormula: Array<FormulaInfo>;
        let colIds: Array<string>;
        let lstColFormula;
        for (let com of this.viewerInfo.getLstComponent()) {
            lstFormula = com.getColumn().getLstFormula();
            if (lstFormula && lstFormula.length > 0) {
                for (let formulaInfo of lstFormula) {
                    colIds = FormulaTools.getColumnParams(formulaInfo.getFormulaDto().filter);
                    if (colIds && colIds.length > 0) {
                        for (let colId of colIds) {
                            CommonUtils.addMapListValue(this.mapFieldToFormula, colId, formulaInfo);
                        }
                    }
                    colIds = FormulaTools.getColumnParams(formulaInfo.getFormulaDto().formula);
                    if (colIds && colIds.length > 0) {
                        for (let colId of colIds) {
                            CommonUtils.addMapListValue(this.mapFieldToFormula, colId, formulaInfo);
                        }
                    }
                }
            }
        }
    }

}
