import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {Component} from "./Component";
import {PopulateBean} from "../../decorator/decorator";

export class BlockViewer {

    blockViewDto: BlockViewDto;
    /**
     * 字段显示信息列表
     */
    lstComponent: Array<Component>;

    getBlockViewDto(): BlockViewDto {
        return this.blockViewDto;
    }

    @PopulateBean(BlockViewDto)
    setBlockViewDto(value: BlockViewDto) {
        this.blockViewDto = value;
    }

    getLstComponent(): Array<Component> {
        return this.lstComponent;
    }

    @PopulateBean(Component)
    setLstComponent(value: Array<Component>) {
        this.lstComponent = value;
    }
}
