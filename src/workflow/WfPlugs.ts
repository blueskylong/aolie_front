import {ManagedTable} from "../blockui/managedView/ManagedTable";
import {AutoManagedUI, IEventHandler} from "../blockui/managedView/AutoManagedUI";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {MenuButtonDto} from "../sysfunc/menu/dto/MenuButtonDto";
import {BlockViewer} from "../blockui/uiruntime/BlockViewer";
import {CacheUtils} from "../common/CacheUtils";
import {StringMap} from "../common/StringMap";
import {WfTable2flowDto} from "./deploy/dto/WfTable2flowDto";
import {WfWorkflowDto} from "./deploy/dto/WfWorkflowDto";
import {WfNode} from "./deploy/dto/WfNode";
import {DeployService} from "./deploy/service/DeployService";
import {FlowInfo} from "./deploy/dto/FlowInfo";
import {ApplicationEventCenter} from "../App/ApplicationEventCenter";

export class WfPlugs {
    /**
     * 流程虚拟列
     */
    static PLUG_FIELD_NAME = "PLUG_COLUMN_WF_STATE";
    /**
     * 操作事件
     */
    static EVENT_COMMIT = 1101;

    static EVENT_BACK = 1102;
    /**
     * tableId 对就表流程信息
     */
    private static mapTable2Flow = new StringMap<WfTable2flowDto>();
    /**
     * 流程ID对应节点信息列表
     */
    private static mapFlowInfo = new StringMap<FlowInfo>();

    static addPlugs() {
        WfPlugs.initFlowInfo(() => {
            ManagedTable.addClassEventHandler(WfPlugs.EVENT_COMMIT, new WfCommitHandler());
            ManagedTable.addClassEventHandler(WfPlugs.EVENT_BACK, new WfBackHandler());
            ManagedTable.addExtColProvider((blockInfo: BlockViewer) => {
                let wfNodes = WfPlugs.findFlowNodes(blockInfo);
                if (wfNodes) {
                    return [{
                        label: "流程状态",
                        width: 200,
                        name: WfPlugs.PLUG_FIELD_NAME,
                        edittype: "select",
                        editoptions: {"value": WfPlugs.makeSelections(wfNodes)}
                    }];
                } else {
                    return null;
                }

            });
        });

    }

    private static makeSelections(lstNodes: Array<WfNode>) {
        if (lstNodes == null) {
            return "";
        }
        let str = "";
        lstNodes.forEach(el => {
            str += el.getActId() + ":" + el.getName() + ";";
        })
        return str;
    }

    /**
     * 查询流程节点的信息
     * @param blockInfo
     */
    static findFlowNodes(blockInfo: BlockViewer): Array<WfNode> {
        let tableInfos = blockInfo.findTables();
        if (tableInfos == null) {
            return null;
        }
        //遍历查找,以第一个找到的为准
        for (let tableInfo of tableInfos) {
            let flowInfo = this.mapTable2Flow.get(tableInfo.getTableDto().tableId);
            if (!flowInfo) {
                continue;
            }
            return this.mapFlowInfo.get(flowInfo.getWfId()).getLstNodes();
        }
        return null;
    }

    static initFlowInfo(next: Function) {
        DeployService.getFlowInfoByVersion((lstFlowInfo) => {
            WfPlugs.initFlowInfoCache(lstFlowInfo);
            DeployService.findTable2FlowByVersion((lstTable2Flow) => {
                WfPlugs.initTable2FlowCache(lstTable2Flow);
                next();
            });
        })
    }

    static initFlowInfoCache(lstFlowInfo: Array<FlowInfo>) {
        WfPlugs.mapFlowInfo = new StringMap<FlowInfo>();
        if (!lstFlowInfo) {
            return;
        }
        lstFlowInfo.forEach(el => WfPlugs.mapFlowInfo.set(el.getFlowDto().getWfId(), el));
    }

    static initTable2FlowCache(lstFlowInfo: Array<WfTable2flowDto>) {
        WfPlugs.mapTable2Flow = new StringMap<WfTable2flowDto>();
        if (!lstFlowInfo) {
            return;
        }
        lstFlowInfo.forEach(el => WfPlugs.mapTable2Flow.set(el.getTableId(), el));
    }


}

class WfCommitHandler implements IEventHandler {
    doHandle(operType: number | string, dsId: number, data: object | Array<object>,
             ui: AutoManagedUI, menuButtonDto: MenuButtonDto): void {
        Alert.showMessage("提交");
    }
}

class WfBackHandler implements IEventHandler {
    doHandle(operType: number | string, dsId: number, data: object | Array<object>,
             ui: AutoManagedUI, menuButtonDto: MenuButtonDto): void {
        Alert.showMessage("退回");
    }
}

ApplicationEventCenter.addListener(ApplicationEventCenter.LOGIN_SUCCESS, {
    handleEvent(eventType: string, data: any, source: any, extObject?: any) {
        WfPlugs.addPlugs();
    }
});

