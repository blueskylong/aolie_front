import {Dialog, DialogInfo} from "../../../blockui/Dialog";
import {Component} from "../../../blockui/uiruntime/Component";
import {JQueryGeneralComponentGenerator} from "../../../uidesign/view/JQueryComponent/JQueryGeneralComponentGenerator";
import {BaseComponent} from "../../../uidesign/view/BaseComponent";
import {Select} from "../../../uidesign/view/JQueryComponent/Select";
import EventBus from "../EventBus";
import {DmService} from "../../../datamodel/service/DmService";
import {Constants} from "../../../common/Constants";

export class SelectTableDlg<T extends DialogInfo> extends Dialog<T> {
    private selectCom: BaseComponent<Component>;

    private existsTableNames: Array<string>;

    protected getBody(): HTMLElement {
        let componentInfo = Component.fromSimpleComponent({
            title: "选择数据表",
            fieldName: "c1",
            dispType: Constants.ComponentType.select,
            horSpan: 12
        });
        this.selectCom = new JQueryGeneralComponentGenerator().generateComponent(Constants.ComponentType.select, componentInfo, null, this);

        return this.selectCom.getViewUI();
    }

    setExistsTableNames(names) {
        this.existsTableNames = names;
    }


    beforeShow(value?: any) {
        this.setValue(value);
    }

    show(...value) {
        super.show(value);
        if (this.selectCom instanceof Select) {
            DmService.findCanSelectTable(this.importValue)
                .then((result) => {
                    let lstTable = result.data;
                    for (let tableName of lstTable) {
                        if (this.existsTableNames && this.existsTableNames.indexOf(tableName) != -1) {
                            continue;
                        }
                        (<Select<any>>this.selectCom).addOption(tableName, tableName);
                    }
                    (<Select<any>>this.selectCom).getEditor().selectpicker("refresh");
                });
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


    destroy() {
        if (this.selectCom) {
            this.selectCom.destroy();
            this.selectCom = null;
        }
        return super.destroy();

    }
}
