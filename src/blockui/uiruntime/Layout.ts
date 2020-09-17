import {LayoutDto} from "../../uidesign/dto/LayoutDto";

export class Layout {
    private _dto: LayoutDto;

    get dto(): LayoutDto {
        return this._dto;
    }

    set dto(value: LayoutDto) {
        this._dto = value;
    }
}
