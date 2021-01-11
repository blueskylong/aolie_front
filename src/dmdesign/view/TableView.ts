import DmDesignBaseView from "./DmDesignBaseView";
import ColumnView from "./ColumnView";
import EventBus from "./EventBus";
import {DragEventCallbackOptions} from "jsplumb";
import {AttrChangeListener} from "./AttrChangeListener";
import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {TableInfo} from "../../datamodel/DmRuntime/TableInfo";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {CommonUtils} from "../../common/CommonUtils";
import {DmDesignService} from "../service/DmDesignService";
import {Column} from "../../datamodel/DmRuntime/Column";
import {BeanFactory} from "../../decorator/decorator";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";


export default class TableView extends DmDesignBaseView<TableInfo> implements AttrChangeListener {

    private static DEFAULT_WIDTH = 200;
    //向上图标类
    private static UP_CLASS = 'fa-arrow-circle-up';
    //向下图标类
    private static DOWN_CLASS = "fa-arrow-circle-down";
    private lstColumn: Array<ColumnView>;
    private move = false;
    private posInfo = null;
    private callUp = false;
    private confirmDlg: Dialog<DialogInfo>;
    private isShrinked = false;//是否是收缩状态
    private static activeTableView: TableView;

    /**
     * 增加右键菜单的开关,所有的表只需要一套菜单即可
     */
    public static isAddedContextMenu = false;


    getId() {
        return "C" + this.properties.getTableDto().tableId;
    }

    findColumn(colId: number): ColumnView {
        if (!this.lstColumn || this.lstColumn.length == 0) {
            return null;
        }
        for (let col of this.lstColumn) {
            if (col.getDtoInfo().getColumnDto().columnId == colId) {
                return col;
            }
        }
        return null;
    }

    afterComponentAssemble(): void {
        this.createSubControl();
        this.bindEvent();

    }

    private createSubControl() {
        this.addColumns(this.$element.find(".table-body .list-group").get(0));
        this.notifySubComplete();
        if (!TableView.isAddedContextMenu) {
            $.contextMenu({
                selector: '.table-view',
                callback: (key, options) => {
                    if (key === "delete") {
                        this.confirmDlg.show();
                    } else if (key === "sync") {
                        this.syncTable();
                    }

                },
                items: {
                    "delete": {name: "删除表", icon: "delete"},
                    "copy": {name: "复制增加", icon: "edit"},
                    "sync": {name: "同步", icon: "fa-refresh"},

                }
            });
            TableView.isAddedContextMenu = true;
        }


        this.confirmDlg = new Dialog<DialogInfo>({
            title: "消息",
            content: "确定要删除表[" + this.properties.getTableDto().title + "]吗?",
            onOk: () => {
                EventBus.fireEvent(EventBus.TABLE_REMOVE, this);
                return true;
            }
        });
    }

    private syncTable() {
        if (TableView.activeTableView) {
            TableView.activeTableView.doSync();
        }
    }

    protected selfActived() {
        TableView.activeTableView = this;
    }

    private doSync() {
        if (this.properties.getTableDto().tableId < 0) {
            Alert.showMessage("此表还没有保存,不需要同步!");
            return;
        }
        DmDesignService.getSyncTableCols(this.properties.getTableDto().tableId, (data) => {
            let columns = this.updateCols(BeanFactory.populateBeans(ColumnDto, data));
            this.properties.setLstColumn(columns);
            this.addColumns(this.$element.find(".table-body .list-group").get(0));
        });

    }

    private updateCols(lstDtos: Array<ColumnDto>) {
        let lstNewColumn = new Array<Column>();
        if (lstDtos) {
            for (let dto of lstDtos) {
                lstNewColumn.push(this.findColumnByDto(dto));
            }
        }
        return lstNewColumn;
    }

    private findColumnByDto(columnDto: ColumnDto) {
        let lstColumn = this.properties.getLstColumn();
        if (!lstColumn) {
            return null;
        }
        for (let column of lstColumn) {
            if (column.getColumnDto().columnId === columnDto.columnId) {
                column.setColumnDto(columnDto);
                return column;
            }
        }
        let column = new Column();
        columnDto.columnId = CommonUtils.genId();
        column.setColumnDto(columnDto);
        return column;
    }

    adjustProfile() {
        if (this.properties.getTableDto().posTop) {
            this.$element.css("top", this.properties.getTableDto().posTop)
        }
        if (this.properties.getTableDto().posLeft) {
            this.$element.css("left", this.properties.getTableDto().posLeft)
        }
        if (this.properties.getTableDto().width) {
            this.$element.width(this.properties.getTableDto().width);
        }
        if (this.properties.getTableDto().height > 0) {
            this.doPomp();
        } else {
            this.doShrink();
        }


    }

    private bindEvent() {
        TableView.JSPLUMB.draggable(this.element, {
            stop: (params: DragEventCallbackOptions) => {
                EventBus.fireEvent(EventBus.POSITION_CHANGE_EVENT, this.element, params);
            }
        });
        EventBus.fireEvent(EventBus.POSITION_CHANGE_EVENT, this.element, null);

        this.$element.find(".list-group")['dragsort']({
            dragEnd: () => {
                this.resortColumn();
                this.getJsplumb().revalidate(this.element);
            }
        });
        this.$element.find(".close-button").on("click", (e) => {
            this.confirmDlg.show();
        });
        this.$element.find(".table-title").on("dblclick", (event) => {
            this.toggleShrink();
        });

        let that = this;
        EventBus.addListener(EventBus.ADD_COLUMN, {
            handleEvent(eventType: string, data: any, source: object, extObject?: any) {
                if (data.tableId === that.properties.getTableDto().tableId) {
                    that.addColumn();
                }
            }
        });
        this.regResizeEvent();
    }

