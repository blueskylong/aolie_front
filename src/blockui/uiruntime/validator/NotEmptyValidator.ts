import {IValidator} from "../IValidator";
import {BlockViewer} from "../BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {Component} from "../Component";
import {RegValidator} from "../../../decorator/decorator";

/**
 * 必填
 */
@RegValidator()
export class NotEmptyValidator implements IValidator {

    validateField(fieldName, value, row, viewer: BlockViewer): string {
        if (typeof value === "undefined" || value == null || value.trim() === "") {
            return "不可以为空";
        }
        return null;
    }

    /**
     * 此字段是否需要此验证器验证
     * @param component
     * @param viewer
     */
    isConcerned(component: Component, viewer: BlockViewer): boolean {
        return !component.column.getColumnDto().nullable;
    }

    /**
     * 取得实例,有此验证器,可以是单例,有些多例,由验证器自己决定
     * @param component
     * @param viewer
     */
    getInstance(component: Component, viewer: BlockViewer): IValidator {
        return this;
    }
}
