import {BlockViewer} from "./BlockViewer";
import {StringMap} from "../../common/StringMap";
import {Component} from "./Component";

/**
 * 验证器接口
 */
export interface IValidator {

    /**
     * 验证单个数据
     * @param fieldName
     * @param value
     * @param component
     * @param viewer
     *
     * @return 返回错误信息
     */
    validateField(fieldName, value, row, viewer: BlockViewer): string;

    /**
     * 此字段是否需要此验证器验证
     * @param component
     * @param viewer
     */
    isConcerned(component: Component, viewer: BlockViewer): boolean;

    /**
     * 取得实例,有此验证器,可以是单例,有些多例,由验证器自己决定
     * @param component
     * @param viewer
     */
    getInstance(component: Component, viewer: BlockViewer): IValidator;
}
