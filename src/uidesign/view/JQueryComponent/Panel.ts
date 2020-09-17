import {TextInput} from "./TextInput";
import {AutoFit} from "./AutoFit";
import {Component} from "../../../blockui/uiruntime/Component";

export class Panel<T extends Component> extends TextInput<T> {

    protected getEditorType() {
        return "panel";
    }

    protected handleEditor($dom: JQuery) {
        let $editorParent = $dom.find(".base-comp");
        if (this.properties.componentDto.titleSpan > 12) {//如果标题宽度大于12,则表示实际宽度,则剩下的空间给编辑器
            AutoFit.addAutoFitCompoent($editorParent.get(0));
        } else {
            $editorParent.addClass("col-md-" + (12 - this.properties.componentDto.titleSpan ? this.properties.componentDto.titleSpan : 0));
        }

    }

    protected loadTemplate(): string {
        return require("./templete/Panel.html");
    }

}
