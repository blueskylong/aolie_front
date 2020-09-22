import DmDesignBaseView from "./DmDesignBaseView";
import {ColumnDto} from "../../datamodel/dto/ColumnDto";
import {AttrChangeListener} from "./AttrChangeListener";
import FormulaView from "./FormulaView";
import {Component} from "../../blockui/uiruntime/Component";
import {Column} from "../../datamodel/DmRuntime/Column";
import {CommonUtils} from "../../common/CommonUtils";
import EventBus from "./EventBus";


export default class ColumnView extends DmDesignBaseView<Column> implements AttrChangeListener {

    private static isAddedContextMenu = false;
    private static ATTR_KEY = "K";
    private static ATTR_HAS_REF = "R";
    private static ATTR_HAS_FORMULA = "F";

    private static UN_VISIBLE_CLASS = "un-visible";

    private static HIDDEN_CLASS = "hidden";

    private _lstFormula: Array<FormulaView> = new Array<FormulaView>();

    public getId() {
        return CommonUtils.genElementId(this.properties.getColumnDto().tableId,
            this.properties.getColumnDto().columnId);
    }


    afterComponentAssemble(): void {

        setTimeout(() => {
            ColumnView.JSPLUMB.makeSource(this.element, ColumnView.SOURCE_PARAM);
            ColumnView.JSPLUMB.makeTarget(this.element, ColumnView.TARGET_PARAM);
            if (!ColumnView.isAddedContextMenu) {
                $.contextMenu({
                    selector: '.column-body',
                    callback: (key, options) => {
                        if (key === "add") {
                            EventBus.fireEvent(EventBus.ADD_COLUMN, {tableId: this.properties.getColumnDto().tableId}, null);
                        }
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
        if (this.properties.getColumnDto().refId) {
            $element.find(".column-badge-right .fa-retweet").removeClass(ColumnView.UN_VISIBLE_CLASS);
        } else {
            $element.find(".column-badge-right .fa-retweet").addClass(ColumnView.UN_VISIBLE_CLASS);
        }
        $element.find(".column-badge-right .col-type").text(this.getTypeShortName(this.properties.getColumnDto().fieldType));

        if (this.properties.getColumnDto().isKey) {
            $element.find(".column-badge-left span").removeClass(ColumnView.UN_VISIBLE_CLASS);
        } else {
            $element.find(".column-badge-left apan").addClass(ColumnView.UN_VISIBLE_CLASS);
        }

    }

    setShowAble(isShow) {
        if (isShow) {
            this.$element.removeClass(ColumnView.HIDDEN_CLASS);
        } else {
            //如果是有连接的,则不隐藏
            if (this.$element.hasClass("jtk-connected")
                || this.$element.hasClass("jtk-endpoint-anchor")) {
                return;
            }
            this.$element.addClass(ColumnView.HIDDEN_CLASS);
        }
    }

    private getTypeShortName(type) {
        return type.substr(0, 1).toUpperCase();
    }

    attrChanged(attrName: string, value: any) {
        //再赋值
        this.properties.getColumnDto()[attrName] = value;
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
            .text("(" + (this.properties.getColumnDto().fieldName ?
                this.properties.getColumnDto().fieldName : "无") + ")"
                + this.properties.getColumnDto().title);
    }

}
