import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {JsTree} from "../../blockui/JsTree/JsTree";
import {Toolbar} from "../../uidesign/view/JQueryComponent/Toolbar";
import {UserRightService} from "./service/UserRightService";
import {DmConstants} from "../../datamodel/DmConstants";
import {StringMap} from "../../common/StringMap";
import "./templates/rigth.css";
import {CommonUtils} from "../../common/CommonUtils";

export class MenuAndButton<T> extends BaseComponent<T> {


    private menuButtonTree: JsTree<any>;

    protected createUI(): HTMLElement {
        return $(require("./templates/MenuAndButton.html")).get(0);
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
            if (node.data["type"] == 1) {
                lstMenuId.push(node.data["id"]);
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
     * 这里转换成设置角色
     * @param value
     * @param extendData
     */
    setValue(value: any, extendData?) {
        this.menuButtonTree.getJsTree().deselect_all();
        if (value) {
            UserRightService.findRsDetail(DmConstants.DefaultRsIds.role,
                DmConstants.DefaultRsIds.menuButton, value, (resultButton) => {

                    UserRightService.findRsDetail(DmConstants.DefaultRsIds.role,
                        DmConstants.DefaultRsIds.menu, value, (resultMenu) => {
                            this.signTree(resultButton.data as any, resultMenu.data as any);
                        });
                });

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
        let lstData = this.menuButtonTree.getJsTree().get_json(null, {flat: true});
        for (let node of lstData) {
            if (!this.menuButtonTree.getJsTree().is_leaf(node)) {
                continue;
            }
            if (node.data["type"] == 1 && mapMenuId.has(node.data["id"])) {
                this.menuButtonTree.selectNode(node);
            } else if (node.data["type"] == 2 && mapBtnId.has(node.data["id"])) {
                this.menuButtonTree.selectNode(node);
            }

        }

    }


    protected initSubControllers() {

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
