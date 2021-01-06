import {BlockViewer} from "../../../blockui/uiruntime/BlockViewer";
import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";
import {HandleResult} from "../../../common/HandleResult";

export class UserService {
    public static URL_ROOT = "/user";

    /**
     * 取得用户的所有权限
     * @param blockViewer
     * @param callback
     */
    static getUserRights(userId: number, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(this.URL_ROOT + "/getUserRights/" + userId), callback);
    }

    /**
     * 取得用户的所有权限
     * @param blockViewer
     * @param callback
     */
    static saveUserRight(userId: number, rsToIds: object, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(this.URL_ROOT + "/saveUserRight/" + userId, rsToIds), callback);
    }

}
