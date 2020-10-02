import BaseUI from "../../uidesign/view/BaseUI";
import "jstree/dist/themes/default/style.css";
import {BaseComponent} from "../../uidesign/view/BaseComponent";
import {CommonUtils} from "../../common/CommonUtils";
import {NetRequest} from "../../common/NetRequest";

export class JsTree<T extends JsTreeInfo> extends BaseComponent<T> {


    private jsTree: JSTree;

    private $jsTree: JQuery;

    private static ROOT_KEY = "#";

    private currentNode: any;

    private timeCount = 0;

    private isCounting = false;


    protected createUI(): HTMLElement {
        return $(require("../templete/JsTree.html")).get(0);
    }

    private treeProps = {
        "core": {
            "animation": 0,
            "check_callback": true,
            "themes": {"stripes": true},
            'checkbox': {
                "keep_selected_style": false
            }

        },
        "plugins": [
            "contextmenu", "dnd", "search",
            "state", "types"
        ]
    };

    getJsTree() {
        return this.jsTree;
    }

    public setShowCheck(canCheck) {
        if (this.properties.multiSelect) {
            canCheck ? this.jsTree.show_checkboxes() : this.jsTree.hide_checkboxes();
        }
    }

    afterComponentAssemble(): void {
        this.createTree();
        this.bindEvent();
    }

    private createTree() {
        if (this.properties.multiSelect) {
            this.treeProps.plugins.push("checkbox")
        }
        this.treeProps = $.extend(true, this.treeProps, this.properties);
        if (this.properties.url) {
            this.treeProps.core['data'] = (obj, callback) => {
                NetRequest.axios.get(this.properties.url).then((result) => {
                    if (result.status == 200) {
                        callback(this.makeTreeData(result.data));
                        return;
                    }
                    alert("Tree encounter error!")
                })
            }

        }
        this.$jsTree = this.$element.find(".tree-panel");
        this.$jsTree.jstree(this.treeProps);
        this.jsTree = this.$jsTree.jstree(true);
    }

    private bindEvent() {
        this.$jsTree.on("activate_node.jstree", (obj, e) => {
            // 获取当前节点
            this.currentNode = e.node;
        });
        if (!this.properties.showSearch) {
            this.$element.find(".search-input").addClass(JsTree.HIDDEN_CLASS);
        }
        this.$element.find(".search-input").on("keyup", (e) => {
                this.startCount($(e.target).val());
            }
        );
    }


    private startCount(value) {
        if (this.isCounting) {
            this.timeCount = 3;
            return;
        }
        this.isCounting = true;
        let int = setInterval(() => {
            this.timeCount--;
            if (this.timeCount < 0) {
                clearInterval(int);
                this.isCounting = false;
                console.log("searching ===>" + this.$element.find(".search-input").val());
                this.jsTree.search(this.$element.find(".search-input").val() as string);
            }
        }, 300);
    }

    getValue(): any {
        let oraData = this.jsTree.get_json(null, {flat: true});
        if (oraData) {
            let result = [];
            if (this.properties.rootName) {
                oraData = oraData.splice(0, 1);
            }
            for (let row of oraData) {
                result.push(row.data);
            }
            return result;
        }
        return oraData;
    }

    setEditable(editable: boolean) {
        this.setEnable(editable);
    }

    setEnable(enable: boolean) {
        let data = this.jsTree.get_json(null, {flat: true});
        if (enable) {
            for (let row of data) {
                let node = this.jsTree.get_node(row.id);
                this.jsTree.disable_node(node);
            }
        } else {
            for (let row of data) {
                let node = this.jsTree.get_node(row.id);
                this.jsTree.enable_node(node);
            }
        }
        this.jsTree.redraw(true);
    }


    /**
     * 设置树上数据
     * @param value
     * @param directset
     */
    setValue(value: any, directset = false) {

        this.jsTree.settings.core.data = directset
            ? value : this.makeTreeData(value);
        this.jsTree.refresh();
    }

    protected makeTreeData(data: Array<object>): Array<any> {
        if (!data) {
            return data;
        }
        if (this.properties.idField && this.properties.parentField) {
            return this.makeTreeDataById(data);
        } else {
            return this.makeTreeDataByCode(data);
        }

    }

    protected makeTreeDataByCode(data: Array<object>) {
        let result = new Array<Node>();
        let node: Node;
        let code;
        let rootId = JsTree.ROOT_KEY;
        this.properties.idField = this.properties.idField || Node.ID_FIELD;
        this.properties.codeField = this.properties.codeField || Node.CODE_FIELD;
        this.properties.textField = this.properties.textField || Node.TEXT_FIELD;
        if (this.properties.rootName) {
            let nodeRoot = new Node();
            rootId = CommonUtils.genUUID();
            nodeRoot.id = rootId;
            nodeRoot.parent = JsTree.ROOT_KEY;
            nodeRoot.text = this.properties.rootName;
            nodeRoot.data = null;
            result.push(nodeRoot);
        }
        for (let row of data) {
            node = new Node();
            code = row[this.properties.codeField];
            if (!code) {
                node.id = CommonUtils.genUUID();
                node.parent = rootId;
            } else {
                node.id = code;
                node.parent = code.length > 3 ? code.substr(0, code.length - 3) : rootId;
            }
            node.text = row[this.properties.textField];
            node.key = row[this.properties.idField];
            node.data = row;
            result.push(node);
        }
        return result;
    }

    getCurrentData() {
        if (this.currentNode) {
            this.currentNode.data;
        }
        return null;
    }

    protected makeTreeDataById(data: Array<any>) {
        let result = new Array<Node>();
        let node: Node;
        let code;
        let rootId = JsTree.ROOT_KEY;
        if (this.properties.rootName) {
            let nodeRoot = new Node();
            rootId = CommonUtils.genUUID();
            nodeRoot.id = rootId;
            nodeRoot.parent = JsTree.ROOT_KEY;
            nodeRoot.text = this.properties.rootName;
            nodeRoot.data = null;
            result.push(nodeRoot);
        }
        for (let row of data) {
            node = new Node();
            node.id = row[this.properties.idField];
            node.parent = row[this.properties.parentField] ? row[this.properties.parentField] : rootId;
            node.text = row[this.properties.textField];
            node.data = row;
            result.push(node);
        }
        return result;
    }

}

export class Node {
    static ID_FIELD = "id";//id 字段
    static TEXT_FIELD = "name";//  名称字段
    static PARENT_FIELD = "parent_id";//父字段
    static CODE_FIELD = "code";//编码,需有级次,并且 是3-3-3的结构
    id: string;
    text: string;
    parent: string;
    data: any;
    key: any;
}

export interface JsTreeInfo {

    textField: string;
    multiSelect?: boolean;
    rootName?: string;
    codeField?: string;
    idField?: string;
    showSearch?: boolean;
    url?: string,
    parentField?: string;
    lvl?: Array<number>;
}
