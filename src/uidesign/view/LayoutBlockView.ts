import BaseUI from "./BaseUI";
import {LayoutDto} from "../dto/LayoutDto";

class LayoutBlockView extends BaseUI<LayoutDto> {

    afterComponentAssemble(): void {
    }

    protected createUI(): HTMLElement {
        return undefined;
    }

}
