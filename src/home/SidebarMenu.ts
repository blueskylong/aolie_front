import BaseUI from "../uidesign/view/BaseUI";
import {MenuDto} from "../sysfunc/menu/dto/MenuDto";
import {TreeNodeFactory} from "../common/TreeNode";
import {MenuItem} from "./MenuItem";

export class SidebarMenu<T extends Array<MenuDto>> extends BaseUI<T> {
    private CURRENT_URL = null;
    private isSmall = false;

    private lstMenu: Array<MenuItem<any>> = new Array<MenuItem<any>>();

    setShowSmall(isSmall: boolean) {
        this.isSmall = isSmall;
        for (let menuItem of this.lstMenu) {
            menuItem.setShowSmall(isSmall);
        }
    }

    protected createUI(): HTMLElement {
        let $dom = $(require("./templates/SidebarMenu.html"));
        if (!this.properties) {
            return $dom.get(0);
        }
        let menuNodes = TreeNodeFactory.genTreeNodeForTree(this.properties, "lvlCode", "menuName");
        let menuItem;
        let $container = $dom.find(".side-menu");
        let selectListener = (needSlideUp, isNeedRemoveOpenClass, isNeedReedRemoveActiveClass, isNeedRemoveCurrentClass) => {
            if (isNeedReedRemoveActiveClass) {
                this.$element.find('li').removeClass('active').removeClass("active-sm");
            }
            if (isNeedRemoveOpenClass) {
                this.$element.find('li').removeClass('opened');
            }
            if (needSlideUp) {
                this.$element.find('li ul').slideUp();
            }
            if (isNeedRemoveCurrentClass) {
                this.$element.find('li').removeClass('current-page');
            }

        }

        for (let node of menuNodes) {
            menuItem = new MenuItem(node);
            $container.append(menuItem.getViewUI());
            menuItem.setSelectChangeListener(selectListener);
            this.lstMenu.push(menuItem);

        }
        return $dom.get(0);
    }

    afterComponentAssemble(): void {
        let $lis = this.locateMenu();
        $('ul:first', $lis).slideDown(function () {
        });
    }

    locateMenu(): JQuery {
        this.$element.find(".current-page").removeClass("current-page");
        let urls = window.location.href.split('#');
        if (urls.length == 1) {
            return;
        }
        this.CURRENT_URL = urls[1].split('?')[0];
        if (!this.CURRENT_URL) {
            return;
        }

        let menu = this.$element.find(
            'a[href="#' + this.CURRENT_URL + '"]')
            .parent('li');

        menu.addClass('current-page').addClass(this.getActiveClass());
        menu.parents('ul')
            .slideDown();
        menu.parents("li").addClass(this.getActiveClass).addClass("opened");
        return menu;
    }

    public getMenuInfo(menuId:number):MenuDto{
        if(this.properties){
            for(let menuDto of this.properties){
                if(menuDto.menuId == menuId){
                    return menuDto;
                }
            }
        }
        return null;
    }

    private getActiveClass() {
        let activeClass = "active";
        if (this.isSmall) {
            activeClass = "active-sm";
        }
        return activeClass;
    }


}
