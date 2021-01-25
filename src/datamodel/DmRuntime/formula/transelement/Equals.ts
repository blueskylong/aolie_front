import {AbstractTransElement} from "./AbstractTransElement";
import {FormulaElement} from "./TransElement";

@FormulaElement()
export class Equals extends AbstractTransElement {
    protected elementInner = "==";
    protected elementCN = "等于";

    getOrder(): number {
        return this.getElementType()+60;
    }


}
