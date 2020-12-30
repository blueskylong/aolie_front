import {CommonUtils} from "./CommonUtils";
import {StringMap} from "./StringMap";
import {LoginUser} from "../sysfunc/user/LoginUser";
import {RoleDto} from "../sysfunc/user/RoleDto";
import {MockServer} from "./MockServer";
import {CacheUtils} from "./CacheUtils";

export class GlobalParams {

    private static loginUser: LoginUser;

    private static pageSchema = new StringMap<number>();

    static cacheType = "page";
    /**
     * 默认的登录的数据版本
     */
    static loginVersion = "000000";

    static getLoginVersion() {
        return GlobalParams.loginVersion;
    }

    static getLoginUser(): LoginUser {
        if (!GlobalParams.loginUser) {
            GlobalParams.loginUser = MockServer.getLoginUser();
        }
        return GlobalParams.loginUser;
    }

    static setLoginUser(loginUser) {
        GlobalParams.loginUser = loginUser;
    }


    /**
     * 取得全局变量
     */
    static getGlobalParams() {
        let user = GlobalParams.getLoginUser();
        return {
            "GLOBAL_LOGIN_VERSION": GlobalParams.getLoginVersion(),
            "GLOBAL_USER_ID": user.userId, "GLOBAL_USER_NAME": user.userName,
            "GLOBAL_USER_CODE": user.accountCode,
            "GLOBAL_LOGIN_ROLE_CODE": user.getRoleDto().roleType
        }
    }
}
