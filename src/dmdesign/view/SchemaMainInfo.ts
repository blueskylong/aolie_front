import {JsTree, JsTreeInfo} from "../../blockui/JsTree/JsTree";
import {Form} from "../../blockui/Form";
import {BorderLayout, BorderLayoutProperty} from "../../blockui/layout/BorderLayout";
import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";
import EventBus from "./EventBus";
import {BeanFactory} from "../../decorator/decorator";
import SchemaDto from "../../datamodel/dto/SchemaDto";

/**
 * 包含方案树和方案明细信息的面板
 */
export class SchemaMainInfo extends BorderLayout<BorderLayoutProperty> {
    private schemaTree: JsTree<JsTreeInfo>;
    private fSchema: Form;
    private selectChangeListener: GeneralEventListener;
    private valueChangeListener: GeneralEventListener;


    getViewUI(): HTMLElement {
        this.schemaTree = new JsTree<JsTreeInfo>({
            textField: "schemaName",
            rootName: "方案信息",
            idField: "schemaId",
            url: "/dm/findAllSchemaDto"
        });
        this.fSchema = Form.getInstance(25);
        this.addComponent(BorderLayout.west, this.schemaTree);
        this.addComponent(BorderLayout.center, this.fSchema);
        return super.getViewUI();
    }


    private fireSchemaSelectChanged(schemaInfo) {
        if (this.selectChangeListener) {
            this.selectChangeListener.handleEvent(EventBus.SELECT_CHANGE_EVENT,
                BeanFactory.populateBean(SchemaDto, schemaInfo), null, null);
        }
    }

    private fireValueChangeListener(field, value) {
        if (this.valueChangeListener) {
            this.valueChangeListener.handleEvent(EventBus.VALUE_CHANGE_EVENT, field, value, null);
        }
    }

    setSelectChangeListener(listener: GeneralEventListener) {
        this.selectChangeListener = listener;
    }

    private getData() {
        return this.fSchema.getValue();
    }

    protected initEvent() {
        this.schemaTree.addSelectListener({
            handleEvent: (eventType: string, data: object, source: object, extObject?: any) => {
                if (this.schemaTree.isSelectRoot()) {
                    return;
                }
                this.fSchema.setValue(data);
                this.fireSchemaSelectChanged(data);
            }
        });
    }

    setValueChangeListener(valueChangeListener: GeneralEventListener) {
        this.valueChangeListener = valueChangeListener;
    }

    setEditable(canEdit) {
        this.fSchema.setEditable(canEdit);
    }

    destroy(): boolean {
        this.fSchema.destroy();
        this.schemaTree.destroy();
        this.selectChangeListener = null;
        this.valueChangeListener = null;
        return super.destroy();
    }

}