    private resortColumn() {
        let newArray = new Array<ColumnView>();
        let colDom = this.$element.find(".column-body");
        colDom.each((index, element) => {
            let i = 0;
            for (let col of this.lstColumn) {
                if (col.getViewUI() === element) {
                    col.getDtoInfo().prepareData(index + 1);
                    newArray.push(col);
                    this.lstColumn.splice(i, 1);
                }
                i++;
            }
        });
        this.lstColumn = newArray;

    }

    public attrChanged(attrName: string, value: any) {
        //先处理需要界面变化数据
        if (attrName === "title") {
            this.$element.find(".table-title").text(value);
        } else if (attrName === "readOnly") {
            this.$element.find(".badge").text(value == 1 ? "V" : "T");
        }
        this.properties.getTableDto()[attrName] = value;
    }

    notifySubComplete() {
        if (this.lstColumn && this.lstColumn.length > 0) {
            for (let columnView of this.lstColumn) {
 //               columnView.afterComponentAssemble();
            }
        }
    }

    destroy(): boolean {
        if (this.lstColumn && this.lstColumn.length > 0) {
            for (let col of this.lstColumn) {
                col.destroy();
            }
            this.lstColumn = null;
        }
        super.destroy();
        return true;
    }

    private addColumn() {
        let dto = new ColumnDto();
        dto.tableId = this.properties.getTableDto().tableId;
        dto.versionCode = this.properties.getTableDto().versionCode;
        dto.columnId = DmDesignService.genColId();
        dto.title = "新加列";
        dto.fieldName = "unNamed";
        dto.fieldType = "varchar";
        dto.length = 100;
        let col = new Column();
        col.setColumnDto(dto);
        let view = new ColumnView(col);
        this.properties.getLstColumn().push(col);
        this.lstColumn.push(view);
        this.$element.find(".table-body .list-group").append(view.getViewUI());
    }

    createUI(): HTMLElement {
        let eleRoot = $(require("../template/TableView.html"));
        eleRoot.attr("id", this.getId());
        eleRoot.find(".table-body").attr("id", Math.random());

        eleRoot.find(".table-title").text(this.getAttributes().getTableDto().title);
        eleRoot.find(".table-body .list-group").attr("id",
            "group-" + this.getAttributes().getTableDto().tableId);
        eleRoot.width((this.properties && this.properties.getTableDto().width)
            ? this.properties.getTableDto().width : TableView.DEFAULT_WIDTH);
        eleRoot.find(".shrink-spot").on("click", (event) => {
            this.toggleShrink();
        });
        return eleRoot.get(0);
    }

    public toggleShrink() {
        if (this.isShrinked) {
            this.doPomp();
        } else {
            this.doShrink();
        }
    }

    /**
     * 收起
     */
    public doShrink() {
        this.isShrinked = true;
        this.$element.find(".shrink-spot").removeClass(TableView.UP_CLASS)
            .addClass(TableView.DOWN_CLASS);
        if (this.lstColumn) {
            for (let col of this.lstColumn) {
                col.setShowAble(false);
            }
        }
        this.getJsplumb().revalidate(this.element);

    }

    /**
     * 展开
     */
    public doPomp() {
        this.isShrinked = false
        this.$element.find(".shrink-spot").removeClass(TableView.DOWN_CLASS)
            .addClass(TableView.UP_CLASS);
        if (this.lstColumn) {
            for (let col of this.lstColumn) {
                col.setShowAble(true);
            }
        }
        this.getJsplumb().revalidate(this.element);
        EventBus.fireEvent(EventBus.POSITION_CHANGE_EVENT, this.element, null);
    }


    private addColumns(columnParent: HTMLElement) {
        this.initCol();
        let element = $(columnParent);
        let i = 1;
        if (this.lstColumn) {
            for (let columnView of this.lstColumn) {
                element.append(columnView.getViewUI());
            }
        }

    }

    public columnAttrChanged(columnId: number, attrName: string, value: any): boolean {

        for (let column of this.lstColumn) {

            if (column.getDtoInfo().getColumnDto().columnId == columnId) {
                column.attrChanged(attrName, value);
                return true;
            }
        }
        return false;
    }

    private initCol() {
        if (this.lstColumn) {
            for (let colView of this.lstColumn) {
                colView.destroy();
            }
        }
        if (this.properties.getLstColumn()) {
            this.lstColumn = new Array<ColumnView>();
            for (let column of this.properties.getLstColumn()) {
                this.lstColumn.push(new ColumnView(column));
            }
        }
    }

    /**
     * 设置大小
     * @param e
     */
    private doResize(e) {
        this.$element.css({
            'width': Math.max(30, e.pageX - this.posInfo.x + this.posInfo.w),
        });
        this.getJsplumb().revalidate(this.element);

    }


    /**
     * 注册动态调整表内容的高度
     */
    private regResizeEvent() {
        $("#schema-component").on("mousemove", (e) => {
            if (this.move) {
                this.doResize(e);
                e.preventDefault();
                e.stopPropagation();
            }
        });
        $(document).on("mouseup", (e) => {
            this.move = false;
            this.callUp = false;
        });

        this.$element.on('mousedown', '.resize-spot', (e) => {
            this.posInfo = {
                'w': this.$element.width(),
                'h': this.$element.height(),
                'x': e.pageX,
                'y': e.pageY
            };
            this.move = true;
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }

    public prepareData() {
        this.properties.getTableDto().posTop = this.$element.position().top;
        this.properties.getTableDto().posLeft = this.$element.position().left;
        this.properties.getTableDto().width = this.$element.width();
        this.properties.getTableDto().height = this.isShrinked ? 0 : 1;
        this.resortColumn();
    }

    protected needHandleSelectEvent() {
        return true;
    }

}
