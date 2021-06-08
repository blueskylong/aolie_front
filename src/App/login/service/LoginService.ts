import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";
import {Logger} from "../../../common/Logger";
import {Alert} from "../../../uidesign/view/JQueryComponent/Alert";

export class LoginService {
    static login(data, callback: (result) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post("/login", data), callback);
    }

    static logout() {
        CommonUtils.handleResponse(NetRequest.axios.get("/logout"), (result) => {
            if (result.success) {
                Logger.info("登出成功");
            }
        });
    }

    static findUserRoles(callback: (result) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get("/user/findUserRoles"), (result) => {
            if (result.success) {
                if (callback) {
                    callback(result.data);
                }
            }
        });
    }

    static selectRole(roleId, callback: (result) => void) {
        CommonUtils.handleResponse(NetRequest.axios.put("/user/selectUserRole/" + roleId), (result) => {
            if (result.success) {
                if (callback) {
                    callback(result.data);
                }
            }
        });
    }
}
