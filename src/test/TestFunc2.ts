import {MenuFunc} from "../decorator/decorator";
import {ManagedFunc} from "../blockui/ManagedFunc";
import {NetRequest} from "../common/NetRequest";
import {Alert} from "../uidesign/view/JQueryComponent/Alert";
import {CommonUtils} from "../common/CommonUtils";


@MenuFunc("TestFunc2")
export default class TestFunc2 extends ManagedFunc<any> {
    public sayHello() {
        TestService.sayHello();
    }

}

class TestService {
    public static sayHello() {
        NetRequest.axios.get("/wf/sayHello").then((result) => {
            if (CommonUtils.isHandleResult(result.data)) {
                Alert.showMessage("Error," + result.data.err)
            } else {
                Alert.showMessage("Recieve message:" + result.data);
            }

        });


    }

}
