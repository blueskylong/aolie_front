/**
 * 流程综合信息
 *
 * @author xxl
 * @version V0.0.1
 * @date 2021/3/25 0025 20:43
 **/
import {WfWorkflowDto} from "./WfWorkflowDto";
import {WfNode} from "./WfNode";
import {PopulateBean} from "../../../decorator/decorator";

export class FlowInfo {


    private flowDto: WfWorkflowDto;
    private lstNodes: Array<WfNode>;


    public getFlowDto() {
        return this.flowDto;
    }

    @PopulateBean(WfWorkflowDto)
    public setFlowDto(flowDto) {
        this.flowDto = flowDto;
    }

    public getLstNodes() {
        return this.lstNodes;
    }

    @PopulateBean(WfNode)
    public setLstNodes(lstNodes) {
        this.lstNodes = lstNodes;
    }
}
