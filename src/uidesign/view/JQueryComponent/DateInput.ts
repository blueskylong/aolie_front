import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";
@RegComponent(Constants.ComponentType.date)
export class DateInput<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "date";
    }

}
