import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {AbstractTransElement} from "./AbstractTransElement";

@FormulaElement()
export class NotEquals extends AbstractTransElement {
    protected elementInner = "!=";
    protected elementCN = "不等于";

    getOrder(): number {
        return this.getElementType()+5;
    }


}
