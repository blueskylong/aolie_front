import {MenuFunc} from "../decorator/decorator";
import {ManagedFunc} from "../blockui/ManagedFunc";
import {MenuButtonDto} from "../sysfunc/menu/dto/MenuButtonDto";
import {SchemaFactory} from "../datamodel/SchemaFactory";
import {FormulaParse} from "../datamodel/DmRuntime/formula/FormulaParse";


@MenuFunc("TestFunc2")
export default class TestFunc2 extends ManagedFunc<any> {

}
