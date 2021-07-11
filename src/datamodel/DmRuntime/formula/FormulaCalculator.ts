import {Schema} from "../Schema";
import {BlockViewer} from "../../../blockui/uiruntime/BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {FormulaInfo} from "../../../blockui/uiruntime/FormulaInfo";
import {CommonUtils} from "../../../common/CommonUtils";
import {FormulaParse} from "./FormulaParse";
import {FormulaTools} from "./FormulaTools";
import {SchemaFactory} from "../../SchemaFactory";
import {Component} from "../../../blockui/uiruntime/Component";
import {ControlFilterInfo, ControlFilterResult} from "../../../blockui/uiruntime/ControlFilterInfo";

/**
 * 公式计算器,目前的设计是一切合法的JS 表达式,业务上要求是 +_*\\/括号运算
 */
export class FormulaCalculator {

    /**
     * 记录计算公式
     */
    private mapFieldToFormula: StringMap<Array<FormulaInfo>>;
    private filterParser: FormulaParse;
    private formulaParser: FormulaParse;
    /**
     * 记录控件控制条件 key:fieldName,value:Array<ControlFilterInfo>
     */
    private mapFieldControlFilter: StringMap<Array<ControlFilterInfo>>;


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

    public calcFormulaOnFiledChange(fieldId: number, row: object,
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
        if (lstFormula == null || lstFormula.length < 1) {
            return mapChangedField;
        }
        return this.doCalcFormulas(lstFormula, row, mapHasCalcFormula, mapChangedField);

    }

    private doCalcFormulas(lstFormula: Array<FormulaInfo>, row: object,
                           mapHasCalcFormula: StringMap<FormulaInfo>, mapChangedField?: StringMap<any>) {
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

    /**
     * 计算所有的公式
     * @param row
     */
    public calcAllFormula(row: object): StringMap<any> {
        let mapChangedField = new StringMap<any>();
        this.mapFieldToFormula.forEach((key, lstFormula, map) => {
            let mapHasCalcFormula: StringMap<FormulaInfo> = new StringMap<FormulaInfo>();
            mapChangedField.setAll(this.doCalcFormulas(lstFormula, row, mapHasCalcFormula, mapChangedField));
            row = $.extend(true, row, mapChangedField);
        });
        return mapChangedField;
    }

    /**
     * 计算所有的控制条件
     * @param row
     */
    public calcAllControlFilter(row: object): StringMap<ControlFilterResult> {
        let result = new StringMap<ControlFilterResult>();
        this.mapFieldControlFilter.forEach((key, value, map) => {
            result.setAll(this.doCalcControlFilters(row, value));
        });
        return result;

    }

    public calcFilterOnFieldChange(fieldId: number, row: object,): StringMap<ControlFilterResult> {
        let result = new StringMap<ControlFilterResult>();
        let lstFilter = this.getFieldControlFilter(fieldId);
        if (!lstFilter || lstFilter.length < 1) {
            return result;
        }
        return this.doCalcControlFilters(row, lstFilter);

    }

    private doCalcControlFilters(row: object, lstFilter: Array<ControlFilterInfo>) {
        let result = new StringMap<ControlFilterResult>();
        for (let filterInfo of lstFilter) {
            result.set(filterInfo.fieldName, {
                isEditableFilter: filterInfo.isEditableFilter,
                result: this.calcOneFilter(filterInfo, row)
            });
        }
        return result;
    }

    private calcOneFilter(filterInfo: ControlFilterInfo, row: object): boolean {
        let exp = this.filterParser.transToValue(filterInfo.filter, row);
        return this.calcExpresion(exp, false);
    }


    private getFieldFormulas(fieldId): Array<FormulaInfo> {
        return this.mapFieldToFormula.get(fieldId);
    }

    private getFieldControlFilter(fieldId): Array<ControlFilterInfo> {
        return this.mapFieldControlFilter.get(fieldId);
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
        if (!!this.viewerInfo.getBlockViewDto().fieldToCamel) {
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
        this.calcFormulaOnFiledChange(column.getColumnDto().columnId, row, mapHasCalcFormula, mapChangedField);
    }

    private calcExpresion(str, isFilter) {
        return eval(str);
    }

    /**
     * 分析此视图中公式结构,一个字段关联相应的公式列表
     */
    private initFieldFormula() {
        this.mapFieldToFormula = new StringMap<Array<FormulaInfo>>();
        this.mapFieldControlFilter = new StringMap<Array<ControlFilterInfo>>();

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
            if (com.getComponentDto().editableFilter) {
                colIds = FormulaTools.getColumnParams(com.getComponentDto().editableFilter);
                if (colIds && colIds.length > 0) {
                    for (let colId of colIds) {
                        CommonUtils.addMapListValue(this.mapFieldControlFilter, colId,
                            {
                                filter: com.getComponentDto().editableFilter,
                                isEditableFilter: true,
                                columnId: com.getColumn().getColumnDto().columnId,
                                fieldName: com.getColumn().getColumnDto().fieldName
                            });
                    }
                }
            }
            if (com.getComponentDto().visibleFilter) {
                colIds = FormulaTools.getColumnParams(com.getComponentDto().visibleFilter);
                if (colIds && colIds.length > 0) {
                    for (let colId of colIds) {
                        CommonUtils.addMapListValue(this.mapFieldControlFilter, colId, {
                            filter: com.getComponentDto().visibleFilter,
                            isEditableFilter: false,
                            columnId: com.getColumn().getColumnDto().columnId,
                            fieldName: com.getColumn().getColumnDto().fieldName
                        });
                    }
                }
            }
        }
    }

}
