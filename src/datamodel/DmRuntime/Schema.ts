import SchemaDto from "../dto/SchemaDto";
import {Constraint} from "./Constraint";
import {Reference} from "./Reference";
import {Formula} from "../../blockui/uiruntime/Formula";
import {PopulateBean} from "../../decorator/decorator";
import {Component} from "../../blockui/uiruntime/Component";
import {Table} from "../../blockui/table/Table";

export class Schema {
    private schemaDto: SchemaDto;
    /**
     * 下属表
     */
    private lstTable: Array<Table>;
    /**
     * 表间约束
     */
    private lstConstraint: Array<Constraint>;

    /**
     * 所有的引用信息
     */
    private lstReference: Array<Reference>;

    /**
     * 所有的公式
     */
    private lstFormula: Array<Formula>;

    getLstReference() {
        return this.lstReference;
    }

    @PopulateBean(Reference)
    setLstReference(lstReference: Array<Reference>) {
        this.lstReference = lstReference;
    }

    getLstFormula() {
        return this.lstFormula;
    }
    @PopulateBean(Formula)
    setLstFormula(lstFormula:Array<Formula>) {
        this.lstFormula = lstFormula;
    }


    getSchemaDto(): SchemaDto {
        return this.schemaDto;
    }

    @PopulateBean(SchemaDto)
    seSchemaDto(value: SchemaDto) {
        this.schemaDto = value;
    }

    getLstTable(): Array<Table> {
        return this.lstTable;
    }

    @PopulateBean(Table)
    setLstTable(value: Array<Table>) {
        this.lstTable = value;
    }

    getLstConstraint(): Array<Constraint> {
        return this.lstConstraint;
    }
    @PopulateBean(Constraint)
    setLstConstraint(value: Array<Constraint>) {
        this.lstConstraint = value;
    }
}
