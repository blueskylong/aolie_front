import {Logger} from "../common/Logger";
import {GlobalParams} from "../common/GlobalParams";
import {ManagedUiCenter} from "./managedView/ManagedUiCenter";
import {ManagedPage} from "./managedView/ManagedPage";
import {MenuFunc} from "../decorator/decorator";
import {MenuButtonDto} from "../sysfunc/menu/dto/MenuButtonDto";
import {MenuInfo} from "../sysfunc/menu/dto/MenuInfo";
import {MenuFunction} from "./MenuFunction";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {ButtonInfo} from "../uidesign/view/JQueryComponent/Toolbar";
import {UiService} from "./service/UiService";
import {ManagedUITools} from "./managedView/ManagedUITools";
import {CommonUtils} from "../common/CommonUtils";

/**
 * 设计出来的自动管理的功能
 */
@MenuFunc()
export class ManagedFunc<T extends MenuInfo> extends MenuFunction<T> {

    private managedUiCenter: ManagedUiCenter;

    private page: ManagedPage<any>;
    private isValid = false;

    protected createUI(): HTMLElement {
        return $(require("./templete/FunctionUI.html")).get(0);
    }

    protected async initSubControllers() {
        this.isValid = false;
        if (!this.properties.getMenuDto() || !this.properties.getMenuDto().pageId) {
            Logger.error("菜单没有指定页面信息");
            Alert.showMessage("菜单没有指定页面信息");
            this.$element.find(".dm-function")
                .append($("<div class='empty-menu-hint' style='height: 100%;width: 100%'>初始化失败(菜单没有指定页面信息)</div>"));
            return;
        }
        let schemaId = await ManagedUITools.getPageSchema(this.properties.getMenuDto().pageId, GlobalParams.getLoginUser());

        this.managedUiCenter = new ManagedUiCenter(schemaId);
        this.managedUiCenter.setButtonClickHandler((btn: MenuButtonDto) => {
            this.handleButtonClick(btn);
        });
        //显示配置界面
        this.page = ManagedPage.getManagedInstance(this.properties.getMenuDto().pageId, null);
        this.$element.append(this.page.getViewUI());
        this.page.addReadyListener((source) => {
            this.managedUiCenter.registerManagedUI(this.page.getSubManagedUI());
            super.afterComponentAssemble();
        });
        this.isValid = true;


    }

    private distributeButtons() {
        this.managedUiCenter.distributeButtons(this.properties.getLstBtns());
    }

    getButton(): Array<MenuButtonDto> {
        if (!this.properties.getLstBtns()) {
            return null;
        }
        //先由各界面领用
        this.managedUiCenter.distributeButtons(this.properties.getLstBtns());
        let result = new Array<MenuButtonDto>();
        for (let buttonInfo of this.properties.getLstBtns()) {
            if (!buttonInfo.isUsed) {
                result.push(buttonInfo);
            }
        }
        return result;
    }

    afterComponentAssemble(): void {
        CommonUtils.readyDo(() => {
                return this.isValid;
            }, () => {
                this.page.afterComponentAssemble();
                //这里要等待页面初始化好后,才可以更改完成状态
                // CommonUtils.readyDo(() => {
            //     return this.page.isReady()
            // }, () => {
            //
            // });
            }
        );
    }

    destroy(): boolean {
        if (this.managedUiCenter) {
            this.managedUiCenter.destroy();
        }
        this.managedUiCenter = null;
        if (this.page) {
            this.page.destroy();
        }
        return super.destroy();
    }

    /**
     * 处理
     * @param actionCode
     */
    handleButtonClick(btn: MenuButtonDto) {
        if (!btn.funcName) {
            Alert.showMessage("按钮没有指定处理程序");
            return;
        }
        if (this[btn.funcName] && typeof this[btn.funcName] === "function") {
            this[btn.funcName]();
        }
        //TODO
    }
}
