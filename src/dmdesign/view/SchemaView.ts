import SchemaDto from "../../datamodel/dto/SchemaDto";
import TableView from "./TableView";
import DmDesignBaseView from "./DmDesignBaseView";
import TableDto from "../../datamodel/dto/TableDto";
import EventBus from "./EventBus";
import {AttrChangeListener} from "./AttrChangeListener";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import ColumnView from "./ColumnView";
import {Connection} from "jsplumb";
import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {RelationDlg} from "./dialog/RelationDlg";
import {StringMap} from "../../common/StringMap";
import {TableColumnRelationDto} from "../../datamodel/dto/TableColumnRelationDto";
import {SelectTableDlg} from "./dialog/SelectTableDlg";
import {CommonUtils} from "../../common/CommonUtils";


export default class SchemaView extends DmDesignBaseView<SchemaDto> implements AttrChangeListener {
    static TYPE_TABLE = "TABLE";
    static TYPE_COLUMN = "COLUMN";
    static DEFAULT_RELATION_TYPE = 2;

    private dragHor = false;
    private dragVer = false;
    private posInfo = null;
    private relationDlg: RelationDlg<DialogInfo>;
    private selectTableDlg: SelectTableDlg<DialogInfo>;

    private curConnection: Connection;
    private connectionRelations: StringMap<TableColumnRelationDto> = new StringMap<TableColumnRelationDto>();


    protected tables: Array<TableView>;
    private itemSelectListener: any;

    constructor(dto: SchemaDto) {
        super(dto);
        this.tables = new Array<TableView>();
        let tableDto = new TableDto();
        tableDto.tableId = 1;
        tableDto.tableName = "表1";
        let tableView = new TableView(tableDto);
        this.tables.push(tableView);
        tableDto = new TableDto();
        tableDto.tableId = 2;
        tableDto.tableName = "表2";
        tableView = new TableView(tableDto);
        this.tables.push(tableView);
        tableDto = new TableDto();
        tableDto.tableId = 3;
        tableDto.posLeft = 350;
        tableDto.posTop = 100;
        tableDto.tableName = "表3";
        tableView = new TableView(tableDto);
        this.tables.push(tableView);

        this.relationDlg =
            new RelationDlg<DialogInfo>({
                title: "请选择表之间的关系", onOk: (value) => {
                    return this.onRelationOk()
                }
            });

        this.selectTableDlg = new SelectTableDlg<DialogInfo>({
            title: "请选择要增加的表", onOk: (items) => {
                return this.onSelectTable(items[0], items[1]);
            }
        });
    }

    private removeTable(tableView: TableView): boolean {
        //删除所有与此表的连接信息
        let colIdPre = tableView.getId();
        this.connectionRelations.forEach((value, key, map) => {
            if (tableView.findColumn(value.fieldTo) || tableView.findColumn(value.fieldFrom)) {
                this.removeConnection(key);
            }
        });
        //删除此表信息
        this.tables.splice(this.tables.indexOf(tableView), 1);
        return true;
    }

    private removeConnection(conId: string) {
        let cons = this.getJsplumb().getAllConnections();
        for (let con of cons) {
            if (con.id === conId) {
                this.getJsplumb().deleteConnection(con);
                return;
            }
        }
    }

    private createDefaultRelation(fieldFrom, fieldTo) {
        let dto = new TableColumnRelationDto();
        dto.fieldFrom = fieldFrom;
        dto.fieldTo = fieldTo;
        dto.relationType = SchemaView.DEFAULT_RELATION_TYPE;
        return dto;
    }

    private onSelectTable(left, top): boolean {
        let tableName = this.selectTableDlg.getValue();
        console.log("select table:" + tableName);
        let tableDto = new TableDto();
        tableDto.tableId = 100;
        tableDto.tableName = tableName;
        tableDto.title = "新增表[" + tableName + "]";
        tableDto.posLeft = left;
        tableDto.posTop = top;
        let tableView = new TableView(tableDto);
        this.addTable(this.element, tableView);
        tableView.afterComponentAssemble();
        return true;
    }

