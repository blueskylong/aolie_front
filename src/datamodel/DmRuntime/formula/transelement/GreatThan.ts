import {AbstractTransElement} from "./AbstractTransElement";
import {FormulaElement} from "./TransElement";

@FormulaElement()
export class GreatThan extends AbstractTransElement {
    protected elementInner = ">";
    protected elementCN = "大于";

    getOrder(): number {
        return this.getElementType()+61;
    }


}
