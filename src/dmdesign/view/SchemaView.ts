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
import {DmDesignService} from "../service/DmDesignService";
import {TableInfo} from "../../datamodel/DmRuntime/TableInfo";
import {DmService} from "../../datamodel/service/DmService";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Schema} from "../../datamodel/DmRuntime/Schema";
import {BeanFactory} from "../../decorator/decorator";
import {TableColumnRelation} from "../../datamodel/DmRuntime/TableColumnRelation";
import {UiService} from "../../blockui/service/UiService";
import {ReferenceData} from "../../datamodel/dto/ReferenceData";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {Toolbar, ToolbarInfo} from "../../uidesign/view/JQueryComponent/Toolbar";


export default class SchemaView extends DmDesignBaseView<SchemaDto> implements AttrChangeListener {
    static TYPE_TABLE = "TABLE";
    static TYPE_COLUMN = "COLUMN";
    static DEFAULT_RELATION_TYPE = 2;
    static RELATION_TYPE_REF = 40;

    private dragHor = false;
    private dragVer = false;
    private posInfo = null;
    private relationDlg: RelationDlg<DialogInfo>;
    private selectTableDlg: SelectTableDlg<DialogInfo>;

    private schema: Schema;

    private curConnection: Connection;
    private connectionRelations: StringMap<TableColumnRelationDto> = new StringMap<TableColumnRelationDto>();


    protected tables: Array<TableView>;
    private itemSelectListener: any;
    private relationReferenceData: Array<ReferenceData>;


    private dataReady: () => void;

    private toolBar: Toolbar<ToolbarInfo>;

    private $canvas: JQuery;
    private destroying = false;


    constructor(dto: SchemaDto) {
        super(dto);
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
        this.connectionRelations.forEach((value, key, map) => {
            if (tableView.findColumn(value.fieldTo) || tableView.findColumn(value.fieldFrom)) {
                this.removeConnection(key);
            }
        });
        //删除此表信息
        this.tables.splice(this.tables.indexOf(tableView), 1);
        this.schema.getLstTable().splice(this.schema.getLstTable().indexOf(tableView.getDtoInfo()), 1);
        return true;
    }

    private removeConnection(conId: string) {
        let cons = this.getJsplumb().getAllConnections();
        for (let con of cons) {
            if (con.id === conId) {
                this.getJsplumb().deleteConnection(con);
                this.connectionRelations.delete(con.id);
                return;
            }
        }
    }

    private createDefaultRelation(fieldFrom, fieldTo) {
        let dto = new TableColumnRelationDto();
        dto.fieldFrom = fieldFrom;
        dto.fieldTo = fieldTo;
        dto.id = DmDesignService.genColId();
        dto.relationType = SchemaView.DEFAULT_RELATION_TYPE;
        return dto;
    }

    private onSelectTable(left, top): boolean {
        let tableName = this.selectTableDlg.getValue();
        if (tableName) {

            let tableDto = new TableDto();
            tableDto.tableId = DmDesignService.genTableId();
            tableDto.tableName = tableName;
            tableDto.height = 1;
            tableDto.title = "新增表[" + tableName + "]";
            tableDto.posLeft = left;
            tableDto.posTop = top;
            let tableInfo = new TableInfo();
            tableInfo.setTableDto(tableDto);
            DmDesignService.findTableFieldAsColumnDto(tableName, this.properties.schemaId, this.properties.versionCode,
                tableDto.tableId, (data) => {
                    if (data && data.length > 0) {
                        let cols = new Array<Column>();
                        for (let col of data) {
                            let c = new Column();
                            c.setColumnDto(col);
                            cols.push(c);
                        }
                        tableInfo.setLstColumn(cols);
                        let tableView = new TableView(tableInfo);
                        this.addTable(this.$canvas.get(0), tableView);
                        tableView.afterComponentAssemble();
                        tableView.adjustProfile();
                    }

                });

        }
        return true;
    }

