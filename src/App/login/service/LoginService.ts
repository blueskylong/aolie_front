import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";

export class LoginService {
    static login(data, callback: (result) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post("/login", data), callback);
    }
}
