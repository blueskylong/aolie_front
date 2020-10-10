import BaseUI from "../view/BaseUI";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {Constants} from "../../common/Constants";
import {Component} from "../../blockui/uiruntime/Component";
import {Column} from "../../datamodel/DmRuntime/Column";
import {ComponentDto} from "../dto/ComponentDto";
import {CommonUtils} from "../../common/CommonUtils";
import {DesignComponent} from "./DesignComponent";
import EventBus from "../../dmdesign/view/EventBus";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import {UiService} from "../../blockui/service/UiService";
import {BlockViewer} from "../../blockui/uiruntime/BlockViewer";
import {Alert} from "../view/JQueryComponent/Alert";

export class DesignPanel<T> extends BaseUI<T> {

    private lstDesignComponent: Array<DesignComponent<Component>> = [];
    private $compBody: JQuery;
    private currentComp: DesignComponent<Component>;

    private selectListener: GeneralEventListener;
    private blockViewer: BlockViewer;

    protected createUI(): HTMLElement {
        return $(require("../templates/DesignPanel.html")).get(0);
    }

    afterComponentAssemble(): void {
        this.$compBody = this.$element.find(".form-body");
        super.afterComponentAssemble();
        $(document).on("dnd_stop.vakata.jstree", (event, data) => {
            if (data.event.target == this.getViewUI()) {
                this.createByColumnDto(data.data.origin.get_node(data.data.nodes[0]).data);
            }
        });
        this.initEvent();
    }

    private initEvent() {
        EventBus.addListener(EventBus.SELECT_CHANGE_EVENT, this);
        EventBus.addListener(EventBus.DELETE_COLUMN, this);
    }

    setSelectListener(handler: GeneralEventListener) {
        this.selectListener = handler;
    }

    handleEvent(eventType: string, data: object, source: object) {
        if (eventType === EventBus.SELECT_CHANGE_EVENT) {
            this.currentComp = source as any;
            if (this.selectListener) {
                this.selectListener.handleEvent(EventBus.SELECT_CHANGE_EVENT,
                    this.currentComp.getValue().getComponentDto(), source);
            }
        } else if (eventType === EventBus.DELETE_COLUMN) {
            if (this.currentComp === source) {
                this.currentComp = null;
            }
            this.deleteComp(source as any);
        }
    }

    valueChanged(propertyName, value) {
        if (this.currentComp) {
            this.currentComp.propertyChanged(propertyName, value);
        }
    }

    private createByColumnDto(colDto: ColumnDto) {
        let component = this.createComponentInfo(colDto);
        this.addComponent(component);
    }

    private addComponent(component: Component) {
        let newCom = new DesignComponent(component);
        this.lstDesignComponent.push(newCom);
        this.$compBody.append(newCom.getViewUI());
        newCom.afterComponentAssemble();
        if (this.lstDesignComponent.length == 1) {
            this.$compBody['dragsort']();
        }
    }

    private deleteComp(comp: DesignComponent<any>) {
        let index = this.lstDesignComponent.indexOf(comp);
        this.lstDesignComponent.splice(index, 1);
        comp.destroy();
        $(comp.getViewUI()).off();
        $(comp.getViewUI()).remove();
    }

    private createComponentInfo(colDto: ColumnDto) {
        let comp = new Component();
        let col = new Column();
        col.setColumnDto(colDto);
        comp.setColumn(col);
        let compDto = new ComponentDto();
        compDto.dispType = this.getDisptypeByFieldType(colDto.fieldType);
        compDto.title = colDto.title;
        compDto.columnId = colDto.columnId;
        compDto.componentId = CommonUtils.genId();
        compDto.titleSpan = 3;
        compDto.horSpan = 4;
        compDto.verSpan = 1;
        compDto.versionCode = this.blockViewer.blockViewDto.versionCode;
        compDto.blockViewId = this.blockViewer.blockViewDto.blockViewId;
        compDto.componentId = CommonUtils.genId();
        comp.setComponentDto(compDto);
        return comp;
    }


    private getDisptypeByFieldType(colType: string) {
        if (colType == Constants.FieldType.int || colType == Constants.FieldType.decimal) {
            return "number";
        } else if (colType == Constants.FieldType.datatime) {
            return "time";
        } else {
            return "text";
        }
    }

    public getData(lvlCode?: string): Array<Component> {
        let result = [];
        if (this.lstDesignComponent.length > 0) {
            this.$compBody.find(".design-component").each((index, item) => {
                result.push(this.getComponentInfoById($(item).attr(DesignComponent.COMID)));
            });
        }
        return result;
    }

    doSave(onSuccess: () => void) {
        this.blockViewer.lstComponent = this.getData("001");

        UiService.saveBlockViewer(this.blockViewer, (err) => {
            if (CommonUtils.isEmpty(err)) {
                Alert.showMessage({message: "保存成功"});
                onSuccess();
            } else {
                Alert.showMessage({message: "保存失败,原因:" + err, type: Alert.type.warning});
            }
        });
    }

    private getComponentInfoById(id) {
        for (let com of this.lstDesignComponent) {
            if (com.getAttributes().getComponentDto().componentId == id) {
                return com.getValue();
            }
        }
    }

    destroy(): boolean {
        EventBus.removeListener(EventBus.SELECT_CHANGE_EVENT, this);
        EventBus.removeListener(EventBus.DELETE_COLUMN, this);
        this.clear();
        this.currentComp = null;
        this.selectListener = null;
        this.$compBody = null;
        return super.destroy();
    }

    async showBlock(blockId, version) {
        if (this.blockViewer) {
            this.clear();
        }
        this.blockViewer = await UiService.getSchemaViewer(blockId) as BlockViewer;
        this.showComponent();

    }

    private showComponent() {
        if (this.blockViewer) {
            if (this.blockViewer.getLstComponent()) {
                for (let component of this.blockViewer.getLstComponent()) {
                    this.addComponent(component);
                }
            }
        }
    }

    private clear() {
        if (this.lstDesignComponent) {
            for (let comp of this.lstDesignComponent) {
                comp.destroy();
            }
        }
    }


}
