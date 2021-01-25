import {Dialog, DialogInfo} from "../../../../blockui/Dialog";
import {Schema} from "../../../../datamodel/DmRuntime/Schema";
import {FilterEditor} from "./FilterEditor";
import {Alert} from "../Alert";
import {jsPlumb} from "jsplumb";

/**
 * 过滤设计 对话框
 */
export class FilterDlg<T extends FilterDlgProperty> extends Dialog<T> {
    private filterEditor: FilterEditor<any>;

    protected getBody(): HTMLElement {
        this.filterEditor = new FilterEditor<any>(this.properties);
        return this.filterEditor.getViewUI();
    }

    protected beforeShow(value?: any) {
        if (this.hasInited) {
            return;
        }
        this.setSize([800, 600]);
        this.filterEditor.setValue(value);
        this.addButton("检查", (e) => {
            this.filterEditor.check();
        });
        this.addButton("强行保存", (e) => {
            if (this.properties.forceSave) {
                this.properties.forceSave(this.getValue());
                this.close();
            }
        });
    }

    protected afterShow() {
        jsPlumb.getInstance({} as any).setDraggable(this.$element, false);
    }

    protected getValue(): any {
        return this.filterEditor.getValue();
    }

    public getFilterInner() {
        return this.filterEditor.getFilterInner();
    }

    protected beforeOK(): boolean {
        if (!this.properties.editable) {
            return true;
        }
        if (!this.filterEditor.check()) {
            Alert.showMessage("检查不通过");
            return false;
        }
        return true;
    }

}

export interface FilterDlgProperty extends DialogInfo {
    schema: Schema,
    editable: boolean;
    forceSave?: (value) => void;
}
