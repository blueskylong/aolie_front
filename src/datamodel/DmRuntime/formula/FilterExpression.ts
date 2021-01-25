/**
 *过滤条件表达式
 * 支持二种表达式,一是服务端调用表达式,如用在引用数据上的过滤条件,形如:{{service1(param1,param2)}}
 * 一种是普通的表达式,如: ${1}==${3} and ${1} > 0 and ${4} =='#{-1}',其中1和3都是列ID,-1为系统参数,需要直接替换的
 */
import {Column} from "../Column";
import {CommonUtils} from "../../../common/CommonUtils";
import {FormulaTools} from "./FormulaTools";
import {SchemaFactory} from "../../SchemaFactory";
import {GlobalParams} from "../../../common/GlobalParams";
import {Schema} from "../Schema";
import {FormulaParse} from "./transelement";

export class FilterExpression {
    /**
     * 用于转换的固定几个
     */
        // static TRANSACTION_CONST_CE_JS = [
        //     ["大于等于", ">="],
        //     ["小于等于", "<="],
        //     ["不等于", "!="],
        //     ["大于", ">"],
        //     ["小于", "<"],
        //     ["等于", "=="],
        //     ["并且", "&&"],
        //     ["或者", "||"],
        //     ["以(*)开头", ".indexOf(*) == 0"],
        //     ["包含(*)", ".indexOf(*)!=-1"],
        //     ["不包含(*)", ".indexOf(*) == -1"],
        //     ["为空(*)", ".indexOf(*) == -1"],
        //     ["不为空(*)", ".indexOf(*) == -1"],
        // ];
    private version: string;
    private filter: string;
    private serviceFilter = false;

    /**
     * 条件时涉及到的字段
     */
    private lstCols = new Array<Column>();

    public static getInstance(filter: string, version: string) {
        let expression = new FilterExpression();
        expression.parseExpression(filter);
        return expression;
    }

    private FilterExpression() {

    }

    public getFilterInner() {
        return this.filter;
    }


    /**
     * 解析表达式
     *
     * @param filter
     * @return
     */
    public parseExpression(filter: string): FilterExpression {
        this.filter = filter;
        if (CommonUtils.isEmpty(filter)) {
            return this;
        }
        this.serviceFilter = FilterExpression.isServerExpress(filter);
        return this;
    }

    public static isServerExpress(str) {
        if (CommonUtils.isEmpty(str)) {
            return true;
        }
        return str.startsWith("{{") && str.endsWith("}}");
    }

    /**
     * 取得中文内容
     */
    public getFilterCN(schema: Schema) {
        if (this.isServiceFilter()) {
            return this.filter;
        }
        return FormulaParse.getInstance(true, schema).transToCn(this.filter);
        //FilterExpression.convertFilterToCN(this.filter, schema);
    }

    public setExpressCN(filterCN, schema: Schema) {
        if (FilterExpression.isServerExpress(filterCN)) {
            this.parseExpression(filterCN);
        } else {
            this.filter = FormulaParse.getInstance(true, schema).transToInner(filterCN, schema);
        }
    }

    /**
     * 验证公式是不是正确
     * @param str
     */
    public static validate(str): string {
        return null;
    }

    /**
     * 验证中文公式是不是正确
     * @param str
     */
    public static validateCN(str): string {
        return null;
    }


    /**
     * 这里分析所有的字段,返回字段列表
     * 如果指定了表ID ,则只返回对应的列信息
     */
    public getColParams(dsId?): Array<Column> {
        if (this.isServiceFilter()) {
            return null;
        }
        let columnParams = FormulaTools.getColumnParams(this.filter);
        if (!columnParams) {
            return null;
        }
        let cols = new Array<Column>();
        let col: Column;
        for (let colParam of columnParams) {
            col = SchemaFactory.getColumnById(colParam);
            if (dsId) {
                if (col.getColumnDto().tableId === dsId) {
                    cols.push(col);
                }
            } else {
                cols.push(col);
            }
        }
        return cols;
    }

    public isServiceFilter(): boolean {
        return this.serviceFilter;
    }


