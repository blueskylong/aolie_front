//注意,注意引入的方式
/**数据设计*/
import "./dmdesign/DmDesign";
/**界面设计*/
import "./uidesign/BlockDesign";
/**功能设计*/
import "./funcdesign/PageDesign";
/**
 * 通用设计功能
 */
import "./blockui/ManagedFunc";

import "./test/TestFunc";
import "./test/TestFunc2";

///以下是视图注册
import "./sysfunc/user/UserToResource"
import "./sysfunc/right/RoleToResource"
import "./sysfunc/right/RightRelation"

import "./sysfunc/right/RightRelationFunc";
import "./workflow/deploy/DeployUI";


export class FunctionReg {

}

new FunctionReg();

