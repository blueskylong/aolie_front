import {BaseDto} from "../../datamodel/dto/BaseDto";

/**
 * 能成一个完成的布局,下面的布局块应该是一个树状结构
 */
export class LayoutDto extends BaseDto {
    public layoutId: number;
    public layoutName: string;
    public lvlCode: string;

}
