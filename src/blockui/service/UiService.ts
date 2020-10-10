import {BeanFactory} from "../../decorator/decorator";
import {BlockViewer} from "../uiruntime/BlockViewer";
import {ReferenceData} from "../../datamodel/dto/ReferenceData";
import {NetRequest} from "../../common/NetRequest";
import {StringMap} from "../../common/StringMap";
import {CommonUtils} from "../../common/CommonUtils";

export class UiService {
    private static URL_ROOT = "/ui";
    private static CACHE = new StringMap<object>();
    private static PREFIX_KEY_BLOCK = "BLOCK_";
    private static PREFIX_KEY_REFERENCE_DATE = "REFERENCE_";


    /**
     * 取得一个UI信息
     * @param blockViewerId
     * @param version
     */
    static async getSchemaViewer(blockViewerId: number) {
        let key = UiService.PREFIX_KEY_BLOCK + blockViewerId;
        if (UiService.CACHE.has(key)) {
            return UiService.CACHE.get(key);
        }
        let viewData = await NetRequest.axios.get(this.URL_ROOT + "/getSchemaViewer/" + blockViewerId);
        let result = BeanFactory.populateBean(BlockViewer, viewData.data) as any;
        UiService.CACHE.set(key, result);
        return result;
    }

    /**
     * 取得引用信息
     * @param refId
     * @param version
     */
    static async getReferenceData(refId: number) {
        let key = UiService.PREFIX_KEY_REFERENCE_DATE + refId;
        if (UiService.CACHE.has(key)) {
            return UiService.CACHE.get(key) as any;
        }
        let result = await NetRequest.axios.get(this.URL_ROOT + "/findReferenceData/" + refId);
        if (result && result.data) {
            let lstResult = new Array<ReferenceData>();
            for (let row of result.data) {
                lstResult.push(BeanFactory.populateBean(ReferenceData, row));
            }
            UiService.CACHE.set(key, lstResult);
            return lstResult;
        }
        return null;
    }

    /**
     * 保存视图
     * @param blockViewer
     * @param callback
     */
    static saveBlockViewer(blockViewer: BlockViewer, callback: (err: string) => void) {
        CommonUtils.handleResponse(NetRequest.axios.post(this.URL_ROOT + "/saveBlock", blockViewer), callback);

    }
}
