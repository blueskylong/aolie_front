import {IValidator} from "../IValidator";
import {BlockViewer} from "../BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {Component} from "../Component";
import {RegValidator} from "../../../decorator/decorator";

/**
 * 正则表达式验证 ,这个验证由约束验证维护,不需要独立注册
 */
// @RegValidator()
export class RegExValidator implements IValidator {
    private regex: RegExp;

    validate(row, viewer: BlockViewer): StringMap<String> {
        return undefined;
    }

    setRegStr(regStr) {
        this.regex = new RegExp("/" + regStr + "/g");
    }

    public validateField(fieldName, value, row, viewer: BlockViewer): string {
        if (typeof value === "undefined" || value == null) {
            return null;
        }
        if (!this.regex.test(value)) {
            return "输入内容不合规则";
        }
        return null;
    }

    /**
     * 此字段是否需要此验证器验证
     * @param component
     * @param viewer
     */
    isConcerned(component: Component, viewer: BlockViewer): boolean {
        return true;
    }

    /**
     * 取得实例,有此验证器,可以是单例,有些多例,由验证器自己决定
     * @param component
     * @param viewer
     */
    getInstance(component: Component, viewer: BlockViewer): IValidator {
        return new RegExValidator();
    }
}
