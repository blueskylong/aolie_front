import {StringMap} from "./StringMap";
import {LoginUser} from "../sysfunc/user/LoginUser";
import {MockServer} from "./MockServer";
import {Constants} from "./Constants";
import {DmConstants} from "../datamodel/DmConstants";

export class GlobalParams {
    /**
     * 缓存系统参数
     */
    private static PARAMS: StringMap<SystemParam>;
    private static loginUser: LoginUser;
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

    /**
     * 取得系统参数
     * @param id
     */
    static getParamInfo(id): SystemParam {
        return GlobalParams.PARAMS.get(id);
    }

    /**
     * 取得系统参数
     * @param id
     */
    static getParamInfoByName(name): SystemParam {
        let paramInfo = null;
        GlobalParams.PARAMS.forEach((key, value, map) => {
            if (value.name === name) {
                paramInfo = value;
                return false;
            }
        });
        if (paramInfo == null) {
            throw new Error("系统参数[" + name + "]不存在")
        }
        return paramInfo;

    }

    static getAllGlobalParams() {
        return GlobalParams.PARAMS.getValues();
    }

    /**
     * 初始化全局参数
     */
    static initGlobalDefaultParam() {
        GlobalParams.PARAMS = new StringMap<SystemParam>();
        let user = GlobalParams.getLoginUser();
        //增加人员
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.userId + "",
            new SystemParam("登录用户ID", Constants.FieldType.int, user.userId + "", DmConstants.GlobalParamsIds.userId));
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.roleId + "",
            new SystemParam("登录角色ID", Constants.FieldType.int, user.getRoleDto().roleId + "", DmConstants.GlobalParamsIds.roleId));
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.version + "",
            new SystemParam("版本号", Constants.FieldType.varchar, user.versionCode + "", DmConstants.GlobalParamsIds.version));
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.userName + "",
            new SystemParam("登录用户名", Constants.FieldType.varchar, user.userName + "", DmConstants.GlobalParamsIds.userName));
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.userBelong + '',
            new SystemParam("登录用户所属机构", Constants.FieldType.int, user.userId + "", DmConstants.GlobalParamsIds.userBelong));
        GlobalParams.PARAMS.set(DmConstants.GlobalParamsIds.userAccount + '',
            new SystemParam("登录帐号", Constants.FieldType.varchar, user.accountCode + "", DmConstants.GlobalParamsIds.userAccount));
        //TODO 需要远程加载系统选项

    }
}


/**
 * 系统参数描述类
 */
export class SystemParam {

    constructor(name: string, dataType: string, value: string, id: number) {
        this.name = name;
        this.dataType = dataType;
        this.value = value;
        this.id = id;
    }

    name: string;
    dataType: string;
    value: string;
    id: number;
}

GlobalParams.initGlobalDefaultParam();
