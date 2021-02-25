import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";
import {Logger} from "../../../common/Logger";

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
}
