/**
 * 布局视图
 */
import BaseUI from "./BaseUI";
import {LayoutDto} from "../dto/LayoutDto";
import {LayoutBlockDto} from "../dto/LayoutBlockDto";

class LayoutView extends BaseUI<LayoutDto> {
    /**
     * 子布局块
     */
    protected lstLayoutBlock: Array<LayoutBlockDto>;

    afterComponentAssemble(): void {
    }

    protected createUI(): HTMLElement {
        return undefined;
    }

}
