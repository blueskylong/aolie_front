import {Reference} from "./Reference";
import {ColumnDto} from "../dto/ColumnDto";
import {PopulateBean} from "../../decorator/decorator";

/**
 * 表列信息处理类
 */
export class Column {
    private columnDto: ColumnDto;
    private reference: Reference;

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
}
