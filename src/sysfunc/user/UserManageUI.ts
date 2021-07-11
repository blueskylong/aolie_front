import {ManagedFunc} from "../../blockui/ManagedFunc";
import {MenuInfo} from "../menu/dto/MenuInfo";
import {ManagedTable} from "../../blockui/managedView/ManagedTable";
import {Constants} from "../../common/Constants";
import {AutoManagedUI} from "../../blockui/managedView/AutoManagedUI";
import {Dialog} from "../../blockui/Dialog";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {MenuFunc} from "../../decorator/decorator";
import {UserService} from "./service/UserService";

@MenuFunc("UserManageUI")
export class UserManageUI extends ManagedFunc<MenuInfo> {

    /**
     * 增加按钮事件的处理
     */
    private table: ManagedTable;

    afterComponentAssemble(): void {
        super.afterComponentAssemble();
        this.addReadyListener(() => {
            this.table = <ManagedTable>this.findSubUIByType(ManagedTable);
            let inter = this.getDeployEventInterceptor();
            this.table.addEventInterceptor(Constants.DsOperatorType.custom1, inter);
            this.table.addEventInterceptor(Constants.DsOperatorType.custom2, inter);
            this.table.addEventInterceptor(Constants.DsOperatorType.custom3, inter);
        });

    }

    private getDeployEventInterceptor() {
        return {
            beforeHandle: (operType: number | string, dsId: number, data: object | Array<object>, ui: AutoManagedUI) => {

                if (operType == Constants.DsOperatorType.custom1) {
                    //转换成重置密码
                    Dialog.showConfirm("确定要重置用户[" + data["user_name"] + "]的密码吗?", () => {
                        UserService.resetUserPassword(data["user_id"], (result => {
                            if (result.success) {
                                Alert.showMessage("重置成功");
                                ui.reload();
                            } else {
                                Alert.showMessage("操作失败" + result.err);
                            }
                            ui.reload();
                        }));
                    });


                } else if (operType == Constants.DsOperatorType.custom2) {
                    //转换成禁用
                    Dialog.showConfirm("确定要禁用用户[" + data["user_name"] + "]的密码吗?", () => {
                        UserService.disableUser(data["user_id"], (result => {
                            if (result.success) {
                                Alert.showMessage("禁用成功");
                                ui.reload();
                            } else {
                                Alert.showMessage("操作失败" + result.err);
                            }

                        }));
                    });
                } else if (operType == Constants.DsOperatorType.custom3) {
                    //转换成启用
                    Dialog.showConfirm("确定要启用用户[" + data["user_name"] + "]的密码吗?", () => {
                        UserService.enableUser(data["user_id"], (result => {
                            if (result.success) {
                                Alert.showMessage("启用成功");
                                ui.reload();
                            } else {
                                Alert.showMessage("操作失败" + result.err);
                            }

                        }));
                    });
                }
                return true;
            }
        }
    }



}
