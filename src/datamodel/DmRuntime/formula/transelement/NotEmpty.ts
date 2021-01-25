import {FormulaElement} from "./TransElement";
import {IsEmpty} from "./IsEmpty";

@FormulaElement()
export class notEmpty extends IsEmpty {

    protected elementInner = "!=null";
    protected elementCN = "不为空";

    getOrder(): number {
        return this.getElementType()+1;
    }
}
