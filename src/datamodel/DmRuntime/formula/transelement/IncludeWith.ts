import {AbstractTransElement} from "./AbstractTransElement";
import {DmConstants} from "../../../DmConstants";
import {FormulaElement, TransCenter} from "./TransElement";
import {Schema} from "../../Schema";

@FormulaElement()
export class IncludeWith extends AbstractTransElement {

    protected elementCN = "含有(*)";

    protected startStr = ".indexOf(";
    protected startStrCN = "含有(";
    protected endStr = ")!==-1";
    protected endStrCN = ")";

    getOrder(): number {
        return this.getElementType()+51;
    }

    getExpressionCN(): string {
        return "含有()";
    }

    getElementType(): number {
        return DmConstants.FormulaElementType.compare;
    }

    isMatchCn(str): boolean {
        return str.indexOf(this.startStrCN) !== -1 && str.endsWith(this.endStrCN);
    }

    isMatchInner(str): boolean {
        if (str.indexOf(this.startStr) === -1) {
            return false;
        }
        return (str.trim().endsWith(this.endStr));
    }

    /**
     *   ${f1}.indexOf("我")===0  =>  ${字段1} 以("我")开头
     * @param curElement
     * @param preElement
     * @param transcenter
     */
    transToCn(curElement, preElement, transcenter?: TransCenter): string {
        //前面部分,可以变量,也可能是常量,需要中心去处理
        let indexPos = curElement.indexOf(this.startStr);
        let endPos = curElement.indexOf((this.endStr));
        //前面部分
        let pre = curElement.substr(0, indexPos);
        let preStr = transcenter.transToCn(pre, transcenter);
        //中间部门,也需要中心处理
        let innerParam = curElement.substr(indexPos + this.startStr.length,
            endPos - indexPos + this.startStr.length);
        let innerParamStr = transcenter.transToCn(innerParam, transcenter);
        return preStr + this.startStrCN + innerParamStr + this.endStrCN;
    }

    /**
     * ${字段1} 以("我")开头  =>  ${f1}.indexOf("我")===0
     * @param curElement
     * @param preElement
     * @param transcenter
     */
    transToInner(curElement, schema: Schema, transcenter?: TransCenter): string {
        //前面部分,可以变量,也可能是常量,需要中心去处理
        let indexPos = curElement.indexOf(this.startStrCN);
        let endPos = curElement.indexOf((this.endStrCN));
        //前面部分
        let pre = curElement.substr(0, indexPos);
        let preStr = transcenter.transToInner(pre, schema, transcenter);
        //中间部门,也需要中心处理
        let innerParam = curElement.substr(indexPos + this.startStr.length,
            endPos - indexPos + this.startStr.length);
        let innerParamStr = transcenter.transToInner(innerParam, schema, transcenter);
        return preStr + this.startStr + innerParamStr + this.endStr;
    }
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.slice(0, prefix.length) === prefix;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
