import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {RegComponent} from "../../../decorator/decorator";
import {Constants} from "../../../common/Constants";

@RegComponent(Constants.ComponentType.button)
export class Button<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "button";
    }

}
