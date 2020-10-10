import BaseUI from "../view/BaseUI";
import {Component} from "../../blockui/uiruntime/Component";
import {IComponentGenerator} from "../view/generator/IComponentGenerator";
import {JQueryGeneralComponentGenerator} from "../view/JQueryComponent/JQueryGeneralComponentGenerator";
import {BaseComponent} from "../view/BaseComponent";
import {AutoFit} from "../view/JQueryComponent/AutoFit";
import EventBus from "../../dmdesign/view/EventBus";

export class DesignComponent<T extends Component> extends BaseComponent<T> {
    public static COMID = "comId";
    private generator: IComponentGenerator = new JQueryGeneralComponentGenerator();
    private component: BaseComponent<Component>;
    private horSpan: number;

    private editable = true;


    protected createUI(): HTMLElement {
        this.horSpan = this.properties.getComponentDto().horSpan;
        this.properties.getComponentDto().horSpan = 12;
        let $ele = $(require("../templates/DesignComponent.html"));
        $ele.attr(DesignComponent.COMID, this.properties.getComponentDto().componentId);
        return $ele.get(0);
    }

    public propertyChanged(propertyName, value) {
        if (propertyName === "horSpan") {
            this.horSpan = value;
            this.handleSize();
            return;
        }
        //始终是占满
        this.getDtoInfo().getComponentDto().horSpan = 12;
        this.getDtoInfo().getComponentDto()[propertyName] = value;
        if (this.isNeedRecreate(propertyName)) {
            this.createComponent();
        }
    }

    private handleSize() {
        this.$element.removeClass((index, className) => {
            if (className) {
                let classes = className.split(" ");
                for (let aclass of classes) {
                    if (aclass.indexOf("col-md-") == 0) {
                        return aclass;
                    }
                }
            }
        });
        //设置高度和宽度
        if (this.horSpan <= 12) {//小于12.表示用bootstrap的列布局
            this.$element.addClass("col-md-" + this.horSpan);
        } else if (this.horSpan > 12) {//大于12 ,则直接使用像素
            this.$element.css("width", this.horSpan + "px");
        } else if (this.horSpan < 0) {//小于0表示填充所有空间
            AutoFit.addAutoFitCompoent(this.$element.get(0), true, false);
        }
        if (this.properties.componentDto.verSpan <= 12) {//小于12.表示占用几行
            this.$element.attr("rows", this.properties.componentDto.verSpan);
        } else if (this.properties.componentDto.verSpan > 12) {//大于12 ,则直接使用像素
            this.$element.height(this.properties.componentDto.verSpan);
        } else if (this.properties.componentDto.horSpan < 0) {//小于0表示填充所有空间
            AutoFit.addAutoFitCompoent(this.$element.get(0), false, true);
        }

    }

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        this.createComponent();
        this.bindEvent();
    }

    private bindEvent() {
        let $closeBtn = this.$element.find(".close-button");
        this.$element.on("mouseenter", (e) => {
            $closeBtn.removeClass(DesignComponent.HIDDEN_CLASS);
        });
        this.$element.on("mouseleave", (e) => {
            if (this.editable) {
                $closeBtn.addClass(DesignComponent.HIDDEN_CLASS);
            }
        });
        this.$element.on("click", (e) => {
            EventBus.fireEvent(EventBus.SELECT_CHANGE_EVENT, e, this);
        });
        $closeBtn.on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            //这里只是用于触发删除事件
            EventBus.fireEvent(EventBus.DELETE_COLUMN, null, this)

        });
        $closeBtn.on("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        let that = this;
        EventBus.addListener(EventBus.SELECT_CHANGE_EVENT, {
            handleEvent(eventType: string, data: object, source: object, extObject?: any) {
                if (that == source) {
                    that.$element.find(".masker").addClass("active");
                } else {
                    that.$element.find(".masker").removeClass("active");
                }
            }
        })

    }

    private createComponent() {
        if (this.component) {
            this.component.destroy();
        }


        this.component = this.generator.generateComponent(this.properties.componentDto.dispType, this.properties,
            null);
        $(this.component.getViewUI()).insertBefore(this.$element.children()[0]);
        this.component.afterComponentAssemble();
        this.handleSize();

    }

    private isNeedRecreate(propertyName) {
        return (propertyName === "title" || propertyName === "verSpan" || propertyName === "horSpan" ||
            propertyName === "dispType" || propertyName === "titleColor" || propertyName === "backgroundColor"
            || propertyName === "titlePosition" || propertyName === "titleSpan");

    }

    getValue() {
        this.properties.getComponentDto().horSpan = this.horSpan;
        return this.properties;
    }

    destroy(): boolean {
        EventBus.removeListener(EventBus.SELECT_CHANGE_EVENT, this);
        return super.destroy();
    }

    setEditable(editable: boolean) {
        this.editable = editable;
        if (!this.editable) {
            this.$element.find(".close-button").addClass(DesignComponent.HIDDEN_CLASS);
        }
    }

    setEnable(enable: boolean) {
        this.setEditable(enable);
    }

    setValue(value: any) {
    }


}
