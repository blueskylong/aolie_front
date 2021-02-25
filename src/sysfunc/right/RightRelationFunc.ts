import {ManagedFunc} from "../../blockui/ManagedFunc";
import {Dialog, DialogInfo} from "../../blockui/Dialog";
import {GlobalParams} from "../../common/GlobalParams";
import {RightGraphPanel} from "./RightGraphPanel";
import {MenuFunc} from "../../decorator/decorator";

/**
 * 关系维护功能,
 * 这里只为增加一个自定义的按钮事件
 */
@MenuFunc()
export class RightRelationFunc extends ManagedFunc<any> {
    private graphDlg: Dialog<DialogInfo>;
    private graph: RightGraphPanel;

    showGraph() {
        if (this.graphDlg) {
            this.graphDlg.destroy();
        }
        this.graphDlg = new Dialog<DialogInfo>({
            title: "权限关系图",
            height: 600, draggable: false
        });
        this.graphDlg.setSize(Dialog.SIZE.x_large);
        this.graph = new RightGraphPanel(GlobalParams.getLoginVersion());
        this.graphDlg.setBodyContent(this.graph.getViewUI());
        this.graphDlg.show(null, Dialog.SIZE.x_large);
    }

    destroy(): boolean {

        this.graphDlg && this.graphDlg.destroy();
        this.graph.destroy();
        return super.destroy();
    }

}
