import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {JsTree, JsTreeInfo} from "../../blockui/JsTree/JsTree";
import {UiUtils} from "../../common/UiUtils";

export class SelectDsDlg extends Dialog<SelectDsDialogInfo> {
    protected tree: JsTree<JsTreeInfo>;
    private schemaId = 2;

    setSchemaId(schemaId) {
        this.schemaId = schemaId;
        return this;
    }

    protected getBody(): HTMLElement {
        let treeInfo = {
            idField: "tableId",
            textField: "tableName",
            codeField: "tableId",
            parentField: "nofield",//这里只是让其找不到的一个字段即可
            rootName: "数据表",
            multiSelect: this.properties.singleSelect ? false : true,
            showSearch: true,
            url: () => {
                return "/ui/findAllTableInfo/" + this.schemaId
            },
            onReady: () => {
                this.tree.selectNode(this.importValue)
            }
        };
        this.tree = new JsTree<JsTreeInfo>(treeInfo);

        return this.tree.getViewUI();
    }

    protected beforeShow(value?: any) {
        this.tree.setWidth(500);
        this.tree.setHeight(400);
    }

    getValue() {
        return this.tree.getSelectedId(true);
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

export interface SelectDsDialogInfo extends DialogInfo {
    //单选
    singleSelect?: boolean;
}
