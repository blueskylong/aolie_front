import {ConstraintDto} from "../dto/ConstraintDto";
import {PopulateBean} from "../../decorator/decorator";
import {CommonUtils} from "../../common/CommonUtils";

export class Constraint {
    private constraintDto: ConstraintDto;
    /**
     * 引用到的表,方便查询
     */
    private lstRefTable: Array<number>;

    /**
     * 引用到的列,方便查询
     */
    private lstRefColumn: Array<number>;

    getConstraintDto(): ConstraintDto {
        return this.constraintDto;
    }

    @PopulateBean(ConstraintDto)
    setConstraintDto(value: ConstraintDto) {
        this.constraintDto = value;
    }

    gerLstRefTable(): Array<number> {
        return this.lstRefTable;
    }

    setLstRefTable(value: Array<number>) {
        this.lstRefTable = value;
    }

    getLstRefColumn(): Array<number> {
        return this.lstRefColumn;
    }

    setLstRefColumn(value: Array<number>) {
        this.lstRefColumn = value;
    }

    static genConstraintDto(schemaId?, versionId?) {
        let dto = new ConstraintDto();
        dto.id = CommonUtils.genId();
        dto.schemaId = schemaId;
        dto.versionCode = versionId;
        dto.disabled = 0;
        return dto;
    }
}
