import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {JsTree, JsTreeInfo} from "../blockui/JsTree/JsTree";
import "./templates/BlockDesign.css";
import {SelectDsDlg} from "./dialog/SelectDsDlg";
import {DesignUiService} from "./service/DesignUiService";
import {DesignPanel} from "./blockdv/DesignPanel";
import {Form} from "../blockui/Form";
import EventBus from "../dmdesign/view/EventBus";
import {MenuButton} from "../home/dto/MenuButton";
import {CommonUtils} from "../common/CommonUtils";
import {Alert} from "./view/JQueryComponent/Alert";
import {Dialog, DialogInfo} from "../blockui/Dialog";
import {GlobalParams} from "../common/GlobalParams";
import {BlockViewDto} from "./dto/BlockViewDto";
import {Constants} from "../common/Constants";
import {InputDlg} from "../blockui/dialogs/InputDlg";

@MenuFunc()
export default class BlockDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {
    private schemaId = 2;

    private selectDsDlg: SelectDsDlg;

    private dsTree: JsTree<JsTreeInfo>;
    //设计面板
    private designPanel: DesignPanel<any>;
    //控件属性面板
    private fColAttr: Form;
    //块属性面板
    private fBlock: Form;
    //最后选择的视图ID
    private lastBlockId = -1;

    //视图树
    private blockTree: JsTree<JsTreeInfo>;
    private selectedTable: Array<number>;
    private blockDlg: InputDlg;

    private confirmDlg: Dialog<DialogInfo>;

    protected createUI(): HTMLElement {
        this.selectDsDlg = new SelectDsDlg({
            title: "请选择数据表",
            height: 200,
            onOk: (items) => {
                this.selectedTable = items;
                if (items && items.length > 0) {
                    DesignUiService.findTablesAndFields(items, (data) => {
                        this.updateTree(data)
                    });
                }
                return true;
            }
        });
        this.blockDlg = new InputDlg({
            title: "增加视图",
            inputTitle: "社图名称",
            isCanEmpty: false,
            onOk: (items) => {
                this.addView(this.blockDlg.getValue());
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
            dnd: {
                isDraggable: true,
                onlyDroppable: true
            }
        });
        $ele.find(".ds-tree").append(this.dsTree.getViewUI());

        this.blockTree = new JsTree<JsTreeInfo>({
            rootName: "视图",
            textField: "blockViewName",
            idField: "blockViewId",
            codeField: "lvlCode",
            url: "/ui/getBlockViews/" + this.schemaId,
            dnd: {isDraggable: false},
            buttons: [{
                icon: "fa fa-trash",
                title: "删除",
                clickHandler: (event, data) => {
                    this.doDelete(data);
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

    private addView(viewName) {
        if (CommonUtils.isEmpty(viewName)) {
            return;
        }
        let parentId = "null";
        let node = this.dsTree.getSelectData(true);
        if (node && node.data) {
            parentId = node.data.lvlCode;
        }
        DesignUiService.genNewBlockViewer(viewName, this.schemaId, parentId, (newId) => {
            this.blockTree.getJsTree().refresh(false, true);
            CommonUtils.readyDo(() => {
                return this.blockTree.isReady()
            }, () => {
                this.blockTree.selectNodeById(newId);
            })

        });

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
            this.selectDsDlg.show(this.selectedTable);
        });


        this.blockTree.addSelectListener({
            handleEvent: (type, data) => {
                if (data) {
                    if (this.lastBlockId == data['blockViewId']) {
                        return;
                    }
                    this.lastBlockId = data['blockViewId'];
                    this.fBlock.setValue(data);
                    this.designPanel.showBlock(this.lastBlockId, data['versionCode']);
                    CommonUtils.readyDo(() => {
                        return this.designPanel.isReady();
                    }, () => {
                        this.selectedTable = this.designPanel.getRelationDs();

                        if (this.selectedTable && this.selectedTable.length > 0) {

                            DesignUiService.findTablesAndFields(this.selectedTable, (data) => {
                                this.updateTree(data)
                            })
                        }
                    });
                }
            }
        });
        this.designPanel.setSelectListener(this);
        this.fBlock.addValueChangeListener({
            handleEvent: (eventType: string, field: any, value: any, extObject?: any) => {
                if (field == "defaultShowType") {
                    if (value == Constants.DispType.table) {
                        this.designPanel.showAsTable();
                    } else {
                        this.designPanel.showAsForm();
                    }
                }
            }
        });
        this.fColAttr.addValueChangeListener(this);
    }

    handleEvent(eventType: string, data: object, value: object) {
        if (eventType === EventBus.SELECT_CHANGE_EVENT) {
            this.fColAttr.setValue(data);
        } else if (eventType === EventBus.VALUE_CHANGE_EVENT) {
            //如果变化不成功,则要恢复
            if (!this.designPanel.valueChanged(data, value)) {
                this.fColAttr.setValue(this.designPanel.getCurrentData());
            }
        }
    }

    doSave() {
        this.designPanel.doSave(this.fBlock.getValueForObject(BlockViewDto), () => {
            this.refresh();
        });
    }

    doAdd() {
        this.blockDlg.show();
    }

    refresh() {
        let viewId = this.blockTree.getCurrentData().blockViewId;
        this.blockTree.getJsTree().refresh();
        this.blockTree.selectNodeById(viewId);
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


    destroy(): boolean {
        this.designPanel.destroy();
        this.dsTree.destroy();
        this.blockTree.destroy();
        return super.destroy();
    }

    doDelete(data?) {
        let node;
        node = data ? data : this.blockTree.getCurrentNode();
        if (data) {
            node = data;
        }
        if (!node) {
            Alert.showMessage({message: "请选择要删除的视图"});
            return;
        }
        if (node.children && node.children.length > 0) {
            Alert.showMessage({message: "此视图下已存在子节点,请先删除!"});
            return;
        }


        this.confirmDlg = new Dialog<DialogInfo>({
            title: "确认",
            content: "确定删除此视图吗?",
            onOk: (items) => {
                DesignUiService.deleteBlockView(node.data.blockViewId, (data) => {
                    Alert.showMessage({message: "删除成功!"});
                    this.blockTree.getJsTree().refresh(false, true);
                    this.clearAttrShow();
                });
                return true;
            }
        });
        this.confirmDlg.show();


    }

    private clearAttrShow() {
        this.designPanel.showBlock(null, GlobalParams.loginVersion);
        this.fBlock.setValue({});
        this.fColAttr.setValue({});
    }
}

