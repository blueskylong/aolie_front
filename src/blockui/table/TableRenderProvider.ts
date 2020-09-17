import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {BlockViewer} from "../uiruntime/BlockViewer";
import {Table} from "./Table";
import ColumnModel = FreeJqGrid.ColumnModel;
import {GlobalParams} from "../../common/GlobalParams";
import {UiService} from "../service/UiService";
import {TreeNode, TreeNodeFactory} from "../../common/TreeNode";
import {CommonUtils} from "../../common/CommonUtils";
import {Component} from "../uiruntime/Component";
import FormatterOptions = FreeJqGrid.FormatterOptions;

/**
 * 表体渲染接口,这个针对jqTable.
 */
export interface TableRenderProvider {
    /**
     * 某个单元格的编辑器
     * @param rowid
     * @param colIndex
     * @param value
     */
    getCellEditor(rowid: String, colIndex: number, value?: any, extParams?: any);

    /**
     * 取得一单元格的值
     * @param rowid
     * @param colIndex
     * @param value
     */
    getCellValue(rowid: String, colIndex: number, value?: any);

    /**
     * 某一单元格是否可以编辑
     * @param rowid
     * @param colIndex
     * @param value
     */
    isCellEditable(rowid: String, colIndex: number, value?: any);

    // /**
    //  * 取得列信息
    //  */
    // getColumnModel(): Array<ColumnModel>;

    /**
     * 取得分组信息
     */
    getColumnGroup(): FreeJqGrid.SetGroupHeaderOptions;

    /**
     * 取得后台的配置信息
     */
    getBlockInfo?(): BlockViewer;

    /**
     * 取得表参数
     */
    getOptions(table: Table): Promise<FreeJqGrid.JqGridOptions>;

    setEditable(editable): void;

}


export class ServerRenderProvider implements TableRenderProvider {

    static ServerDataUrl = CommonUtils.getServerUrl("/data/findBlockData")
    /**
     * 是否可以编辑
     */
    protected isEditable = true;
    protected viewer: BlockViewer;
    protected tableOption: FreeJqGrid.JqGridOptions;
    protected isReady = false;

    private lstColumn: Array<ColumnModel> = new Array<ColumnModel>();
    private groupHeader = {
        useColSpanStyle: true,
        applyLabelClasses: true,
        groupHeaders: []
    };

    constructor(protected blockId: string | number) {
    }

    /**
     * 取得单元格的编辑器
     * @param rowid
     * @param colIndex
     * @param value
     */
    public getCellEditor(rowid, colIndex, value, extParams?: any) {
        let ele = $("<input type='text' ></input>");
        ele.val(value);
        ele.attr("id", extParams.id);
        ele.attr("name", extParams.name);
        return ele.get(0);
    }

    /**
     * 取得显示值
     * @param rowid
     * @param colIndex
     * @param value
     */
    public getCellValue(rowid, colIndex, value) {

    }

    public isCellEditable(rowid, colIndex, value) {
        if (!this.isEditable) {
            return false;
        }
        if (rowid.substr(3) % 2)
            return true;
        return false;
    }

    /**
     * 取得列末级列
     */
    public getColumnModel(): Array<ColumnModel> {
        return this.lstColumn;
    }

    getBlockInfo(): BlockViewer {
        return this.viewer;
    }

    /**
     * 取得分组信息
     *
     */
    public getColumnGroup(): FreeJqGrid.SetGroupHeaderOptions {
        if (this.groupHeader.groupHeaders.length > 0) {
            return this.groupHeader;
        }
        return null;
    }

    private async findViewerInfo(blockId) {
        this.viewer = await UiService.getSchemaViewer(blockId) as any;
    }

    /**
     * 初始化表头
     */
    private async init() {

        await this.findViewerInfo(this.blockId);

        if (this.viewer) {
            let lstComponent = this.viewer.lstComponent;
            if (!lstComponent || lstComponent.length == 0) {
                lstComponent = [];
                return;
            }
            let blockDto = this.viewer.blockViewDto;
            let comNodes = TreeNodeFactory.genTreeNode(lstComponent, "componentDto", "lvlCode");
            for (let node of comNodes) {
                if (this.viewer.blockViewDto.fieldToCamel == 1) {
                    node.data.column.getColumnDto().fieldName
                        = CommonUtils.toCamel(node.data.column.getColumnDto().fieldName);
                }
                if (node.children) {//目前只做二层
                    this.groupHeader.groupHeaders.push(this.createGroupHeader(node));
                    for (let subNode of node.children) {
                        this.lstColumn.push(this.createColModel(node.data));
                    }
                } else {
                    this.lstColumn.push(this.createColModel(node.data));
                }

            }

        }

    }


