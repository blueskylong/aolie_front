import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {JsTree} from "../blockui/JsTree/JsTree";
import "./templates/BlockDesign.css";

@MenuFunc()
export class BlockDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {
    protected createUI(): HTMLElement {
        return $(require("./templates/BlockDesign.html")).get(0);
    }

    afterComponentAssemble(): void {
        this.$element.find(".split-pane")['splitPane']();
        this.ready = true;
    }

    beforeClose(): boolean {
        return true;
    }
}

