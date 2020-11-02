import SchemaDto from "../../datamodel/dto/SchemaDto";
import {BaseDto} from "../../datamodel/dto/BaseDto";

export class PageDetailDto extends BaseDto {
    pageId: number;
    pageDetailId: number;
    viewId: string;
    pagePosition: number;
    initWidth: number;
    initHeight: number;
}
