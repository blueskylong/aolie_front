export interface IMainFrame {
    showFunc(menuId: number): boolean;

    /**
     * 取得视图的组件
     */
    getViewUI(): HTMLElement;

    afterComponentAssemble(): void;

    destroy(): void;
}
