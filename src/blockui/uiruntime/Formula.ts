import FormulaDto from "../../datamodel/dto/FormulaDto";

export class Formula {
    private formulaDto: FormulaDto;

    getFormulaDto(): FormulaDto {
        return this.formulaDto;
    }

    setFormulaDto(value: FormulaDto) {
        this.formulaDto = value;
    }
}
