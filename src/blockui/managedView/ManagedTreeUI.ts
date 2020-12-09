/**
 * 此表单只响应列表或树选中情况下的显示
 * 表单只响应本级数据源的变化
 */
import {AutoManagedUI, ManagedEventListener} from "./AutoManagedUI";
import {StringMap} from "../../common/StringMap";
import {Column} from "../../datamodel/DmRuntime/Column";
import {Constants} from "../../common/Constants";
import {TreeUI} from "../JsTree/TreeUI";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {ManagedUITools} from "./ManagedUITools";
import {GlobalParams} from "../../common/GlobalParams";
import {CommonUtils} from "../../common/CommonUtils";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";


export class ManagedTreeUI<T extends BlockViewDto> extends TreeUI<T> implements AutoManagedUI {

    protected dsIds = new Array<any>();
    protected refCols = new StringMap<Array<Column>>();
    protected managedEventListener: ManagedEventListener;
    protected pageDetail: PageDetailDto;

    attrChanged(source: any, tableId, mapKeyAndValue, field, value) {
        if (source == this) {
            return;
        }
        //如果和源数据源有1对1的关系 ,则也需要刷新
        //这里简化,只处理本数据源且是同一行时更新自己
        let rowId = this.locateRow(tableId, mapKeyAndValue) as any;
        if (rowId) {
            let node = this.getTree().getJsTree().get_node(rowId);
            if (node) {
                //TODO 要观察有没有得到修改
                node.data[field] = value;
                if (field == this.treeInfo.textField) {
                    this.getTree().changeNodeText(rowId, value);
                }

            }
        }
    }

    private locateRow(tableId, mapKeyAndValue) {
        if (!mapKeyAndValue) {
            return null;
        }
        let data = this.getValue() as Array<Object>;
        if (!data) {
            return null;
        }
        if (Array.isArray(data)) {
            for (let row of data) {
                if (this.isInRow(row, mapKeyAndValue)) {
                    return row[this.treeInfo.codeField];
                }
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

    dataRemoved(source: any, tableId, mapKeyAndValue) {
        if (source == this) {
            return;
        }
        //只处理单数据源的情况
        if (this.dsIds.length == 1 && this.dsIds[0] == tableId) {
            let rowId = this.locateRow(tableId, mapKeyAndValue);
            if (rowId) {
                this.getTree().getJsTree().delete_node(rowId);
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
            this.reload();
            return;
        }
        //增加条件到本次查询,如果没有取消,则会一直接有效
        this.extFilter[tableRelationField[1]] = row[tableRelationField[0]] || mapKeyAndValue[tableRelationField[0]];
        this.reload();

    }


    getTableIds(): Array<number> {
        return this.dsIds;
    }

    getPageDetail(): PageDetailDto {
        return this.pageDetail;
    }

    static getManagedInstance(blockId, pageDetail: PageDetailDto, version?) {
        let blockDto = new BlockViewDto();
        blockDto.blockViewId = blockId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();
        let tree = new ManagedTreeUI(blockDto);
        tree.pageDetail = pageDetail;
        tree.blockViewId = blockId;
        tree.versionCode = version;
        tree.addReadyListener(() => {
            if (tree.pageDetail && tree.pageDetail.loadOnshow == 1) {
                tree.reload();

            }
        })
        return tree;
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

    onUiDataReady(): void {
        //分析数据源信息
        ManagedUITools.initReferAndDsId(this.viewer.lstComponent, this.dsIds, this.refCols);
        this.jsTree.addSelectListener({
            handleEvent: (eventType: string, row: object, table: object, extObject?: any) => {
                if (!this.managedEventListener || this.dsIds.length != 1) {//只有单一数据源时,才做处理
                    return;
                }
                this.managedEventListener.dsSelectChanged(this, this.dsIds[0], ManagedUITools.getDsKeyValue(this.dsIds[0], row), row);
            }
        });
    }

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        CommonUtils.readyDo(() => {
            return this.jsTree && this.jsTree.isReady();
        }, () => {
            ManagedUITools.initReferAndDsId(this.viewer.getLstComponent(), this.dsIds, this.refCols);
        });
    }

    setManageEventListener(listener: ManagedEventListener) {
        this.managedEventListener = listener;
    }

}
