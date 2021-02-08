import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";

export class LoginService {
    static login(callback: (result) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post("/login", {username: "xxl", password: "xxl"}), callback);
    }
}
