import {PlugDto} from "./dto/PlugDto";
import {ManagedFunc} from "../blockui/ManagedFunc";
import {MenuInfo} from "../sysfunc/menu/dto/MenuInfo";
import {ManagedTable} from "../blockui/managedView/ManagedTable";
import {PlugMangeService} from "./services/PlugMangeService";
import {MenuFunc} from "../decorator/decorator";
import {Constants} from "../common/Constants";
import {AutoManagedUI} from "../blockui/managedView/AutoManagedUI";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {Dialog} from "../blockui/Dialog";

@MenuFunc("PlugMangeUI")
export class PlugMangeUI extends ManagedFunc<MenuInfo> {

    private table: ManagedTable;

    private updateTableData() {
        PlugMangeService.getPlugInfos((result => {
            this.table.setData(result);
        }));
    }

    protected uiReady() {
        this.table = <ManagedTable>this.findSubUIByType(ManagedTable);
        this.table.getDtoInfo().setAllowLoadData(false);
        this.updateTableData();

        this.table.addEventInterceptor(Constants.DsOperatorType.edit, {
            beforeHandle: (operType: number | string, dsId: number,
                           data: object | Array<object>, ui: AutoManagedUI): boolean => {

                let dto = (<PlugDto>data);
                if (Constants.PlugStatus.NEW == dto.status) {
                    Alert.showMessage("此插件还没有安装，不需要升级");
                    return;
                } else if (Constants.PlugStatus.INSTALLED == dto.status) {
                    Alert.showMessage("此插件已是最新版本，不需要升级");
                    return;
                }
                Dialog.showConfirm("确定要升级此插件吗？", () => {
                    PlugMangeService.updatePlug(dto.plugId, (result) => {
                        if (result.success) {

                            Alert.showMessage("升级完成");
                            this.updateTableData();
                        }
                    });
                });
                return false;
            }
        });
        this.table.addEventInterceptor(Constants.DsOperatorType.custom1, {
            beforeHandle: (operType: number | string, dsId: number,
                           data: object | Array<object>, ui: AutoManagedUI): boolean => {
                let dto = (<PlugDto>data);
                if (Constants.PlugStatus.OLD == dto.status) {
                    Alert.showMessage("此插件已安装，只需要升级,不需要再次安装");
                    return;
                } else if (Constants.PlugStatus.INSTALLED == dto.status) {
                    Alert.showMessage("此插件已安装，不需要再安装");
                    return;
                }
                PlugMangeService.installPlug(dto.plugId, (result => {
                    if (result.success) {

                        Alert.showMessage("安装完成");
                        this.updateTableData();
                    } else {
                        Alert.showMessage("安装失败");
                    }
                }));
                return false;
            }
        });
        this.table.addEventInterceptor(Constants.DsOperatorType.custom2, {
            beforeHandle: (operType: number | string, dsId: number,
                           data: object | Array<object>, ui: AutoManagedUI): boolean => {
                //转换成检查
                let dto = (<PlugDto>data);
                if (Constants.PlugStatus.NEW == dto.status) {
                    Alert.showMessage("此插件未安装，不需要检查");
                    return;
                }
                PlugMangeService.checkPlug(dto.plugId, (result => {
                    Alert.showMessage("更新结束," + result.err);
                    this.updateTableData();
                }));
                return false;
            }
        });
        this.table.addEventInterceptor(Constants.DsOperatorType.delete, {
            beforeHandle: (operType: number | string, dsId: number,
                           data: object | Array<object>, ui: AutoManagedUI): boolean => {
                let dto = (<PlugDto>data);
                if (Constants.PlugStatus.NEW == dto.status) {
                    Alert.showMessage("此插件未安装，不需要卸载");
                    return;
                }
                Dialog.showConfirm("确定要卸载插件[" + dto.name + "]吗?", () => {
                    PlugMangeService.uninstallPlug(dto.plugId, (result) => {
                        if (result.success) {
                            Alert.showMessage("卸载完成");
                            this.updateTableData();
                        }
                    });
                });
                return false;
            }
        });

    }

}
