import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {Schema} from "../../Schema";
import {DmConstants} from "../../../DmConstants";
import {CommonUtils} from "../../../../common/CommonUtils";

@FormulaElement()
export class ConstParam implements TransElement {
    getElementType(): number {
        return DmConstants.FormulaElementType.constant;
    }

    getName(): string {
        return "常量";
    }

    getExpressionCN() {
        return this.getName();
    }

    getOrder(): number {
        return this.getElementType();
    }

    //所有的其它不匹配的,都算做常量
    isMatchCn(str): boolean {
        return true;
    }

    isMatchInner(str): boolean {
        return true;
    }

    transToCn(curElement: string,  transcenter?: TransCenter): string {
        console.log(this.getName()+"  matched!");
        return curElement;
    }

    transToInner(curElement: string,  schema: Schema, transcenter?: TransCenter): string {
        console.log(this.getName()+"  matched!");
        if ((curElement.startsWith("'") && curElement.endsWith("'"))
            || (curElement.startsWith('"') && curElement.endsWith('"')))
            return curElement;
        if (CommonUtils.isNumber(curElement)) {
            return curElement;
        }
        return "'" + curElement + "'"
    }

}
