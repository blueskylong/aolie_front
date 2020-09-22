import SchemaDto from "../dto/SchemaDto";
import {Constraint} from "./Constraint";
import {Reference} from "./Reference";
import {Formula} from "../../blockui/uiruntime/Formula";
import {PopulateBean} from "../../decorator/decorator";
import {TableInfo} from "./TableInfo";
import FormulaDto from "../dto/FormulaDto";
import {TableColumnRelation} from "./TableColumnRelation";
import {Column} from "./Column";

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

    @PopulateBean(TableInfo)
    setLstTable(value: Array<TableInfo>) {
        this.lstTable = value;
    }

    getLstConstraint(): Array<Constraint> {
        return this.lstConstraint;
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
}
