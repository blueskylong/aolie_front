import {BaseDto} from "../../datamodel/dto/BaseDto";

class PageBlockDto extends BaseDto{
    /**
     * 页面ID
     */
    public pageId: number;
    /**
     * 区块布局ID
     */
    public layoutBlockId: number;
    /**
     * 区块内容ID
     */
    public blockId: number;
}
