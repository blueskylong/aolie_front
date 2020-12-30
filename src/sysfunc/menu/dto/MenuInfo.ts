import {MenuDto} from "./MenuDto";
import {PopulateBean} from "../../../decorator/decorator";
import {PageInfoDto} from "../../../funcdesign/dto/PageInfoDto";
import {MenuButtonDto} from "./MenuButtonDto";

export class MenuInfo {
    private menuDto: MenuDto;
    private lstBtns: Array<MenuButtonDto>;

    @PopulateBean(MenuDto)
    setMenuDto(dto: MenuDto) {
        this.menuDto = dto;
    }

    @PopulateBean(MenuButtonDto)
    setLstBtns(lstButton: Array<MenuButtonDto>) {
        this.lstBtns = lstButton;
    }

    public getMenuDto() {
        return this.menuDto;
    }

    public getLstBtns() {
        return this.lstBtns;
    }
}
