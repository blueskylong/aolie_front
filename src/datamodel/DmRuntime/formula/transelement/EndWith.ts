import {FormulaElement} from "./TransElement";
import {IncludeWith} from "./IncludeWith";

@FormulaElement()
export class EndWith extends IncludeWith {

    protected elementCN = "以(*)结尾";

    protected startStr = ".endsWith(";
    protected startStrCN = "以(";
    protected endStr = ")";
    protected endStrCN = ")结尾";

    getOrder(): number {
        return this.getElementType() + 1;
    }

    getExpressionCN() {
        return "以()结尾";
    }

}


