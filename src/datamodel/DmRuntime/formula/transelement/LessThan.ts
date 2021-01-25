import {FormulaElement, TransCenter, TransElement} from "./TransElement";
import {AbstractTransElement} from "./AbstractTransElement";

@FormulaElement()
export class LessThan extends AbstractTransElement {
    protected elementInner = "<";
    protected elementCN = "小于";

    getOrder(): number {
        return this.getElementType()+67;
    }


}
