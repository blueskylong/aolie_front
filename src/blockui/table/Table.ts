import * as _ from 'underscore';
import {TableTools} from "./TableTools";
import BaseUI from "../../uidesign/view/BaseUI";
import {CommonUtils} from "../../common/CommonUtils";
import "./table.css";
import {TableRenderProvider} from "./TableRenderProvider";


class Table extends BaseUI<TableRenderProvider> {
    /**
     * 选择列的id
     */
    static CHECK_COL_ID = "cb";
    private isMaskChange = false;
    private ready = false;

    private isEditable = true;
    //同blockId,即界面设置器中的Id,但如果是本地表格类型，则使用这个uuid
    private tableId: string = CommonUtils.genUUID();


    /**
     * 行ID的字段名
     */
    public static ID_FIELD = "id";


    constructor(renderPro: TableRenderProvider) {
        super(renderPro);
    }

    setMultiSelect(isMulti) {
        this.$element.setGridParam({multiselect: isMulti}, true);
        if (!isMulti) {
            this.$element.hideCol(Table.CHECK_COL_ID);
        } else {
            this.$element.showCol(Table.CHECK_COL_ID);
        }
    }

    isMultiSelect() {
        this.$element.getGridParam("multiselect");
    }

    private removeNavHandler() {
        if (this.getSelectedCount() === 0) {
            console.log('warning', '请至少选择一条记录！');
            return;
        }
        this.removeSelected();
    }

    protected getTableId() {
        return this.tableId;

    }

    public getEditable() {
        return this.isEditable;
    }

    public isReady() {
        return this.ready;
    }

    public setEditable(editable) {
        this.isEditable = editable;
        this.properties.setEditable(editable);
        this.$element.setGridParam("cellEdit", editable).trigger("reloadGrid");
    }

    public stopEdit() {
        this.$element.trigger("blur");
    }

    private colmunNavHandler(d: any, e: any) {
        const {colModel, colNames} = this.$element.jqGrid('getGridParam');
        let values = [], options: Array<any> = [{
            id: '_all',
            text: '全部'
        }];
        for (let i = 0, l = colModel.length; i < l; i++) {
            let cm = colModel[i];
            if (cm.name !== 'rn' &&
                cm.name !== 'cb' &&
                cm.name !== 'subgrid') {
                options.push({
                    id: cm.name,
                    text: colNames[i],
                    parent: '_all'
                });
                if (!cm.hidden) {
                    values.push(cm.name);
                }
                TableTools.cellTreeselect(e.currentTarget, {
                    value: values.join(','),
                    options,
                    multiple: true,
                    threeState: true,
                    onStop: (str: string) => {
                        const newValues = str.split(',');
                        // 新的小于旧的，说明影藏
                        if (values.length > newValues.length) {
                            for (let value of values) {
                                if (!_.contains(newValues, value)) {
                                    this.$element.jqGrid('hideCol', value);
                                }
                            }
                        } else if (values.length < newValues.length) {
                            for (let newValue of newValues) {
                                if (!_.contains(values, newValue)) {
                                    this.$element.jqGrid('showCol', newValue);
                                }
                            }
                        }
                        values = newValues;
                    }
                });
            }
        }
    }


    eachColumns(columns: Array<any>, fn: Function, level = 1) {
        if (columns && columns.push && columns.length) {
            for (let column of columns) {
                fn(column, level,
                    !(column.children && column.children.push && column.children.length));
                this.eachColumns(column.children, fn, level + 1);
            }
        }
    }

    countLeafColumns({children}) {
        let count = 0;
        if (children && children.push && children.length) {
            for (let child of children) {
                count += this.countLeafColumns(child);
            }
        } else {
            count = 1;
        }
        return count;
    }

    firstLeafColumn(column) {
        const children = column.children;
        if (children && children.push && children.length) {
            return this.firstLeafColumn(children[0]);
        } else {
            return column;
        }
    }


