import {AbstractTransElement} from "./AbstractTransElement";
import {DmConstants} from "../../../DmConstants";
import {FormulaElement, TransCenter} from "./TransElement";
import {IncludeWith} from "./IncludeWith";

@FormulaElement()
export class NotIncludeWith extends IncludeWith {

    protected elementCN = "不含有(*)";

    protected startStr = ".indexOf(";
    protected startStrCN = "不含有(";
    protected endStr = ")===-1";
    protected endStrCN = ")";

    getOrder(): number {
        return this.getElementType()+11;
    }
    getExpressionCN(): string {
        return "不含有()";
    }
}
