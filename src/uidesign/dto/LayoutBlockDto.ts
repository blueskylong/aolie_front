import {BaseDto} from "../../datamodel/dto/BaseDto";

/**
 * 定义一个布局块,组成整个布局的一部分
 */
export class LayoutBlockDto extends BaseDto {
    public schemaId: number;
    /**
     * id
     */
    public layoutId: number;

    /**
     * 布局块ID
     */
    public layoutBlockId: number;

    /**
     * 页面ID
     */
    public pageId: number;
    /**
     * 所占列数,如果大于12 ,则为实际像素,为负数,则表示屏宽减去此数的像素.
     */
    public colNum: number;

    /**
     * 某些控件可以使用的标题
     */
    public title: string;
    /**
     * 所占行数,0表示自适应,小于等于0 表不自己适应,如果是负数,则表示最大不超过.
     */
    public rowNum: number;
    /**
     * 横向对齐方式
     */
    public alignHorizon: number;
    /**
     * 纵向对齐方式
     */
    public alignVertical: number;
    /**
     * 使能
     */
    public enabled: number;
    /**
     * 顺序号
     */
    public orderNum: number;
    /**
     * 显示方式,默认是DIV，也可能是分隔条，panel等其它类型的控件
     */
    public displayType: number;


    /**
     * 以下的View数量根据控件的不同,需要不同数量的控件.
     */
    public blockId1: number;
    public blockId2: number;
    public blockId3: number;
    public blockId4: number;
}
