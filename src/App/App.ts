import {MainFrame} from "../home/MainFrame";
import {IMainFrame} from "./IMainFrame";
import {CommonUtils} from "../common/CommonUtils";
import {SchemaFactory} from "../datamodel/SchemaFactory";
import BaseUI from "../uidesign/view/BaseUI";
import {Login} from "./login/Login";
import {GlobalParams} from "../common/GlobalParams";
import {LoginService} from "./login/service/LoginService";
import {ApplicationEventCenter} from "./ApplicationEventCenter";
import {SelectRole} from "./login/SelectRole";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {BeanFactory} from "../decorator/decorator";
import {RoleDto} from "../sysfunc/right/RoleDto";

export class App {
    static homePageClass: { new(...args: Array<any>): any };

    static setHomePage(homePageClass: { new(...args: Array<any>): any }) {
        App.homePageClass = homePageClass;
    }

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

    //是否放弃处理变动事件
    private maskChange = false;

    private lastMenuId = null;

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

            if (GlobalParams.isLogin()) {
                this.showFunc(e.newURL.substr(e.newURL.lastIndexOf("#") + 1) as number);
            } else {
                this.showLogin(e.newURL.substr(e.newURL.lastIndexOf("#") + 1) as number);
            }
        };
        this.startCounter();
    }

    /**
     * 显示功能,如果主界面未生成则生成
     * @param menuId
     */
    private showFunc(menuId) {
        this.lastMenuId = menuId;
        if (this.mainFrame == null) {
            this.createFrame();
        }
        if (menuId == null) {
            menuId = this.getLocationMenu();
        }
        if (SchemaFactory.CACHE_SCHEMA.getSize() === 0) {
            new SchemaFactory().init(() => {
                this.mainFrame.showFunc(menuId);
            });
        } else {
            this.mainFrame.showFunc(menuId);
        }

    }

    private createFrame() {
        if (this.mainFrame) {
            this.mainFrame.destroy();
        }
        this.mainFrame = new MainFrame({homePageClass: App.homePageClass});
        let $body = $("body");
        $body.children().remove();
        $body.append(this.mainFrame.getViewUI());
    }

    private showMainFrame(menuId?) {
        if (this.login != null) {
            this.login.destroy();
            this.login = null;
        }

        this.showFrame(menuId);


    }

    public showFrame(menuId) {
        if (this.mainFrame == null) {
            this.createFrame();
        }
        this.showFunc(menuId);
    }

    protected getLocationMenu() {
        let hash = window.location.hash;
        if (!CommonUtils.isEmpty(hash) && "" !== hash) {
            return parseInt(hash.substr(1));
        }
        return null;
    }

    public showLogin(menuId?: number) {
        if (!menuId && this.lastMenuId) {
            menuId = this.lastMenuId;
        }
        if (this.mainFrame != null) {
            this.mainFrame.destroy();
            this.mainFrame = null;
        }
        if (this.login) {
            this.login.destroy();
        }

        this.login = this.createLoginForm(menuId);
        let $body = $("body");
        $body.children().remove();
        $body.append(this.login.getViewUI());

    }

    private refreshFrame(menuId?) {
        if (this.mainFrame == null) {
            this.createFrame();
        }

        if (SchemaFactory.CACHE_SCHEMA.getSize() === 0) {
            new SchemaFactory().init(() => {
                this.mainFrame.refresh(menuId);
            });
        } else {
            this.mainFrame.refresh(menuId);
        }


    }

    public showSelectRole(menuId?) {
        new SelectRole({
            title: "选择角色",
            destroyOnClose: true,
            onOk: (roleId) => {
                if (!roleId) {
                    Alert.showMessage("请选择角色");
                    return false;
                }
                LoginService.selectRole(roleId, (result) => {
                    //和上次的相同则不处理
                    if (GlobalParams.getLoginUser().getRoleDto() != null
                        && GlobalParams.getLoginUser().getRoleDto().roleId == roleId) {
                        return;
                    }
                    GlobalParams.getLoginUser().setRoleDto(BeanFactory.populateBean(RoleDto, result));
                    ApplicationEventCenter.fireEvent(ApplicationEventCenter.LOGIN_SUCCESS);
                    this.refreshFrame(menuId);
                });
                return true;
            },
            beforeClose: () => {
                if (!GlobalParams.getLoginUser().getRoleDto()) {
                    this.showLogin(menuId);
                }
                return true;
            }
        }).show();
    }

    protected createLoginForm(menuId?: number) {
        return new Login({
            menuId: menuId, afterLogin: (data, menuId?) => {
                //检查当前用户是不是多角色,如果是,则需要让用户选择
                if (data["authorities"].length > 1) {
                    if (this.login != null) {
                        this.login.destroy();
                        this.login = null;
                    }
                    this.showSelectRole(menuId);
                    return;
                }

                ApplicationEventCenter.fireEvent(ApplicationEventCenter.LOGIN_SUCCESS);
                this.refreshFrame(menuId);
                // this.showMainFrame(menuId);
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
            ApplicationEventCenter.fireEvent(ApplicationEventCenter.LOGOUT);
            this.showLogin();
        }
    }


}
