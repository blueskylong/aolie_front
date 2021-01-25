import {IValidator} from "../IValidator";
import {BlockViewer} from "../BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {Component} from "../Component";
import {RegValidator} from "../../../decorator/decorator";
import {CommonUtils} from "../../../common/CommonUtils";

/**
 *数值最大值验证或字符串最长
 */
@RegValidator()
export class MaxValueValidator implements IValidator {
    private errStr: string;
    private errNumber: string;
    private maxValue: number;
    private isNumberColumn: boolean;

    validateField(fieldName, value, row, viewer: BlockViewer): string {
        if (CommonUtils.isEmpty(value)) {
            return "";
        }
        if (this.isNumberColumn) {
            let num = Number(value);
            if (num === NaN) {
                return "";
            }
            if (num > this.maxValue) {
                return this.errNumber;
            }
        } else {
            if (typeof value === "undefined" || value === null) {
                return null;
            }
            if (value.length > this.maxValue) {
                return this.errStr;
            }
        }
        return "";
    }

    /**
     * 此字段是否需要此验证器验证
     * @param component
     * @param viewer
     */
    isConcerned(component: Component, viewer: BlockViewer): boolean {
        let maxValue = component.column.getColumnDto().maxValue;
        if (typeof maxValue === "undefined" || maxValue == null) {
            return false;
        }
        return true;
    }

    /**
     * 取得实例,有此验证器,可以是单例,有些多例,由验证器自己决定
     * @param component
     * @param viewer
     */
    getInstance(component: Component, viewer: BlockViewer): IValidator {
        let max = new MaxValueValidator();
        max.maxValue = component.getColumn().getColumnDto().maxValue;
        max.isNumberColumn = component.isNumberColumn();
        if (max.isNumberColumn) {
            max.errNumber = "数字最大不可以超过" + max.maxValue;
        } else {
            max.errStr = "最多可输入" + max.maxValue + "个字符";
        }
        return max;
    }
}
