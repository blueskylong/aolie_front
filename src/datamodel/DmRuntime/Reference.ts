import {ReferenceDto} from "../dto/ReferenceDto";
import {ConstraintDto} from "../dto/ConstraintDto";
import {PopulateBean} from "../../decorator/decorator";

/**
 * 引用信息处理类
 */
export class Reference {
    private referenceDto: ReferenceDto;

    getReferenceDto(): ReferenceDto {
        return this.referenceDto;
    }

    @PopulateBean(ReferenceDto)
    setReferenceDto(value: ReferenceDto) {
        this.referenceDto = value;
    }
}
