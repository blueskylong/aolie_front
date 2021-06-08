export interface IMainFrame {
    showFunc(menuId: number): boolean;

    /**
     * 取得视图的组件
     */
    getViewUI(): HTMLElement;

    afterComponentAssemble(): void;

    /**
     * 刷新显示,重建菜单,重新打开功能
     * @param menuId
     */
    refresh(menuId?): void;

    destroy(): void;
}
