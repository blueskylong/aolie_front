import {MenuDto} from "../sysfunc/menu/dto/MenuDto";
import BaseUI from "../uidesign/view/BaseUI";
import {TreeNode} from "../common/TreeNode";

export class MenuItem<T extends TreeNode<MenuDto>> extends BaseUI<T> {
    private static TYPE_FIRST = 1;
    private static TYPE_MIDDLE = 2;
    private static TYPE_LEAF = 3;
    private isSmall = false;
    private itemType = MenuItem.TYPE_LEAF;

    private lstSubMenuItem: Array<MenuItem<any>> = new Array<MenuItem<any>>();
    private menuSelectChanged: (needSlideUp, isNeedRemoveOpenClass, isNeedReedRemoveActiveClass, isNeedRemoveCurrentClass) => void;

    protected createUI(): HTMLElement {
        let $dom: JQuery;
        //如果是一级菜单,且有孩子
        if (!this.properties.parent && this.properties.children) {
            $dom = $(require("./templates/MenuItem_first_level.html"));
            this.itemType = MenuItem.TYPE_FIRST;
        }
        //如果有父亲,有孩子,则为中间按钮
        else if (this.properties.parent && this.properties.children) {
            $dom = $(require("./templates/MenuItem_middle_level.html"));
            this.itemType = MenuItem.TYPE_MIDDLE;

        } else {//其它的是叶子节点
            $dom = $(require("./templates/MenuItem_leaf_level.html"));
            $dom.find(".menu-text").attr("href", "#" + this.properties.data.menuId)
        }
        if (this.properties.children) {
            for (let node of this.properties.children) {
                let menuItem = new MenuItem(node);
                this.lstSubMenuItem.push(menuItem);
                $dom.find(".child_menu").append(menuItem.getViewUI());
            }
        }
        $($dom.find(".menu-text").get(0)).text(this.properties.data.menuName)
            .attr("title", this.properties.data.memo);
        return $dom.get(0);
    }

    setSelectChangeListener(menuSelectChanged: () => void) {
        this.menuSelectChanged = menuSelectChanged;
        for (let subMenu of this.lstSubMenuItem) {
            subMenu.setSelectChangeListener(menuSelectChanged);
        }
    }

    private fireSelectChangeEvent(needSlideUp,
                                  isNeedRemoveOpenClass,
                                  isNeedReedRemoveActiveClass = true,
                                  isNeedRemoveCurrentClass = false) {
        if (this.menuSelectChanged) {
            this.menuSelectChanged(needSlideUp, isNeedRemoveOpenClass,
                isNeedReedRemoveActiveClass, isNeedRemoveCurrentClass);
        }
    }

    protected initEvent() {
        this.$element
            .find('a:first').on('click', (ev) => {
                let $li = $(ev.target).closest("li");
                if (this.itemType != MenuItem.TYPE_LEAF) {//上级菜单
                    $li.toggleClass("opened");
                    if ($li.is(".opened")) {
                        if (this.itemType == MenuItem.TYPE_FIRST) {
                            this.fireSelectChangeEvent(true, true);
                            $li.addClass("opened");
                        }
                        $('ul:first', $li).slideDown();

                    } else {
                        $('ul:first', $li).slideUp();
                    }
                } else {
                    //叶子菜单
                    this.fireSelectChangeEvent(false, false, true);
                    $li.addClass("current-page");
                }
                $li.addClass(this.getActiveClass());
                $li.parents("li").addClass(this.getActiveClass());

            }
        );
    }

    private getActiveClass() {
        let activeClass = "active";
        if (this.isSmall) {
            activeClass = "active-sm";
        }
        return activeClass;
    }

    setShowSmall(isSmall: boolean) {
        this.isSmall = isSmall;
        if (this.isSmall) {
            this.$element.find('li.active-sm ul').show();
            this.$element.find('li.active-sm').addClass('active').removeClass('active-sm');

        } else {
            this.$element.find('li.active ul').hide();
            this.$element.find('li.active').addClass('active-sm').removeClass('active');

        }
    }

}