    private onRelationOk(): boolean {
        if (!this.curConnection) {
            return true;
        }
        if (this.curConnection.id, this.relationDlg.getValue()) {
            this.connectionRelations.set(this.curConnection.id, this.createDefaultRelation(this.getColumnIdByElementID(this.curConnection.sourceId),
                this.getColumnIdByElementID(this.curConnection.targetId)));
            this.updateLabelText(this.curConnection, this.relationDlg.getTitle());
            return true;
        }

    }

    afterComponentAssemble(): void {
        $.contextMenu({
            selector: '.schema-view',
            callback: (key, options, event) => {
                if (key === "add") {

                    this.selectTableDlg.show($(event.target).closest(".context-menu-root").offset().left,
                        $(event.target).closest(".context-menu-root").offset().top,
                        this.properties.schemaId);
                }
            },
            items: {
                "add": {name: "增加表", icon: "add"}
            }
        } as any);
        EventBus.addListener(EventBus.POSITION_CHANGE_EVENT,
            {
                handleEvent: (eventType: string, data: object, source: object) => {
                    if ($(data).offset().top + $(data).height() > this.$element.height() - 10) {
                        this.$element.height($(data).offset().top + $(data).height() + 20);
                    }

                    if ($(data).offset().left + $(data).width() > this.$element.width() - 10) {
                        this.$element.width($(data).offset().left + $(data).width() + 20);
                    }
                }
            });
        EventBus.addListener(EventBus.SELECT_CHANGE_EVENT,
            {
                handleEvent: (eventType: string, data: object, source: object) => {
                    if (!this.itemSelectListener) {
                        return;
                    }
                    if (source instanceof TableView) {
                        this.itemSelectListener(SchemaView.TYPE_TABLE, source.getDtoInfo());
                    } else if (source instanceof ColumnView) {
                        this.itemSelectListener(SchemaView.TYPE_COLUMN, source.getDtoInfo());
                    }
                }
            });
        EventBus.addListener(EventBus.CONNECTION_BEFOREDETACH,
            {
                handleEvent: (eventType: string, data: object, source: object) => {
                    this.connectionRemoved(data as any);
                }
            }
        );
        //删除当前连接
        EventBus.addListener(EventBus.DELETE_CUR_CONNECTION,
            {
                handleEvent: (eventType: string, data: object, source: object) => {
                    if (this.curConnection) {
                        this.getJsplumb().deleteConnection(this.curConnection);
                    }

                }
            }
        );
        EventBus.addListener(EventBus.TABLE_REMOVE,
            {
                handleEvent: (eventType: string, data: object, source: object) => {
                    if (data instanceof TableView) {
                        this.removeTable(data);
                        $(data.getViewUI()).remove();
                    }
                }
            }
        );


    }


    protected initSubControllers() {
        this.getJsplumb().setContainer(this.element);
        this.getJsplumb().draggable(this.element);
        this.getJsplumb().bind("click", (e, f) => {
            this.curConnection = e;
            this.relationDlg.show(this.connectionRelations.get(e.id));

        });
        this.getJsplumb().bind("connection", (e) => {
            this.curConnection = e.connection;
            //默认一对多的关系
            console.log("=====> add Id:" + this.curConnection.id);
            this.connectionRelations.set(this.curConnection.id,
                this.createDefaultRelation(this.getColumnIdByElementID(this.curConnection.sourceId),
                    this.getColumnIdByElementID(this.curConnection.targetId)));
            this.relationDlg.show(SchemaView.DEFAULT_RELATION_TYPE);
            return true;
        });

        this.getJsplumb().bind("beforeDrop", (info) => {
            if (info.targetId.substr(0, info.targetId.indexOf("_"))
                === info.sourceId.substr(0, info.sourceId.indexOf("_"))) {
                return false;
            }
            // info.connection.getOverlays() = "kerej";
            return true;
        });
        this.getJsplumb().draggable(this.$element.find(".panel-tools").get(0));
        this.handleResize();
        this.addTables(this.element);

    }

    private getColumnIdByElementID(elementId: string) {
        return elementId.substr(elementId.lastIndexOf("_") + 1);
    }

    private updateLabelText(connection: Connection, text: string) {
        let obj = connection.getOverlays();
        for (let attr in obj) {
            if (obj[attr].labelText) {
                obj[attr].setLabel(text);
                return;
            }
        }
    }

