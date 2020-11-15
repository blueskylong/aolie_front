import SchemaView from "./view/SchemaView";
import "./template/css/dmdesign.css";
import "split-pane/split-pane.css";
import "split-pane";
import TapPanel from "./view/TapPanel";
import SchemaDto from "../datamodel/dto/SchemaDto";
import {Form} from "../blockui/Form";
import {BlockViewDto} from "../uidesign/dto/BlockViewDto";
import {TableDemo} from "./view/TableDemo";
import {ServerRenderProvider} from "../blockui/table/TableRenderProvider";
import {CardList} from "../blockui/cardlist/CardList";
import {Column} from "../datamodel/DmRuntime/Column";
import {Formula} from "../blockui/uiruntime/Formula";
import {Constraint} from "../datamodel/DmRuntime/Constraint";
import TableDto from "../datamodel/dto/TableDto";
import {MenuFunc} from "../decorator/decorator";
import {MenuFunction, MenuFunctionInfo} from "../blockui/MenuFunction";
import {CommonUtils} from "../common/CommonUtils";
import {JsTree, JsTreeInfo} from "../blockui/JsTree/JsTree";
import {SchemaMainInfo} from "./view/SchemaMainInfo";
import {BorderLayoutProperty} from "../blockui/layout/BorderLayout";

@MenuFunc()
export default class DmDesign<T extends MenuFunctionInfo> extends MenuFunction<T> {
    private ID_SCHEMA = "schema-component";
    private ID_TAP = "tap-component";
    private ID_ATTR = "attr-component";
    private schemaView: SchemaView;
    private tapPanel: TapPanel;
    private fAttr: Form;
    private schemaInfo: SchemaMainInfo;
    private fReference: Form;
    private fTable: Form;
    private listFormula: CardList<BlockViewDto>;
    private listConstraint: CardList<BlockViewDto>;
    private schemaDto: SchemaDto;

    /**
     * 当前的编辑状态
     */
    private editable = false;


    public createUI() {
        let $ele = this.getUI();
        return $ele.get(0);
    }

    /**
     * 当视图被装配后的处理
     */
    public afterComponentAssemble(): void {
        this.$element.find(".split-pane")['splitPane']();

        this.addTabInfoUI(this.$element);
        this.addAttrUI(this.$element);
        this.addSchemaUI(this.$element);

    };

    private getUI() {
        return $(require("./template/DmDesign.html"));
    }

    /**
     * 生成
     */
    private addSchemaUI($parent: JQuery) {
        this.schemaView = new SchemaView(null);
        this.schemaView.setDataReadyListener(() => {
            this.updateItemData();
        });
        this.schemaView.setRefreshEvent({
            handleEvent: (type, schemaId) => {
                this.schemaInfo.refresh(schemaId);

            }
        });
        this.schemaDto = this.schemaView.getDtoInfo();
        $parent.find("#" + this.ID_SCHEMA).append(this.schemaView.getViewUI());
        $parent.find(".split-pane").on("mousemove",
            (e) => {
                this.schemaView.resize(e);
            });
        this.schemaView.afterComponentAssemble();
        this.schemaView.setItemSelectListener((type, dto) => {
            //这里要先把最后的变化生效
            if (dto instanceof TableDto) {
                this.fTable.setValue(dto);
                this.updateConstraint(dto);
            } else {
                this.fAttr.setValue((<Column>dto).getColumnDto());
                //如果选择了
                let tableView = this.schemaView.findTableById((<Column>dto).getColumnDto().tableId);

                this.fTable.setValue(tableView.getDtoInfo());
                this.listFormula.setValue((<Column>dto).getLstFormulaDto());
            }
        });
        CommonUtils.readyDo(() => {
            return this.schemaView.isReady();
        }, () => {
            this.ready = true;
        })

    }

    private updateItemData() {
        this.updateConstraint();
        this.fAttr.setValue({});
        this.fReference.setValue({});
        this.fTable.setValue({});
        this.listFormula.setValue(null);
    }

