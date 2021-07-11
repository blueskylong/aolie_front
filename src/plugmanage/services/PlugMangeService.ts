import {HandleResult} from "../../common/HandleResult";
import {CommonUtils} from "../../common/CommonUtils";
import {NetRequest} from "../../common/NetRequest";

export class PlugMangeService {
    static URL_ROOT = "/plug";

    /**
     *
     * @param callback
     */
    static getPlugInfos(callback: (result: Array<any>) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(PlugMangeService.URL_ROOT + "/getPlugInfos"), callback);
    }

    /**
     *
     * @param callback
     */
    static installPlug(plugId, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(PlugMangeService.URL_ROOT + "/install/" + plugId), callback);
    }

    /**
     *
     * @param callback
     */
    static updatePlug(plugId, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(PlugMangeService.URL_ROOT + "/update/" + plugId), callback);
    }

    /**
     *
     * @param callback
     */
    static uninstallPlug(plugId, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(PlugMangeService.URL_ROOT + "/uninstall/" + plugId), callback);
    }

    /**
     *
     * @param callback
     */
    static checkPlug(plugId, callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(PlugMangeService.URL_ROOT + "/check/" + plugId), callback);
    }
}
