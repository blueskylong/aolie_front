import {BaseDto} from "../../datamodel/dto/BaseDto";

export class PageInfoDto extends BaseDto {
    pageId: number;
    pageName: string;
    lvlCode: string;
    width: number;
    height: number;
    layoutType: number;
    canDrag: number;
}
