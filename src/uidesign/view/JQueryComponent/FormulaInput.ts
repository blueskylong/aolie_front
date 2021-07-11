import {Component} from "../../../blockui/uiruntime/Component";
import {RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";
import {FilterInput} from "./FilterInput";

@RegComponent(Constants.ComponentType.formula)
export class FormulaInput<T extends Component> extends FilterInput<T> {
    protected isFilter(): boolean {
        return false;
    }

}
