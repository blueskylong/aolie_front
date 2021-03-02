import BaseUI from "../../uidesign/view/BaseUI";
import "./template/login.css"
import {Stars} from "./Stars";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {GlobalParams} from "../../common/GlobalParams";
import {LoginService} from "./service/LoginService";
import {BeanFactory} from "../../decorator/decorator";
import {LoginUser} from "../../sysfunc/user/LoginUser";

export class Login<T extends LoginInfo> extends BaseUI<T> {
    private $accoutName: JQuery;
    private $password: JQuery;

    protected createUI(): HTMLElement {
        return $(require("./template/Login.html")).get(0);
    }

    protected initSubControls() {
        this.$accoutName = this.$element.find("#username");
        this.$password = this.$element.find("#password");
    }

    protected initEvent() {
        this.$element.find(".btn-login").on("click", (e) => {
            if (this.$element.find("form").valid()) {
                LoginService.login({
                    username: this.$accoutName.val(),
                    password: this.$password.val()
                }, (result1) => {
                    if (result1.success) {
                        GlobalParams.setLoginUser(BeanFactory.populateBean(LoginUser, result1.data.principal));
                        if (this.properties.afterLogin) {
                            this.properties.afterLogin(this.properties.menuId);
                        }
                    }

                });

            }
            e.preventDefault();
        })
    }

    afterComponentAssemble(): void {
        Stars.start(this.$element.find(".stars"));
        this.$element.on("mousemove", (e) => {
            Stars.mousePosition.x = e.pageX;
            Stars.mousePosition.y = e.pageY;
        });
        super.afterComponentAssemble();
    }

}

interface LoginInfo {
    //登录后的功能号
    menuId: number
    afterLogin: (menuId?) => void;
}
