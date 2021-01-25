import {Reference} from "./Reference";
import {ColumnDto} from "../dto/ColumnDto";
import {PopulateBean} from "../../decorator/decorator";
import FormulaDto from "../dto/FormulaDto";
import {Constants} from "../../common/Constants";
import {FormulaInfo} from "../../blockui/uiruntime/FormulaInfo";

/**
 * 表列信息处理类
 */
export class Column {
    private columnDto: ColumnDto;
    private reference: Reference;
    private lstFormula: Array<FormulaInfo> = [];
    private lstFormulaDto: Array<FormulaDto> = [];

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

    getLstFormula(): Array<FormulaInfo> {
        return this.lstFormula;
    }

    getLstFormulaDto(): Array<FormulaDto> {
        if (!this.lstFormulaDto) {
            this.lstFormulaDto = [];
        }
        return this.lstFormulaDto;
    }

    prepareData(index) {
        this.getColumnDto().fieldIndex = index;
        //根据dto排序决定 formula位置.因为在设计时,没有主动取得数据进行排序,这里就用其它的办法做了排序.
        if (this.lstFormulaDto) {
            if (!this.lstFormula) {
                this.lstFormula = [];
            } else {
                this.lstFormula.splice(0, this.lstFormula.length);
            }
            let i = 0;
            for (let dto of this.lstFormulaDto) {
                let formula = new FormulaInfo();
                formula.setFormulaDto(dto);
                dto.orderNum = ++i;
                this.lstFormula.push(formula);
            }
        }
    }

    @PopulateBean(FormulaInfo)
    setLstFormula(value: Array<FormulaInfo>) {
        this.lstFormula = value;
        this.lstFormulaDto = [];
        if (value) {
            value.forEach((formula, index) => {
                this.lstFormulaDto.push(formula.getFormulaDto());
            });
        }
    }

    isNumberColumn(): boolean {
        return this.getColumnDto().fieldType === Constants.FieldType.decimal
            || this.getColumnDto().fieldType === Constants.FieldType.int;
    }
}
