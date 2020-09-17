import {TextInput} from "./TextInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {UiService} from "../../../blockui/service/UiService";
import {ReferenceData} from "../../../datamodel/dto/ReferenceData";
import {StringMap} from "../../../common/StringMap";

export class Select<T extends Component> extends TextInput<T> {
    private valueTitle: StringMap<string>;

    protected getEditorType() {
        return "select";
    }

    protected async afterCreateEditor($dom?) {
        //生成option
        this.valueTitle = new StringMap<string>();
        if (this.properties.column.getColumnDto().refId) {
            let data = await UiService.getReferenceData(
                this.properties.column.getColumnDto().refId);
            if (data) {
                let editor = this.editor;
                let ref: ReferenceData;
                for (let referenceData of data as any) {
                    ref = (<ReferenceData>referenceData);
                    this.valueTitle.set(ref.id, ref.name);
                    editor.append("<option value='" + ref.id + "'>" + ref.name + "</option>");
                }
            }
        }
        let $ele = $dom ? $dom : this.$element;
        $ele.find('.selectpicker').selectpicker();
    }

    setValue(value: any) {
        //这里增加判断,如果还没有选择项,可能是还没有初始化完成,这里增加一点时间,再试一次
        if (!this.valueTitle || this.valueTitle.getSize() == 0) {
            setTimeout(() => {
                this.editor.selectpicker('val', value);
            }, 100);
        } else {
            this.editor.selectpicker('val', value);
        }

    }

    getValue(): any {
        return this.editor.selectpicker('val');
    }

    getTitle(): any {
        return this.valueTitle.get(this.getValue());
    }

    addOption(id, title) {
        this.editor.append("<option value='" + id + "'>" + title + "</option>");
    }

    protected createEditor(id: string) {
        // @ts-ignore
        return $("<select class='com-editor form-control selectpicker'  id='" + id +
            "'><option></option></select>");
    }
}
