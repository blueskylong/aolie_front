import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {UiUtils} from "../../common/UiUtils";
import {Form} from "../../blockui/Form";
import {Constants} from "../../common/Constants";
import {Component} from "../../blockui/uiruntime/Component";

export class ComfirmDlg extends Dialog<DialogInfo> {

    static getInstance(content: string, onOk: (value: any) => boolean) {
        return new ComfirmDlg({title: "确认", content: content, onOk: onOk})
    }

    protected getBody(): HTMLElement {
        return $("<div>" + this.properties.content + "</div>").get(0);
    }

}

