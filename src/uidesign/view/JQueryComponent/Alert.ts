import BaseUI from "../BaseUI";

export class Alert<T extends AlertInfo> extends BaseUI<T> {
    static type = {
        success: "alert-success",
        warning: "alert-warning",
        info: "alert-info",
        danger: "alert-danger",
        light: "alert-light",
        dark: "alert-dark",
        primary: "alert-primary",
        secondary: "alert-secondary"
    };
    private time = 500000;

    protected createUI(): HTMLElement {
        let $ele = $(require("./templete/Alert.html"));
        $ele.find("span").text(this.properties.message);
        if (this.properties.type && Alert.type[this.properties.type]) {
            $ele.addClass(Alert.type[this.properties.type]);
        } else {
            $ele.addClass(Alert.type.info);//default info
        }
        return $ele.get(0);
    }

    show() {
        $("body").append(this.getViewUI());
        let interval = setInterval(() => {
            if (this.time <= 0) {
                clearInterval(interval);
                this.$element.remove();
            } else {
                this.time--;
            }
        }, 1000);

    }

    static showMessage(info: AlertInfo) {
        alert(info.message)
    }
}

export interface AlertInfo {
    message: string,
    position?: string,
    type?: string
}
