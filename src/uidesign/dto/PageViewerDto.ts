import {BaseDto} from "../../datamodel/dto/BaseDto";

/**
 * 页面视图
 */
export class PageViewerDto extends BaseDto {
    /**
     *方案ID
     */
    public schemaId: number;
    /**
     * id
     */
    public pageId: number;
    /**
     * 布局
     */
    public layoutId: number;
    /**
     * 页面类型,对话框,内嵌面板
     */
    public pageDisplayType: number;
    /**
     * 名称
     */
    public name: string;
    /**
     * 对话框宽度
     */
    public width: number;
    /**
     * 对话框高度
     */
    public height: number;
}