    private onRelationOk(): boolean {
        if (!this.curConnection) {
            return true;
        }
        if (this.curConnection.id && this.relationDlg.getValue()) {
            let relationDto = this.createDefaultRelation(this.getColumnIdByElementID(this.curConnection.sourceId),
                this.getColumnIdByElementID(this.curConnection.targetId));
            relationDto.relationType = this.relationDlg.getValue();
            this.connectionRelations.set(this.curConnection.id, relationDto);
            this.updateLabelText(this.curConnection, this.relationDlg.getTitle());
            return true;
        }

    }

    saveSchema() {
        if (!this.check()) {
            return;
        }
        this.schema.prepareData();
        if (this.tables) {
            for (let table of this.tables) {
                table.prepareData();
            }
        }
        this.schema.getSchemaDto().width = this.$canvas.width();
        this.schema.getSchemaDto().height = this.$canvas.height();
        this.schema.setLstRelation(this.getRelations());
        DmDesignService.saveSchema(this.schema, (err) => {
            if (err) {
                alert(err);
            } else {
                Alert.showMessage({message: "保存成功"});
                this.refresh();
            }
        })
    }

    getRelations() {
        let result = new Array<TableColumnRelation>();
        this.connectionRelations.forEach((dto, key, map) => {
            let relation = new TableColumnRelation();
            relation.setDto(dto);
            result.push(relation);
        });
        return result;
    }

