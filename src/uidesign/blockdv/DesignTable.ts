/**
 * 主要用于设计的列表控件
 */
import {Table} from "../../blockui/table/Table";
import {LocalRenderProvider} from "../../blockui/table/TableRenderProvider";
import {BlockViewer} from "../../blockui/uiruntime/BlockViewer";
import EventBus from "../../dmdesign/view/EventBus";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import {Component} from "../../blockui/uiruntime/Component";

export class DesignTable extends Table {
    private selectChangeListener: GeneralEventListener;
    private lstComponent: Array<Component>;
    private currentColId: any;

    constructor(viewer: BlockViewer) {
        super(new LocalRenderProvider(viewer));
    }

    addSelectChangeListener(listener: GeneralEventListener) {
        this.selectChangeListener = listener;
    }

    async showTable(): Promise<void> {

        this.getJqTable().on("jqGridResizeStop", ((eventObject, width, index) => {
            let columnArray = this.$element.jqGrid("getGridParam", "colModel");
            if (this.selectChangeListener) {
                this.selectChangeListener.handleEvent(EventBus.VALUE_CHANGE_EVENT, columnArray[index].id, width as any);
            }
        }));
        this.$fullElement.find("th").on("click", (event) => {
            if (this.selectChangeListener) {
                this.selectChangeListener.handleEvent(EventBus.SELECT_CHANGE_EVENT, $(event.currentTarget)
                    .attr("colid") as any, event.target);
            }
        });
        this.lstComponent = this.properties.getBlockInfo().getLstComponent();
        this.showUnVisibleCol();

    }

    destroy(): boolean {
        this.lstComponent = null;
        this.selectChangeListener = null;
        return super.destroy();
    }

    selectCol(colId) {
        this.currentColId = colId;
        this.$fullElement.find("[colid]").removeClass("selected");
        this.$fullElement.find("[colid=" + colId + "]").addClass("selected");
    }

    propertyChanged(propertyName, value) {
        if (this.currentColId) {
            let dto = this.findDtoById(this.currentColId);
            if (dto) {
                dto[propertyName] = value;
            }
            if (propertyName === 'title') {
                this.getJqTable().setLabel(this.getColNameById(this.currentColId), value);
            }
        }

    }

    private findDtoById(colId) {
        if (this.lstComponent) {
            for (let com of this.lstComponent) {
                if (com.getComponentDto().componentId == colId) {
                    return com;
                }
            }
        }
        return null;
    }

    getData() {
        return this.lstComponent;
    }


}
