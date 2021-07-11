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
    private isChanging: boolean;


    constructor(viewer: BlockViewer | LocalRenderProvider) {
        if (viewer instanceof BlockViewer) {
            viewer.setShowSearch(false);
            let localPro = new LocalRenderProvider(viewer);
            localPro.setAllowLoadData(false);
            super(localPro);
        } else {
            super(viewer);
        }
        this.isChanging = false;
    }

    addSelectChangeListener(listener: GeneralEventListener) {
        this.selectChangeListener = listener;
    }

    onUiReady() {

        this.getJqTable().on("jqGridResizeStop", ((eventObject, width, index) => {
            if (this.isChanging) {
                return;
            }
            let columnArray = this.$element.jqGrid("getGridParam", "colModel");
            if (this.selectChangeListener) {
                this.selectChangeListener.handleEvent(EventBus.VALUE_CHANGE_EVENT, columnArray[index].id, width as any);
            }
        }));
        this.$fullElement.find('th').on('click', (event) => {
            if (this.selectChangeListener) {
                let classes = $(event.currentTarget).attr('class').split(' ');

                if (!classes) {
                    return;
                }
                let colId = '';
                for (let aClass of classes) {
                    if (aClass.startsWith(Table.COLUMN_LABEL_CLASS_PREFIX)) {
                        colId = aClass.substr(Table.COLUMN_LABEL_CLASS_PREFIX.length);
                    }
                }

                this.selectChangeListener.handleEvent(EventBus.SELECT_CHANGE_EVENT,
                    colId, event.target);
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
        this.$fullElement.find("th.selected").removeClass("selected");
        this.$fullElement.find("." + Table.COLUMN_LABEL_CLASS_PREFIX + colId).addClass("selected");
    }

    propertyChanged(propertyName, value) {
        if (this.currentColId) {
            this.isChanging = true;
            let dto = this.findDtoById(this.currentColId);
            if (dto) {
                dto[propertyName] = value;
            }
            if (propertyName === 'title') {

                this.getJqTable().setLabel(this.getColNameById(this.currentColId), value);
            }
            if (propertyName === 'width') {
                this.getJqTable().setColWidth(this.getColIndexById(this.currentColId), value);
            }
        }
        this.isChanging = false;

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
