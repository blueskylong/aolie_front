import "./template/PageDesign.css"
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {MenuFunc} from "../decorator/decorator";
import {JsTree, JsTreeInfo} from "../blockui/JsTree/JsTree";
import {Constants} from "../common/Constants";
import {BorderLayout, BorderLayoutProperty} from "../blockui/layout/BorderLayout";
import {Form} from "../blockui/Form";
import {BorderDesignPanel} from "./widget/BorderDesignPanel";

@MenuFunc()
export default class PageDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {

    private pageTree: JsTree<JsTreeInfo>;
    private blockTree: JsTree<JsTreeInfo>;
    private splitCenter: BorderLayout<any>;
    private fPage: Form;
    private fAttr: Form;
    private designPanel: BorderDesignPanel;

    protected createUI(): HTMLElement {
        return $(require("./template/PageDesign.html")).get(0);
    }

    protected initSubControllers() {
        this.pageTree = new JsTree<JsTreeInfo>({
            textField: "pageName",
            idField: "pageId",
            codeField: "lvlCode",
            rootName: "页面信息",
            url: "/page/findPageInfos/" + Constants.DEFAULT_SCHEMA_ID
        });

        this.blockTree = new JsTree<JsTreeInfo>({
            rootName: "视图",
            textField: "blockViewName",
            idField: "blockViewId",
            codeField: "lvlCode",
            url: "/ui/getBlockViews/" + Constants.DEFAULT_SCHEMA_ID,
            dnd: {isDraggable: true, onlyDroppable: true}
        });

        let layoutAttr = new BorderLayoutProperty();
        layoutAttr.centerHeight = 0.7;
        layoutAttr.centerWidth = 0.8;
        this.splitCenter = new BorderLayout<any>(layoutAttr);
        this.fAttr = Form.getInstance(85);
        this.fPage = Form.getInstance(80);
        this.designPanel = new BorderDesignPanel(BorderLayoutProperty.genDefaultFullProperty());
    }

    afterComponentAssemble(): void {
        this.$element.find(".split-pane")['splitPane']();
        super.afterComponentAssemble();
        this.$element.find(".page-tree").append(this.pageTree.getViewUI());
        this.pageTree.afterComponentAssemble();
        this.$element.find(".block-tree").append(this.blockTree.getViewUI());
        this.blockTree.afterComponentAssemble();

        this.$element.find(".center-panel").append(this.splitCenter.getViewUI());
        this.splitCenter.addComponent(BorderLayout.center, this.designPanel);
        this.splitCenter.addComponent(BorderLayout.south, this.fPage);
        this.splitCenter.addComponent(BorderLayout.east, this.fAttr);
        this.splitCenter.afterComponentAssemble();
    }
}
