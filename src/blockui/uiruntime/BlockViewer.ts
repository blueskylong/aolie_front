import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {Component} from "./Component";
import {PopulateBean} from "../../decorator/decorator";
import {CommonUtils} from "../../common/CommonUtils";

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

    findFieldIdByName(fieldName):number {
        if (fieldName == null || !this.getLstComponent()) {
            return null;
        }
        let isNeedConvert = !!this.blockViewDto.fieldToCamel;
        if (isNeedConvert) {
            fieldName = CommonUtils.toUnderLine(fieldName);
        }
        for (let com of this.lstComponent) {
            if (com.getColumn().getColumnDto().fieldName === fieldName) {
                return com.getColumn().getColumnDto().columnId;
            }
        }
        return null;
    }
}
