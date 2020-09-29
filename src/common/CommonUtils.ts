/**
 * 工具类
 */

export class CommonUtils {
    static ID_SER = -1;

    static genKey(id: number, version: string) {
        return id + "_" + version;
    }

    static isNull(obj: any) {
        let str = typeof obj;
        return str === "undefined" || obj == null;
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
        let times = 20;
        let i = setInterval(() => {
            if (times < 0) {
                clearInterval(i);
                return;
            }
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
}
