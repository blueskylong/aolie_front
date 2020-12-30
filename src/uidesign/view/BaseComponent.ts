import BaseUI from "./BaseUI";
import EventBus from "../../dmdesign/view/EventBus";
import {Component} from "../../blockui/uiruntime/Component";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import {MenuButtonDto} from "../../sysfunc/menu/dto/MenuButtonDto";
import {ButtonInfo} from "./JQueryComponent/Toolbar";
import ClickEvent = JQuery.ClickEvent;
import {Constants} from "../../common/Constants";

export abstract class BaseComponent<T> extends BaseUI<T> {
    protected changeEventHandler: Array<GeneralEventListener> = new Array<GeneralEventListener>();
    protected editable = true;
    protected enabled = true;

    constructor(dto: T) {
        super(dto);
        this.init();
    }

    public abstract getValue(): any;

    protected init() {

    }

    public addValueChangeListener(listener: GeneralEventListener) {
        if (listener) {
            this.changeEventHandler.push(listener);
        }
    }

    public getFieldName() {
        if (this.properties["column"]) {
            return (this.properties as any).column.columnDto.fieldName;
        }
        return null;

    }

    protected fireValueChanged(field?: string, value?: any) {
        if (this.changeEventHandler.length > 0) {
            for (let listener of this.changeEventHandler) {
                listener.handleEvent(EventBus.VALUE_CHANGE_EVENT, field ? field : this.getValue(),
                    field ? value : this, this);
            }
        }

    }

    public removeValueChangeListener(listener) {
        let index = this.changeEventHandler.indexOf(listener);
        if (index != -1) {
            //TODO
            this.changeEventHandler.splice(index, 1);
        }
    }


    /**
     * 设置值,
     * @param value
     * @param extendData 这里主要是给选择项等有条件计算的控件,更多值的机会.
     */
    public abstract setValue(value: any, extendData?);

    public setEditable(editable: boolean) {
        this.editable = editable;
    }

    public setVisible(visible: boolean) {
        this.$element.css("display:" + (visible ? "display" : "none"));
    }

    public setEnable(enable: boolean) {
        this.enabled = enable;
    }

    destroy(): boolean {
        this.changeEventHandler = null;
        return super.destroy();
    }

    toButtonInfo(btns: Array<MenuButtonDto>): Array<ButtonInfo> {
        if (!btns) {
            return null;
        }
        let result = new Array<ButtonInfo>();
        for (let btn of btns) {
            //先设置使用标记
            btn.isUsed = true;
            let btnInfo = {
                id: btn.btnId + "",
                text: btn.title,
                iconClass: btn.iconClass,
                hint: btn.memo,
                clickHandler: (event: ClickEvent, data?, sourceComponent?) => {
                    if (this.componentButtonClicked) {
                        this.componentButtonClicked(event, btn, data);
                    }
                },
                isShow: (data) => {
                    return this.isButtonShow(data)
                }
            };
            result.push(btnInfo);
        }
        return result;
    }

    protected isButtonShow(data) {
        return true;
    }

    protected componentButtonClicked?(event: ClickEvent, menuBtnDto: MenuButtonDto, data);

}
