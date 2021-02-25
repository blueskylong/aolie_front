import {BaseDto} from "../../../datamodel/dto/BaseDto";

export class RightResourceDto extends BaseDto {
    private rsId: number;
    private rsName: string;
    private resourceType: number;
    private resourceId: number;
    private transmitable: number;
    private filterType: string;
    private lvlCode: string;


    getRsId(): number {
        return this.rsId;
    }

    setRsId(value: number) {
        this.rsId = value;
    }

    getRsName(): string {
        return this.rsName;
    }

    setRsName(value: string) {
        this.rsName = value;
    }

    getResourceType(): number {
        return this.resourceType;
    }

    setResourceType(value: number) {
        this.resourceType = value;
    }

    getResourceId(): number {
        return this.resourceId;
    }

    setResourceId(value: number) {
        this.resourceId = value;
    }

    getTransmitable(): number {
        return this.transmitable;
    }

    setTransmitable(value: number) {
        this.transmitable = value;
    }

    getFilterType(): string {
        return this.filterType;
    }

    setFilterType(value: string) {
        this.filterType = value;
    }

    getLvlCode(): string {
        return this.lvlCode;
    }

    setLvlCode(value: string) {
        this.lvlCode = value;
    }

    toString(){
        return this.resourceId;
    }
}
