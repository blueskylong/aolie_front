import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";

export class Hidden<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "hidden";
    }

}
