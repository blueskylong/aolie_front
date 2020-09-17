import SchemaView from "./view/SchemaView";
import "./template/css/dmdesign.css";
import "split-pane/split-pane.css";
import "split-pane";
import TapPanel from "./view/TapPanel";
import SchemaDto from "../datamodel/dto/SchemaDto";
import {Form} from "../blockui/Form";
import {BlockViewDto} from "../uidesign/dto/BlockViewDto";
import ColumnView from "./view/ColumnView";
import EventBus from "./view/EventBus";
import {Table} from "../blockui/table/Table";
import {TableDemo} from "./view/TableDemo";
import {ServerRenderProvider} from "../blockui/table/TableRenderProvider";

export default class DmDesign {
    private ID_SCHEMA = "schema-component";
    private ID_TAP = "tap-component";
    private ID_ATTR = "attr-component";
    private schemaView: SchemaView;
    private tapPanel: TapPanel;
    private parent: HTMLElement;

    private fAttr: Form;
    private fSchema: Form;
    private fTable: Form;
    private fFormula: Form;
    private fConstraint: Form;

    /**
     * 当前的编辑状态
     */
    private editable = false;


    public start(parent: HTMLElement) {
        this.parent = parent;
        $(() => {
            $(parent).append(this.getUI());
            $(".split-pane")['splitPane']();
            this.addSchemaUI();
            this.addTabInfoUI();
            this.addAttrUI();
        });
    }

    private getUI() {
        return $(require("./template/DmDesign.html"));
    }

    /**
     * 生成
     */
    private addSchemaUI() {
        let schemaDto =new SchemaDto();
        schemaDto.schemaId =2;
        schemaDto.schemaName="业务方案";
        this.schemaView = new SchemaView(schemaDto);
        $("#" + this.ID_SCHEMA).append(this.schemaView.getViewUI());
        $(".split-pane").on("mousemove",
            (e) => {
                this.schemaView.resize(e);
            });
        this.schemaView.afterComponentAssemble();
        this.schemaView.setItemSelectListener((type, dto) => {
            //这里要先把最后的变化生效
            if (type === SchemaView.TYPE_TABLE) {
                this.fTable.setValue(dto);
            } else {
                this.fAttr.setValue(dto);
                //如果选择了
                let tableView = this.schemaView.findTableById(dto.tableId);
                this.fTable.setValue(tableView.getDtoInfo());
            }
        });
    }

    /**
     * 生成下方的属性界面
     */
    private addTabInfoUI() {
        this.tapPanel = new TapPanel(null);
        $("#" + this.ID_TAP).append(this.tapPanel.getViewUI());
        //增加各各面板
        let dto = new BlockViewDto();
        dto.blockViewId = 25;
        this.fSchema = new Form(dto);
        let thas = this;
        this.fSchema.addValueChangeListener({
            handleEvent(eventType: string, fieldName: object, value: object) {
                thas.schemaView.attrChanged(fieldName as any, value);
            }
        });
        this.tapPanel.addTap("方案信息", this.fSchema.getViewUI());


        dto = new BlockViewDto();
        dto.blockViewId = 30;
        this.fTable = new Form(dto);
        this.fTable.addValueChangeListener({
            handleEvent(eventType: string, fieldName: object, value: object, form: Form) {
                thas.schemaView.tableAttrChange(form.getValue().get("tableId") as any
                    , fieldName as any, value);
            }
        });
        this.tapPanel.addTap("表属性", this.fTable.getViewUI());

        dto = new BlockViewDto();
        dto.blockViewId = 35;
        this.fFormula = new Form(dto);
        this.tapPanel.addTap("列公式", this.fFormula.getViewUI());

        dto = new BlockViewDto();
        dto.blockViewId = 40;
        this.fConstraint = new Form(dto);
        this.tapPanel.addTap("约束", this.fConstraint.getViewUI());

        let table = new TableDemo(new ServerRenderProvider(30));

        this.tapPanel.addTap("表格", table.getViewUI());
        table.showTable();
        table.doTest();


        this.tapPanel.setActiveTap(0);


    }


    public setEditable(editable) {
        this.fFormula.setEditable(editable);
        this.fConstraint.setEditable(editable);
        this.fFormula.setEditable(editable);
        this.fTable.setEditable(editable);
        this.fAttr.setEditable(editable);
    }

    /**
     * 生成右边的属性事件
     */
    private addAttrUI() {
        let dto = new BlockViewDto();
        dto.blockViewId = 20;
        this.fAttr = new Form(dto);
        $("#" + this.ID_ATTR).append(this.fAttr.getViewUI());
        this.fAttr.afterComponentAssemble();
        let thas = this;
        this.fAttr.addValueChangeListener({
            handleEvent(eventType: string, fieldName: object, value: object, form: Form) {
                thas.schemaView.columnAttrChanged(form.getValue().get("columnId") as any, fieldName as any, value);
            }
        });

    }


}

