import SchemaDto from "../../datamodel/dto/SchemaDto";
import {BaseDto} from "../../datamodel/dto/BaseDto";

export class PageDetailDto extends BaseDto {
    pageId: number;
    pageDetailId: number;
    viewId: number;
    pagePosition: string;
    initWidth: number;
    initHeight: number;
}
