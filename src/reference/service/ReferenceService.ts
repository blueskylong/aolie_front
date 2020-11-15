import {CommonUtils} from "../../common/CommonUtils";
import {NetRequest} from "../../common/NetRequest";

export class ReferenceService {
    static URL_ROOT = "/dm";

    static findReferenceInfo(callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(this.URL_ROOT + "/findReferenceInfo"), callback);
    }

    static saveReference(lstDto, callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(this.URL_ROOT + "/saveReference", lstDto), callback);
    }
}
