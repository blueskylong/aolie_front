import {JQBaseComponent} from "./JQBaseComponent";
import {AutoFit} from "./AutoFit";
import {Constants} from "../../../common/Constants";
import {Component} from "../../../blockui/uiruntime/Component";
import {CommonUtils} from "../../../common/CommonUtils";

export class TextInput<T extends Component> extends JQBaseComponent<T> {
    private static TEMPLATE = require("./templete/BaseInput.html");
    private static TEMPLATE_RIGHT = require("./templete/BaseInput-right.html");


    protected createUI(): HTMLElement {
        let $dom = null;
        $dom = $(this.loadTemplate());
        $dom.attr("fieldName", this.properties.column.getColumnDto().fieldName);
        this.handleExt($dom);
        return $dom.get(0);
    }

    protected loadTemplate(): string {
        return Constants.TitlePosition.right == this.properties.componentDto.titlePosition ? TextInput.TEMPLATE_RIGHT : TextInput.TEMPLATE;

    }

    protected handleExt($ele?: JQuery) {
        let $dom = $ele ? $ele : this.$element;
        let id = 'ID_' + this.properties.componentDto.componentId + "" + Math.round(Math.random() * 10000000);
        this.handleContainer($dom);
        this.handleTitle($dom, id);
        this.handleEditor($dom, id);
        this.afterCreateEditor($dom);
    }

    afterComponentAssemble(): void {
    }

    protected handleContainer($dom: JQuery) {
        //设置高度和宽度
        if (this.properties.componentDto.horSpan <= 12) {//小于12.表示用bootstrap的列布局
            $dom.addClass("col-md-" + this.properties.componentDto.horSpan);
        } else if (this.properties.componentDto.horSpan > 12) {//大于12 ,则直接使用像素
            $dom.css("width", this.properties.componentDto.horSpan + "px");
        } else if (this.properties.componentDto.horSpan < 0) {//小于0表示填充所有空间
            AutoFit.addAutoFitComponent($dom.get(0), true, false);
        }
        if (this.properties.componentDto.verSpan <= 12) {//小于12.表示占用几行
            $dom.attr("rows", this.properties.componentDto.verSpan);
        } else if (this.properties.componentDto.verSpan > 12) {//大于12 ,则直接使用像素
            $dom.height(this.properties.componentDto.verSpan);
        } else if (this.properties.componentDto.horSpan < 0) {//小于0表示填充所有空间
            AutoFit.addAutoFitComponent($dom.get(0), false, true);
        }

    }

    protected handleTitle($dom: JQuery, id: string) {
        let $title = $dom.find(".comp-title");
        let title = this.properties.componentDto.title;
        if (!this.properties.column.getColumnDto().nullable) {
            //必填标记
            title += "*";
        }
        $title.text(title);
        let color = this.properties.componentDto.titleColor;
        if (!CommonUtils.isEmpty(color)) {
            $title.css("color", color);
        }
        $title.attr("for", id);
        //如果不显示
        if (this.properties.componentDto.titlePosition == Constants.TitlePosition.none) {
            $title.css("display", "none")
        } else {//根据设置显示宽度
            if (!this.properties.componentDto.titleSpan) {
                this.properties.componentDto.titleSpan = 3;
            }
            if (this.properties.componentDto.titleSpan > 12) {
                $title.width(this.properties.componentDto.titleSpan);
            } else {
                $title.addClass("col-md-" + this.properties.componentDto.titleSpan);
            }
        }
        if (this.properties.componentDto.memo) {
            $dom.attr("title", this.properties.componentDto.memo);
        }

    }

    protected handleEditor($dom: JQuery, id: string) {
        // let $editorParent = $dom.find(".comp-editor-parent");
        this.editor = this.createEditor(id);
        // $dom.find(".comp-editor-parent").append(this.editor)
        if (this.properties.componentDto.titlePosition === Constants.TitlePosition.right) {
            this.editor.insertBefore($dom.find(".comp-title-right"));
        } else {
            $dom.append(this.editor);
        }
        //
        this.editor.on("change", (e) => {
            this.fireValueChanged(this.getFieldName(), this.getValue());
        });
        if (this.properties.componentDto.titleSpan > 12) {//如果标题宽度大于12,则表示实际宽度,则剩下的空间给编辑器
            AutoFit.addAutoFitComponent(this.editor.get(0));
        } else {
            this.editor.addClass("col-md-" + (12 - this.properties.componentDto.titleSpan));
        }

    }

    protected createEditor(id: string) {
        return $("<input class='com-editor form-control'" +
            " name='" + this.properties.getColumn().getColumnDto().fieldName + "' id='" + id
            + "' type='" + this.getEditorType() + "'/>");
    }


    protected getEditorType() {
        return "text";
    }

    protected afterCreateEditor($dom?: JQuery) {


    }


}
