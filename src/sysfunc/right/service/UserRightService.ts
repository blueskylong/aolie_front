import {HandleResult} from "../../../common/HandleResult";
import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";

export class UserRightService {
    public static URL_ROOT = "/user";

    /**
     * 取得用户的所有权限
     * @param blockViewer
     * @param callback
     */
    static findMenuAndButton(callback: (result: HandleResult) => void) {
        CommonUtils.handleResponse(NetRequest.axios.get(UserRightService.URL_ROOT + "/findMenuAndButton"), callback);
    }

    /**
     * 查询一权限关系数据
     *
     * @param rrId     权限关系ID
     * @param sourceId 主权限的ID
     * @return
     */
    static findRightRelationDetail(rrId, sourceId, callback: (handleResult: HandleResult) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(UserRightService.URL_ROOT + "/findRightRelationDetail/" + rrId + "/" + sourceId)
            , callback);
    };

    /**
     * 查询一权限关系数据
     *
     * @param rrId     权限关系ID
     * @param sourceId 主权限的ID
     * @return
     */
    static findRsDetail(sourceRsId, destRsId, sourceId, callback: (handleResult: HandleResult) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(UserRightService.URL_ROOT + "/findRsDetail/" + sourceRsId + "/"
                + destRsId + "/" + sourceId)
            , callback);
    };

    /**
     * 根据权限资源ID,查询权限资源全信息
     *
     * @param lstId
     * @return
     */
    static findRightResources(lstId: Array<any>, callback: (handleResult: HandleResult) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.post(UserRightService.URL_ROOT + "/findRightResources", lstId)
            , callback);
    };
}
