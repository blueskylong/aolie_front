import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {GlobalParams} from "../../common/GlobalParams";
import {SchemaFactory} from "../../datamodel/SchemaFactory";
import {CommonUtils} from "../../common/CommonUtils";


/**
 * 受控件的管理中心
 */
export class ManagedUiCenter implements ManagedEventListener {
    protected lstManagedUI: Array<AutoManagedUI> = new Array<AutoManagedUI>();

    constructor(protected schemaId) {
    }

    /**
     * 注册受控件,
     * @param uis
     */
    registerManagedUI(uis: Array<AutoManagedUI>) {
        if (!uis) {
            return;
        }
        for (let ui of uis) {
            ui.setManageEventListener(this);
        }
        this.lstManagedUI.push(...uis);
    }

    /**
     *     取消注册受控件
     */
    unRegisterManagedUI(uis: AutoManagedUI | Array<AutoManagedUI>) {
        if (uis instanceof Array) {
            for (let ui of uis) {
                ui.setManageEventListener(null);
                this.removeUI(ui);
            }
        } else {
            uis.setManageEventListener(null);
            this.removeUI(uis);
        }

    }

    private removeUI(ui: AutoManagedUI) {
        let index = this.lstManagedUI.indexOf(ui);
        if (index == -1) {
            return;
        }
        this.lstManagedUI.splice(index, 1);
    }

    /**
     * 一个数据发生了变化
     * @param source
     * @param tableId
     * @param mapKeyAndValue
     * @param field
     * @param value
     */
    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        //首先取得此数据相关的视图,然后通知
        let relationUIs = this.getRelationUIs(tableId);
        for (let ui of relationUIs) {
            if (ui == source) {
                continue;
            }
            ui.attrChanged(source, tableId, mapKeyAndValue, field, value);
        }
    }

    dataRemoved(source: any, tableId, mapKeyAndValue) {
        //首先取得此数据相关的视图,然后通知
        let relationUIs = this.getRelationUIs(tableId);
        for (let ui of relationUIs) {
            if (ui == source) {
                continue;
            }
            ui.dataRemoved(source, tableId, mapKeyAndValue);
        }
    }

    dsSelectChanged(source: any, tableId, mapKeyAndValue, row?) {
        //首先取得此数据相关的视图,然后通知
        let relationUIs = this.getRelationUIs(tableId);
        for (let ui of relationUIs) {
            if (ui == source) {
                continue;
            }
            ui.dsSelectChanged(source, tableId, mapKeyAndValue, row);
        }
    }

    referenceSelectChanged(source: any, refId, id) {

        //首先取得此数据相关的视图,然后通知
        let relationTableIds = this.getRelationTablesByRef(this.schemaId, GlobalParams.getLoginVersion(), refId);
        if (!relationTableIds) {
            return;
        }
        for (let ui of this.lstManagedUI) {
            if (ui == source) {
                continue;
            }
            if (this.anyInArray(ui.getTableIds(), relationTableIds)) {
                ui.referenceSelectChanged(source, refId, id);
            }

        }
    }

    private inArray(id: number, ids: Array<number>) {
        return ids.indexOf(id) != -1;
    }

    private anyInArray(ids: Array<number>, idRange: Array<number>) {
        for (let id of ids) {
            if (this.inArray(id, idRange)) {
                return true;
            }
        }
        return false;
    }

    stateChange(tableId, state: number) {
    }

    /**
     * 取得与此表有直接相关的界面
     * @param tableId
     */
    private getRelationUIs(tableId) {
        let result = new Array<AutoManagedUI>();
        for (let ui of this.lstManagedUI) {
            let tableIds = ui.getTableIds();
            if (tableIds.indexOf(tableId) != -1) {
                result.push(ui);
                continue;
            }
            for (let id of tableIds) {
                if (SchemaFactory.getTableRelation(tableId, id)) {
                    result.push(ui);
                    break;
                }
            }

        }
        return result;
    }

    private getRelationTablesByRef(schemaId, version, refId): Array<number> {
        let schema = SchemaFactory.getSchema(schemaId, version);
        let lstTable = schema.getLstTable();
        if (!lstTable) {
            return null;
        }
        let result = [];
        for (let table of lstTable) {
            if (table.hasColRelationToRef(refId)) {
                result.push(table.getTableDto().tableId);
            }
        }
        return result;
    }

    destroy() {
        this.unRegisterManagedUI(this.lstManagedUI);
        this.lstManagedUI = null;
    }
};
