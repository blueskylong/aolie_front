import BaseUI from "../uidesign/view/BaseUI";

import "./plugs/custom.css";
import {IMainFrame} from "../App/IMainFrame";
import {ApplicationContext, BeanFactory} from "../decorator/decorator";
import {MenuFunction} from "../blockui/MenuFunction";
import {CommonUtils} from "../common/CommonUtils";

import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {MenuService} from "../sysfunc/menu/service/MenuService";
import {MenuInfo} from "../sysfunc/menu/dto/MenuInfo";
import {CacheUtils} from "../common/CacheUtils";
import {GlobalParams} from "../common/GlobalParams";
import {MenuDto} from "../sysfunc/menu/dto/MenuDto";
import {SidebarMenu} from "./SidebarMenu";
import {Logger} from "../common/Logger";

export class MainFrame<T extends HomeInfo> extends BaseUI<T> implements IMainFrame {
    static cacheType = "menu";
    private $root: JQuery = null;
    private $menuToggle: JQuery = null;
    // private $sidebarMenu: JQuery = null;
    private $sidebarFooter: JQuery = null;
    private $leftCol: JQuery = null;
    private $body: JQuery = null;
    private $navMenu: JQuery = null;
    private $footer: JQuery = null;
    private $toolbar: JQuery = null;

    private menuBar: SidebarMenu<any> = null;


    private lastFunc: MenuFunction<any>;

    protected createUI(): HTMLElement {
        let $ele = $(require("./templates/MainFrame.html"));
        this.$root = $ele;
        this.$menuToggle = $ele.find('#menu_toggle');
        // this.$sidebarMenu = $ele.find('#sidebar-menu');
        this.$sidebarFooter = $ele.find('.sidebar-footer');
        this.$leftCol = $ele.find('.left_col');
        this.$body = $ele.find('.right_col');
        this.$navMenu = $ele.find('.nav_menu');
        this.$footer = $ele.find('footer');
        this.$toolbar = $ele.find(".toolbar");

        return $ele.get(0);
    }

    protected initSubControllers() {
        this.showMenu();
    }

    afterComponentAssemble(): void {
        this.setContentHeight();
        CommonUtils.readyDo(() => {
            return !!this.menuBar;
        }, () => {
            //           this.menuBar.afterComponentAssemble();
        });

    }

    protected setContentHeight() {

        let bodyHeight = window.innerHeight;
        let footerHeight = this.$footer.outerHeight();
        let topNavHeight = this.$navMenu.outerHeight();

        let contentHeight = bodyHeight - footerHeight - topNavHeight;

        this.$body.css('height', contentHeight);
        this.$body.css('min-height', contentHeight);
        this.$body.css('max-height', contentHeight);
    };


    private showMenu() {
        MenuService.findUserMenu((data) => {

            let lstMenuDto: Array<MenuDto> = [];
            if (data) {
                lstMenuDto = BeanFactory.populateBeans(MenuDto, data);
            }
            this.menuBar = new SidebarMenu(lstMenuDto);
            this.$element.find("#sidebar-menu").append(this.menuBar.getViewUI());
        });

    }

    protected initEvent() {


        // toggle small or large menu
        this.$menuToggle.on('click', () => {
                this.$root.toggleClass('nav-md nav-sm');
                this.menuBar.setShowSmall(this.$root.hasClass('nav-sm'));
            }
        );


        window
            .onresize = () => {
            this.setContentHeight();
        };

        $('.close-link').on("click", () => {
            var $boxPanel = this.$element.closest('.x_panel');
            $boxPanel.remove();
        });
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });

        $(".expand").on("click", () => {
            $(this).next().slideToggle(200);
            let $expand = this.$element.find(">:first-child");

            if ($expand.text() == "+") {
                $expand.text("-");
            } else {
                $expand.text("+");
            }
        });
    }

    showFunc(menuId: number) {
        if (this.menuBar) {
            this.menuBar.locateMenu();
        }
        CommonUtils.showMask();

        if (this.lastFunc) {
            try {
                if (!this.lastFunc.beforeClose()) {
                    return false;
                }
                this.lastFunc.destroy();
            } catch (e) {
                Logger.error(e.message);
            }
            this.$body.children().remove();
        }
        this
            .lastFunc = null;

        MenuService.findMenuInfo(menuId, (data) => {
            let funcName = "";
            let menuInfo: MenuInfo = CacheUtils.get(MainFrame.cacheType, CommonUtils.genKey(menuId, GlobalParams.loginVersion));
            if (menuInfo) {
                this.createAndShow(menuInfo);
            } else {
                //查询后创建
                MenuService.findMenuInfo(menuId, (data) => {
                    if (!data) {
                        Alert.showMessage("查询菜单信息失败");
                        return;
                    }
                    let menuInfo1 = BeanFactory.populateBean(MenuInfo, data);
                    CacheUtils.put(MainFrame.cacheType, menuId, menuInfo1);
                    this.createAndShow(menuInfo1);
                });

            }

        });
        return true;

    }


    protected createAndShow(menuInfo: MenuInfo) {

        let funcName = menuInfo.getMenuDto().funcName;

        if (!funcName) {
            Alert.showMessage("指定的功能不存在");
            CommonUtils.hideMask();
            return;
        }
        this.$element.find(".current-menu-title").text(menuInfo.getMenuDto().menuName);
        let funcClazz = ApplicationContext.getMenuFunc(funcName);
        let baseUi = <MenuFunction<any>>BeanFactory.createBean(funcClazz, [menuInfo]);
        this.lastFunc = baseUi;

        this.lastFunc.addReadyListener(() => {
            this.initButtons();
            CommonUtils.hideMask();
        });
        this.$body.append(this.lastFunc.getViewUI());
        return <MenuFunction<any>>this.lastFunc;
    }

    private initButtons() {
        this.$toolbar.children().remove();
        if (this.lastFunc) {
            let buttons = this.lastFunc.getButton();
            if (buttons && buttons.length > 0) {
                for (let btn of buttons) {
                    //先处理分隔条件
                    if (btn.title === "|") {
                        let span = $("<span class='button-split btn'></span>");
                        this.$toolbar.append(span);
                        continue;
                    }
                    let $btn = $("<button class=\"btn btn-warning\" action-code='" + btn.funcName + "'>" +
                        (btn.iconClass ? "<span class='" + btn.iconClass + "'></span>" : "")
                        + (btn.title ? btn.title : "") + "</button>");
                    $btn.on("click", (event) => {
                        this.lastFunc.handleButtonClick(btn);
                    });
                    this.$toolbar.append($btn);
                }
            }
        }
    }


    /**
     * 根据功能状态更新按钮的状态
     */
    private updateButtonState() {
        //TODO
    }
}

export interface HomeInfo {

}
