import * as jsPlumb from "jsplumb";
import EventBus from "./EventBus";
import BaseUI from "../../uidesign/view/BaseUI";

export default abstract class DmDesignBaseView<T> extends BaseUI<T> {

    /**
     * dom
     */
    protected element: HTMLElement;

    protected static DEFAULT_PARAM = {
        ConnectionOverlays: [["Arrow", {
            location: 0.3,
            paintStyle: {fill: "green"},
            width: 15,
            length: 15
        }], ["Label", {cssClass: "line-title", label: "一对多", fill: "red"}],
            ["Arrow", {
                location: 1,
                paintStyle: {fill: "green"},
                width: 15,
                length: 15
            }]],
        HoverPaintStyle: {
            // fill: 'lightgray',
            stroke: 'red',
            strokeWidth: 3
        },
        Connector: ["Flowchart", {
            cornerRadius: 10,
            isLoopbackCurrently: false,
            connectorStyle: {
                outlineStroke: 'green',
                strokeWidth: 1
            },
            connectorHoverStyle: {
                strokeWidth: 2,
                outlineStroke: 'red',
            }
        }
        ]
    };
    protected static JSPLUMB = jsPlumb.jsPlumb.getInstance(DmDesignBaseView.DEFAULT_PARAM as any);
    protected static TARGET_PARAM = {
        filter: '.column-title',
        filterExclude: false,
        paintStyle:
            {fill: 'lightgray', stroke: 'darkgray', strokeWidth: 2}
        ,
        anchors: ["Right", "Left"],
        allowLoopback: false
    };
    protected static SOURCE_PARAM = {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        filter: '.spot',
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false,
        maxConnections: -1,
        paintStyle:
            {fill: 'lightgray', stroke: 'darkgray', strokeWidth: 1}
        ,
        beforeDetach: (connection) => {
            EventBus.fireEvent(EventBus.CONNECTION_BEFOREDETACH, connection);
        },
        connectorStyle: {
            // 线的颜色
            stroke: 'green',
            // 线的粗细，值越大线越粗
            strokeWidth: 2,
            // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，
            outlineStroke: 'transparent',
            // 线外边的宽，值越大，线的点击范围越大
            outlineWidth: 10
        },
        connectorHoverStyle: {stroke: 'red', strokeWidth: 2},
        onMaxConnections: (info, e) => {
            console.log(`超过了最大值连线: ${info.maxConnections}`)
        }
    }
    protected dto: T;

    public getJsplumb() {
        return DmDesignBaseView.JSPLUMB;
    }

    handleEvent(eventType: string, data: object, source: object) {
        if (eventType === EventBus.SELECT_CHANGE_EVENT) {
            if (source.constructor.name !== this.constructor.name) {
                return;
            }
            if (this == source) {
                this.$element.addClass("active");
            } else {
                this.$element.removeClass("active");
            }
        }
    }

    /**
     * 取得视图的组件
     */
    public getViewUI(): HTMLElement {
        if (!this.element) {
            this.element = this.createUI();
            this.$element = $(this.element);
            if (this.needHandleSelectEvent()) {
                this.$element.on("mousedown", (e) => {
                    if (this.$element.hasClass("active")) {
                        return;
                    }
                    EventBus.fireEvent(EventBus.SELECT_CHANGE_EVENT, e, this);
                    if (this.needPreventDefaultClick()) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                EventBus.addListener(EventBus.SELECT_CHANGE_EVENT, this);
            }
        }
        return this.element;
    }

    protected needPreventDefaultClick() {
        return false;
    }

    /**
     * 是否需要选择
     */
    protected needHandleSelectEvent() {
        return false;
    }

    /**
     * 自己被删除前
     */
    public beforeRemoved(): boolean {
        if (this.needHandleSelectEvent()) {
            EventBus.removeListener(EventBus.SELECT_CHANGE_EVENT, this);
        }
        return true;
    }


}

