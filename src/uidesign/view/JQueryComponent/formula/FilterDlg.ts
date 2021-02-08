import {Dialog, DialogInfo} from "../../../../blockui/Dialog";
import {Schema} from "../../../../datamodel/DmRuntime/Schema";
import {FilterEditor} from "./FilterEditor";
import {jsPlumb} from "jsplumb";

/**
 * 过滤设计 对话框
 */
export class FilterDlg<T extends FilterDlgProperty> extends Dialog<T> {
    private filterEditor: FilterEditor<any>;
    private isFilter = true;

    protected getBody(): HTMLElement {
        this.filterEditor = new FilterEditor<any>(this.properties);
        return this.filterEditor.getViewUI();
    }

    protected beforeShow(value?: any) {
        if (this.hasInited) {
            return;
        }
        this.setSize([800, 600]);
        this.filterEditor.setFilterInner(value);
        this.addButton("检查", (e) => {
            this.filterEditor.check();
        });
        this.addButton("强行保存", (e) => {
            Dialog.showConfirm("强型保存,会直接将未翻译的条件内容保存,请自行确认其正确性.确定保存吗?", () => {
                if (this.properties.forceSave) {
                    this.properties.forceSave(this.getValue());
                    this.close();
                }
            });

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
        if (!this.filterEditor.check(true)) {
            return false;
        }
        return true;
    }

}

export interface FilterDlgProperty extends DialogInfo {
    schema: Schema,//方案
    editable: boolean;//是不是可以编辑
    isFilter: boolean;//是不是过滤条件
    forceSave?: (value) => void;
}
