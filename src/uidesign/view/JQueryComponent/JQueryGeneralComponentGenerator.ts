import {BaseComponent} from "../BaseComponent";
import {IComponentGenerator} from "../generator/IComponentGenerator";
import {TextInput} from "./TextInput";
import {BeanFactory} from "../../../decorator/decorator";
import {Button} from "./Button";
import {Password} from "./Password";
import {Hidden} from "./Hidden";
import {FileInput} from "./FileInput";
import {CheckBox} from "./CheckBox";
import {RadioInput} from "./RadioInput";
import {TextArea} from "./TextArea";
import {Select} from "./Select";
import {Label} from "./Label";
import {Panel} from "./Panel";
import {TimeInput} from "./TimeInput";
import {EmailInput} from "./EmailInput";
import {ColorSelect} from "./ColorSelect";
import {DateInput} from "./DateInput";
import {NumberInput} from "./NumberInput";
import {Component} from "../../../blockui/uiruntime/Component";
import {GeneralEventListener} from "../../../blockui/event/GeneralEventListener";
import {Constants} from "../../../common/Constants";
import {CommonUtils} from "../../../common/CommonUtils";
import {FilterInput} from "./FilterInput";

export class JQueryGeneralComponentGenerator implements IComponentGenerator {
    public static COMPONENT_TYPE = {};

    public static init() {
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.text] = TextInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.button] = Button;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.password] = Password;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.hidden] = Hidden;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.checkbox] = CheckBox;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.radio] = RadioInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.textarea] = TextArea;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.select] = Select;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.label] = Label;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.panel] = Panel;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.time] = TimeInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.email] = EmailInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.color] = ColorSelect;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.date] = DateInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.number] = NumberInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.filter] = FilterInput;
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[Constants.ComponentType.formula] = TextArea;
    }

    /**
     * 创建控件
     * @param compType
     * @param dto
     * @param parent
     * @param eventHandler
     */
    public generateComponent(compType: string, dto: Component, parent: HTMLElement, eventHandler?: GeneralEventListener):
        BaseComponent<Component> {
        let param = new Array();
        param.push(dto);
        param.push(eventHandler);
        return BeanFactory.createBean(JQueryGeneralComponentGenerator.COMPONENT_TYPE[compType], param);
    }

    /**
     * 注册自定义的控件, 或者替换原有的控件
     * @param compTypeId
     * @param _constructor
     */
    public static regCustomComponent(compTypeId, _constructor: { new(...args: Array<any>) }) {
        JQueryGeneralComponentGenerator.COMPONENT_TYPE[compTypeId] = _constructor;
    }
}

JQueryGeneralComponentGenerator.init();
