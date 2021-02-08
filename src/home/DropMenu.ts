import BaseUI from "../uidesign/view/BaseUI";

export class DropMenu<T extends DropMenuInfo> extends BaseUI<T> {
    protected createUI(): HTMLElement {
        return $(require("./templates/DropDownMenu.html")).get(0);
    }

    protected initSubControls() {
        this.$element.find(".user-name").text(this.properties.userName);
        //修改图片
        if (this.properties.lstItem != null) {
            this.properties.lstItem.forEach((item) => {
                this.addItem(item);
            })
        }
    }

    public addItem(menuInfo: DropMenuItemInfo) {
        let item = new DropMenuItem(menuInfo);
        this.$element.find(".dropdown-usermenu").append(item.getViewUI());
    }
}

export interface DropMenuInfo {
    lstItem: Array<DropMenuItemInfo>;
    userName: string;
    userImg: string;
}

/**
 * 消息控件
 */
export class MessageDropMenu<T extends MessageDropMenuInfo> extends BaseUI<T> {
    protected createUI(): HTMLElement {
        return $(require("./templates/MessageDropDownMenu.html")).get(0);
    }

    protected initSubControls() {
        this.$element.find(".new-message-count").text(this.properties.count);
        let moreMessageItem = this.$element.find(".more-message");
        moreMessageItem.on("click", () => {
            this.properties.showMore();
        });
        if (this.properties.lstItem) {

            for (let item of this.properties.lstItem) {
                $(new MessageDropMenuItem(item).getViewUI()).insertBefore(moreMessageItem);
            }
        }
        if (this.properties.count) {
            moreMessageItem.show();
        } else {
            moreMessageItem.hide();
        }
    }
}

export interface MessageDropMenuInfo {
    lstItem: Array<MessageDropMenuItemInfo>;
    count: number;
    showMore: () => void;
}

/**
 * 消息列表项
 */
export class MessageDropMenuItem<T extends MessageDropMenuItemInfo> extends BaseUI<T> {

    protected createUI(): HTMLElement {
        return $(require("./templates/MessageDropDownMenuItem.html")).get(0);
    }

    protected initSubControls() {
        this.$element.find(".from-user").text(this.properties.fromUser);
        this.$element.find(".time").text(this.getTimeText(this.properties.receiveTime));
        this.$element.find(".message").text(this.properties.message);
        this.$element.on("click", (event) => {
            this.properties.handler(this.properties.messageId);
        });
    }

    private getTimeText(time: Date) {
        return "3分钟前";
    }
}

export interface MessageDropMenuItemInfo {
    messageId: number;
    imageURL: string;
    fromUser: string;
    receiveTime: Date;
    message: string;
    handler: (messageId) => void;
}

/**
 * 下拉菜单条目
 */
export class DropMenuItem<T extends DropMenuItemInfo> extends BaseUI<T> {

    protected createUI(): HTMLElement {
        return $("<a class='dropdown-item' >" +
            "<i class='fa drop-item-icon  pull-right'>" +
            "</i><span class='drop-item-text'></span></a>").get(0);
    }

    protected initSubControls() {
        if (this.properties) {
            this.$element.find(".drop-item-text").text(this.properties.title);
            if (this.properties.icons) {
                this.$element.find(".drop-item-icon").addClass(this.properties.icons);
            }
            if (this.properties.clickHandler) {
                this.$element.on("click", (event) => {
                    this.properties.clickHandler(event);
                })
            }

        }
    }
}

export interface DropMenuItemInfo {
    title: string;
    icons?: string;
    clickHandler: (event) => void;
}
