import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";

export default abstract class BaseUI<T> implements GeneralEventListener {
    protected static UN_VISIBLE_CLASS = "un-visible";
    protected static HIDDEN_CLASS = "hidden";
    protected properties: T;
    protected template: string;
    protected lstReadyListener: Array<(source: any) => void>;
    /**
     * dom
     */
    protected element: HTMLElement;

    protected $element: JQuery;

    protected ready = false;
    protected destroied = false;

    constructor(properties: T) {

        this.properties = properties;
    }

    addReadyListener(handler: (source: any) => void) {
        if (!this.lstReadyListener) {
            this.lstReadyListener = new Array<() => void>();
        }
        this.lstReadyListener.push(handler);
    }

    fireReadyEvent() {
        if (this.lstReadyListener) {
            for (let listener of this.lstReadyListener) {
                listener(this);
            }
        }
    }

    public getDtoInfo() {
        return this.properties;
    }

    handleEvent(eventType: string, data: object, source: object) {
    }

    /**
     * 取得视图的组件
     */
    public getViewUI(): HTMLElement {
        if (!this.element) {
            this.element = this.createUI();
            this.$element = $(this.element);
            this.$element.on("remove", (e) => {
            });
            this.initSubControllers();
            this.initEvent();
        }
        this.$element.attr("component-class", this.constructor.name);
        return this.element;
    }

    protected initSubControllers() {

    }

    protected initEvent() {

    }

    /**
     * 创建本级视图
     */
    protected abstract createUI(): HTMLElement;

    /**
     * 当视图被装配后的处理
     */
    public afterComponentAssemble(): void {
        if (!this.$element) {
            this.getViewUI();
        }
        this.ready = true;
        this.fireReadyEvent();
    };

    /**
     * 设置某一属性
     * @param attrName
     * @param value
     */
    public setAttribute(attrName: string, value: Object) {

        this.getAttributes()[attrName] = value;
    }

    /**
     * 取得某一属性
     */
    public getAttributes(): T {
        if (!this.properties) {
            this.properties = {} as any;
        }
        return this.properties;
    }

    /**
     * 自己被删除前
     */
    public destroy(): boolean {
        if (this.$element) {
            this.$element.remove();
            this.$element = null;
            this.element = null;
        }
        this.lstReadyListener = null;
        this.destroied = true;
        return true;
    }

    isDestroied() {
        return this.destroied;
    }

    public hide() {
        this.$element.attr("display", "none");
    }

    public shown() {
        this.$element.attr("display", "display");
    }

    /**
     * 父容器的值发生了变化,可能会影响此控件的显示属性,需要变化,如选择框,可能需要根据父亲值的变化,重新生成选择项
     * @param fullValue
     */
    public parentValueChanged(fullValue: object): void {

    }

    public isReady() {
        return this.ready;
    }
}


// var greeter = Object.create(window["Greeter"].prototype);
// greeter.constructor.apply(greeter, new Array("World"));
// var button = document.createElement('button');
// button.innerText = "Say Hello";
// button.onclick = function() {
//     alert(greeter.greet());
// }
// document.body.appendChild(button);
