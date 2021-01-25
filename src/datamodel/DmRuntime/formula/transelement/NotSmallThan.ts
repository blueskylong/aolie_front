import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {AbstractTransElement} from "./AbstractTransElement";

@FormulaElement()
export class NotSmallThan extends AbstractTransElement {
    protected elementInner = ">=";
    protected elementCN = "大于等于";

    getOrder(): number {
        return this.getElementType()+14;
    }
}
