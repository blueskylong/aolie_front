import {AbstractTransElement} from "./AbstractTransElement";
import {DmConstants} from "../../../DmConstants";
import {FormulaElement, TransCenter} from "./TransElement";
import {Schema} from "../../Schema";

@FormulaElement()
export class Or extends AbstractTransElement {
    protected elementInner = "||";
    protected elementCN = "或者";

    getOrder(): number {
        return this.getElementType() + 15;
    }

    getElementType(): number {
        return DmConstants.FormulaElementType.logic;
    }

}
