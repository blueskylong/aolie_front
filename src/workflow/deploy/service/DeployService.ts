import {CommonUtils} from "../../../common/CommonUtils";
import {NetRequest} from "../../../common/NetRequest";
import {FlowInfo} from "../dto/FlowInfo";
import {BeanFactory} from "../../../decorator/decorator";
import {WfTable2flowDto} from "../dto/WfTable2flowDto";

export class DeployService {
    private static URL_ROOT = "/wf";

    /**
     * 流程部署
     * @param wfId
     * @param callback
     */
    static deployWf(wfId, callback: (data) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(this.URL_ROOT + "/deploy/" + wfId), callback);
    }

    static getFlowInfoByVersion(callback: (data: Array<FlowInfo>) => void) {
        CommonUtils.handleResponse(
            NetRequest.axios.get(this.URL_ROOT + "/getFlowInfoByVersion"), (result) => {
                callback(BeanFactory.populateBeans(FlowInfo, result.data));
            });
    };

    static findTable2FlowByVersion(callback:(data:Array<WfTable2flowDto>)=>void){
        CommonUtils.handleResponse(
            NetRequest.axios.get(this.URL_ROOT + "/findTable2FlowByVersion"), (result) => {
                callback(BeanFactory.populateBeans(WfTable2flowDto, result.data));
            });
    }
}
