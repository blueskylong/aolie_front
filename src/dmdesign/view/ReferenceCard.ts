import BaseUI from "../../uidesign/view/BaseUI";
import {Form} from "../../blockui/Form";
import {ReferenceDto} from "../../datamodel/dto/ReferenceDto";
import {DmDesignService} from "../service/DmDesignService";
import {BeanFactory} from "../../decorator/decorator";
import {CardList} from "../../blockui/cardlist/CardList";
import TableDto from "../../datamodel/dto/TableDto";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {CommonUtils} from "../../common/CommonUtils";

export class ReferenceCard extends BaseUI<any> {
    //未选中表的ID
    private static NO_TABLE_ID = -1000000;
    /**
     * 这里保存外部表中的引用信息
     */
    private lstReference: Array<ReferenceDto>;
    private referenceCard: CardList<any>;
    private curTableId = ReferenceCard.NO_TABLE_ID;
    //共同选项的表ID
    private static COMMON_TABLE_ID = 99;

    protected createUI(): HTMLElement {
        this.referenceCard = CardList.getInstance(90);
        this.referenceCard.setDefaultValueProvider(() => {
            let dto = new ReferenceDto();
            dto.refId = CommonUtils.genId();
            dto.tableId = this.curTableId;
            return dto;
        });
        this.referenceCard.setBeforeAdd(() => {
            if (this.curTableId == ReferenceCard.NO_TABLE_ID) {
                Alert.showMessage("请选择方案后再增加");
                return false;
            }
            return true;
        });
        return this.referenceCard.getViewUI();
    }


    setFullEditable() {
        this.referenceCard.setFullEditable();
    }

    afterComponentAssemble(): void {
//        this.referenceCard.afterComponentAssemble();

        super.afterComponentAssemble();
    }

    destroy(): boolean {
        this.referenceCard.destroy();
        return super.destroy();
    }

    setEditable(isEditable) {
        this.referenceCard.setEditable(isEditable);
    }

    setRemoveable(removeAble, force = false) {
        this.referenceCard.setRemoveable(removeAble, force);
    }

    setShowHead(isShowHead, force = false) {
        this.referenceCard.setShowHead(isShowHead, force);
    }

    setShowAdd(isShow: boolean, force = false) {

        this.referenceCard.setShowAdd(isShow, force);
    }

    setShowSave(isShow: boolean, force = false) {
        this.referenceCard.setShowSave(isShow, force);
    }

    showCard(tableId, dtos: Array<ReferenceDto>) {
        if (tableId == this.curTableId) {
            return;
        }
        if (!this.referenceCard) {
            return;
        }
        this.saveCurrentData();
        //如果原来显示过信息,则需要将信息保存,然后再显示新的
        this.lstReference = dtos;
        this.curTableId = tableId;
        this.referenceCard.setValue(dtos);
    }

    private saveCurrentData() {
        //这里的this.lstReference,是外部传来的数据引用,所以改变它就是改变外部的数据
        if (this.curTableId != -1000000) {
            let referenceDtos = BeanFactory.populateBeans(ReferenceDto, this.referenceCard.getValue());
            this.lstReference.splice(0, this.lstReference.length);
            if (referenceDtos) {
                this.lstReference.push(...referenceDtos);
            }
        }
    }


    private removeTableReference(tableId) {
        if (this.lstReference) {
            let ref;
            for (let i = this.lstReference.length - 1; i >= 0; i--) {
                ref = this.lstReference[i];
                if (ref.tableId == tableId) {
                    this.lstReference.splice(i, 1);
                }
            }
        }
    }

    /**
     * 查询表对应的引用
     * @param tableId
     */
    findReference(tableId) {
        if (this.lstReference) {
            let result = new Array<ReferenceDto>();
            for (let reference of this.lstReference) {
                if (reference.tableId == tableId) {
                    result.push(reference);
                }
            }
            return result;
        }
        return null;
    }

    check(allTables: Array<TableDto>) {
        this.saveCurrentData();
        //每个表格都至少有一个引用信息,引用信息也必须有表作为载体
        if (this.lstReference && this.lstReference.length > 0 && (!allTables || allTables.length == 0)) {
            Alert.showMessage("引用必须由表承载,当前有引用没有对应具体的表");
            return false;
        }
        if (allTables && allTables.length > 0 && (!this.lstReference || this.lstReference.length == 0)) {
            Alert.showMessage("引用方案里,每一张表,必须指定引用信息.")
            return false
        }
        //逐一检查,每一张表,是不是都有对应的引用信息
        for (let tableDto of allTables) {
            let referenceDtos = this.findReference(tableDto.tableId);
            if (!referenceDtos) {
                Alert.showMessage("表[" + tableDto.tableName + "]没有指定引用信息");
                return false;
            }
            //顺便 更新 一下表名
            if (tableDto.tableId < 0) {
                for (let refDto of referenceDtos) {
                    refDto.tableName = tableDto.tableName;
                }
            }
        }
        return true;
    }

    getAllReferenceData() {
        return this.lstReference;
    }

    public stopEdit() {
        this.saveCurrentData();
    }

    clearShow() {
        this.referenceCard.setValue(null);
    }
}
