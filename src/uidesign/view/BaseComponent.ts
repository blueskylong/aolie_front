import BaseUI from "./BaseUI";
import EventBus from "../../dmdesign/view/EventBus";
import {Component} from "../../blockui/uiruntime/Component";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";

export abstract class BaseComponent<T> extends BaseUI<T> {
    protected changeEventHandler: Array<GeneralEventListener> = new Array<GeneralEventListener>();

    constructor(dto: T) {
        super(dto);
        this.init();
    }

    public abstract getValue(): any;

    protected init() {

    }

    public addValueChangeListener(listener) {
        this.changeEventHandler.push(listener);
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
     * 取得对应列信息
     */
    public getColumnId(): number {
        return 0;
    }

    public abstract setValue(value: any);

    public abstract setEditable(editable: boolean);

    public setVisible(visible: boolean) {
        this.$element.css("display:" + (visible ? "display" : "none"));
    }

    public abstract setEnable(enable: boolean);


}
