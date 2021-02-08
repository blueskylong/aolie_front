/**
 *过滤条件表达式
 * 支持二种表达式,一是服务端调用表达式,如用在引用数据上的过滤条件,形如:{{service1(param1,param2)}}
 * 一种是普通的表达式,如: ${1}==${3} and ${1} > 0 and ${4} =='#{-1}',其中1和3都是列ID,-1为系统参数,需要直接替换的
 *
 * 主要功能已迁到FormulaParse中了
 */
import {Column} from "../Column";
import {CommonUtils} from "../../../common/CommonUtils";
import {FormulaTools} from "./FormulaTools";
import {SchemaFactory} from "../../SchemaFactory";

export class FilterExpression {
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
        if (!this.isServiceFilter()) {
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
}
