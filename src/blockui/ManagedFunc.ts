import {MenuFunction, MenuFunctionInfo} from "./MenuFunction";

import {Logger} from "../common/Logger";
import {GlobalParams} from "../common/GlobalParams";
import {ManagedUiCenter} from "./managedView/ManagedUiCenter";
import {ManagedPage} from "./managedView/ManagedPage";
import {MenuFunc} from "../decorator/decorator";

/**
 * 设计出来的自动管理的功能
 */
@MenuFunc()
export class ManagedFunc<T extends MenuFunctionInfo> extends MenuFunction<T> {

    private managedUiCenter: ManagedUiCenter;

    private page: ManagedPage<any>;
    private isValid = false;

    protected createUI(): HTMLElement {
        return $(require("./templete/FunctionUI.html")).get(0);
    }

    protected initSubControllers() {
        super.initSubControllers();
        if (!this.properties.menuDto || !this.properties.menuDto.pageId) {
            Logger.error("菜单没有指定页面信息");
            this.isValid = false;
            this.$element.find(".dm-function")
                .append($("<div class='empty-menu-hint' style='height: 100%;width: 100%'>初始化失败(菜单没有指定页面信息)</div>"));
            return;
        }
        this.managedUiCenter = new ManagedUiCenter(GlobalParams.getPageSchemaInfo(this.properties.menuDto.pageId));
        //显示配置界面
        this.page = ManagedPage.getManagedInstance(this.properties.menuDto.pageId, null);
        this.page.addReadyListener((source) => {
            this.managedUiCenter.registerManagedUI(this.page.getSubManagedUI());
        });
        this.$element.append(this.page.getViewUI());

        this.isValid = true;
    }

    afterComponentAssemble(): void {
        if (!this.isValid) {
            return;
        }
        super.afterComponentAssemble();
        this.page.afterComponentAssemble();

    }

    destroy(): boolean {
        this.managedUiCenter.destroy();
        this.managedUiCenter = null;
        this.page.destroy();
        return super.destroy();
    }

}
