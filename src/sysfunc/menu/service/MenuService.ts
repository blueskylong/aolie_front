import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";

export class MenuService {
    static URL_ROOT = "/menu";

    static findMenuInfo(menuId, callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(MenuService.URL_ROOT + "/findMenuInfo/" + menuId), callback);
    }

    static findUserMenu(callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(MenuService.URL_ROOT + "/findUserMenu/"), callback);
    }

}
