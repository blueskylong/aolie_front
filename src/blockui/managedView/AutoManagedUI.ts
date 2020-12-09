/**
 * 复合控件,包含树,面板,列表,页面等.
 */
import {PageDetailDto} from "../../funcdesign/dto/PageDetailDto";
import {MenuButton} from "../../home/dto/MenuButton";

export interface AutoManagedUI extends ManagedEventListener {
    /**
     * 取得页面明细信息
     */
    getPageDetail(): PageDetailDto;

    /**
     * 取得控件相关的数据表id
     */
    getTableIds(): Array<number>;

    /**
     * 设置事件监测中心
     * @param listener
     */
    setManageEventListener(listener: ManagedEventListener)

    /**
     * 设置显示的按钮,只会给它相关的按钮,不相关的,不给.
     * @param buttons
     */
    // setButtons(buttons: Array<MenuButton>);
}

/**
 * 响应数据事件
 */
export interface ManagedEventListener {
    /**
     * 引用选择变化
     * @param source
     * @param refId
     * @param id
     */
    referenceSelectChanged(source: any, refId, id);

    /**
     * 数据表选变化
     * @param source
     * @param tableId
     * @param mapKeyAndValue
     * @param row
     */
    dsSelectChanged(source: any, tableId, mapKeyAndValue, row?);

    /**
     * 数据值变化
     * @param source
     * @param tableId
     * @param mapKeyAndValue
     * @param field
     * @param value
     */
    attrChanged(source: any, tableId, mapKeyAndValue, field, value);

    /**
     * 数据删除事件
     * @param source
     * @param tableId
     * @param mapKeyAndValue
     */
    dataRemoved(source: any, tableId, mapKeyAndValue);

    /**
     *数据状态变化
     * @param tableId
     * @param state
     */
    stateChange(tableId, state: number);
}
