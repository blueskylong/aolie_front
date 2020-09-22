import BaseUI from "../BaseUI";

export class Toolbar<T extends ToolbarInfo> extends BaseUI<T> {
    protected createUI(): HTMLElement {
        return $(require("./templete/Toolbar.html")).get(0);
    }

    afterComponentAssemble(): void {
        if (this.properties && this.properties.btns) {
            for (let i = 0; i < this.properties.btns.length; i++) {
                let handler = null;
                if (this.properties.handler && this.properties.handler.length > i) {
                    handler = this.properties.handler[i];
                }
                this.addBtn(this.properties.btns[i], handler);
            }
        }
    }

    public addBtn(title: string, handler?: (event) => void) {
        let $btn = $("<button type=\"button\" class=\"btn btn-default\"></button>");
        $btn.text(title);
        this.$element.append($btn);
        if (handler) {
            $btn.on("click", (event) => {
                handler(event);
            });
        }
    }


}

export interface ToolbarInfo {
    btns?: Array<string>,
    handler?: Array<(event) => void>,
}
