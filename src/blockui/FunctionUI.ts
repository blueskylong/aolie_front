import {PageViewerDto} from "../uidesign/dto/PageViewerDto";
import BaseUI from "../uidesign/view/BaseUI";

export class FunctionUI extends BaseUI<PageViewerDto> {
    afterComponentAssemble(): void {
    }

    protected createUI(): HTMLElement {
        return $(require("./templete/FunctionUI.html")).get(0);
    }


}
