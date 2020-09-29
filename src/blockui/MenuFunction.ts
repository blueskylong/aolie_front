import BaseUI from "../uidesign/view/BaseUI";

export abstract class MenuFunction<T extends MenuFunctionInfo> extends BaseUI<T> {

    /**
     * 关闭前询问
     */
    beforeClose(): boolean {
        return true;
    }
}

export interface MenuFunctionInfo {

}
