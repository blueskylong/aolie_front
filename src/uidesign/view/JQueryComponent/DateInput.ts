import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";

export class DateInput<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "date";
    }

}
