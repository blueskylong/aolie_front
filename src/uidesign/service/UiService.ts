import {NetRequest} from "../../common/NetRequest";
import {CommonUtils} from "../../common/CommonUtils";

export class UiService {
    private static URL_ROOT = "/ui";

    static findTablesAndFields(tableIds, callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(UiService.URL_ROOT + "/findTablesAndFields", tableIds), callback);

    }

}