    /**
     * 如果是服务服务过滤,则取得服务名及参数名{{service1(param1,param2)}}
     */
    public getServiceNameAndParams(): Array<string> {
        if (!this.isServiceFilter) {
            return null;
        }
        this.filter = this.filter.trim();
        let lst = new Array<any>();
        let exp = this.filter.substring(2, this.filter.length - 2);
        let serviceName = exp.substring(0, exp.indexOf("("));
        lst.push(serviceName);
        if (exp.indexOf("(") != -1) {
            let params = exp.substring(exp.indexOf("(") + 1, exp.length - 1);
            let split = params.split(",");
            for (let i = 0; i < split.length; i++) {
                if (!CommonUtils.isEmpty(split[i])) {
                    lst.push(SchemaFactory.getColumnById(split[i]));
                }
            }
        }
        return lst;
    }

    public getServiceName(): string {
        if (!this.isServiceFilter) {
            return null;
        }
        let serviceNameAndParams = this.getServiceNameAndParams();
        return serviceNameAndParams[0];
    }

    /**
     * 转换成中文
     * @param exp
     * @param mapValue
     */
    static convertFilterToCN(exp, schema: Schema) {
        return FormulaParse.getInstance(true, schema).transToCn(exp);
    }

    /**
     * 转换成内部表达
     * @param exp
     * @param mapValue
     */
    static convertFilterToInner(exp, schema: Schema) {
        return FormulaParse.getInstance(true, schema).transToInner(exp);
    }

    /**
     * 替换英文系统参数
     * @param exp
     */
    private static replaceSysParamsToCN(exp) {
        let sysParams = FormulaTools.getSysParams(exp);
        if (sysParams && sysParams.length > 0) {
            for (let paramExp of sysParams) {
                let paramInfo = GlobalParams.getParamInfo(paramExp);
                exp = FormulaTools.replaceParamNameStr(exp, paramExp, paramInfo.name);
            }
        }
        return exp;
    }

    // /**
    //  * 替换成中文操作符
    //  * @param exp
    //  */
    // private static convertJsLogicToCN(exp: string) {
    //     for (let oper of FilterExpression.TRANSACTION_CONST_CE_JS) {
    //         exp = exp.replace(" " + oper[1] + " ", " " + oper[0] + " ");
    //     }
    //     return exp;
    // }
    //
    // /**
    //  * 替换成JS 操作符
    //  * @param exp
    //  */
    // private static convertLogicToInnerJs(exp: string) {
    //     for (let oper of FilterExpression.TRANSACTION_CONST_CE_JS) {
    //         exp = exp.replace(" " + oper[0] + " ", " " + oper[1] + " ");
    //     }
    //     return exp;
    // }

    /**
     * 替换成英文系统参数
     * @param exp
     */
    private static replaceSysParamsToInner(exp) {
        let sysParams = FormulaTools.getSysParams(exp);
        if (sysParams && sysParams.length > 0) {
            for (let paramName of sysParams) {
                let paramInfo = GlobalParams.getParamInfoByName(paramName);
                exp = FormulaTools.replaceParamNameStr(exp, paramName, paramInfo.id + "");
            }
        }
        return exp;
    }

    /**
     * 这里要注意,会有临时列,这里是查询不到的
     * @param exp
     */
    private static replaceColParamsToCN(exp, schema: Schema) {
        let columnParams = FormulaTools.getColumnParams(exp);
        if (!columnParams || columnParams.length < 1) {
            return exp;
        }
        for (let param of columnParams) {
            let column = schema.findColumnById(param);
            let tableInfo = schema.findTableById(column.getColumnDto().tableId);
            exp = FormulaTools.replaceColumnNameStr(exp, param,
                tableInfo.getTableDto().title + "." + column.getColumnDto().title);
        }
        return exp;

    }

    /**
     * 这里要注意,会有临时列,这里是查询不到的
     * @param exp
     */
    private static replaceColParamsToInner(exp, schema: Schema) {
        let columnParams = FormulaTools.getColumnParams(exp);
        if (!columnParams || columnParams.length < 1) {
            return exp;
        }
        for (let paramName of columnParams) {
            let names = paramName.split(".");
            if (names.length != 2) {
                throw new Error("列全名不正确");
            }
            let table = schema.findTableByTitle(names[0])
            if (!table) {
                throw new Error("方案[" + schema.getSchemaDto().schemaName + "]中,表不存在[" + names[0] + "]");
            }
            let column = table.findColumnByColTitle(names[1]);
            if (column == null) {
                throw new Error("方案[" + schema.getSchemaDto().schemaName + "]中,列不存在[" + paramName + "]");
            }
            let tableInfo = SchemaFactory.getTableByTableId(column.getColumnDto().tableId);
            exp = FormulaTools.replaceColumnNameStr(exp, paramName,
                column.getColumnDto().columnId + "");
        }
        return exp;

    }
}
