/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {Form} from "../Form";
import {AutoManagedUI, IManageCenter, ManagedEventListener} from "./AutoManagedUI";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {GlobalParams} from "../../common/GlobalParams";
import {StringMap} from "../../common/StringMap";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {Constants} from "../../common/Constants";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {MenuButtonDto} from "../../sysfunc/menu/dto/MenuButtonDto";
import {ManagedUITools} from "./ManagedUITools";
import {HandleResult} from "../../common/HandleResult";
import ClickEvent = JQuery.ClickEvent;
import {UiService} from "../service/UiService";


export class ManagedForm extends Form implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected manageCenter: IManageCenter;
    protected pageDetail: PageDetailDto;
    protected state: number = Constants.UIState.edit;
    private getDefaultValue: () => any;

    private lastSelectValue: any;

    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        if (source == this) {
            return;
        }
        //如果和源数据源有1对1的关系 ,则也需要刷新
        //这里简化,只处理本数据源且是同一行时更新自己
        if (this.isSameRow(tableId, mapKeyAndValue)) {
            this.setFieldValue(field, value);
        }
    }

    static getManagedInstance(blockId, pageDetail: PageDetailDto, version?) {
        let blockDto = new BlockViewDto();
        blockDto.blockViewId = blockId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();
        let form = new ManagedForm(blockDto);
        form.pageDetail = pageDetail;
        return form;
    }

    /**
     * 指定值是不是与当前同一行
     * @param tableId
     * @param mapKeyAndValue
     */
    protected isSameRow(tableId, mapKeyAndValue: StringMap<any>) {
        if (!mapKeyAndValue) {
            return false;
        }
        if (this.dsIds.indexOf(tableId) == -1) {
            return false;
        }
        return mapKeyAndValue.equals(ManagedUITools.getDsKeyValue(tableId, this.getValue()));
    }


    dataChanged(source: any, dsId, id) {
        if (source == this) {
            return;
        }
        //只处理单数据源的情况
        if (this.dsIds.length == 1 && this.dsIds[0] == dsId) {
            this.setValue({});
        }
    }

    dsSelectChanged(source: any, tableId, id, row?) {
        if (source == this) {
            return;
        }
        if (this.dsIds.indexOf(tableId) == -1) {
            return;
        }
        //只处理当前只有一个数据源的情况
        if (this.dsIds.length == 1) {
            if (!row) {
                if (!id) {
                    this.lastSelectValue = row;
                    this.setValue(row)
                } else {
                    //需要到后台查询
                    UiService.findTableRow(tableId, id, (result) => {
                        this.lastSelectValue = result;
                        this.setValue(result)
                    });
                }
            } else {
                this.lastSelectValue = row;
                this.setValue(row);
            }

        }

    }

    findAndShow(keyAndValues?) {
        //TODO
    }

    getTableIds(): Array<number> {
        return this.dsIds;
    }

    getPageDetail() {
        return this.pageDetail;
    }

    referenceSelectChanged(source: AutoManagedUI, refId, id) {
        //do nothing. 引用的变化,表单不需要处理
    }

    stateChange(source: any, tableId, state: number) {
        if (this.dsIds.indexOf(tableId) != -1) {
            //这是需要进一步判断,哪些控件可以编辑
            this.setEditable(Constants.UIState.view != state);
        }
    }

    /**
     * 单个数据,不主动请示数据库
     */
    loadData() {
    }

    onUiDataReady(): void {
        //分析数据源信息
        if (this.viewer.lstComponent) {
            for (let component of this.viewer.lstComponent) {
                if (this.dsIds.indexOf(component.getColumn().getColumnDto().tableId) == -1) {
                    this.dsIds.push(component.getColumn().getColumnDto().tableId);
                }
            }
        }
        this.addValueChangeListener({
            handleEvent: (eventType: string, fieldName: object, value: object, extObject?: any) => {
                if (!this.manageCenter || this.dsIds.length != 1) {//只有单一数据源时,才做处理
                    return;
                }
                this.manageCenter.attrChanged(this,
                    this.dsIds[0], ManagedUITools.getDsKeyValue(this.dsIds[0],
                        this.getValue()), fieldName as any, value);
            }
        });
        this.setState(this.pageDetail.initState || Constants.UIState.view);
        super.onUiDataReady();
    }

    setManageCenter(listener: ManagedEventListener) {
        this.manageCenter = listener;
    }

    setDefaultValueProvider(getDefaultValue) {
        this.getDefaultValue = getDefaultValue;
    }


    /**
     * 接收菜单按钮,当前只接收增加,保存和修改操作的按钮
     * @param buttons
     */
    setButtons(buttons: Array<MenuButtonDto>) {
        //只处理当数据源的情况
        if (!this.dsIds && this.dsIds.length != 1) {
            return;
        }
        let btns = ManagedUITools.findRelationButtons(buttons, this.dsIds[0]);
        if (!btns || btns.length < 1) {
            return;
        }
        //只对保存和修改关心,增加和删除需要数据集控件(如表,树)的支持
        let relationBtn = new Array<MenuButtonDto>();
        let canHandleType = this.getCanHandleButtonType();
        for (let btn of btns) {
            if (canHandleType.indexOf(btn.tableOpertype) != -1) {
                btn.isUsed = true;
                relationBtn.push(btn);
            }
        }
        if (relationBtn.length < 1) {
            return;
        }
        this.addButton(this.toButtonInfo(relationBtn));

    }

    /**
     * 取得可以处理的类型
     */
    protected getCanHandleButtonType() {
        return [Constants.TableOperatorType.edit,
            Constants.TableOperatorType.saveSingle,
            Constants.TableOperatorType.cancel];
    }


    /**
     * 这里处理的是自己按钮的触发
     * @param event
     * @param menuBtnDto
     * @param data
     */
    protected componentButtonClicked(event: ClickEvent, menuBtnDto: MenuButtonDto, data) {
        //如果是取消
        if (menuBtnDto.tableOpertype === Constants.TableOperatorType.cancel) {
            if (this.doCancel()) {
                this.manageCenter.stateChange(this, this.dsIds[0], Constants.TableState.view);
            }

        } else if (menuBtnDto.tableOpertype === Constants.TableOperatorType.saveSingle) {
            this.doSave();
        } else if (menuBtnDto.tableOpertype === Constants.TableOperatorType.edit) {
            if (this.doEdit(this.lastSelectValue)) {
                this.manageCenter.stateChange(this, this.dsIds[0], Constants.TableState.edit);
            }
        }
    }

    protected doCancel() {
        if (this.state == Constants.UIState.view) {
            return false;
        }
        let state = Constants.UIState.view;
        this.setValue(this.lastSelectValue);
        if (this.pageDetail.initState) {
            state = this.pageDetail.initState;
        }
        this.setState(state);
        return true;

    }


    protected setState(uiState: number) {
        this.state = uiState;
        this.setEditable(this.state !== Constants.UIState.view);
    }

    doSave(callback?: (result) => void) {
        if (this.check()) {
            if (this.manageCenter) {//如果有管理中心
                this.manageCenter.checkAndSave(this.getValue(), this.dsIds[0], (result: HandleResult) => {
                    if (result.getSuccess()) {
                        //编辑保存
                        if (this.state === Constants.UIState.edit) {
                            this.manageCenter.dataChanged(this, this.dsIds[0],
                                ManagedUITools.getDsKeyValue(this.dsIds[0], this.getValue()),
                                Constants.TableDataChangedType.edited);
                        } else if (this.state === Constants.UIState.add) {
                            //增加保存
                            let obj = {};
                            obj[ManagedUITools.getOneKeyColumnField(this.dsIds[0])]
                                = result.data[0][Constants.ConstFieldName.CHANGE_KEYS_FEILD][0][1];
                            this.manageCenter.dataChanged(this, this.dsIds[0]
                                , obj, Constants.TableDataChangedType.added);
                        }
                        this.setEditable(false);
                        this.manageCenter.stateChange(this, this.dsIds[0], Constants.TableState.view,
                            ManagedUITools.getDsKeyValue(this.dsIds[0], this.getValue()));
                        this.setState(Constants.UIState.view);

                        callback && callback(true);
                    } else {
                        Alert.showMessage("保存失败,原因:" + result.err);
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            } else {
                UiService.saveRows([this.getValue()], this.dsIds[0], (result: HandleResult) => {
                    callback && callback(result.getSuccess());
                });
            }

        }
    }


    /**
     * 自身检查
     */
    public check() {
        if (this.state === Constants.UIState.view) {
            Alert.showMessage("当前在查看状态,没有需要保存的数据");
            return false;
        }
        return true;
    }

    /**
     * 响应其它组件的按钮信息
     * @param buttonInfo
     * @param data
     */
    btnClicked(source: any, buttonInfo: MenuButtonDto, data): boolean {
        //首先判断本界面是不是可以处理这个按钮事件
        if (!this.dsIds && this.dsIds.length != 1) {
            return false;
        }
        if (this.dsIds[0] != buttonInfo.relationTableid) {
            return false;
        }
        this.lastSelectValue = this.getValue();
        //可接受增加.修改,操作
        if (buttonInfo.tableOpertype == Constants.TableOperatorType.add) {
            this.doAdd(data);
            return true;
        } else if (buttonInfo.tableOpertype == Constants.TableOperatorType.edit) {
            return this.doEdit(this.lastSelectValue);
        }
        return false;
    }

    doAdd(data) {
        data = $.extend(this.getDefaultValues(),
            ManagedUITools.genKeyFieldValue(this.dsIds[0]), data);

        this.setValue(data);
        this.setState(Constants.UIState.add);
        if (this.manageCenter) {
            this.manageCenter.stateChange(this, this.dsIds[0], Constants.TableState.add);
        }

    }


    getUiDataNum(): number {
        return Constants.UIDataNum.one;
    }

    /**
     *  用于显示数据 ,数据和ID选其中一个
     * @param data
     * @param id
     */
    doView(data?, id?) {
        this.setState(Constants.UIState.view);
        if (data) {
            this.setValue(data);
        } else {
            if (!id) {
                Alert.showMessage("没有提供数据进行显示");
                return;
            }
            UiService.findTableRow(this.dsIds[0], id, (data) => {
                this.setValue(data.data[0]);
            })

        }
    }

    doEdit(data?, id?): boolean {
        if (this.state === Constants.UIState.edit) {
            return false;
        }
        if (this.state === Constants.UIState.add) {
            Alert.showMessage("当前已在增加状态");
            return false;
        }
        if (!data && !id) {
            Alert.showMessage("请选择要修改的数据");
            return false;
        }
        this.setState(Constants.UIState.edit);
        if (data) {
            this.setValue(data);
        } else if (id) {
            UiService.findTableRow(this.dsIds[0], id, (data: HandleResult) => {
                this.setValue(data.data[0]);
            })
        }
        return true;

    }
}
