import BaseUI from "../uidesign/view/BaseUI";
import ClickEvent = JQuery.ClickEvent;
import {BaseComponent} from "../uidesign/view/BaseComponent";
import DmDesignBaseView from "../dmdesign/view/DmDesignBaseView";
import * as jsPlumb from "jsplumb";

export class Dialog<T extends DialogInfo> extends BaseUI<T> {
    private static TEMPLATE = require("./templete/Dialog.html");
    private static FOOTER_SELECTOR = ".modal-footer";
    private static OK_BUTTON_SELECTOR = ".dlg-ok-button";
    private static CLOSE_BUTTON_SELECTOR = ".dlg-close-button";
    protected importValue: any;

    private btns: Array<HTMLElement | string> = new Array<HTMLElement | string>();
    private btnListeners: Array<(event: ClickEvent) => void> = new Array<(ClickEvent) => void>();

    public show(value?: any) {
        $("body").append(this.getViewUI());
        this.beforeShow(value);
        this.importValue = value;
        this.$element.modal({backdrop: "static"});
        this.$element.modal('show');
        jsPlumb.jsPlumb.getInstance({} as any).draggable(this.$element);

    }

    public close() {
        if (this.properties.beforeClose) {
            if (!this.properties.beforeClose()) {
                return;
            }
        }
        this.btnListeners = new Array<(ClickEvent) => void>();
        this.btns = new Array<HTMLElement | string>();
        this.$element.modal('hide');
    }

    protected beforeShow(value?: any) {

    }


    protected createUI(): HTMLElement {
        let $ele = $(Dialog.TEMPLATE);
        let sub = this.getBody();
        $ele.find(".modal-title").text(this.properties.title);
        if (sub) {
            $ele.find(".modal-body").append(sub);
        }
        if (this.properties.height) {
            $ele.find(".modal-body")
                .css("height", this.properties.height);
        }
        if (this.properties.width) {
            $ele.find(".modal-body").css("width", this.properties.width);
        }

        if (this.btns) {
            let index = 0;
            for (let btn of this.btns) {
                this.appendButton(btn, this.btnListeners[index++], $ele);
            }
        }

        this.addEventHandler($ele);
        return $ele.get(0);

    }

    protected addEventHandler($element) {
        $element.on('hidden.bs.modal', () => {
            this.destroy();
        });
        $element.find(Dialog.OK_BUTTON_SELECTOR).on("click", (e) => {
            if (!this.beforeOK()) {
                return;
            }
            if (this.properties.onOk) {
                if (this.properties.onOk(this.getValue())) {
                    this.close();
                }
            }
        });
        $element.find(Dialog.CLOSE_BUTTON_SELECTOR).on("click", () => {
            this.close();
        })


    }

    protected getValue() {
        return this.importValue
    }

    protected beforeOK(): boolean {
        return true;
    }

    public addButton(btn: HTMLElement | string, clickHandler: (event: ClickEvent) => void) {
        if (this.$element) {
            this.appendButton(btn, clickHandler, this.$element);
        }
        this.btns.push(btn);
        this.btnListeners.push(clickHandler);
    }

    protected appendButton(btn: HTMLElement | string, clickHandler: (event: ClickEvent) => void, $element: JQuery) {
        let $close = $element.find(Dialog.FOOTER_SELECTOR);
        if (typeof btn === "string") {
            btn = $("<button type=\"button\" class=\"btn btn-default \">" + btn + "</button>").get(0);
        }
        $close.prepend(btn);
        $(btn).on("click", (e) => {
            clickHandler(e);
        })
    }


    protected getBody(): HTMLElement {
        if (this.properties.content) {
            return $("<label>" + this.properties.content + "</label>").get(0);
        } else {
            return null;
        }
    }

}

export interface DialogInfo {
    title: string,
    width?: number;
    height?: number;
    beforeClose?: () => boolean;
    onOk?: (...items) => boolean;
    content?: string;
}
