import BaseUI from "../uidesign/view/BaseUI";
import {MenuButtonDto} from "../sysfunc/menu/dto/MenuButtonDto";
import {MenuInfo} from "../sysfunc/menu/dto/MenuInfo";

export abstract class MenuFunction<T extends MenuInfo> extends BaseUI<T> {
    private stateChangeListener: () => void;

    /**
     * 关闭前询问
     */
    beforeClose(): boolean {
        return true;
    }

    getButton(): Array<MenuButtonDto> {
        return null;
    }

    handleButtonClick(btn: MenuButtonDto) {
        if (this[btn.funcName] && typeof this[btn.funcName] === "function") {
            this[btn.funcName]();
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


