import {ComponentDto} from "../uidesign/dto/ComponentDto";

export class MockServer {

    public static getComponents(): Array<ComponentDto> {
        let arr = new Array<ComponentDto>();
        let comp
        comp = new ComponentDto();
        comp.columnId = 1;
        comp.blockId = 1;
        comp.horSpan = 4;
        comp.titlePosition = "none";
        // comp.titleSpan = 3;
        comp.title = "第1个控件:";
        comp.lvlCode = '001';
        comp.dispType = "panel";
        arr.push(comp);
        comp = new ComponentDto();
        comp.columnId = 2;
        comp.blockId = 1;
        comp.horSpan = 12;
        comp.titlePosition = "left";
        comp.titleSpan = 3;
        comp.title = "第一个控件:";
        comp.lvlCode = '001001';
        comp.dispType = "text";
        arr.push(comp);

        comp = new ComponentDto();
        comp.columnId = 3;
        comp.blockId = 1;
        comp.horSpan = 12;
        comp.titlePosition = "left";
        comp.titleSpan = 3;
        comp.title = "第二个控件:";
        comp.lvlCode = '001002';
        comp.dispType = "text";
        arr.push(comp);

        comp = new ComponentDto();
        comp.columnId = 4;
        comp.blockId = 1;
        comp.horSpan = 4;
        comp.verSpan = 10;
        comp.titlePosition = "left";
        comp.titleSpan = 3;
        comp.title = "第3个控件:";
        comp.lvlCode = '002';
        comp.dispType = "textarea";
        arr.push(comp);

        comp = new ComponentDto();
        comp.columnId = 1;
        comp.blockId = 1;
        comp.horSpan = 4;
        comp.titlePosition = "none";
        // comp.titleSpan = 3;
        comp.title = "第1个控件:";
        comp.lvlCode = '003';
        comp.dispType = "panel";
        arr.push(comp);
        comp = new ComponentDto();
        comp.columnId = 2;
        comp.blockId = 1;
        comp.horSpan = 12;
        comp.titlePosition = "left";
        comp.titleSpan = 3;
        comp.title = "第d个控件:";
        comp.lvlCode = '003001';
        comp.dispType = "text";
        arr.push(comp);

        comp = new ComponentDto();
        comp.columnId = 3;
        comp.blockId = 1;
        comp.horSpan = 12;
        comp.titlePosition = "left";
        comp.titleSpan = 3;
        comp.title = "第x个控件:";
        comp.lvlCode = '003002';
        comp.dispType = "text";
        arr.push(comp);

        return arr;
    }

}