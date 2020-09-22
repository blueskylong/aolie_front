import {Reference} from "./Reference";
import {ColumnDto} from "../dto/ColumnDto";
import {PopulateBean} from "../../decorator/decorator";
import {Formula} from "../../blockui/uiruntime/Formula";
import FormulaDto from "../dto/FormulaDto";

/**
 * 表列信息处理类
 */
export class Column {
    private columnDto: ColumnDto;
    private reference: Reference;
    private lstFormula: Array<Formula>;

    getColumnDto(): ColumnDto {
        return this.columnDto;
    }

    @PopulateBean(ColumnDto)
    setColumnDto(value: ColumnDto) {
        this.columnDto = value;
    }

    getReference(): Reference {
        return this.reference;
    }

    @PopulateBean(Reference)
    setReference(value: Reference) {
        this.reference = value;
    }

    getLstFormula(): Array<Formula> {
        return this.lstFormula;
    }

    getLstFormulaDto(): Array<FormulaDto> {
        let result = new Array<FormulaDto>();
        if (this.getLstFormula()) {
            for (let formula of this.getLstFormula()) {
                result.push(formula.getFormulaDto());
            }
        }
        return result;
    }

    @PopulateBean(Formula)
    setLstFormula(value: Array<Formula>) {
        this.lstFormula = value;
    }
}
