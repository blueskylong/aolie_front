import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";

/**
 * 页面定义,这些页面可以用于直接功能,或者用对话框显示
 */
@MenuFunc()
export default class PageDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {
    protected createUI(): HTMLElement {
        return $("<div>xxl</div>").get(0);
    }
}
