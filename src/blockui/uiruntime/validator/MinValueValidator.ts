import {IValidator} from "../IValidator";
import {BlockViewer} from "../BlockViewer";
import {Component} from "../Component";
import {RegValidator} from "../../../decorator/decorator";
import {CommonUtils} from "../../../common/CommonUtils";

/**
 * 最小值验证
 */
@RegValidator()
export class MinValueValidator implements IValidator {
    private errStr: string;
    private errNumber: string;
    private minValue: number;
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
            if (num < this.minValue) {
                return this.errNumber;
            }
        } else {
            if (typeof value === "undefined" || value === null) {
                return null;
            }
            if (value.length < this.minValue) {
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
        let minValue = component.column.getColumnDto().minValue;
        if (typeof minValue === "undefined" || minValue == null) {
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
        let min = new MinValueValidator();
        min.minValue = component.getColumn().getColumnDto().minValue;
        min.isNumberColumn = component.isNumberColumn();
        if (min.isNumberColumn) {
            min.errNumber = "数字最小不可小于" + min.minValue;
        } else {
            min.errStr = "最少需要输入" + min.minValue + "个字符";
        }
        return min;
    }
}
