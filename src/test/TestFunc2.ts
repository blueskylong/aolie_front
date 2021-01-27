import {MenuFunc} from "../decorator/decorator";
import {ManagedFunc} from "../blockui/ManagedFunc";
import {MenuButtonDto} from "../sysfunc/menu/dto/MenuButtonDto";
import {SchemaFactory} from "../datamodel/SchemaFactory";
import {FormulaParse} from "../datamodel/DmRuntime/formula/FormulaParse";


@MenuFunc()
export default class TestFunc2 extends ManagedFunc<any> {

    handleButtonClick(btn: MenuButtonDto) {
        let filter = "${4958233176623655} >= 0 && #{1} == 3";
        console.log("origin str:" + filter);
        let filterCn = FormulaParse.getInstance(true, SchemaFactory.getSchema(1, "000000")).transToInner(filter);
        console.log("toChinese:" + filterCn);
        filter = FormulaParse.getInstance(true, SchemaFactory.getSchema(1, "000000")).transToCn(filterCn,);
        console.log("backToInner:" + filter);
    }
}
