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

export class JQueryGeneralComponentGenerator implements IComponentGenerator {
    public static COMPONENT_TYPE = {
        text: TextInput,
        button: Button,
        password: Password,
        hidden: Hidden,
        file: FileInput,
        checkbox: CheckBox,
        radio: RadioInput,
        textarea: TextArea,
        select: Select,
        label: Label,
        panel: Panel,
        time: TimeInput,
        email: EmailInput,
        color: ColorSelect,
        date: DateInput,
        number: NumberInput,
        filter: TextArea,
        formula: TextArea
    }


    public generateComponent(compType: string, dto: Component, parent: HTMLElement, eventHandler?: GeneralEventListener):
        BaseComponent<Component> {
        let param = new Array();
        param.push(dto);
        param.push(eventHandler);
        return BeanFactory.createBean(JQueryGeneralComponentGenerator.COMPONENT_TYPE[compType], param);
    }


}
