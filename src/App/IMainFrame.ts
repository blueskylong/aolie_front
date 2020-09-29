import {MenuFunction} from "../blockui/MenuFunction";

export interface IMainFrame {
    showFunc(funcName: string): MenuFunction<any>;

    /**
     * 取得视图的组件
     */
    getViewUI(): HTMLElement;

    afterComponentAssemble(): void;
}