    updateConstraint(dto?: TableDto) {
        //TODO 根据选择的信息显示相应的约束
        if (!dto) {
            this.listConstraint.setValue(this.schemaView.getConstraintDtos());
        }
    }

    private showSchema(schemaDto: SchemaDto) {
        this.schemaView.refresh(schemaDto);
    }

    /**
     * 生成下方的属性界面
     */
    private addTabInfoUI($parent: JQuery) {
        this.tapPanel = new TapPanel(null);
        $parent.find("#" + this.ID_TAP).append(this.tapPanel.getViewUI());
        //增加各各面板

        this.schemaInfo = new SchemaMainInfo(BorderLayoutProperty.genDefaultFullProperty());
        this.schemaInfo.setSelectChangeListener({
            handleEvent: (eventType: string, schemaDto: any, other: object) => {
                this.showSchema(schemaDto);

                if (schemaDto.schemaId == 0) {
                    this.tapPanel.showTap(4);
                } else {
                    this.tapPanel.hideTap(4);
                }
            }
        });

        this.schemaInfo.setValueChangeListener({
            handleEvent: (eventType: string, field: any,
                          value: object, extObject?: any) => {
                this.schemaView.attrChanged(field, value);
            }
        });
        this.tapPanel.addTap("方案信息", this.schemaInfo.getViewUI());
        this.schemaInfo.afterComponentAssemble();


        this.fTable = Form.getInstance(30);
        this.fTable.addValueChangeListener({
            handleEvent: (eventType: string, fieldName: object, value: object, form: Form) => {
                this.schemaView.tableAttrChange(form.getValue().get("tableId") as any
                    , fieldName as any, value);
            }
        });
        this.tapPanel.addTap("表属性", this.fTable.getViewUI());

        this.listFormula = CardList.getInstance(35);
        this.tapPanel.addTap("列公式", this.listFormula.getViewUI());
        this.listFormula.setEditable(true);
        this.listFormula.setDefaultValueProvider(() => {
            return Formula.genNewFormula(this.schemaDto.schemaId, this.schemaDto.versionCode, null);
        });

        this.listConstraint = CardList.getInstance(40);
        this.tapPanel.addTap("约束", this.listConstraint.getViewUI());
        this.listConstraint.setEditable(true);
        this.listConstraint.setDefaultValueProvider(() => {
            return Constraint.genConstraintDto(this.schemaDto.schemaId, this.schemaDto.versionCode);
        });

        this.fReference = Form.getInstance(90);
        this.tapPanel.addTap("引用信息", this.fReference.getViewUI());

        let table = new TableDemo(new ServerRenderProvider(30));

        this.tapPanel.addTap("表格", table.getViewUI());
        table.showTable();
        table.doTest();
        this.tapPanel.setActiveTap(0);
    }


    public setEditable(editable) {
        this.schemaInfo.setEditable(editable);
        this.listConstraint.setEditable(editable);
        this.listFormula.setEditable(editable);
        this.fTable.setEditable(editable);
        this.fAttr.setEditable(editable);
        this.fReference.setEditable(editable);
    }

    /**
     * 生成右边的属性事件
     */
    private addAttrUI($parent: JQuery) {
        this.fAttr = Form.getInstance(20);
        $parent.find("#" + this.ID_ATTR).append(this.fAttr.getViewUI());
        this.fAttr.afterComponentAssemble();
        let thas = this;
        this.fAttr.addValueChangeListener({
            handleEvent(eventType: string, fieldName: object, value: object, form: Form) {
                thas.schemaView.columnAttrChanged(form.getValue().get("columnId") as any, fieldName as any, value);
            }
        });
    }

    /**
     * 自己被删除前
     */
    public destroy(): boolean {
        super.destroy();
        this.schemaView.destroy();
        this.fTable.destroy();
        this.fAttr.destroy();
        this.schemaInfo.destroy();
        this.fReference.destroy();
        this.listFormula.destroy();
        this.listConstraint.destroy();
        this.schemaView = null;
        this.fTable = null;
        this.fAttr = null;
        this.fReference = null;
        this.schemaInfo = null;
        this.listFormula = null;
        this.listConstraint = null;


        return true;
    }
}

