/**
 * 显示控件的额外属性
 */
import {BaseDto} from "../../datamodel/dto/BaseDto";

export class ComponentDto extends BaseDto {
    public componentId: number;
    /**
     * 主表ID
     */
    public blockViewId: number;
    /**
     * 引用的列ID
     */
    public columnId: number;
    /**
     * 级次编码,本系统都采用的3位一级的编码格式
     */
    public lvlCode: string;
    /**
     * 标题
     */
    public title: string;
    /**
     * 显示方式,如text,datetime等
     */
    public dispType: string;
    /**
     * 横向占比例,类似于bootstrap的12列,占多少列的意思
     */
    public horSpan: number;
    /**
     * 纵向行数,如textArea这类的,会占用多行.
     */
    public verSpan: number;
    /**
     * 如果为列表显示,则显示的宽度,0表示列表中不显示
     */
    public width: number;
    /**
     * 可编辑条件,空表示可编辑
     */
    public editableFilter: string;
    /**
     * 可见条件,空表示可见
     */
    public visibleFilter: string;
    /**
     * 显示格式,如数字,日期等
     */
    public format: string;
    /**
     * 自定义标题的颜色
     */
    public titleColor: string;
    /**
     * 说明
     */
    public memo: string;
    /**
     * 自定义css样式类
     */
    public cssClass: string;
    /**
     * 扩展样式
     */
    public extStyle: string;
    /**
     * 分组类型
     */
    public groupType: number;

    /**
     * 默认排序类型
     */
    public orderType: number;

    /**
     * 背景色
     */
    public backgroundColor: string;

    /**
     * 标题位置
     */
    public titlePosition: string;

    public titleSpan: number;

    /**
     * 如果是树状显示,在树上的作用,如标题,ID,编码等,查看 Constants.TreeRole常量定义
     */
    public treeRole:number;


}
