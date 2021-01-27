import {Component} from "../../../blockui/uiruntime/Component";
import {JQBaseComponent} from "./JQBaseComponent";
import {FilterExpression} from "../../../datamodel/DmRuntime/formula/FilterExpression";
import {TextArea} from "./TextArea";
import {CommonUtils} from "../../../common/CommonUtils";
import {SchemaFactory} from "../../../datamodel/SchemaFactory";
import {Schema} from "../../../datamodel/DmRuntime/Schema";
import {StringMap} from "../../../common/StringMap";
import {FilterDlg, FilterDlgProperty} from "./formula/FilterDlg";
import {RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";
import {FilterInput} from "./FilterInput";

@RegComponent(Constants.ComponentType.formula)
export class FormulaInput<T extends Component> extends FilterInput<T> {





    protected isFilter(): boolean {
        return false;
    }

}
