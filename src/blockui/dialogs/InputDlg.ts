import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {UiUtils} from "../../common/UiUtils";
import {Form} from "../../blockui/Form";
import {Constants} from "../../common/Constants";
import {Component} from "../../blockui/uiruntime/Component";

export class InputDlg extends Dialog<InputDlgInfo> {
    private fName: Form;

    protected getBody(): HTMLElement {
        let lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.text, this.properties.inputTitle, 11, "name"));
        this.fName = new Form(null);
        this.fName.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        return this.fName.getViewUI();
    }

    protected beforeShow(value?: any) {
        if (value) {
            this.fName.setValue({name: value});
        }
    }

    getValue() {
        return this.fName.getValue()['name'].toString();
    }

    protected beforeOK() {
        let data = this.getValue();
        if (!this.properties.isCanEmpty && !data || "" === data.trim()) {
            UiUtils.showInfo("输入项不可以为空");
            return false;
        }
        return true;
    }

}

export interface InputDlgInfo extends DialogInfo {
    inputTitle: string,
    isCanEmpty: boolean
}
