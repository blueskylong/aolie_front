import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";

export class CheckBox<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "checkbox";
    }

    getValue(): any {
        return this.getEditor().prop("checked") ? 1 : 0;
    }

    setValue(value: any) {
        this.getEditor().prop("checked", value);
    }

}
