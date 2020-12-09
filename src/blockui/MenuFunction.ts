import BaseUI from "../uidesign/view/BaseUI";
import {MenuButton} from "../home/dto/MenuButton";
import {MenuDto} from "../home/dto/MenuDto";

export abstract class MenuFunction<T extends MenuFunctionInfo> extends BaseUI<T> {
    private stateChangeListener: () => void;

    /**
     * 关闭前询问
     */
    beforeClose(): boolean {
        return true;
    }

    getButton(): Array<MenuButton> {
        return null;
    }

    handleButtonClick(actionCode) {
        if (this[actionCode] && typeof this[actionCode] === "function") {
            this[actionCode]();
        }
        //TODO
    }

    getState() {
        return null;
    }

    setStateChangeListener(stateChangeListener: () => void) {
        this.stateChangeListener = stateChangeListener;
    }

    setParamters(param: any) {

    }

}

export interface MenuFunctionInfo {
    menuDto: MenuDto;
}
