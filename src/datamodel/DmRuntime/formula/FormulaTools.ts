import {StringMap} from "../../../common/StringMap";
import {Constants} from "../../../common/Constants";

export class FormulaTools {


    static colReg = /\$\{[^}]+\}$/;
    static colReg_g = /\$\{(.+?)\}/g;
    static paramReg = /\#\{[^}]+\}$/;
    static paramReg_g = /\#\{(.+?)\}/g;

    /**
     * 取得列参数,形如${1}
     * @param str
     */
    static getColumnParams(str): Array<string> {
        return FormulaTools.getParam(str, FormulaTools.colReg_g);
    }

    /**
     * 检查字符串是不是列参数
     * @param str
     */
    static isColumnParam(str) {
        return FormulaTools.colReg.test(str);
    }

    static isSysParam(str) {
        return FormulaTools.paramReg.test(str);
    }

    /**
     * 取得列ID,形如: 从${1} 中取出1
     * @param param
     */
    static getParamInnerStr(param: string) {
        return param.substr(2, param.length - 3);
    }

    static getParam(str, regEx: RegExp): Array<string> {
        let result = str.match(regEx);
        let list = [];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                let item = result[i];
                let innerParam = this.getParamInnerStr(item);
                if (list.indexOf(innerParam) === -1) {
                    list.push(innerParam)
                }
            }
        }
        return list;
    }

    static getSysParams(str): Array<string> {
        return FormulaTools.getParam(str, FormulaTools.paramReg_g);
    }

    /**
     * 替换列参数
     * @param str
     * @param toReplace
     * @param replace
     */
    static replaceColumnNameStr(str: string, toReplace: string, replace: string): string {
        return str.replace("${" + toReplace + "}", "${" + replace + "}")
    }

    /**
     * 替换系统参数
     * @param str
     * @param toReplace
     * @param replace
     */
    static replaceParamNameStr(str: string, toReplace: string, replace: string): string {
        return str.replace("#{" + toReplace + "}", "#{" + replace + "}")
    }

    /**
     * 替换列参数
     * @param str
     * @param toReplace
     * @param replace
     */
    static replaceColumnValueStr(str: string, toReplace: string, fieldValue: string, fieldType): string {
        if (fieldType === Constants.FieldType.int || fieldType === Constants.FieldType.decimal) {
            return str.replace("${" + toReplace + "}", fieldValue);
        } else {
            return str.replace("${" + toReplace + "}", "'" + fieldValue + "'");
        }

    }

    /**
     * 替换系统参数,直接替换成值的表达式,
     * @param str
     * @param toReplace
     * @param replace
     */
    static replaceParamValueStr(str: string, toReplace: string, value: string, fieldType): string {
        if (fieldType === Constants.FieldType.int || fieldType === Constants.FieldType.decimal) {
            return str.replace("#{" + toReplace + "}", value)
        } else {
            return str.replace("#{" + toReplace + "}", "'" + value + "'");
        }
    }
}
