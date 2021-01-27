import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";
@RegComponent(Constants.ComponentType.textarea)
export class TextArea<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "textarea";
    }

    protected createEditor(id: string) {
        return $("<textarea class='com-editor form-control' id='" + id
            + "' />");
    }
}