    private createGroupHeader(node: TreeNode<Component>) {

        return {
            startColumnName: node.children[0].data.column.getColumnDto().fieldName,
            numberOfColumns: node.children.length,
            titleText: node.data.componentDto.title
        }
    }

    private createColModel(com: Component): ColumnModel {
        return {
            name: com.column.getColumnDto().fieldName,
            index: com.column.getColumnDto().fieldName,
            width: com.componentDto.width ? com.componentDto.width : 200,
            search: true,
            searchoptions: com.isNumberField() ? {sopt: ['eq', 'ne', 'le', 'lt', 'gt', 'ge']} : null,
            align: com.getTextAlign(),
            label: com.componentDto.title,
            editable: true,
            formatter: (cellValue: any, options: FormatterOptions
                , rowObject: any, action?: "edit" | "add") => {
                let value = CommonUtils.isNull(cellValue) ? "" : cellValue;
                if (!this.isEditable) {
                    options.colModel.classes = null;
                    return value;
                }
                if (!this.isCellEditable(options.rowId, options.pos, cellValue)) {
                    options.colModel.classes = "readonly_cell"
                    return value;
                } else {
                    options.colModel.classes = null;
                    return value;
                }
            },
            edittype: com.componentDto.dispType as any
        }

    }


    setEditable(editable): void {
        this.isEditable = editable;
    }

    /**
     * 取得表参数
     */
    async getOptions(table: Table): Promise<FreeJqGrid.JqGridOptions> {
        if (!this.tableOption) {
            await this.init();
            this.tableOption = $.extend(true, {}, DEFAULT_TABLE_CONFIG);
            this.tableOption.colModel = this.getColumnModel();
            this.tableOption.url = ServerRenderProvider.ServerDataUrl + "/" + this.blockId;
            this.tableOption.datatype = "json";
            let blockId = this.blockId;
            this.tableOption.beforeRequest = function () {
                this.p.postData["blockId"] = blockId;
            }
            return new Promise<FreeJqGrid.JqGridOptions>((resolve) => {
                resolve(this.tableOption);
            });
        } else {
            return new Promise<FreeJqGrid.JqGridOptions>((resolve) => {
                resolve(this.tableOption);
            });
        }
    }

    private findColumnByName(fieldName) {
        for (let col of this.viewer.getLstComponent()) {
            if (fieldName === col.column.getColumnDto().fieldName) {
                return col;
            }
        }
        return null;
    }
}

let DEFAULT_TABLE_CONFIG: FreeJqGrid.JqGridOptions = {
    guiStyle: "bootstrapPrimary",
    datatype: 'local',
    multiselect: true,
    multiselectPosition: "left",
    rownumbers: true,
    multiselectWidth: 25,
    rownumWidth: 40,
    sortable: true, // 是否可列排序
    rowList: [10, 20, 50, 100, '-1:全部'],
    rowNum: 20,
    styleUI: 'Bootstrap',
    pagerpos: "center",
    pgtext: '第 {0}页， 共{1}页',
    viewrecords: true,
    recordtext: '显示第 {0} 至 {1} 条记录，共 {2} 项',
    recordpos: 'left' as any,
    emptyrecords: '没有匹配的结果',
    loadtext: '读取中...',
    treeGridModel: "adjacency",
    treedatatype: 'local',
    frozen: true,
    pager: ".xx",//这里只是临时使用
    colModel: [],
    cellEdit: true,
    jsonReader: {
        root: "lstData",    // json中代表实际模型数据的入口
        page: "page.currentPage",    // json中代表当前页码的数据
        total: "page.totalPage",    // json中代表总页数
        records: "page.totalRecord", // json中代表数据行总数的数据
        repeatitems: true, // 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。
        cell: "cell",
        id: "id",
        userdata: "userdata",
        subgrid: {
            root: "lstData",
            repeatitems: true,
            cell: "cell"
        }
    }

};