    /**
     * 刷新数据，可编辑表格会触发检验
     */
    refreshData() {
        this.reloadData();
    }

    /**
     * 重载数据，可编辑表格不会触发检验
     * @param searchData
     */
    reloadData(searchData?) {

    }

    reparseOptions(target: any) {

    }

    /**
     * 过滤显示数据
     * @param {Function} fn
     */
    filterData(fn: Function) {

    }


    /**
     * 重置数据
     * @param args
     */
    resetData(data: Array<any>) {
        this.isMaskChange = true;
        this.setData(data);
        this.isMaskChange = false;
    }

    /**
     * 设置数据
     * @param {Array<any>} data
     */
    setData(data: Array<any>) {
        this.clearData();
        if (data) {
            for (let row of data) {
                this.$element.addRowData(CommonUtils.genUUID(), row);
            }
        }
    }

    addRow(rowData: any, rowId?: string) {
        let id = rowId ? rowId : CommonUtils.genUUID();
        this.$element.addRowData(rowId, rowData);
    }

    clearData() {
        this.$element.clearGridData(true);
    }

    /**
     * 获取表数据
     * @returns {any}
     */
    getData() {
        return this.$element.getRowData(null, {includeId: true});
    }

    /**
     * 导出excel文档
     */
    exportExcel() {
        //TODO
    }

    /**
     * 移除行
     * @param row
     */
    removeRow(row: any) {
        if (row) {
            if (typeof row === "string")
                this.$element.delRowData(row);
            else {
                this.$element.delRowData(row[Table.ID_FIELD]);
            }
        }
    }

    /**
     * 移除行
     * @param row
     */
    removeRows(rows: Array<any>) {
        if (!rows) {
            return;
        }
        for (let row of rows) {
            this.removeRow(row);
        }
    }

    /**
     * 这个ID数组是动态的，不要操作
     */
    getSelectRowIds() {
        return this.$element.jqGrid("getGridParam", "selarrrow");
    }

    /**
     * 移除选中行
     */
    removeSelected() {
        let rowIds = this.getSelectRowIds();
        if (!rowIds || rowIds.length < 1) {
            alert('请先选择行记录!');
            return false;
        }
        for (let i = rowIds.length - 1; i >= 0; i--) {
            this.removeRow(rowIds[i]);
        }
        return true;
    }

    /**
     * 获取行数据
     * @param rowid
     * @returns {any}
     */
    getRowData(rowid: string | string[]): object | Array<object> {
        if (typeof rowid === "string") {
            return this.$element.getRowData(rowid);
        } else {
            let arrResult = new Array<any>();
            for (let oneRow of rowid) {
                arrResult.push(this.getRowData(oneRow));
            }
            return arrResult;
        }

    }

    /**
     * 获取选中数量
     */
    getSelectedCount(): number {
        let rowIds = this.getSelectRowIds();
        if (CommonUtils.isNull(rowIds)) {
            return 0;
        }
        return rowIds.length;
    }

    /**
     * 返回选中数据，返回必定为数组
     * @returns {Array<any>}
     */
    getSelected(): Array<any> {
        let selectRowIds = this.getSelectRowIds();
        if (CommonUtils.isNull(selectRowIds)) {
            return null;
        }
        let data = this.getRowData(selectRowIds);
        if (data instanceof Array) {
            return data;
        } else {
            return [data];

        }
    }

    /**
     *
     * 设置行数据
     * @param rowid
     * @param rowdata
     */
    setRowData(rowid: string, rowdata) {
        return this.$element.setRowData(rowid, rowdata);
    }

    /**
     * 重新渲染单元格
     * @param x
     * @param y
     */
    rerenderCell(x: string, y: string) {

    }

    /**
     * 设置但不触发校验
     * @param rowid
     * @param colname
     * @param value
     */
    resetValue(rowid: string, colname: string, value?: any) {
        this.isMaskChange = true;
        this.setValue(rowid, colname, value);
        this.isMaskChange = false;
    }

