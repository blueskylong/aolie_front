import {IValidator} from "../IValidator";
import {BlockViewer} from "../BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {Component} from "../Component";
import {RegValidator} from "../../../decorator/decorator";
import {CommonUtils} from "../../../common/CommonUtils";

/**
 * 值类型检查,检查数字
 */
@RegValidator()
export class FieldTypeValidator implements IValidator {

    validateField(fieldName, value, row, viewer: BlockViewer): string {
        if (!value) {
            return null;
        }
        if (!isNaN(value)) {
            return null;
        }
        if (!CommonUtils.isNumber(value)) {
            return "请输入有效的数字";
        }

    }

    /**
     * 此字段是否需要此验证器验证
     * @param component
     * @param viewer
     */
    isConcerned(component: Component, viewer: BlockViewer): boolean {
        return component.isNumberColumn();
    }

    /**
     * 取得实例,有此验证器,可以是单例,有些多例,由验证器自己决定
     * @param component
     * @param viewer
     */
    getInstance(component: Component, viewer: BlockViewer): IValidator {

        return new FieldTypeValidator();
    }
}
