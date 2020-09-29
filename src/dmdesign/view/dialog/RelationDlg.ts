import {Dialog, DialogInfo} from "../../../blockui/Dialog";
import {Component} from "../../../blockui/uiruntime/Component";
import {JQueryGeneralComponentGenerator} from "../../../uidesign/view/JQueryComponent/JQueryGeneralComponentGenerator";
import {BaseComponent} from "../../../uidesign/view/BaseComponent";
import {Select} from "../../../uidesign/view/JQueryComponent/Select";
import EventBus from "../EventBus";

export class RelationDlg<T extends DialogInfo> extends Dialog<T> {
    private selectCom: BaseComponent<Component>;

    private confirmDialg: Dialog<DialogInfo>;

    protected getBody(): HTMLElement {
        let componentInfo = Component.fromSimpleComponent({
            title: "类型",
            fieldName: "c1",
            dispType: "select",
            horSpan: 12,
            refId: 40
        });
        this.selectCom = new JQueryGeneralComponentGenerator().generateComponent("select", componentInfo, null, this);
        this.confirmDialg = new Dialog<DialogInfo>({
            title: "提示",
            content: "确定要删除连接吗?",
            onOk: () => {
                EventBus.fireEvent(EventBus.DELETE_CUR_CONNECTION, this.importValue);
                return true;
            }
        });
        this.addButton($("<button type=\"button\" class=\"btn btn-danger dlg-ok-button\">删除</button>").get(0),
            (e) => {
                this.confirmDialg.show();
            });
        return this.selectCom.getViewUI();

    }

    beforeShow(value?: any) {

        if (typeof value === "number" || typeof value === "string") {
            this.setValue(value);
        } else {
            this.setValue(value.relationType);
        }

    }

    setValue(value) {
        this.selectCom.setValue(value);
    }

    getValue() {
        return this.selectCom.getValue();
    }

    getTitle() {
        return (<Select<any>>this.selectCom).getTitle();
    }


    beforeRemoved() {
        if (this.selectCom) {
            this.selectCom.beforeRemoved();
            this.selectCom = null;
        }

        return super.beforeRemoved();

    }
}
