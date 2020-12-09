import SchemaDto from "../dto/SchemaDto";
import {Constraint} from "./Constraint";
import {Reference} from "./Reference";
import {Formula} from "../../blockui/uiruntime/Formula";
import {PopulateBean} from "../../decorator/decorator";
import {TableInfo} from "./TableInfo";
import FormulaDto from "../dto/FormulaDto";
import {TableColumnRelation} from "./TableColumnRelation";
import {Column} from "./Column";
import {ConstraintDto} from "../dto/ConstraintDto";
import TableDto from "../dto/TableDto";

export class Schema {
    private schemaDto: SchemaDto;
    /**
     * 下属表
     */
    private lstTable: Array<TableInfo>;
    /**
     * 表间约束
     */
    private lstConstraint: Array<Constraint>;

    //这是城只用作临时记录,给设计器一个直接操作的入口
    private lstConstraintDto: Array<ConstraintDto>;

    /**
     * 所有的引用信息
     */
    private lstReference: Array<Reference>;

    /**
     * 所有关系
     */
    private lstRelation: Array<TableColumnRelation>;


    getLstReference() {
        return this.lstReference;
    }

    @PopulateBean(Reference)
    setLstReference(lstReference: Array<Reference>) {
        this.lstReference = lstReference;
    }

    getLstFormula() {
        if (this.lstTable) {
            let result = new Array<FormulaDto>();
            for (let table of this.lstTable) {
                let dtos = table.getColFormulas();
                if (dtos && dtos.length > 0) {
                    result.push(...dtos);
                }
            }
        }
    }


    getSchemaDto(): SchemaDto {
        return this.schemaDto;
    }

    @PopulateBean(SchemaDto)
    setSchemaDto(value: SchemaDto) {
        this.schemaDto = value;
    }

    getLstTable(): Array<TableInfo> {
        return this.lstTable;
    }

    getLstTableDto() {
        if (this.lstTable) {
            let result = new Array<TableDto>();
            for (let table of this.lstTable) {
                result.push(table.getTableDto());
            }
            return result;
        }
        return null;
    }

    @PopulateBean(TableInfo)
    setLstTable(value: Array<TableInfo>) {
        this.lstTable = value;
    }

    getLstConstraint(): Array<Constraint> {
        if (!this.lstConstraint) {
            this.lstConstraint = [];
        }
        return this.lstConstraint;
    }

    getLstConstraintDto(): Array<ConstraintDto> {
        if (!this.lstConstraintDto) {
            this.lstConstraintDto = [];
            if (this.lstConstraint) {
                for (let constraint of this.lstConstraint) {
                    this.lstConstraintDto.push(constraint.getConstraintDto());
                }
            }
        }
        return this.lstConstraintDto;
    }

    @PopulateBean(Constraint)
    setLstConstraint(value: Array<Constraint>) {
        this.lstConstraint = value;
    }


    getLstRelation(): Array<TableColumnRelation> {
        return this.lstRelation;
    }

    @PopulateBean(TableColumnRelation)
    setLstRelation(value: Array<TableColumnRelation>) {
        this.lstRelation = value;
    }

    findColumn(colId: number): Column {
        if (this.lstTable && this.lstTable.length > 0) {
            for (let table of this.lstTable) {
                let column = table.findColById(colId);
                if (column) {
                    return column;
                }
            }
        }
        return null;
    }

    /**
     * 用于保存前的处理
     */
    public prepareData() {
        //这里主是要约束要从DTO转成
        this.getLstConstraint().splice(0, this.getLstConstraint().length);
        if (this.lstConstraintDto) {
            let index = 1
            for (let dto of this.lstConstraintDto) {
                dto.orderNum = index++;
                let c = new Constraint();
                c.setConstraintDto(dto);
                this.lstConstraint.push(c);
            }
        }

    }
}
