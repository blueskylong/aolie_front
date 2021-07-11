import BaseUI from "./BaseUI";
import EventBus from "../../dmdesign/view/EventBus";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import {MenuButtonDto} from "../../sysfunc/menu/dto/MenuButtonDto";
import {ButtonInfo} from "./JQueryComponent/Toolbar";
import {StringMap} from "../../common/StringMap";
import ClickEvent = JQuery.ClickEvent;


export abstract class BaseComponent<T> extends BaseUI<T> {
    /**
     * 绝对位置布局
     */
    public static FIX_POSITION_CLASS = "fix-position";
    protected changeEventHandler: Array<GeneralEventListener> = new Array<GeneralEventListener>();
    protected editable = true;
    protected enabled = true;

    protected extendData: StringMap<any>;

    constructor(dto: T) {
        super(dto);
        this.init();
    }

    public getValue(): any {
        return null;
    }

    protected init() {

    }

    /**
     * 控件需要的额外数据的名称,供个性化开发使用
     */
    public getRequireExtendDataName(): Array<string> {
        return null;
    }

    /**
     * 设置所需要的个性化数据,供个性化开发使用
     * @param data
     */
    public setExtendData(data: StringMap<any>) {
        this.extendData = data;
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

    public getColumnId() {
        if (this.properties["column"]) {
            return (this.properties as any).column.columnDto.columnId;
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
    public setValue(value: any, extendData?) {

    }

    public setEditable(editable: boolean) {
        this.editable = editable;
    }

    public setVisible(visible: boolean) {
        if (visible) {
            this.$element.removeClass(BaseComponent.HIDDEN_CLASS);
        } else {
            this.$element.addClass(BaseComponent.HIDDEN_CLASS);
        }
    }

    public setEnable(enable: boolean) {
        this.enabled = enable;
    }

    destroy(): boolean {
        this.changeEventHandler = null;
        this.extendData = null;
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

    /**
     * 检查自身数据是否合格
     */
    public check(): boolean {
        return true;
    }

    /**
     * 本地按钮事件处理
     * @param event
     * @param menuBtnDto
     * @param data
     */
    protected componentButtonClicked?(event: ClickEvent, menuBtnDto: MenuButtonDto, data);


}
