import {CommonUtils} from "../../common/CommonUtils";
import {NetRequest} from "../../common/NetRequest";
import {PageInfo} from "../dto/PageInfo";

export default class PageService {
    static URL_ROOT = "/page";

    static addPage(pageName, schemaId, parentId, callback: (data) => void) {
        let data = {pageName: pageName};
        if (parentId) {
            data["parentId"] = parentId;
        }
        CommonUtils.handleResponse(
            NetRequest.axios.post(PageService.URL_ROOT + "/addPage/" + schemaId, data), callback);
    }

    static deletePage(pageId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.delete(PageService.URL_ROOT + "/deletePage/" + pageId), callback);
    }

    static findPageDetail(pageId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(PageService.URL_ROOT + "/findPageDetail/" + pageId), callback);
    }

    static savePageFullInfo(pageInfo: PageInfo, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.post(PageService.URL_ROOT + "/savePageFullInfo", pageInfo), callback);
    }

    static updatePageLevel(mapIdToCode: Object, schemaId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.post(PageService.URL_ROOT + "/updatePageLevel/" + schemaId, mapIdToCode), callback);
    }
}
