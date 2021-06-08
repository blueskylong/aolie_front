import {ManagedFunc} from "../../blockui/ManagedFunc";
import {MenuInfo} from "../../sysfunc/menu/dto/MenuInfo";
import {ManagedTable} from "../../blockui/managedView/ManagedTable";
import {AutoManagedUI} from "../../blockui/managedView/AutoManagedUI";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {Constants} from "../../common/Constants";
import {MenuFunc} from "../../decorator/decorator";
import {Dialog} from "../../blockui/Dialog";
import {DeployService} from "./service/DeployService";
import "../WfPlugs"
import {EditorDlg} from "./dialogs/EditorDlg";
import {CommonUtils} from "../../common/CommonUtils";

@MenuFunc("DeployUI")
export class DeployUI extends ManagedFunc<MenuInfo> {
    private static TABLE_UI_CODE = "UI_DEPLOY_TABLE";
    /**
     * 部署列表
     */
    private table: ManagedTable;

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        this.addReadyListener(() => {
            this.table = <ManagedTable>this.findSubUI(DeployUI.TABLE_UI_CODE);
            let inter = this.getDeployEventInterceptor();
            this.table.addEventInterceptor(Constants.DsOperatorType.custom1, inter);
            this.table.addEventInterceptor(Constants.DsOperatorType.custom2, inter);
        });

    }

    private getDeployEventInterceptor() {
        return {
            beforeHandle: (operType: number | string, dsId: number, data: object | Array<object>, ui: AutoManagedUI) => {
                if (operType == Constants.DsOperatorType.custom1) {

                    new EditorDlg({title: "编辑流程"}).show(data['model_id'], CommonUtils.getDialogFullSize());
                } else {
                    this.doDeploy(data);
                }
                return true;
            }
        }
    }

    private doDeploy(data) {
        Dialog.showConfirm("确定要重新部署工作流吗?", () => {
            DeployService.deployWf(data['wf_id'], (data) => {
                Alert.showMessage("部署完成 ")
                this.table.reload();
            })
        })
    }


}
