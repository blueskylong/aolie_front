/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {Table} from "../table/Table";
import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {StringMap} from "../../common/StringMap";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Constants} from "../../common/Constants";
import {ManagedUITools} from "./ManagedUITools";
import {TableRenderProvider} from "../table/TableRenderProvider";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {MenuButton} from "../../home/dto/MenuButton";


export class ManagedTable extends Table implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected refCols = new StringMap<Array<Column>>();
    protected managedEventListener: ManagedEventListener;
    protected pageDetail: PageDetailDto;

    protected extFilter = {};
    protected extFilterTemp = {};

    static getManagedInstance(renderPro: TableRenderProvider, pageDetail: PageDetailDto) {
        let table = new ManagedTable(renderPro);
        table.pageDetail = pageDetail;
        table.addReadyListener(() => {
            if (table.getPageDetail() && table.getPageDetail().loadOnshow) {
                table.reload();
            }
        });
        return table;
    }

    getPageDetail(): PageDetailDto {
        return this.pageDetail;
    }

    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        if (source == this) {
            return;
        }
        //如果和源数据源有1对1的关系 ,则也需要刷新
        //这里简化,只处理本数据源且是同一行时更新自己
        let rowId = ManagedUITools.findRow(tableId, mapKeyAndValue, this.getData() as any, Table.ID_FIELD) as any;
        if (rowId) {
            let row = this.getRowData(rowId);
            row[field] = value;
            this.setRowData(rowId, row);
        }
    }


    dataRemoved(source: any, tableId, mapKeyAndValue) {
        if (source == this) {
            return;
        }
        //只处理单数据源的情况
        if (this.dsIds.length == 1 && this.dsIds[0] == tableId) {
            let rowId = ManagedUITools.findRow(tableId, mapKeyAndValue, this.getData() as any, Table.ID_FIELD);
            if (rowId) {
                this.removeRow(rowId);
            }
        }
    }

    dsSelectChanged(source: any, tableId, mapKeyAndValue, row?) {
        if (source == this) {
            return;
        }
        //查询数据源之间的关系,如果是同一源,不处理
        if (this.dsIds.length == 1 && this.dsIds[0] == tableId) {
            return;
        }
        let tableRelationField = ManagedUITools.getTableRelationField(tableId, this.dsIds);
        if (!tableRelationField) {
            return null
        }
        if (!mapKeyAndValue) {//如果没有指定行数据,则表示取消选择,则删除相应的条件
            delete this.extFilter[tableRelationField[1]];
            this.reloadData();
            return;
        }
        //增加条件到本次查询,如果没有取消,则会一直接有效
        this.extFilter[tableRelationField[1]] = row[tableRelationField[0]] || mapKeyAndValue[tableRelationField[0]];
        this.reloadData();

    }

    reload(filters?) {
        this.extFilterTemp = filters;
        super.reloadData();
    }

    getTableIds(): Array<number> {
        return this.dsIds;
    }

    referenceSelectChanged(source: AutoManagedUI, refId, id) {
        //查询是不是相关的引用,如果是,则要增加过滤
        if (ManagedUITools.makeFilter(refId, this.dsIds, this.extFilter, id)) {
            this.reload();
        }

    }

    stateChange(tableId, state: number) {
        if (this.dsIds.indexOf(tableId) != -1) {
            //这是需要进一步判断,哪些控件可以编辑
            this.setEditable(Constants.UIState.view != state);
        }
    }

    afterComponentAssemble(): void {
        //分析数据源信息
        ManagedUITools.initReferAndDsId(this.properties.getBlockInfo().getLstComponent(), this.dsIds, this.refCols);
        this.addSelectChangeListener({
            handleEvent: (eventType: string, row: object, table: object, extObject?: any) => {
                if (!this.managedEventListener || this.dsIds.length != 1) {//只有单一数据源时,才做处理
                    return;
                }
                this.managedEventListener.dsSelectChanged(this, this.dsIds[0], ManagedUITools.getDsKeyValue(this.dsIds[0], row), row);
            }
        })
    }


    setManageEventListener(listener: ManagedEventListener) {
        this.managedEventListener = listener;
    }

    protected initSubControllers() {
        super.initSubControllers();
        this.properties.setExtFilterProvider({
            getExtFilter: (source: object, oldFilter: object) => {
                return this.extFilter;
            }
        })
    }

    destroy(): boolean {
        this.dsIds = null;
        this.refCols = null;
        this.managedEventListener = null;

        this.extFilter = null;
        this.extFilterTemp = null;
        return super.destroy();
    }

    setButtons(buttons: Array<MenuButton>) {

    }

}
