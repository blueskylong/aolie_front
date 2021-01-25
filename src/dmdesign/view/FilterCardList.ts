import {CardList} from "../../blockui/cardlist/CardList";
import {BlockViewDto} from "../../uidesign/dto/BlockViewDto";
import {Schema} from "../../datamodel/DmRuntime/Schema";
import {FilterInput} from "../../uidesign/view/JQueryComponent/FilterInput";
import {StringMap} from "../../common/StringMap";
import {GlobalParams} from "../../common/GlobalParams";

export class FilterCardList<T extends BlockViewDto> extends CardList<T> {

    setSchema(schema: Schema) {
        let obj = new StringMap();
        obj.set(FilterInput.schemaParamName, schema);
        this.setExtendData(obj);
    }

    setData(value, schema: Schema) {
        this.setSchema(schema);
        this.setValue(value);

    }

    static getInstance(blockId, version?) {
        let blockDto = new BlockViewDto();
        blockDto.blockViewId = blockId;
        blockDto.versionCode = version || GlobalParams.getLoginVersion();
        blockDto.showHead = 1;
        return new FilterCardList(blockDto);
    }

    afterComponentAssemble(): void {
        this.setFullEditable();
        this.setShowHead(true);
        this.setSortable(true);
        super.afterComponentAssemble();
    }
}
