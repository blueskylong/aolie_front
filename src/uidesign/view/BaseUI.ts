import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";

export default abstract class BaseUI<T> implements GeneralEventListener {
    protected static UN_VISIBLE_CLASS = "un-visible";
    protected static HIDDEN_CLASS = "hidden";
    protected properties: T;
    /**
     * dom
     */
    protected element: HTMLElement;

    protected $element: JQuery;

    protected ready = false;

    constructor(properties: T) {
        this.properties = properties;
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
        }

        return this.element;
    }

    protected initSubControllers() {

    }

    /**
     * 创建本级视图
     */
    protected abstract createUI(): HTMLElement;

    /**
     * 当视图被装配后的处理
     */
    public afterComponentAssemble(): void {

        this.ready = true;
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
        return true;
    }

    public hide() {
        this.$element.attr("display", "none");
    }

    public shown() {
        this.$element.attr("display", "display");
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
