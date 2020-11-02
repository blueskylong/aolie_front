import BaseUI from "../uidesign/view/BaseUI";

import "./plugs/custom.css";
import {IMainFrame} from "../App/IMainFrame";
import {ApplicationContext, BeanFactory} from "../decorator/decorator";
import {MenuFunction} from "../blockui/MenuFunction";
import {CommonUtils} from "../common/CommonUtils";

export class MainFrame<T extends HomeInfo> extends BaseUI<T> implements IMainFrame {
    private CURRENT_URL = window.location.href.split('#')[0].split('?')[0];
    private $root: JQuery = null;
    private $menuToggle: JQuery = null;
    private $sidebarMenu: JQuery = null;
    private $sidebarFooter: JQuery = null;
    private $leftCol: JQuery = null;
    private $body: JQuery = null;
    private $navMenu: JQuery = null;
    private $footer: JQuery = null;
    private $toolbar: JQuery = null;

    private lastFunc: MenuFunction<any>;

    protected createUI(): HTMLElement {
        let $ele = $(require("./templates/MainFrame.html"));
        this.$root = $ele;
        this.$menuToggle = $ele.find('#menu_toggle');
        this.$sidebarMenu = $ele.find('#sidebar-menu');
        this.$sidebarFooter = $ele.find('.sidebar-footer');
        this.$leftCol = $ele.find('.left_col');
        this.$body = $ele.find('.right_col');
        this.$navMenu = $ele.find('.nav_menu');
        this.$footer = $ele.find('footer');
        this.$toolbar = $ele.find(".toolbar");

        return $ele.get(0);
    }

    afterComponentAssemble(): void {
        this.initEvent();
        this.setContentHeight();
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

    protected openUpMenu() {
        this.$sidebarMenu.find('li').removeClass('active active-sm');
        this.$sidebarMenu.find('li ul').slideUp();
    }


    protected initEvent() {
        this.$sidebarMenu
            .find('a').on('click', (ev) => {
                let $li = $(ev.target).parent();
                if ($li.is('.active')) {
                    $li.removeClass('active active-sm');

                } else {
                    // prevent closing menu if we are on child menu
                    if (!$li.parent().is('.child_menu')) {
                        this.openUpMenu();
                    } else {
                        if (this.$root.is('nav-sm')) {
                            if (!$li.parent().is('child_menu')) {
                                this.openUpMenu();
                            }
                        }
                    }

                    $li.addClass('active');

                    $('ul:first', $li).slideDown(() => {

                    });
                }
            }
        );

        // toggle small or large menu
        this.$menuToggle.on('click', () => {
                if (this.$root.hasClass('nav-md')) {
                    this.$sidebarMenu.find('li.active ul').hide();
                    this.$sidebarMenu.find('li.active').addClass('active-sm').removeClass('active');
                } else {
                    this.$sidebarMenu.find('li.active-sm ul').show();
                    this.$sidebarMenu.find('li.active-sm').addClass('active').removeClass('active-sm');
                }
                this.$root.toggleClass('nav-md nav-sm');

            }
        );

        // check active menu
        this.$sidebarMenu.find(
            'a[href="' + this.CURRENT_URL + '"]')
            .parent('li')
            .addClass('current-page');

        this.$sidebarMenu.find('a').filter(
            (index, item) => {
                return item.href == this.CURRENT_URL;
            }
        ).parent('li').addClass('current-page').parents('ul')
            .slideDown(() => {

            }).parent().addClass('active');

        window
            .onresize = () => {
            this.setContentHeight();
        };

        $('.collapse-link').on('click', function () {
            let $boxPanel = $(this).closest('.x_panel'),
                $icon = $(this).find('i'),
                $boxContent = $boxPanel.find('.x_content');

            // fix for some div with hardcoded fix class
            if ($boxPanel.attr('style')) {
                $boxContent.slideToggle(200, function () {
                    $boxPanel.removeAttr('style');
                });
            } else {
                $boxContent.slideToggle(200);
                $boxPanel.css('height', 'auto');
            }

            $icon.toggleClass('fa-chevron-up fa-chevron-down');
        });

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

    showFunc(funcName: string, params?: object) {
        CommonUtils.showMask();

        try {
            let func = ApplicationContext.getMenuFunc(funcName);
            if (!func) {
                alert("指定的功能不存在");
                CommonUtils.hideMask();
                return;
            }
            if (this.lastFunc) {
                this.lastFunc.destroy();
                this.$body.children().remove();
            }
            this.lastFunc = null;
            let baseUi = <MenuFunction<any>>BeanFactory.createBean(func, [params || {}]);
            this.lastFunc = baseUi;
            this.$body.append(this.lastFunc.getViewUI());
            this.lastFunc.afterComponentAssemble();
            CommonUtils.readyDo(() => {
                return this.lastFunc.isReady();
            }, () => {
                CommonUtils.hideMask();
            });
            this.initButtons();
            return <MenuFunction<any>>this.lastFunc;
        } catch (e) {
            console.log(e.message);
            CommonUtils.hideMask();
        }
    }

    private initButtons() {
        this.$toolbar.children().remove();
        if (this.lastFunc && this.lastFunc.getButton()) {
            for (let btn of this.lastFunc.getButton()) {
                let $btn = $("<button class=\"btn btn-warning\" action-code='" + btn.action + "'>" +
                    (btn.icon ? "<span class='" + btn.icon + "'></span>" : "")
                    + (btn.title ? btn.title : "") + "</button>");
                $btn.on("click", (event) => {
                    this.lastFunc.handleButtonClick($(event.target).attr("action-code"));
                });
                this.$toolbar.append($btn);
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
