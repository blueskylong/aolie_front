import {AutoManagedUI, IManageCenter} from "../../blockui/managedView/AutoManagedUI";
import {MenuButtonDto} from "../menu/dto/MenuButtonDto";
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {CustomUi} from "../../decorator/decorator";
import {UiService} from "../../blockui/service/UiService";
import {HandleResult} from "../../common/HandleResult";
import {ReferenceTree} from "../../blockui/JsTree/ReferenceTree";
import "./templates/user.css";
import {GlobalParams} from "../../common/GlobalParams";
import {Toolbar} from "../../uidesign/view/JQueryComponent/Toolbar";
import {ManagedUITools} from "../../blockui/managedView/ManagedUITools";
import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {Alert} from "../../uidesign/view/JQueryComponent/Alert";
import {CommonUtils} from "../../common/CommonUtils";
import {UserService} from "./service/UserService";
import {StringMap} from "../../common/StringMap";
import {Constants} from "../../common/Constants";

@CustomUi()
export class UserToResource<T extends PageDetailDto> extends BaseComponent<T> implements AutoManagedUI {

    private lstTree = new Array<ReferenceTree<any>>();
    private mapTree = new StringMap<ReferenceTree<any>>();
    private lstResource: Array<object>;
    private toolBar: Toolbar<any>;
    private manageCenter: IManageCenter;
    private userId: number;
    private state: number;
    private readyCount = 0;
    private treeCount = 0;

    /**
     * 资源ID
     */
    static USER_TO_RESOURCE_DS_ID = 4996398596377088;
    static USER_DS_ID = 4958233176623708;
    static RESOURCE_DS_ID = 4992135365380608;

    attrChanged(source: any, tableId: number, mapKeyAndValue: object, field: string, value: any) {
    }

    btnClicked(source: any, buttonInfo: MenuButtonDto, data): boolean {
        return false;
    }

    dataChanged(source: any, tableId, mapKeyAndValue: object, changeType) {
    }

    dsSelectChanged(source: any, tableId, mapKeyAndValue, row?) {
        this.clearSelection();
        if (mapKeyAndValue) {
            this.userId = mapKeyAndValue["user_id"];
            this.signTrees(this.userId);
        } else {
            this.userId = null;
        }
        this.state = Constants.UIState.view;
        this.setEditable(false);
    }

    private initSelection(userId) {
        if (!userId) {
            return;
        }
        CommonUtils.showMask();

    }

    private clearSelection() {
        if (this.lstTree && this.lstTree.length > 0) {
            for (let tree of this.lstTree) {
                tree.getTree().getJsTree().deselect_all();
            }
        }
    }

    getPageDetail(): PageDetailDto {
        return this.properties;
    }

    getTableIds(): Array<number> {
        return [UserToResource.USER_DS_ID];
    }

    getUiDataNum(): number {
        return 1;
    }

    referenceSelectChanged(source: any, refId, id, isLeaf) {
    }

    setButtons(buttons: Array<MenuButtonDto>) {
        if (!buttons) {
            return;
        }
        let btns = ManagedUITools.findRelationButtons(buttons, UserToResource.USER_TO_RESOURCE_DS_ID);
        if (btns) {
            this.toolBar.addButtons(this.toButtonInfo(btns));
        }

    }

    protected componentButtonClicked(event: JQuery.ClickEvent<any, any, any, any>, menuBtnDto: MenuButtonDto, data) {
        if (menuBtnDto.tableOpertype == Constants.TableOperatorType.saveSingle
            || menuBtnDto.tableOpertype == Constants.TableOperatorType.saveMulti) {
            this.doSave();
        } else if (menuBtnDto.tableOpertype == Constants.TableOperatorType.edit) {
            this.doEdit()
        } else if (menuBtnDto.tableOpertype == Constants.TableOperatorType.cancel) {
            this.doCancel();
        }
    }

    private doCancel() {
        if (this.state === Constants.UIState.view) {
            return;
        }
        this.state = Constants.UIState.view;
        this.setEditable(false);
        if (this.userId) {
            this.signTrees(this.userId);
        }
    }

    private doEdit() {
        if (this.state === Constants.UIState.edit) {
            return;
        }
        if (!this.userId) {
            Alert.showMessage("请选择用户后修改");
            return;
        }
        this.state = Constants.UIState.edit;
        this.setEditable(true);
    }

    private doSave() {
        if (!this.userId) {
            Alert.showMessage("没有需要保存的变动");
            return;
        }
        let result = {};

        this.mapTree.forEach((key, tree, map) => {
            let selectIds = tree.getTree().getSelectedRealId(true);
            if (selectIds && selectIds.length > 0) {
                result[key] = selectIds;
            }
        });
        UserService.saveUserRight(this.userId, result, (result2) => {
            if (result2.success) {
                Alert.showMessage("保存成功!");
            } else {
                Alert.showMessage(result2.err);
            }
        });
    }

    setManageCenter(manageCenter: IManageCenter) {
        this.manageCenter = manageCenter;
    }

    stateChange(source: any, tableId, state: number, extendData?: any) {
    }

    protected createUI(): HTMLElement {
        return $("<div class='user-resource' style='width: 100%;height: 100%'></div>").get(0);
    }

    setEditable(editable: boolean) {
        if (this.lstTree) {
            for (let tree of this.lstTree) {
                tree.setEnable(editable);
            }
        }
    }

    protected initSubControllers() {
        this.toolBar = new Toolbar<any>({float: false});
        this.$element.append(this.toolBar.getViewUI());
        //TODO 查询表数据,并显示
        UiService.findTableRows(UserToResource.RESOURCE_DS_ID, {}, (result: HandleResult) => {
            this.initTree(<Array<any>>result.data);
        });
    }

    private initTree(lstData: Array<any>) {
        this.lstResource = lstData;
        if (!lstData) {
            this.ready = true;
            this.fireReadyEvent();
            return;
        }
        this.treeCount = lstData.length;
        for (let row of lstData) {
            let refTree = ReferenceTree.getTreeInstance(row.resource_id, GlobalParams.loginVersion, true);
            this.$element.append(refTree.getViewUI());
            refTree.reload();
            refTree.setWidth(300);
            refTree.setHeight(500);
            refTree.addReadyListener(() => {
                refTree.setEnable(this.properties.initState != Constants.UIState.view);
                this.readyCount++;
                if (this.readyCount === this.treeCount) {
                    this.ready = true;
                    this.fireReadyEvent();
                }
            });
            this.lstTree.push(refTree);
            this.mapTree.set(row['rs_id'], refTree);
        }
    }

    private signTrees(userId) {
        UserService.getUserRights(userId, (result: HandleResult) => {
            if (result.success) {
                let mapData = result.data;
                if (mapData) {
                    for (let rsId in mapData) {
                        this.mapTree.get(rsId).getTree().selectNodeById(this.getIdArray(mapData[rsId]));
                    }
                }
            }
        });
    }

    private getIdArray(lstData: Array<object>) {
        let result = new Array<any>();
        for (let row of lstData) {
            result.push(row["rs_detail_id"])
        }
        return result;
    }


    private signOneTree(tree: ReferenceTree<any>, ids: Array<any>) {
        tree.getTree().selectNodeById(ids);
    }

    getValue(): any {
    }

    setValue(value: any, extendData?) {
    }

    destroy(): boolean {
        this.lstTree = null;
        this.mapTree.clear();
        this.lstResource = null;
        this.toolBar.destroy();
        this.manageCenter = null;
        return super.destroy();
    }

}

