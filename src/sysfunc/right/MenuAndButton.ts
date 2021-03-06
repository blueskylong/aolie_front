import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {JsTree} from "../../blockui/JsTree/JsTree";
import {Toolbar} from "../../uidesign/view/JQueryComponent/Toolbar";
import {UserRightService} from "./service/UserRightService";
import {DmConstants} from "../../datamodel/DmConstants";
import {StringMap} from "../../common/StringMap";
import "./templates/rigth.css";
import {CommonUtils} from "../../common/CommonUtils";

export class MenuAndButton<T> extends BaseComponent<T> {
    //节点类型--菜单
    public static TYPE_MENU = 1;
    //节点类型--按钮
    public static TYPE_BUTTON = 2;


    private menuButtonTree: JsTree<any>;

    protected createUI(): HTMLElement {
        return $(require("./templates/MenuAndButton.html")).get(0);
    }

    clearSelection() {
        this.menuButtonTree.getJsTree().deselect_all();
    }

    /**
     * 转换成取得选择项
     */
    getValue(): any {
        let lstMenuId = [], lstButton = [];
        let lstSelectData = this.menuButtonTree.getAllSelectFullData();
        if (!lstSelectData || lstSelectData.length < 1) {
            let result = {};
            result[DmConstants.DefaultRsIds.menu] = [];
            result[DmConstants.DefaultRsIds.menuButton] = [];
            return result;
        }
        for (let node of lstSelectData) {
            //如果是菜单
            if (node.data["type"] == MenuAndButton.TYPE_MENU) {
                lstMenuId.push(node.data["realid"]);
            } else {
                lstButton.push(node.data["id"]);
            }
        }
        let result = {};
        result[DmConstants.DefaultRsIds.menu] = lstMenuId;
        result[DmConstants.DefaultRsIds.menuButton] = lstButton;
        return result;

    }


    /**
     * 选择的角色发生变化,查询角色对应权限
     * @param roleId
     */
    setRole(roleId: number) {
        this.menuButtonTree.getJsTree().deselect_all();
        if (roleId) {
            UserRightService.findRsDetail(DmConstants.DefaultRsIds.role,
                DmConstants.DefaultRsIds.menuButton, roleId, (resultButton) => {

                    UserRightService.findRsDetail(DmConstants.DefaultRsIds.role,
                        DmConstants.DefaultRsIds.menu, roleId, (resultMenu) => {
                            this.signTree(resultButton.data as any, resultMenu.data as any);
                        });
                });

        }
    }

    /**
     * 给定按钮和菜单ID,执行选择操作
     * @param mapBtnIds
     * @param mapMenuIds
     */
    signTreeById(mapBtnIds: StringMap<any>, mapMenuIds: StringMap<any>) {
        if (mapBtnIds == null) {
            mapBtnIds = new StringMap<any>();
        }
        if (mapMenuIds == null) {
            mapMenuIds = new StringMap<any>();
        }
        this.menuButtonTree.getJsTree().deselect_all();
        let lstData = this.menuButtonTree.getJsTree().get_json(null, {flat: true});
        for (let node of lstData) {
            if (!this.menuButtonTree.getJsTree().is_leaf(node)) {
                continue;
            }
            //如果选择的是菜单
            if (node.data["type"] == MenuAndButton.TYPE_MENU && mapMenuIds.has(node.data["realid"])) {
                this.menuButtonTree.selectNode(node);
            } else if (node.data["type"] == MenuAndButton.TYPE_BUTTON && mapBtnIds.has(node.data["id"])) {
                //如果选择的是按钮
                this.menuButtonTree.selectNode(node);
            }

        }
    }

    private signTree(lstButton: Array<Object>, lstMenu: Array<Object>) {
        if ((!lstButton || lstButton.length < 1) && (!lstMenu || lstMenu.length < 1)) {
            return;
        }
        let mapBtnId = new StringMap();
        if (lstButton) {
            for (let row of lstButton) {
                mapBtnId.set(row["idTarget"], null);
            }
        }
        let mapMenuId = new StringMap();
        if (lstMenu) {
            for (let row of lstMenu) {
                mapMenuId.set(row["idTarget"], null);
            }
        }
        this.signTreeById(mapBtnId, mapMenuId);

    }


    protected initSubControls() {

        let treeInfo = {
            textField: "name",
            multiSelect: true,
            rootName: "菜单操作授权",
            codeField: "code",
            idField: "id",
            url: "/user/findMenuAndButton",
            loadOnReady: true,
            showSearch: true
        };
        this.menuButtonTree = new JsTree(treeInfo);
        this.$element.append(this.menuButtonTree.getViewUI());
        this.menuButtonTree.addReadyListener(() => {
            this.fireReadyEvent();
        });
    }

    setEditable(editable: boolean) {
        this.menuButtonTree.setEnable(editable);
    }

    afterComponentAssemble(): void {
        this.setWidth(340);
        this.setHeight(500);
    }

}
