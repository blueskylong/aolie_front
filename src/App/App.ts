import {MainFrame} from "../home/MainFrame";
import {IMainFrame} from "./IMainFrame";
import {MenuFunction} from "../blockui/MenuFunction";
import {CommonUtils} from "../common/CommonUtils";
import {SchemaFactory} from "../datamodel/SchemaFactory";
import BaseUI from "../uidesign/view/BaseUI";
import {Login} from "./login/Login";
import {GlobalParams} from "../common/GlobalParams";
import {LoginService} from "./login/service/LoginService";

export class App {
    //设置超时时间： 20分钟
    private static timeToLogout = 20 * 60 * 1000;
    //开始计时时间
    private startTime = new Date().getTime();
    //当前时间
    private endTime = new Date().getTime();
    //功能显示面板
    private mainFrame: IMainFrame;
    //登录
    private login: BaseUI<any>;
    //最后显示的功能
    private lastFunc: MenuFunction<any>;
    //是否放弃处理变动事件
    private maskChange = false;

    start() {
        let i = 0;
        $.hashCode = () => {
            return function () {
                return i++;
            }()
        };

        //初始化显示
        let hash = window.location.hash;
        let menuId = null;
        GlobalParams.setApp(this);
        if (!CommonUtils.isEmpty(hash) && "" !== hash) {
            menuId = parseInt(hash.substr(1));
        }
        if (GlobalParams.isLogin()) {
            this.showMainFrame(menuId);
        } else {
            this.showLogin(menuId);
        }

        window.onhashchange = (e) => {
            if (this.maskChange) {
                this.maskChange = false;
                return;
            }
            if (this.lastFunc) {
                if (!this.lastFunc.beforeClose()) {
                    this.maskChange = true;
                    window.location = e.oldURL;
                    return;
                }
            }
            if (GlobalParams.isLogin()) {
                this.showMainFrame(e.newURL.substr(e.newURL.lastIndexOf("#") + 1) as number);
            } else {
                this.showLogin(e.newURL.substr(e.newURL.lastIndexOf("#") + 1) as number);
            }
        };
        this.startCounter();

    }

    private showMainFrame(menuId?) {
        if (this.login != null) {
            this.login.destroy();
            this.login = null;
        }
        if (SchemaFactory.CACHE_SCHEMA.getSize() === 0) {
            new SchemaFactory().init(() => {
                this.showFrame(menuId);
            });
        } else {
            this.showFrame(menuId);
        }

    }

    public showFrame(menuId) {
        let $body = $("body");
        if (this.mainFrame == null) {
            this.mainFrame = this.createMainFrame();
            $body.children().remove();
            $body.append(this.mainFrame.getViewUI());
        }
        if (menuId == null) {
            menuId = this.getLocationMenu();
        }
        this.mainFrame.showFunc(menuId);
    }

    protected getLocationMenu() {
        let hash = window.location.hash;
        if (!CommonUtils.isEmpty(hash) && "" !== hash) {
            return parseInt(hash.substr(1));
        }
        return null;
    }

    public showLogin(menuId?: number) {
        if (this.mainFrame != null) {
            this.mainFrame.destroy();
            this.mainFrame = null;
        }
        if (this.login == null) {
            this.login = this.createLoginForm(menuId);
            let $body = $("body");
            $body.children().remove();
            $body.append(this.login.getViewUI());
        }

    }

    protected createMainFrame() {
        return new MainFrame({});
    }

    protected createLoginForm(menuId?: number) {
        return new Login({
            menuId: menuId, afterLogin: (menuId?) => {
                this.showMainFrame(menuId);
            }
        });
    }

    /**
     * 计时退出登录
     */
    private startCounter() {
        $(document).on("mousemove", (e) => {
            this.startTime = new Date().getTime(); //鼠标移入重置停留的时间
        });
        setInterval(() => {
            this.checkLoginOutTime();
        }, 20000);

    }


    /**
     * 检查是不是超时
     */
    private checkLoginOutTime() {
        this.endTime = new Date().getTime();
        if (this.endTime - this.startTime > App.timeToLogout) {
            this.logout();
        }
    }

    private logout() {
        this.startTime = new Date().getTime();
        if (GlobalParams.isLogin()) {
            GlobalParams.logout();
            LoginService.logout();
            this.showLogin();
        }
    }


}
