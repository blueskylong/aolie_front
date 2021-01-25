import {Schema} from "../../Schema";
import {ApplicationContext, BeanFactory} from "../../../../decorator/decorator";
import {FormulaParse} from "./FormulaParse";

export interface TransElement extends TransCenter {
    /**
     * 是不是可以翻译的英文(JS)元素
     * @param str
     */
    isMatchInner(str): boolean;

    /**
     * 是不是可以翻译的中文元素
     * @param str
     */
    isMatchCn(str): boolean;

    /**
     * 翻译器的执行顺序,越小越靠前
     */
    getOrder(): number;

    /**
     *
     */
    getElementType(): number;

    getName(): string;

    getExpressionCN(): string;
}

export interface TransCenter {
    /**
     * 翻译成中文
     * @param curElement
     * @param preElement
     * @param transcenter
     */
    transToCn(curElement: string, transcenter?: TransCenter): string;

    /**
     * 翻译成内部表达式(JS)
     * @param curElement
     * @param preElement
     * @param schema
     * @param transcenter
     */
    transToInner(curElement: string, schema?: Schema, transcenter?: TransCenter): string;
}


/**
 * 注册表达式翻译组件
 * @param name
 * @constructor
 */
export function FormulaElement() {
    return (_constructor: { new(...args: Array<any>) }) => {
        //注册
        FormulaParse.regTransElement(BeanFactory.createBean(_constructor, []));
    }
}
