import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {CardList} from "../blockui/cardlist/CardList";
import {ReferenceService} from "./service/ReferenceService";
import {MenuButton} from "../home/dto/MenuButton";
import {ReferenceDto} from "../datamodel/dto/ReferenceDto";
import {CommonUtils} from "../common/CommonUtils";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {StringMap} from "../common/StringMap";

@MenuFunc()
export default class ReferenceFunc<T extends MenuFunctionInfo> extends MenuFunction<T> {

    private refrenceCard: CardList<any>;

    protected createUI(): HTMLElement {
        return $("<div class = 'ref-func'></div>").get(0);
    }

    protected initSubControllers() {
        this.refrenceCard = CardList.getInstance(90);
        this.refrenceCard.setDefaultValueProvider(() => {
            let newValue = new ReferenceDto();
            newValue.refName = "新增加引用";
            newValue.refId = CommonUtils.genId();
            return newValue;
        });
        this.$element.append(this.refrenceCard.getViewUI());
    }

    afterComponentAssemble(): void {
        this.refrenceCard.afterComponentAssemble();
        super.afterComponentAssemble();
        this.refrenceCard.setEditable(true);
        this.refrenceCard.showHead(true);
        this.showReference();
    }

    private showReference() {
        ReferenceService.findReferenceInfo((data) => {
            this.refrenceCard.setValue(data);
        });
    }

    private doSave() {
        CommonUtils.showMask();
        let err = this.check();
        if (err) {
            Alert.showMessage(err);
            CommonUtils.hideMask();
            return;
        }
        try {
            let lstMap = <Array<StringMap<any>>>this.refrenceCard.getValue();
            let lstData = [];
            if (lstMap) {
                for (let map of lstMap) {
                    lstData.push(map.getObject());
                }
            }
            ReferenceService.saveReference(lstData, (data) => {
                Alert.showMessage("保存成功!");
                this.showReference();
                CommonUtils.hideMask();
            });
        } catch (e) {
            Alert.showMessage("保存失败:" + e.message);
            CommonUtils.hideMask();
        }

    }

    private check(): string {
        return null;
    }

    getButton(): Array<MenuButton> {
        return [{
            title: "保存",
            action: "doSave",
            icon: "fa fa-save"
        }];

    }


}
