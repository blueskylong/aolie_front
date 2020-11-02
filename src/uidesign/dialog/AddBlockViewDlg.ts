import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {JsTree, JsTreeInfo} from "../../blockui/JsTree/JsTree";
import {UiUtils} from "../../common/UiUtils";
import {Form} from "../../blockui/Form";
import {BlockViewDto} from "../dto/BlockViewDto";
import {Constants} from "../../common/Constants";
import {Component} from "../../blockui/uiruntime/Component";

export class AddBlockViewDlg extends Dialog<DialogInfo> {
    private fName: Form;

    protected getBody(): HTMLElement {
        let lstComp = new Array<Component>();
        lstComp.push(Form.genSimpDto(
            Constants.ComponentType.text, "视图名称", 11, "name"));
        this.fName = new Form(null);
        this.fName.setDisplayComponent(Form.genSimpleLocalViewer(lstComp));
        return this.fName.getViewUI();
    }

    protected beforeShow(value?: any) {
        this.fName.afterComponentAssemble();
    }

    getValue() {
        return this.fName.getValue().get('name').toString();
    }

    protected beforeOK() {
        let data = this.getValue();
        if (!data || "" === data.trim()) {
            UiUtils.showInfo("请输入视图名称");
            return false;
        }
        return true;
    }

}
