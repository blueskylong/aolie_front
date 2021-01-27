/**
 * 工具类
 */
import {AxiosResponse} from "axios";
import {Logger} from "./Logger";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {BeanFactory} from "../decorator/decorator";
import {HandleResult} from "./HandleResult";
import {StringMap} from "./StringMap";

export class CommonUtils {
    static ID_SER = -1;

    static INT_SER = 1;

    static READY_TRY_TIMES = 10;

    static genKey(id: number, version: string) {
        return id + "_" + version;
    }

    static isEmpty(obj: any) {
        let str = typeof obj;
        return str === "undefined" || obj == null || "" === obj;
    }

    /**
     * 取得临时序号
     */
    static nextInt() {
        return CommonUtils.INT_SER++;
    }

    static genUUID(): string {

        let s = [];
        let hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        // s[8] = s[13] = s[18] = s[23] = "-";

        return "X" + s.join("");

    }

    static toUnderLine(str) {
        let temp = str.replace(/[A-Z]/g, function (match) {
            return "_" + match.toLowerCase();
        });
        if (temp.slice(0, 1) === '_') {
            temp = temp.slice(1);
        }
        return temp;
    };

    static genElementId(...ids) {
        return "C" + ids.join("_");
    }

    static toCamel(str: string) {
        if (str.indexOf("_") == -1) {
            return str;
        }
        return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase();
        });
    }

    static getServerUrl(subUrl) {
        return "http://127.0.0.1:8080/" + (subUrl.indexOf("/") == 0 ? subUrl.substr(1) : subUrl);
    }

    static readyDo(isReady: () => boolean, callback: () => void) {
        let times = CommonUtils.READY_TRY_TIMES;
        let i = setInterval(() => {
            if (times < 0) {
                clearInterval(i);
                Alert.showMessage("初始化超时!")
                return;
            }
            times--;
            if (isReady()) {
                clearInterval(i);
                callback();
            }
        }, 100);
    }

    static showMask() {
        $(".mask-panel").modal("show");
    }

    static hideMask() {
        $(".mask-panel").modal("hide");
    }

    static isNumber(value) {
        if (typeof value === "undefined" || value == null || value == "") {
            return false;
        }
        return !isNaN(value);
    }

    /**
     * 生成普通的ID
     */
    static genId() {
        return CommonUtils.ID_SER--;
    }


    static getOffsetTopByBody(el) {
        let offsetTop = 0;
        while (el && el.tagName !== 'BODY') {
            offsetTop += el.offsetTop;
            el = el.offsetParent
        }
        return offsetTop;
    }

    static getOffsetLeftByBody(el) {
        let offsetLeft = 0;
        while (el && el.tagName !== 'BODY') {
            offsetLeft += el.offsetLeft;
            el = el.offsetParent
        }
        return offsetLeft;
    }

    static handleResponse(promise: Promise<any>, callBack?: (data) => void) {
        promise.then((result) => {
            CommonUtils.handleResult(result, callBack);
        }).catch((e) => {
            CommonUtils.hideMask();
            Alert.showMessage("访问服务器出现异常,操作失败!");
            CommonUtils.log(e.status, e.statusText, e.data);
        });
    }

    static handleResult(result: AxiosResponse, callBack?: (data) => void) {
        if (!result) {
            return;
        }
        if (result.status == 200) {
            if (callBack) {
                try {
                    let data = result.data;
                    if (CommonUtils.isHandleResult(result.data)) {
                        let handleResult = BeanFactory.populateBean(HandleResult, data);
                        if (!handleResult.getSuccess()) {
                            Logger.error(handleResult.err);
                        }
                        callBack(handleResult);
                        return;
                    }
                    callBack(result.data);
                } catch (e) {
                    Logger.error(e.message);
                    console.error(e.stack);
                }
            }
            return;
        }
        CommonUtils.log(result.status, result.statusText, result.data);

    }

    static isHandleResult(obj) {
        if (!obj) {
            return false;
        }
        return (obj.hasOwnProperty("changeNum") &&
            obj.hasOwnProperty("err") &&
            obj.hasOwnProperty("page") &&
            obj.hasOwnProperty("data") &&
            obj.hasOwnProperty("success")
        )
    }

    static log(code, name, message): void {

    }

    static isIE() {
        if (!!window['ActiveXObject'] || "ActiveXObject" in window)
            return true;
        else
            return false;
    }

    /**
     * 分类增加子元素
     * @param map
     * @param key
     * @param subElement
     */
    static addMapListValue<T>(map: StringMap<Array<T>>, key, subElement: T) {
        let lstEle = map.get(key);
        if (!lstEle) {
            lstEle = new Array<T>();
            map.set(key, lstEle);
        }
        lstEle.push(subElement);
    }

    //     return ; //IE
    // } else if ($.browser.safari) {
    //     alert("this is safari!"); //Safar
    // } else if ($.browser.mozilla) {
    //     alert("this is mozilla!");  //Firefox
    // } else if ($.browser.opera) {
    //     alert("this is opera");     //Opera
    // }

}
