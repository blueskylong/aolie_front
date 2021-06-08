import DmDesignBaseView from "./DmDesignBaseView";
import {AttrChangeListener} from "./AttrChangeListener";
import {Column} from "../../datamodel/DmRuntime/Column";
import {CommonUtils} from "../../common/CommonUtils";
import EventBus from "./EventBus";
import {Constants} from "../../common/Constants";


export default class ColumnView extends DmDesignBaseView<Column> implements AttrChangeListener {

    public static isAddedContextMenu = false;


    private static FIELD_TYPE_SHORT_NAME = null;


    public getId() {
        return CommonUtils.genElementId(this.properties.getColumnDto().tableId,
            this.properties.getColumnDto().columnId);
    }


    afterComponentAssemble(): void {

        CommonUtils.readyDo(() => {
            return !!this.element;
        }, () => {
            ColumnView.JSPLUMB.makeSource(this.element, ColumnView.SOURCE_PARAM);
            ColumnView.JSPLUMB.makeTarget(this.element, ColumnView.TARGET_PARAM);
            if (!ColumnView.isAddedContextMenu) {
                $.contextMenu({
                    selector: '.column-body',
                    //因为这个菜单,只可以写一个类别,所以加载一次后,就不能再加载
                    callback: function (key, options) {
                        if (key === "add") {
                            EventBus.fireEvent(EventBus.ADD_COLUMN,
                                {columnId: this.attr("column-id")}, null);
                        } else if (key == "delete") {
                            EventBus.fireEvent(EventBus.DELETE_COLUMN, {columnId: this.attr("column-id")}, null);
                        }
                    },
                    items: {
                        "delete": {name: "删除行", icon: "delete"},
                        "add": {name: "增加行", icon: "add"}

                    }
                });
                ColumnView.isAddedContextMenu = true;
            }
        })

    }

    createUI(): HTMLElement {
        let element = $(require("../template/ColumnView.html"));
        let id = this.getId();
        element.attr("id", id);
        element.attr("data-id", id);
        element.attr("column-id", this.properties.getColumnDto().columnId);

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
            $element.find(".column-badge-left span").addClass(ColumnView.UN_VISIBLE_CLASS);
        }
        if (this.properties.getLstFormulaDto() && this.properties.getLstFormulaDto().length > 0) {
            $element.find(".column-badge-right .fa-calculator").removeClass(ColumnView.UN_VISIBLE_CLASS);
        } else {
            $element.find(".column-badge-right .fa-calculator").addClass(ColumnView.UN_VISIBLE_CLASS);
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
        if (ColumnView.FIELD_TYPE_SHORT_NAME == null) {
            ColumnView.FIELD_TYPE_SHORT_NAME = {};
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.decimal] = "浮";
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.int] = "整";
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.varchar] = "文";
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.binary] = "位";
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.datetime] = "日";
            ColumnView.FIELD_TYPE_SHORT_NAME[Constants.FieldType.text] = "大";
        }
        let name = ColumnView.FIELD_TYPE_SHORT_NAME[type];
        if (!name) {
            return type;
        }
        return name;
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
