import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";

export class ColorSelect<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "color";
    }

}
