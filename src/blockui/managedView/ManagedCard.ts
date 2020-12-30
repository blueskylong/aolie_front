/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {CardList} from "../cardlist/CardList";
import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {StringMap} from "../../common/StringMap";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Form} from "../Form";
import {Constants} from "../../common/Constants";
import {ManagedUITools} from "./ManagedUITools";
import {GlobalParams} from "../../common/GlobalParams";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {MenuButtonDto} from "../../sysfunc/menu/dto/MenuButtonDto";


export class ManagedCard<T extends BlockViewDto> extends CardList<T> implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected refCols = new StringMap<Array<Column>>();
    protected managedEventListener: ManagedEventListener;
    protected pageDetail: PageDetailDto;
    protected extFilter = {};

    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        if (source == this) {
            return;
        }
        //如果和源数据源有1对1的关系 ,则也需要刷新
        //这里简化,只处理本数据源且是同一行时更新自己
        let form = this.locateForm(tableId, mapKeyAndValue);
        if (form) {
            form.setFieldValue(field, value);
        }
    }

    private locateForm(tableId, mapKeyAndValue): Form {
        if (!mapKeyAndValue) {
            return null;
        }
        if (!this.lstForm || this.lstForm.length == 0) {
            return null;
        }
        for (let form of this.lstForm) {
            let values = form.getValue();
            if (this.isInRow(values, mapKeyAndValue)) {
                return form;
            }
        }

        return null;
    }

    private isInRow(row, map: StringMap<any>) {
        let result = true;
        map.forEach((key, value, map) => {
            if (!row.hasOwnProperty(key) || row[key] != value) {
                result = false;
                return false;
            }
        });
        return result;
    }

    dataChanged(source: any, tableId, mapKeyAndValue) {
        if (source == this) {
            return;
        }
        //只处理单数据源的情况
        if (this.dsIds.length == 1 && this.dsIds[0] == tableId) {
            let form = this.locateForm(tableId, mapKeyAndValue);
            if (form) {
                this.deleteRow(this.lstForm.indexOf(form));
            }
        }
    }

    /**
     * 这里只处理从属性的变化,也就是只响应主表的选择变化
     * @param source
     * @param tableId
     * @param mapKeyAndValue
     * @param row
     */
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
            this.loadData(this.extFilter);
            return;
        }
        //增加条件到本次查询,如果没有取消,则会一直接有效
        this.extFilter[tableRelationField[1]] = row[tableRelationField[0]] || mapKeyAndValue[tableRelationField[0]];
        this.loadData(this.extFilter);

    }


    getTableIds(): Array<number> {
        return this.dsIds;
    }

    getPageDetail() {
        return this.pageDetail;
    }


    static getManagedInstance(blockId, pageDetail: PageDetailDto, version?) {
        let blockDto = new BlockViewDto();
        blockDto.blockViewId = blockId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();

        let card = new ManagedCard(blockDto);
        card.pageDetail = pageDetail;
        return card;
    }

    referenceSelectChanged(source: AutoManagedUI, refId, id) {
        //查询是不是相关的引用,如果是,则要增加过滤
        if (ManagedUITools.makeFilter(refId, this.dsIds, this.extFilter, id)) {
            this.loadData(this.extFilter);
        }


    }

    stateChange(source: any, tableId, state: number) {
        if (this.dsIds.indexOf(tableId) != -1) {
            //这是需要进一步判断,哪些控件可以编辑
            this.setEditable(Constants.UIState.view != state);
        }
        return false;
    }

    afterComponentAssemble(): void {
        //分析数据源信息
        ManagedUITools.initReferAndDsId(this.viewer.getLstComponent(), this.dsIds, this.refCols);
        this.addSelectChangeListener({
            handleEvent: (eventType: string, row: object, card: object, extObject?: any) => {
                if (!this.managedEventListener || this.dsIds.length != 1) {//只有单一数据源时,才做处理
                    return;
                }
                this.managedEventListener.dsSelectChanged(this, this.dsIds[0], ManagedUITools.getDsKeyValue(this.dsIds[0], row), row);
            }
        });
        super.afterComponentAssemble();
        if (this.pageDetail && this.pageDetail.loadOnshow == 1) {
            this.loadData();
        }
    }


    setManageCenter(listener: ManagedEventListener) {
        this.managedEventListener = listener;
    }

    protected initSubControllers() {
        super.initSubControllers();
    }

    setButtons(buttons: Array<MenuButtonDto>) {
    }

    getUiDataNum(): number {
        return Constants.UIDataNum.multi;
    }


}
