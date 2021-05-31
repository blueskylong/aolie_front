import {GeneralEventListener} from "../blockui/event/GeneralEventListener";

/**
 * 系统事件
 */
export class ApplicationEventCenter {

    /**
     * 成功登录
     */
    public static LOGIN_SUCCESS = "loginSuccess";
    /**
     * 登出
     */
    public static LOGOUT = "logOut";

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
        ApplicationEventCenter.removeListener(eventType, listener);
        let lstHandler = ApplicationEventCenter.EVENTS[eventType];
        if (!lstHandler) {
            lstHandler = new Array<EventListener>();
            ApplicationEventCenter.EVENTS[eventType] = lstHandler;
        }
        lstHandler.push(listener);
    }


    /**
     * 触发一事件
     * @param eventType
     * @param data
     * @param source
     */
    public static fireEvent(eventType: string, data?: Object, source?: object) {
        let lstHandler = ApplicationEventCenter.EVENTS[eventType];
        if (!lstHandler) {
            return;
        }
        for (let handler of lstHandler) {
            (<GeneralEventListener>handler).handleEvent(eventType, data, source);
        }
    }

    public static clearEvent() {
        ApplicationEventCenter.EVENTS = {};
    }


    /**
     * 取得监听
     * @param eventType
     * @param listener
     */
    public static removeListener(eventType: string, listener: GeneralEventListener) {
        let lstHandler = ApplicationEventCenter.EVENTS[eventType];
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
