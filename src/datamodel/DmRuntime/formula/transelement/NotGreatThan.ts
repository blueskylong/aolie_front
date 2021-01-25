import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {AbstractTransElement} from "./AbstractTransElement";

@FormulaElement()
export class NotGreatThan extends AbstractTransElement {
    protected elementInner = "<=";
    protected elementCN = "小于等于";

    getOrder(): number {
        return this.getElementType()+9;
    }
}
