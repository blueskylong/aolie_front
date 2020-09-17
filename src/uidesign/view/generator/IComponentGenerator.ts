import {BaseComponent} from "../BaseComponent";
import {Component} from "../../../blockui/uiruntime/Component";
import {GeneralEventListener} from "../../../blockui/event/GeneralEventListener";

/**
 * 控件生成接口,注册的生成器,需要继承此接口
 */
export interface IComponentGenerator {
    generateComponent(compType: string, dto: Component,
                      parent: HTMLElement, eventHandler?: GeneralEventListener): BaseComponent<Component>;
}
