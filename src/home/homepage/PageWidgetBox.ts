import BaseUI from "../../uidesign/view/BaseUI";
import {PageWidget} from "./PageWidget";

export class PageWidgetBox extends BaseUI<PageWidget> {

    protected createUI(): HTMLElement {
        return $("<div class ='widget-box'></div>").get(0);
    }

    protected initSubControls() {
        this.adjustSize();
        this.showWidget();

    }

    private showWidget() {
        if (!this.properties) {
            return;
        }
        //先调整自己的高度和宽
        this.$element.append(this.properties.getViewUI());
    }

    private adjustSize() {
        let horSpan = this.properties.getHorSpan();
        if (!horSpan || horSpan <= 0) {
            this.$element.width("100%");
        } else if (horSpan <= 12) {
            //1到12 之间，适用bootstrap列规则
            this.$element.addClass("col-md-" + horSpan);
        } else {
            this.$element.css("width", horSpan + "px");
        }
        let verSpan = this.properties.getVerSpan();
        if (!verSpan || verSpan <= 0) {
            this.$element.width("100%");
        } else if (verSpan <= 12) {
            //1到12 之间，适用bootstrap列规则
            this.$element.attr("rows", verSpan);
        } else {
            this.$element.css("height", verSpan + "px");
        }
    }


    refresh() {
        this.properties.refresh();
    }

    destroy(): boolean {
        this.properties.destroy();
        this.properties = null;
        return super.destroy();
    }

}
