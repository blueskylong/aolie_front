import FormulaDto from "../../datamodel/dto/FormulaDto";
import {CommonUtils} from "../../common/CommonUtils";

export class FormulaInfo {
    private formulaDto: FormulaDto;

    getFormulaDto(): FormulaDto {
        return this.formulaDto;
    }

    setFormulaDto(value: FormulaDto) {
        this.formulaDto = value;
    }

    static genNewFormula(schemaId, version, columnId) {
        let dto = new FormulaDto();
        dto.versionCode = version;
        dto.schemaId = schemaId;
        dto.columnId = columnId;
        dto.formulaId = CommonUtils.genId();
        return dto;
    }
}
