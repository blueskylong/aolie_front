import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {JsTree, JsTreeInfo} from "../blockui/JsTree/JsTree";
import "./templates/BlockDesign.css";
import {SelectDsDlg} from "./dialog/SelectDsDlg";
import {UiService} from "./service/UiService";
import {DesignPanel} from "./blockdv/DesignPanel";
import {Form} from "../blockui/Form";
import {BlockViewDto} from "./dto/BlockViewDto";
import {CommonUtils} from "../common/CommonUtils";
import {GlobalParams} from "../common/GlobalParams";
import EventBus from "../dmdesign/view/EventBus";
import {MenuButton} from "../home/dto/MenuButton";

@MenuFunc()
export class BlockDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {

    private selectDsDlg: SelectDsDlg;

    private dsTree: JsTree<JsTreeInfo>;

    private designPanel: DesignPanel<any>;

    private fColAttr: Form;
    private fBlock: Form;

    private blockTree: JsTree<JsTreeInfo>;


    protected createUI(): HTMLElement {
        this.selectDsDlg = new SelectDsDlg({
            title: "请选择数据表",
            height: 200,
            onOk: (items) => {

                if (items && items.length > 0) {

                    UiService.findTablesAndFields(items, (data) => {
                        this.updateTree(data)
                    })
                }
                return true;
            }
        });
        let $ele = $(require("./templates/BlockDesign.html"));

        this.dsTree = new JsTree<any>({
            rootName: "数据源",
            multiSelect: false,
            textField: "name",
            idField: "id",
            parentField: "parent",
            showSearch: true,
            "dnd": {is_draggable: true}
        });
        $ele.find(".ds-tree").append(this.dsTree.getViewUI());

        this.blockTree = new JsTree<any>({
            rootName: "视图",
            textField: "blockViewName",
            idField: "blockViewId",
            codeField: "blockCode",
            url: "/ui/getBlockViews/2",
            buttons: [{
                icon: "fa fa-plus-square",
                title: "增加",
                clickHandler: (event, data) => {
                    alert("add");
                }
            }, {
                icon: "fa fa-trash",
                title: "删除",
                clickHandler: (event, data) => {
                    alert("delete");
                }
            }]

        });
        $ele.find(".block-tree").append(this.blockTree.getViewUI());

        this.designPanel = new DesignPanel<any>({});
        $ele.find(".design-form").append(this.designPanel.getViewUI());

        this.fBlock = Form.getInstance(50);
        $ele.find(".form-attr").append(this.fBlock.getViewUI());

        this.fColAttr = Form.getInstance(55);
        $ele.find(".col-attr").append(this.fColAttr.getViewUI());
        return $ele.get(0);
    }

    private updateTree(data) {
        this.dsTree.setValue(data);

    }

    afterComponentAssemble(): void {
        this.bindEvent();
        this.dsTree.afterComponentAssemble();
        this.blockTree.afterComponentAssemble();
        this.designPanel.afterComponentAssemble();
        this.fBlock.afterComponentAssemble();
        this.fColAttr.afterComponentAssemble();
        this.ready = true;
    }

    private bindEvent() {
        this.$element.find(".split-pane")['splitPane']();
        this.$element.find(".btnSelectDs").on("click", (e) => {
            this.selectDsDlg.show();
        });

        this.blockTree.addSelectListener({
            handleEvent: (type, data) => {
                if (data) {
                    this.fBlock.setValue(data);
                    this.designPanel.showBlock(data['blockViewId'], data['versionCode']);
                }
            }
        });
        this.designPanel.setSelectListener(this);

        this.fColAttr.addValueChangeListener(this);
    }

    handleEvent(eventType: string, data: object, value: object) {
        if (eventType === EventBus.SELECT_CHANGE_EVENT) {
            this.fColAttr.setValue(data);
        } else if (eventType === EventBus.VALUE_CHANGE_EVENT) {
            this.designPanel.valueChanged(data, value);
        }
    }

    doSave() {
        this.designPanel.doSave(() => {
            this.refresh();
        });
    }

    refresh() {

    }

    beforeClose(): boolean {
        return true;
    }

    getButton(): Array<MenuButton> {
        let addButton = new MenuButton();
        addButton.action = "doAdd";
        addButton.title = "增加";
        addButton.icon = "fa fa-plus-circle";
        let saveButton = new MenuButton();
        saveButton.action = "doSave";
        saveButton.title = "保存";
        saveButton.icon = "fa fa-floppy-o";
        let deleteButton = new MenuButton();
        deleteButton.action = "doDelete";
        deleteButton.title = "删除";
        deleteButton.icon = "fa fa-trash";

        return [addButton, saveButton, deleteButton];
    }

}

