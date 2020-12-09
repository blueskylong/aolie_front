import {BaseDto} from "../../datamodel/dto/BaseDto";

export class PageDetailDto extends BaseDto {
    pageId: number;
    pageDetailId: number;
    viewId: number;
    pagePosition: string;
    initWidth: number;
    initHeight: number;
    showType: number;
    innerButton: number;
    viewType: number;
    loadOnshow: number;
}
