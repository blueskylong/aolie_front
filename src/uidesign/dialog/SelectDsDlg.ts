import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {JsTree, JsTreeInfo} from "../../blockui/JsTree/JsTree";
import {CommonUtils} from "../../common/CommonUtils";
import {UiUtils} from "../../common/UiUtils";

export class SelectDsDlg extends Dialog<DialogInfo> {
    protected tree: JsTree<JsTreeInfo>;

    protected getBody(): HTMLElement {
        let treeInfo = {
            textField: "name",
            codeField: "code",
            rootName: "数据表",
            multiSelect: true,
            showSearch: true,

            url: "/ui/findReferenceData/" + 50
        };
        this.tree = new JsTree<JsTreeInfo>(treeInfo);
        return this.tree.getViewUI();
    }

    protected beforeShow(value?: any) {
        this.tree.afterComponentAssemble();
    }

    getValue() {
        return this.tree.getSelectData(false);
    }

    protected beforeOK() {
        let selectData = this.getValue();
        if (!selectData || selectData.length < 1) {
            UiUtils.showInfo("请选择数据表");
            return false;
        }
        return true;
    }

}
