import TableDto from "../../datamodel/dto/TableDto";
import DmDesignBaseView from "./DmDesignBaseView";
import ColumnView from "./ColumnView";
import EventBus from "./EventBus";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {DragEventCallbackOptions} from "jsplumb";
import {AttrChangeListener} from "./AttrChangeListener";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Dialog, DialogInfo} from "../../blockui/Dialog";


export default class TableView extends DmDesignBaseView<TableDto> implements AttrChangeListener {

    private static DEFAULT_WIDTH = 200;
    private static DEFAULT_HEIGHT = 200;
    private lstColumn: Array<ColumnView>;
    private move = false;
    private posInfo = null;
    private callUp = false;
    private confirmDlg: Dialog<DialogInfo>;
    /**
     * 增加右键菜单的开关,所有的表只需要一套菜单即可
     */
    private static isAddedContextMenu = false;


    getId() {
        return "C" + this.properties.tableId;
    }

    findColumn(colId: number): ColumnView {
        if (!this.lstColumn) {
            return null;
        }
        for (let col of this.lstColumn) {
            if (col.getDtoInfo().columnId == colId) {
                return col;
            }
        }
        return null;
    }

    afterComponentAssemble(): void {
        this.createSubControl();
        this.adjustProfile();
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
                    }
                },
                items: {
                    "delete": {name: "删除表", icon: "delete"},
                    "copy": {name: "复制增加", icon: "edit"}

                }
            });
            TableView.isAddedContextMenu = true;
        }


        this.confirmDlg = new Dialog<DialogInfo>({
            title: "消息",
            content: "确定要删除表[" + this.properties.title + "]吗?",
            onOk: () => {
                EventBus.fireEvent(EventBus.TABLE_REMOVE, this);
                return true;
            }
        });
    }

    private adjustProfile() {
        if (this.properties.posTop) {
            this.$element.css("top", this.properties.posTop)
        }
        if (this.properties.posLeft) {
            this.$element.css("left", this.properties.posLeft)
        }

        this.resize();
        this.adjustHeight((this.dto && this.properties.height) ? this.properties.height : TableView.DEFAULT_HEIGHT - 30);

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
    }

    private resortColumn() {
        let newArray = new Array<ColumnView>();
        let colDom = this.$element.find(".column-body");
        colDom.each((index, element) => {
            let i = 0;
            for (let col of this.lstColumn) {
                if (col.getId() === $(element).attr("id")) {
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
        this.dto[attrName] = value;
    }

    notifySubComplete() {
        for (let columnView of this.lstColumn) {
            columnView.afterComponentAssemble();
        }
    }

    beforeRemoved(): boolean {
        if (this.lstColumn) {
            for (let col of this.lstColumn) {
                col.beforeRemoved();
            }
            this.lstColumn = null;
        }
        super.beforeRemoved();
        return true;
    }

    createUI(): HTMLElement {
        let eleRoot = $(require("../template/TableView.html"));
        eleRoot.attr("id", this.getId());
        eleRoot.find(".table-body").attr("id", Math.random());

        eleRoot.find(".table-title").text(this.getAttributes().title);
        eleRoot.find(".table-body .list-group").attr("id",
            "group-" + this.getAttributes().tableId);
        eleRoot.width((this.dto && this.properties.width) ? this.properties.width : TableView.DEFAULT_WIDTH);
        eleRoot.height((this.dto && this.properties.height) ? this.properties.height : TableView.DEFAULT_HEIGHT);
        return eleRoot.get(0);
    }


    private addColumns(columnParent: HTMLElement) {
        this.initCol();
        let element = $(columnParent);
        let i = 1;
        for (let columnView of this.lstColumn) {
            element.append(columnView.getViewUI());
        }

    }

    public columnAttrChanged(columnId: number, attrName: string, value: any): boolean {
        console.log("------>to find:" + columnId);
        for (let column of this.lstColumn) {
            console.log("------>this.is :" + column.getDtoInfo().columnId);
            if (column.getDtoInfo().columnId == columnId) {
                column.attrChanged(attrName, value);
                return true;
            }
        }
        return false;
    }

    private initCol() {
        let dto = new ColumnDto();
        dto.tableId = this.getAttributes().tableId;
        dto.columnId = Math.round(Math.random() * 1000000);
        dto.title = "第一列";
        let col = new ColumnView(dto);
        this.lstColumn = new Array<ColumnView>();
        this.lstColumn.push(col);
        dto = new ColumnDto();
        dto.title = "第二列";
        dto.tableId = this.getAttributes().tableId;
        dto.columnId = Math.round(Math.random() * 1000000);
        col = new ColumnView(dto);
        this.lstColumn.push(col);
        dto = new ColumnDto();
        dto.title = "第三列";
        dto.tableId = this.getAttributes().tableId;
        dto.columnId = Math.round(Math.random() * 1000000);
        col = new ColumnView(dto);
        this.lstColumn.push(col);
        dto = new ColumnDto();
        dto.title = "第四列";
        dto.tableId = this.getAttributes().tableId;
        dto.columnId = Math.round(Math.random() * 1000000);
        col = new ColumnView(dto);
        this.lstColumn.push(col);
    }

    /**
     * 设置大小
     * @param e
     */
    private doResize(e) {
        this.$element.css({
            'width': Math.max(30, e.pageX - this.posInfo.x + this.posInfo.w),
            'height': Math.max(30, e.pageY - this.posInfo.y + this.posInfo.h)
        });
        this.getJsplumb().revalidate(this.element);
        this.adjustHeight();
    }

    private adjustHeight(height?: number) {
        this.$element.find(".table-body")
            .height(height ? height : this.$element.height() - 30);
    }


    /**
     * 注册动态调整表内容的高度
     */
    private resize() {
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

        this.$element.on('mousedown', '#resize', (e) => {
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

    protected needHandleSelectEvent() {
        return true;
    }
}
