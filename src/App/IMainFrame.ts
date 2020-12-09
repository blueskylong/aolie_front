import {MenuFunction} from "../blockui/MenuFunction";
import {MenuDto} from "../home/dto/MenuDto";

export interface IMainFrame {
    showFunc(funcName: string | MenuDto): MenuFunction<any>;

    /**
     * 取得视图的组件
     */
    getViewUI(): HTMLElement;

    afterComponentAssemble(): void;
}
