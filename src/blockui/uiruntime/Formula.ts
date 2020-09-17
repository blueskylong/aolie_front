import FormulaDto from "../../datamodel/dto/FormulaDto";

export class Formula {
    private _formulaDto: FormulaDto;
    get formulaDto(): FormulaDto {
        return this._formulaDto;
    }

    set formulaDto(value: FormulaDto) {
        this._formulaDto = value;
    }
}
