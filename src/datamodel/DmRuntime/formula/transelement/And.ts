import {AbstractTransElement} from "./AbstractTransElement";
import {DmConstants} from "../../../DmConstants";
import {Or} from "./Or";
import {FormulaElement} from "./TransElement";

@FormulaElement()
export class And extends Or {
    protected elementInner = "&&";
    protected elementCN = "并且";

    getOrder(): number {
        return this.getElementType()+10;
    }

    getElementType(): number {
        return DmConstants.FormulaElementType.logic;
    }


}
