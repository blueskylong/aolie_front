import {StringMap} from "./StringMap";

export class TreeNode<T> {
    private _nodeId: string;
    private _text: string;
    private _data: T;
    private _parent: TreeNode<T>;
    private _children: Array<TreeNode<T>>;

    get nodeId(): string {
        return this._nodeId;
    }

    set nodeId(value: string) {
        this._nodeId = value;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    get parent(): TreeNode<T> {
        return this._parent;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    set parent(value: TreeNode<T>) {
        this._parent = value;
    }

    get children(): Array<TreeNode<T>> {
        return this._children;
    }

    set children(value: Array<TreeNode<T>>) {
        this._children = value;
    }

    constructor(nodeId: string, data: T, text?: string) {
        this._nodeId = nodeId;
        this._data = data;
        this.text = text;
    }

    public addChild(child: TreeNode<T>) {
        if (!this._children) {
            this._children = new Array<TreeNode<T>>();
        }
        child.parent = this;
        this._children.push(child);
    }
}

/**
 * 生成树节点的辅助工具
 */
export class TreeNodeFactory {
    static genTreeNode<T>(objs: Array<T>, ...codeField: string[]): Array<TreeNode<T>> {
        return this.sortNode(this.assembleNode(this.createNodes(objs, codeField)));
    }

    static genTreeNodeForTree<T>(objs: Array<T>, codeField = "lvlCode", textField = "text"): Array<TreeNode<T>> {
        return this.sortNode(this.assembleNode(this.createNodes(objs, [codeField], textField)));
    }

    /**
     * 生成所有节点
     * @param objs
     * @param codeField 可以使用多层字段,如
     */
    private static createNodes<T>(objs: Array<T>, codeField: string[], textField?): StringMap<TreeNode<T>> {
        if (!objs) {
            return null;
        }
        let result = new StringMap<TreeNode<T>>();
        let key, text;
        for (let obj of objs) {
            key = this.getValue(obj, codeField);
            text = textField ? obj[textField] : null;
            result.set(key, new TreeNode(key, obj, text));
        }
        return result;
    }

    private static getValue(obj: any, fields: string[]): string {
        let result = obj;
        for (let i = 0; i < fields.length; i++) {
            result = result[fields[i]];
        }
        return result as any;
    }

    /**
     * 生成树状结构
     * @param nodes
     */
    private static assembleNode<T>(nodes: StringMap<TreeNode<T>>) {
        if (!nodes || nodes.getSize() == 0) {
            return null;
        }
        let lstNode = new Array<TreeNode<T>>();
        let parentCode;
        let parentNode;
        nodes.forEach((key, value, map) => {
            if (key.length === 3) {//如果是三位则直接是第一层节点
                lstNode.push(value);
            } else {
                parentCode = key.substr(0, key.length - 3);
                parentNode = nodes.get(parentCode);
                if (parentNode) {
                    parentNode.addChild(value);
                } else {
                    lstNode.push(value);
                }

            }
        });
        return lstNode;
    }

    /**
     * 节点排序
     * @param nodes
     */
    private static sortNode<T>(nodes: Array<TreeNode<T>>) {
        if (!nodes) {
            return null;
        }
        nodes.sort((a, b) => {
            if (a.children) {
                this.sortNode(a.children);
            }
            return a.nodeId >= b.nodeId ? 1 : -1;
        });
        if (nodes.length > 1) {
            let lastNode = nodes[nodes.length - 1];
            if (lastNode.children) {
                this.sortNode(lastNode.children);
            }
        }
        return nodes;

    }
}
