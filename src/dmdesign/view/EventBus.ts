import {GeneralEventListener} from "../../blockui/event/GeneralEventListener";

/**
 * 一个全局的事件监听器,这个类只在设计功能中使用,不要用在其它地方,会造成内容不回收
 */
export default class EventBus {
    /**
     * 选择变化事件
     */
    public static SELECT_CHANGE_EVENT = "SELECT_CHANGED";
    /**
     * 值变化事件
     */
    public static VALUE_CHANGE_EVENT = "VALUE_CHANGED";
    /**
     * 位置发生变化
     */
    public static POSITION_CHANGE_EVENT = "POSITION_CHANGED";
    /**
     * 表删除
     */
    public static TABLE_REMOVE = "TABLE_REMOVE";

    /**
     * 连接取消消息
     */
    public static CONNECTION_BEFOREDETACH = "CONNECTION_BEFOREDETACH";

    /**
     * 删除连接
     */
    public static DELETE_CUR_CONNECTION = "DELETE_CONNECTION";
    /**
     * 增加列
     */
    public static ADD_COLUMN = "ADD_COLUMN";
    /**
     *删除列
     */
    public static DELETE_COLUMN = "DELETE_COLUMN";
    /**
     * 缓存所有事件监听者
     */
    public static EVENTS = {};

    /**
     * 增加一事件的监听
     * @param eventType
     * @param listener
     */
    public static addListener(eventType: string, listener: GeneralEventListener) {
        EventBus.removeListener(eventType,listener);
        let lstHandler = EventBus.EVENTS[eventType];
        if (!lstHandler) {
            lstHandler = new Array<EventListener>();
            EventBus.EVENTS[eventType] = lstHandler;
        }
        lstHandler.push(listener);
    }

    public static init() {
        EventBus.EVENTS = {};
    }

    /**
     * 触发一事件
     * @param eventType
     * @param data
     * @param source
     */
    public static fireEvent(eventType: string, data?: Object, source?: object) {
        let lstHandler = EventBus.EVENTS[eventType];
        if (!lstHandler) {
            return;
        }
        for (let handler of lstHandler) {
            (<GeneralEventListener>handler).handleEvent(eventType, data, source);
        }
    }

    public static clearEvent() {
        EventBus.EVENTS = {};
    }


    /**
     * 取得监听
     * @param eventType
     * @param listener
     */
    public static removeListener(eventType: string, listener: GeneralEventListener) {
        let lstHandler = EventBus.EVENTS[eventType];
        if (!lstHandler) {
            return false;
        }
        let index = lstHandler.indexOf(listener);
        if (index > -1) {
            let deleted = lstHandler.splice(index, 1);
            return true;
        }
        return false;

    }


}
