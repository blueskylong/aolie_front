import {TransCenter, TransElement} from "./transelement/TransElement";
import {Schema} from "../Schema";


/**
 * 公式或条件解析器(目前只做翻译,和部分的方法检查)
 */
export class FormulaParse implements TransCenter {
    constructor(private isFilter: boolean, private schema: Schema) {

    }

    /**
     * 全部的翻译器
     */
    static arrElement = new Array<TransElement>();
    /**
     * 仅公式的翻译器
     */
    static arrFormulaElement = new Array<TransElement>();

    static getInstance(isFilter: boolean, schema: Schema) {
        return new FormulaParse(isFilter, schema);
    }

    /**
     * 注册公式翻译元素
     * @param ele
     */
    static regTransElement(ele: TransElement) {
        FormulaParse.arrElement.push(ele);
        //排序
        FormulaParse.arrElement.sort((a, b) => {
            if (a.getOrder() >= b.getOrder()) {
                return 1;
            } else {
                return -1;
            }
        });
        if (!ele.isOnlyForFilter()) {
            FormulaParse.arrFormulaElement.push(ele);
        }
        FormulaParse.arrFormulaElement.sort((a, b) => {
            if (a.getOrder() >= b.getOrder()) {
                return 1;
            } else {
                return -1;
            }
        });

    }

    static getTransElements() {
        return FormulaParse.arrElement;
    }

    transToCn(curElement: string): string {

        for (let transElement of this.getTranslator()) {
            if (transElement.isMatchInner(curElement)) {
                return transElement.transToCn(curElement, this);
            }
        }
        return curElement;
    }

    transToInner(curElement: string, schema?: Schema): string {
        for (let transElement of this.getTranslator()) {
            if (transElement.isMatchCn(curElement)) {
                return transElement.transToInner(curElement, schema || this.schema, this);
            }
        }
        return curElement;
    }

    private getTranslator() {
        let arrTranslator = FormulaParse.arrElement;
        if (!this.isFilter) {
            arrTranslator = FormulaParse.arrFormulaElement;
        }
        return arrTranslator;
    }

    transToValue(curElement: string, rowData, schema?: Schema, transcenter?: TransCenter): string {
        for (let transElement of this.getTranslator()) {
            if (transElement.isMatchInner(curElement)) {
                return transElement.transToValue(curElement, rowData, schema || this.schema, this);
            }
        }
        return curElement;
    }

}

export class ParseResult {

}
