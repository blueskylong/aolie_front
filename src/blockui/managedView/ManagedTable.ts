/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {Table} from "../table/Table";
import {AutoManagedUI, IManageCenter, ManagedEventListener} from "./AutoManagedUI";
import {StringMap} from "../../common/StringMap";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Constants} from "../../common/Constants";
import {ManagedUITools} from "./ManagedUITools";
import {TableRenderProvider} from "../table/TableRenderProvider";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {MenuButtonDto} from "../../sysfunc/menu/dto/MenuButtonDto";
import ClickEvent = JQuery.ClickEvent;
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {ButtonInfo} from "../../uidesign/view/JQueryComponent/Toolbar";
import {ManagedCard} from "./ManagedCard";
import {ManagedUiCenter} from "./ManagedUiCenter";
import {CommonUtils} from "../../common/CommonUtils";
import {ManagedDialogInfo, ManagedDlg} from "./ManagedDlg";
import {Dialog} from "../Dialog";
import {UiService} from "../service/UiService";
import {SchemaFactory} from "../../datamodel/SchemaFactory";
import {HandleResult} from "../../common/HandleResult";


export class ManagedTable extends Table implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected refCols = new StringMap<Array<Column>>();
    protected manageCenter: IManageCenter;
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
            //分析数据源信息
            ManagedUITools.initReferAndDsId(table.properties.getBlockInfo().getLstComponent(), table.dsIds, table.refCols);
            table.addSelectChangeListener({
                handleEvent: (eventType: string, row: object, table: ManagedTable, extObject?: any) => {
                    if (!table.manageCenter || table.dsIds.length != 1) {//只有单一数据源时,才做处理
                        return;
                    }
                    table.manageCenter.dsSelectChanged(table, table.dsIds[0], ManagedUITools.getDsKeyValue(table.dsIds[0], row), row);
                }
            })
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


    dataChanged(source: any, tableId, mapKeyAndValue, changeType) {
        if (source == this) {
            return;
        }
        //只处理单数据源的情况
        if (this.dsIds.length == 1 && this.dsIds[0] == tableId) {
            //如果是同表删除,则直接删除好,不再查询数据库
            if (changeType === Constants.TableDataChangedType.deleted) {
                let rowId = ManagedUITools.findRow(tableId, mapKeyAndValue, this.getData() as any, Table.ID_FIELD);
                if (rowId) {
                    this.removeRow(rowId);
                }
            }
        }
    }

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        if (this.pageDetail.loadOnshow) {
            CommonUtils.readyDo(() => {
                return this.isReady();
            }, () => {
                this.reload();

            })
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

    stateChange(source: any, tableId, state: number) {
        if (this.dsIds.indexOf(tableId) != -1) {
            //这是需要进一步判断,哪些控件可以编辑
            this.setEditable(Constants.UIState.view != state);
        }
    }


    setManageCenter(listener: IManageCenter) {
        this.manageCenter = listener;
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
        this.manageCenter = null;
        this.extFilter = null;
        this.extFilterTemp = null;
        return super.destroy();
    }

    setButtons(buttons: Array<MenuButtonDto>) {
        if (!buttons || buttons.length == 0) {
            this.hideOperatorCol();
            return;
        }
        this.showOperatorCol();
        let btns = ManagedUITools.findRelationButtons(buttons, this.dsIds[0], false);
        if (!btns || btns.length == 0) {
            return;
        }
        let lstUseBtn = new Array<MenuButtonDto>();
        let lstToolBtn = new Array<MenuButtonDto>();
        //这里可以做得更好点,在表格的按钮区显示"增加"这一类的统一按钮
        for (let btn of btns) {
            //这里是控件要求
            if (btn.tableOpertype === Constants.TableOperatorType.delete
                || btn.tableOpertype === Constants.TableOperatorType.edit
                || (btn.tableOpertype !== Constants.TableOperatorType.add && !btn.forOne)) {
                btn.isUsed = true;
                lstUseBtn.push(btn);
            } else if (btn.tableOpertype === Constants.TableOperatorType.add ||
                btn.forOne) {
                btn.isUsed = true;
                lstToolBtn.push(btn);
            }
        }
        if (lstUseBtn.length > 0) {
            this.setColOperatorButtons(this.toButtonInfo(lstUseBtn));
        }
        if (lstToolBtn.length > 0) {
            this.setToolbarButton(this.toButtonInfo(lstToolBtn));
        }
    }

    protected componentButtonClicked(event: ClickEvent, menuBtnDto: MenuButtonDto, data) {
        if (menuBtnDto.tableOpertype === Constants.TableOperatorType.add) {
            let dlgInfo: ManagedDialogInfo =
                {
                    dsId: this.dsIds[0],
                    initValue: this.extFilter,
                    title: "增加",
                    operType: Constants.TableOperatorType.add,
                    callback: () => {
                        this.manageCenter.dataChanged(this, this.dsIds[0],
                            null, Constants.TableDataChangedType.added);
                        this.reload();
                    }
                };

            new ManagedDlg(dlgInfo).show();
        } else if (menuBtnDto.tableOpertype === Constants.TableOperatorType.delete) {
            Dialog.showConfirm("确定要删除此行吗?", () => {
                let tableInfo = SchemaFactory.getTableByTableId(this.dsIds[0]);
                UiService.deleteRowByIds([data[tableInfo.getKeyField()]], this.dsIds[0], (result: HandleResult) => {
                    if (this.manageCenter) {
                        this.manageCenter.dataChanged(this, this.dsIds[0],
                            null, Constants.TableDataChangedType.deleted);
                        this.reload();
                    }
                });
            });
        } else if (menuBtnDto.tableOpertype === Constants.TableOperatorType.edit ||
            menuBtnDto.tableOpertype === Constants.TableOperatorType.view) {
            let dlgInfo: ManagedDialogInfo =
                {
                    dsId: this.dsIds[0],
                    initValue: this.getKeyValue(data),
                    title: menuBtnDto.tableOpertype === Constants.TableOperatorType.edit ? "修改" : "查看",
                    operType: menuBtnDto.tableOpertype,
                    callback: () => {
                        let obj = {};
                        obj[this.getKeyField()] = this.getKeyValue(data);
                        this.manageCenter.dataChanged(this, this.dsIds[0],
                            obj, Constants.TableDataChangedType.edited);
                        this.reload();
                    }
                };

            new ManagedDlg(dlgInfo).show();
        }
    }

    private getKeyValue(data) {
        let tableInfo = SchemaFactory.getTableByTableId(this.dsIds[0]);
        return data[tableInfo.getKeyField()];
    }

    private getKeyField() {
        let tableInfo = SchemaFactory.getTableByTableId(this.dsIds[0]);
        return tableInfo.getKeyField();
    }


    getUiDataNum(): number {
        return Constants.UIDataNum.multi;
    }
}
