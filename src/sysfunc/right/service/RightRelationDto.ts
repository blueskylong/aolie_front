/**
 * @author xxl
 * @date 2021-01-08 13:43:06
 * @version 1.0
 */
import {BaseDto} from "../../../datamodel/dto/BaseDto";


export class RightRelationDto extends BaseDto {

    private rsIdFrom: number;
    private rsIdTo: number;
    private rrId: number;
    private transmitable: number;
    private relationName: string;

    public setRsIdFrom(rsIdFrom) {
        this.rsIdFrom = rsIdFrom;
    }

    public getRsIdFrom() {
        return this.rsIdFrom;
    }

    public setRsIdTo(rsIdTo) {
        this.rsIdTo = rsIdTo;
    }

    public getRsIdTo() {
        return this.rsIdTo;
    }

    public setRrId(rrId) {
        this.rrId = rrId;
    }

    public getRrId() {
        return this.rrId;
    }

    public setTransmitable(transmitable) {
        this.transmitable = transmitable;
    }

    public getTransmitable() {
        return this.transmitable;
    }

    public setRelationName(relationName) {
        this.relationName = relationName;
    }

    public getRelationName() {
        return this.relationName;
    }

    toString(){
        return this.rrId;
    }

}
