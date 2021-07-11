import BaseUI from "../../uidesign/view/BaseUI";

export abstract class PageWidget extends BaseUI<any> {

    /**
     * 取得横向宽度
     */
    abstract getHorSpan(): number;

    /**
     * 取得纵向高度
     */
    getVerSpan(): number {
        return 480;
    }

    abstract refresh(): void;

    abstract getOrder(): number;
}