    afterComponentAssemble(): void {
        $.contextMenu({
            selector: '.schema-view',
            callback: (key, options, event) => {
                if (key === "add") {
                    this.selectTableDlg.setExistsTableNames(this.collectExistsTableNames());
                    this.selectTableDlg.show($(event.target)
                        .closest(".context-menu-root").position().left - CommonUtils.getOffsetLeftByBody(this.$canvas.get(0)),
                        $(event.target).closest(".context-menu-root").position().top - CommonUtils.getOffsetTopByBody(this.$canvas.get(0)),
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
                    if ($(data).position().top + $(data).height() > this.$canvas.height() - 10) {
                        this.$canvas.height($(data).position().top + $(data).height() + 20);
                    }

                    if ($(data).position().left + $(data).width() > this.$canvas.width() - 10) {
                        this.$canvas.width($(data).position().left + $(data).width() + 20);
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
                        this.itemSelectListener(SchemaView.TYPE_TABLE, source.getDtoInfo().getTableDto());
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
                        data.beforeRemoved();
                    }
                }
            }
        );
        this.toolBar.addBtn("保存", (e) => {
            this.saveSchema();
        });
        this.toolBar.addBtn("刷新", (e) => {
            this.refresh();
        });
        this.toolBar.addBtn("恢复显示比例", (e) => {
            this.restore();
        });

        this.toolBar.addBtn("收缩", (e) => {
            this.shrinkAll();
        });

        this.toolBar.addBtn("展开", (e) => {
            this.prompAll();
        });
        this.toolBar.addBtn("服务器缓存刷新", (e) => {
            this.refreshServerCache();
        });
    }

    private refresh() {
        this.destroyElement();
        this.getJsplumb().reset(true);
        this.initTableAndRelation();
    }

    private restore() {
        this.zoom(1);
    }


    protected initSubControllers() {
        this.initJsplumb();
        this.handleResize();
        this.initTableAndRelation();
        this.initReference();


    }

    private destroyElement() {
        if (this.tables) {
            for (let table of this.tables) {
                table.beforeRemoved();
                $(table.getViewUI()).remove();
            }
            this.tables = new Array<TableView>();
        }
        this.curConnection = null;
        this.connectionRelations = new StringMap<TableColumnRelationDto>();

    }

    private initTableAndRelation() {
        DmService.findSchemaInfo(this.properties.schemaId, this.properties.versionCode)
            .then((result) => {
                let schema = BeanFactory.populateBean(Schema, result.data);
                this.schema = schema;
                this.properties = schema.getSchemaDto();
                this.initTables(schema.getLstTable());
                this.initRelation(schema.getLstRelation());
                this.updateTableProfile();
                if (this.properties.width) {
                    this.$canvas.width(this.properties.width);
                }
                if (this.properties.height) {
                    this.$canvas.height(this.properties.height);
                }
                this.ready = true;
                if (this.dataReady) {
                    this.dataReady();
                }
            });

    }

    private async initReference() {
        this.relationReferenceData =
            await UiService.getReferenceData(SchemaView.RELATION_TYPE_REF);
    }

    private updateTableProfile() {
        if (this.tables) {
            for (let table of this.tables) {
                table.adjustProfile();
            }
        }
    }

    private initRelation(lstRelation: Array<TableColumnRelation>) {
        if (!lstRelation || lstRelation.length == 0) {
            return;
        }
        for (let relation of lstRelation) {
            try {
                this.getJsplumb().connect({
                    source: this.getElementIdByColumnId(relation.getDto().fieldFrom),
                    target: this.getElementIdByColumnId(relation.getDto().fieldTo),
                    label: this.getRefNameById(relation.getDto().relationType),
                    anchor: ['Left', 'Right', "Top", "Bottom"],
                    connector: ["Flowchart", {cornerRadius: 10, outlineStroke: 'transparent', outlineWidth: 10}],
                    paintStyle: {
                        stroke: 'green', strokeWidth: 2
                    },
                    beforeDetach: (connection) => {
                        EventBus.fireEvent(EventBus.CONNECTION_BEFOREDETACH, connection);
                    },
                    endpointStyle: {fill: 'lightgray', outlineStroke: 'darkgray', strokeWidth: 2}

                } as any).id = relation.getDto().id + "";

                this.connectionRelations.set(relation.getDto().id + "", relation.getDto());
            } catch (e) {
                console.log("初始化连接失败:" + e);
            }
        }

    }

    private getRefNameById(id: number) {
        if (this.relationReferenceData) {
            for (let ref of this.relationReferenceData) {
                if (ref.id == id) {
                    return ref.name;
                }
            }
        }
        return null;
    }

    private createConnection(tableIdFrom, tableIdTo, type) {

    }

    private initTables(tables: Array<TableInfo>) {
        if (tables && tables.length > 0) {
            this.tables = new Array<TableView>();
            for (let table of tables) {
                let tableView = new TableView(table);
                this.tables.push(tableView);
                this.$canvas.append(tableView.getViewUI());
                tableView.afterComponentAssemble();
            }
        }
    }

    private initJsplumb() {
        this.getJsplumb().setContainer(this.$canvas.get(0));
        this.getJsplumb().draggable(this.$canvas.get(0));
        this.getJsplumb().bind("click", (e, f) => {
            this.curConnection = e;
            this.relationDlg.show(this.connectionRelations.get(e.id));

        });
        this.getJsplumb().bind("beforeDrop", (info) => {
            if (info.targetId.substr(0, info.targetId.indexOf("_"))
                === info.sourceId.substr(0, info.sourceId.indexOf("_"))) {
                return false;
            }
            //二张表只能有一个关系

            if (this.isTablesHasRelation(parseInt(info.targetId.substr(1, info.targetId.indexOf("_"))),
                parseInt(info.sourceId.substr(1, info.sourceId.indexOf("_"))))) {
                Alert.showMessage({message: "二张表只能存在一个关系"})
                return false;
            }
            this.curConnection = info.connection;
            //默认一对多的关系
            this.connectionRelations.set(this.curConnection.id,
                this.createDefaultRelation(this.getColumnIdByElementID(this.curConnection.sourceId),
                    this.getColumnIdByElementID(this.curConnection.targetId)));
            this.relationDlg.show(SchemaView.DEFAULT_RELATION_TYPE);
            return true;
        });
        this.getJsplumb().draggable(this.$element.find(".panel-tools").get(0));
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
        if (!this.destroying) {
            this.connectionRelations.delete(connection.id);
        }
    }

    /**
     * 表之间是否已存在关联关系
     * @param tableId1
     * @param tableId2
     */
    private isTablesHasRelation(tableId1: number, tableId2: number) {
        let columnRelationDtos = this.connectionRelations.getValues();
        if (columnRelationDtos) {
            let t1, t2;
            for (let dto of columnRelationDtos) {
                t1 = this.schema.findColumn(dto.fieldFrom).getColumnDto().tableId;
                t2 = this.schema.findColumn(dto.fieldTo).getColumnDto().tableId;
                if ((tableId1 == t1 && tableId2 == t2) || (tableId2 == t1 && tableId1 == t2)) {
                    return true;
                }
            }
        }
        return false;
    }

    private getTableIdFromKey(key: string) {
        return key.substr(1, key.indexOf("_"))
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
        this.destroying = true;
        if (this.tables) {
            for (let table of this.tables) {
                table.beforeRemoved();
            }
        }
        this.tables = null;
        this.relationDlg.beforeRemoved();
        this.selectTableDlg.beforeRemoved();
        this.relationDlg = null;
        this.selectTableDlg = null;
        this.schema = null;
        this.connectionRelations = null;
        this.curConnection = null;
        super.beforeRemoved();
        $.contextMenu("destroy");
        //jsplumb的所有设置和事件都要销毁,否则不可以重复使用
        this.getJsplumb().deleteEveryConnection();
        this.getJsplumb().deleteEveryEndpoint();
        this.getJsplumb().unbind();
        EventBus.clearEvent();

        return true;
    }

    protected createUI(): HTMLElement {
        let html = $(require("../template/SchemaView.html"));
        this.toolBar = new Toolbar<ToolbarInfo>({});
        html.append(this.toolBar.getViewUI());
        this.$canvas = html.find(".schema-view");
        return html.get(0);
    }

    private addTable(parent: HTMLElement, table: TableView) {
        if (!this.tables) {
            this.tables = new Array<TableView>();
        }
        if (!this.schema.getLstTable()) {
            this.schema.setLstTable([]);
        }
        this.schema.getLstTable().push(table.getDtoInfo());
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
        this.$canvas.on('mousedown', '.schema-right,.schema-bottom,.schema-corner',
            (e) => {
                this.posInfo = {
                    'w': this.$canvas.width(),
                    'h': this.$canvas.height(),
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
        this.$canvas.on('mousewheel',
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
        this.$canvas.css({
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
            this.$canvas.css({
                'height': Math.max(30, e.pageY - this.posInfo.y + this.posInfo.h)
            });
        if (this.dragHor) {
            this.$canvas.css({
                'width': Math.max(30, e.pageX - this.posInfo.x + this.posInfo.w)
            })
        }
        this.getJsplumb().revalidate(this.element);

    }

    public findTableById(tableId: number): TableView {
        for (let table of this.tables) {
            if (table.getDtoInfo().getTableDto().tableId == tableId) {
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
        this.schema.getSchemaDto()[attrName] = value;
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

    public setItemSelectListener(listener: (type: string, dto: TableDto | Column) => void) {
        this.itemSelectListener = listener;
    }

    /**
     * 检查合法
     */
    private check() {
        return true;//TODO
    }

    /**
     * 取得表信息
     */
    private getTableInfos() {
        let result = new Array<TableInfo>();
        if (this.tables && this.tables.length > 0) {
            for (let table of this.tables) {
                result.push(table.getAttributes());
            }
        }
        return result;
    }


    private getElementIdByColumnId(id: number) {
        let column = this.schema.findColumn(id);
        if (!column) {
            return null;
        }
        return CommonUtils.genElementId(column.getColumnDto().tableId, column.getColumnDto().columnId);
    }

    private shrinkAll() {
        if (this.tables) {
            for (let table of this.tables) {
                table.doShrink();
            }
        }
    }

    private prompAll() {
        if (this.tables) {
            for (let table of this.tables) {
                table.doPomp();
            }
        }
    }

    private refreshServerCache() {
        DmDesignService.refreshServerCache(this.properties.schemaId, this.properties.versionCode, (data) => {
            this.refresh();
        })
    }

    private collectExistsTableNames() {
        if (this.tables) {
            let result = new Array<string>();
            for (let table of this.tables) {
                result.push(table.getDtoInfo().getTableDto().tableName);
            }
            return result;
        }
        return null;
    }

    getConstraints() {
        return this.schema.getLstConstraint();
    }

    getConstraintDtos() {
        return this.schema.getLstConstraintDto();
    }

    setDataReadyListener(ready: () => void) {
        this.dataReady = ready;
    }
}


