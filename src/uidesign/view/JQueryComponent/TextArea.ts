import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";

export class TextArea<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "textarea";
    }

    protected createEditor(id: string) {
        return $("<textarea class='com-editor form-control' id='" + id
            + "' />");
    }
}