    public connectionRemoved(connection: Connection) {
        console.log("=====> remove Id:" + connection.id);
        this.connectionRelations.delete(connection.id);
    }

    /**
     * 取得视图的组件
     */
    public getViewUI(): HTMLElement {
        if (!this.element) {
            this.element = this.createUI();
            this.$element = $(this.element);
        }
        this.initSubControllers();
        return this.element;
    }

    beforeRemoved(): boolean {
        return false;
    }

    protected createUI(): HTMLElement {
        let html = $(require("../template/SchemaView.html"));
        return html.get(0);
    }

    private addTables(parent: HTMLElement) {
        for (let tableView of this.tables) {
            $(parent).append(tableView.getViewUI());
            tableView.afterComponentAssemble();
        }
    }

    private addTable(parent: HTMLElement, table: TableView) {
        this.tables.push(table);
        $(parent).append(table.getViewUI());

    }

    public resize(e) {
        if (this.dragHor || this.dragVer) {
            this.doResize(e);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * 绑定调整大小的事件
     */
    protected handleResize() {

        $(document).on("mouseup", (e) => {
            this.dragHor = false;
            this.dragVer = false;
        });
        this.$element.on('mousedown', '.schema-right,.schema-bottom,.schema-corner',
            (e) => {
                this.posInfo = {
                    'w': this.$element.width(),
                    'h': this.$element.height(),
                    'x': e.pageX,
                    'y': e.pageY
                };
                let ele = $(e.target);
                this.dragHor = ele.hasClass("schema-right") || ele.hasClass("schema-corner");
                this.dragVer = ele.hasClass("schema-bottom") || ele.hasClass("schema-corner");
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        this.$element.on('mousewheel',
            (e) => {

                var delta = -e.originalEvent['wheelDelta'] || e.originalEvent['detail'];//firefox使用detail:下3上-3,其他浏览器使用wheelDelta:下-120上120//下滚
                let scale = SchemaView.JSPLUMB.getZoom();
                if (delta > 0) {//缩小
                    if (scale < 0.3) {
                        scale = 0.3;
                    } else {
                        scale = scale - 0.03;
                    }
                }
                //上滚
                if (delta < 0) {//放大
                    if (scale > 1.5) {
                        scale = 1.5;
                    } else {
                        scale = scale + 0.03;
                    }
                }
                this.zoom(scale);
                return false;
            });


    }


    zoom(scale) {
        this.$element.css({
            "-webkit-transform": `scale(${scale})`,
            "-moz-transform": `scale(${scale})`,
            "-ms-transform": `scale(${scale})`,
            "-o-transform": `scale(${scale})`,
            "transform": `scale(${scale})`
        });
        SchemaView.JSPLUMB.setZoom(scale);
    }

    /**
     * 设置大小
     * @param e
     */
    private doResize(e) {
        if (this.dragVer)
            this.$element.css({
                'height': Math.max(30, e.pageY - this.posInfo.y + this.posInfo.h)
            });
        if (this.dragHor) {
            this.$element.css({
                'width': Math.max(30, e.pageX - this.posInfo.x + this.posInfo.w)
            })
        }
        this.getJsplumb().revalidate(this.element);

    }

    public findTableById(tableId: number): TableView {
        for (let table of this.tables) {
            if (table.getDtoInfo().tableId == tableId) {
                return table;
            }
        }
    }

    public tableAttrChange(tableId: number, attr: string, value: any) {
        let tableView = this.findTableById(tableId);
        if (tableView) {
            tableView.attrChanged(attr, value);
        }
    }

    attrChanged(attrName: string, value: any) {
        //先处理影响显示的属性 如主键,不可以为空 有引用等,都可以用图标显示出来
        //再赋值
        this.properties[attrName] = value;
    }

    /**
     * 列信息变化时调用
     * @param colomnId
     * @param attr
     * @param value
     */
    columnAttrChanged(colomnId: number, attr: string, value: any) {
        for (let table of this.tables) {
            if (table.columnAttrChanged(colomnId, attr, value)) {
                return true;
            }
        }
        return false;

    }

    public setItemSelectListener(listener: (type: string, dto: TableDto | ColumnDto) => void) {
        this.itemSelectListener = listener;
    }

}