    /**
     * 设置单元格值
     * @param rowid
     * @param colname
     * @param value
     */
    setValue(rowid: string, colname: string, value: any) {
        return this.$element.setCell(rowid, colname, value);
    }

    /**
     * 取得当前行数据
     */
    getCurrentRow() {
        let id = this.$element.getGridParam("selrow");
        if (CommonUtils.isNull(id)) {
            return null;
        }
        return this.$element.getRowData(id);
    }

    /**
     * 获取单元格真实值
     * @param rowid
     * @param colname
     * @returns {any}
     */
    getCellValue(rowId: string, colName: string) {
        return this.$element.getCell(rowId, colName);
    }

    /**
     * 设置footer数据
     * @param data
     */
    setFooterData(data) {
        this.$element.footerData('set', data, true);
    }

    /**
     * 获取footer数据
     */
    getFooterData() {
        return this.$element.footerData();
    }

    /**
     * 根据列
     */
    getColNameByIndex(index: number) {
        const iColByName = this.$element.jqGrid('getGridParam', 'iColByName');
        for (let name in iColByName) {
            if (iColByName.hasOwnProperty(name) &&
                iColByName[name] === index) {
                return name;
            }
        }
    }


    protected createUI(): HTMLElement {
        let $ele = $(require("../templete/Table.html"));
        $ele.find(".jq-pager").attr("id", this.getPagerId());
        return $ele.get(0);
    }

    protected getPagerId() {
        return this.getTableId() + "-pager";
    }


    onSelectRow(rowid: string, state: boolean, eventObject: JQuery.Event) {
        this.$element.find("tr").removeClass("selected");
        this.$element.find("#" + rowid).addClass("selected");

    }

    showSearch(isShow) {
        this.$element.filterToolbar({
            searchOnEnter: false,
            enableClear: true,
            stringResult: true,
            searchOperators: isShow
        });
    }

    public async showTable() {
        let option = await this.properties.getOptions(this);
        let multiSelect = option.multiselect;

        let param: FreeJqGrid.JqGridOptions = {colModel: []};
        param = $.extend(true, {
            onSelectRow: (rowid: string, state: boolean, eventObject: JQuery.Event) => {
                this.onSelectRow(rowid, state, eventObject);
            },
            loadComplete: () => {
                this.ready = true;
                console.log("ready");
            },
            onCellSelect: (rowid, iCol, cellcontent, event) => {
                //当是编辑的列，加上editable-cell 样式，就可以编辑了
                if (this.isEditable) {
                    if (this.properties.isCellEditable(rowid, iCol, cellcontent)) {
                        this.$element.jqGrid('setCell', rowid, iCol, '', 'edit-cell');
                        return;
                    }
                }
                this.$element.jqGrid('setCell', rowid, iCol, '', 'not-editable-cell');
            }

        }, option);

        param = $.extend(true, param, this.properties);
        if (param.pager) {
            param.pager = "#" + this.getPagerId();
        }

        //如果是指定后台生成,则取数据
        this.$element = this.$element.find(".jq-table").jqGrid(param);
        let createEl = $.jgrid.createEl;
        let table = this.$element;
        $.jgrid.createEl = (elementType: string, options: any, value: string, autoWidth?: boolean, ajaxso?: any) => {
            //   return createEl.call(table[0], elementType, options, value, autoWidth, ajaxso);
            return this.properties.getCellEditor(options.rowId, options.iCol, value, options);
        };
        if (this.properties.getColumnGroup()) {
            this.$element.setGroupHeaders(this.properties.getColumnGroup());
        }
        if (!multiSelect) {
            this.setMultiSelect(false);
        }
        if (!option.hideSearch) {
            this.showSearch(true);
        }

    }

    public getJqTable() {
        return this.$element;
    }


}

export {
    Table
}
