import {MenuFunc} from "../decorator/decorator";
import BaseUI from "./view/BaseUI";
import exp = require("constants");
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";

@MenuFunc()
export class BlockDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {
    protected createUI(): HTMLElement {
        return $("<div>您好!</div>").get(0);
    }

    beforeClose(): boolean {
        return true;
    }
}

