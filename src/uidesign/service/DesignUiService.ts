import {NetRequest} from "../../common/NetRequest";
import {CommonUtils} from "../../common/CommonUtils";
import {BlockViewer} from "../../blockui/uiruntime/BlockViewer";

export class DesignUiService {
    private static URL_ROOT = "/ui";

    static findTablesAndFields(tableIds, callback: (data) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(DesignUiService.URL_ROOT + "/findTablesAndFields", tableIds), callback);

    }

    /**
     * 保存视图
     * @param blockViewer
     * @param callback
     */
    static saveBlockViewer(blockViewer: BlockViewer, callback: (err: string) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(this.URL_ROOT + "/saveBlock", blockViewer), callback);

    }

    /**
     * 取得可以选择的数据源信息
     * @param schemaId
     * @param callback
     */
    static findAllTableInfo(schemaId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(this.URL_ROOT + "/findAllTableInfo/" + schemaId), callback);
    }

    static genNewBlockViewer(viewName, schemaId, parentId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.post(
                this.URL_ROOT + "/genNewBlockViewer/" + schemaId + "/" + parentId, {viewName: viewName}), callback);
    }

    static deleteBlockView(blockViewId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.delete(
                this.URL_ROOT + "/deleteBlockView/" + blockViewId), callback);
    }
}
