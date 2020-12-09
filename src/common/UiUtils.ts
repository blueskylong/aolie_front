//TODO 完善成提示信息
import {CommonUtils} from "./CommonUtils";

export class UiUtils {
    static showInfo(info: string) {
        alert(info);
    }

    static showWarning(info: string) {
        alert(info);
    }

    /**
     * 取得块视图的数据
     * @param blockId
     */
    static getBlockViewDataUrl(blockId) {
        return CommonUtils.getServerUrl("/data/findBlockData/" + blockId);
    }

    static getBlockViewNoPageUrl(blockId) {
        return CommonUtils.getServerUrl("/data/findBlockDataNoPage/" + blockId);
    }
}
