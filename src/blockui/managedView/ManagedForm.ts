/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {Form} from "../Form";
import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {GlobalParams} from "../../common/GlobalParams";
import {StringMap} from "../../common/StringMap";
import {SchemaFactory} from "../../datamodel/SchemaFactory";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {Constants} from "../../common/Constants";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";

export class ManagedForm extends Form implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected managedEventListener: ManagedEventListener;
    protected pageDetail: PageDetailDto;

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
        return mapKeyAndValue.isEqual(this.getDsKeyValue(tableId));
    }


    /**
     * 取得主健值
     * @param tableId
     */
    protected getDsKeyValue(tableId): StringMap<any> {
        let tableInfo = SchemaFactory.getTableByTableId(tableId);
        let columns = tableInfo.findKeyColumns();
        if (!columns || columns.length == 0) {
            Alert.showMessage("数据表没有主键");
            return null;
        }
        let value = this.getValue();
        let result = new StringMap();
        for (let column of columns) {
            result.set(column.getColumnDto().fieldName, value.get(column.getColumnDto().fieldName));
        }
        return result;
    }

    dataRemoved(source: any, dsId, id) {
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
            this.setValue(row)
        }

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

    stateChange(tableId, state: number) {
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
                if (!this.managedEventListener || this.dsIds.length != 1) {//只有单一数据源时,才做处理
                    return;
                }
                this.managedEventListener.attrChanged(this,
                    this.dsIds[0], this.getDsKeyValue(this.dsIds[0]), fieldName, value);
            }
        })
    }

    setManageEventListener(listener: ManagedEventListener) {
        this.managedEventListener = listener;
    }


}
