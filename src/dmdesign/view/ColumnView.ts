import DmDesignBaseView from "./DmDesignBaseView";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {AttrChangeListener} from "./AttrChangeListener";
import FormulaView from "./FormulaView";
import {Component} from "../../blockui/uiruntime/Component";


export default class ColumnView extends DmDesignBaseView<ColumnDto> implements AttrChangeListener {

    private static isAddedContextMenu = false;
    private static ATTR_KEY = "K";
    private static ATTR_HAS_REF = "R";
    private static ATTR_HAS_FORMULA = "F";

    private _lstFormula: Array<FormulaView> = new Array<FormulaView>();

    constructor(dto: ColumnDto, formulas?: Array<FormulaView>) {
        super(dto);
        this.lstFormula = formulas;
    }

    public getId() {
        return "C"
            + this.properties.tableId + "_" + this.properties.columnId;
    }

    afterComponentAssemble(): void {

        setTimeout(() => {
            ColumnView.JSPLUMB.makeSource(this.element, ColumnView.SOURCE_PARAM);
            ColumnView.JSPLUMB.makeTarget(this.element, ColumnView.TARGET_PARAM);
            if (!ColumnView.isAddedContextMenu) {
                $.contextMenu({
                    selector: '.column-body',
                    callback: function (key, options) {
                        let m = "clicked: " + key;
                        alert(m);
                    },
                    items: {
                        "delete": {name: "删除行", icon: "delete"},
                        "add": {name: "增加行", icon: "add"}

                    }
                });
                ColumnView.isAddedContextMenu = true;
            }
        }, 200)

    }

    createUI(): HTMLElement {
        let element = $(require("../template/ColumnView.html"));
        let id = this.getId();
        element.attr("id", id);
        element.attr("data-id", id);

        this.updateTitle(element);
        this.updateBadge(element);
        return element.get(0);
    }

    protected needPreventDefaultClick() {
        return false;
    }

    protected needHandleSelectEvent() {
        return true;
    }

    get lstFormula(): Array<FormulaView> {
        return this._lstFormula;
    }

    set lstFormula(value: Array<FormulaView>) {
        this._lstFormula = value;
    }

    private updateBadge($element) {
        let str = "";
        if (this.properties.refId) {
            str += ColumnView.ATTR_HAS_REF;
        }
        $element.find(".column-badge-left").text(str);
        str = "";
        if (this.properties.isKey) {
            str = ColumnView.ATTR_KEY;
        }
        $element.find(".column-badge-right").text(str);
    }

    attrChanged(attrName: string, value: any) {
        //再赋值
        this.properties[attrName] = value;
        //先处理影响显示的属性 如主键,不可以为空 有引用等,都可以用图标显示出来
        if (attrName === "title" || attrName == "fieldName") {
            this.updateTitle(this.$element);
        }
        if (attrName === "refId" || attrName === "fieldType" || attrName === "isKey") {
            this.updateBadge(this.$element);
        }
    }

    /**
     * 更新标题
     * @param $elemet
     */
    private updateTitle($elemet: JQuery) {
        $elemet.find(".column-title")
            .text("(" + (this.properties.fieldName ? this.properties.fieldName : "无") + ")" + this.properties.title);
    }

}
