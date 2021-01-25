import {ValidatorCenter} from "./ValidatorCenter";
import {Form} from "../../Form";
import ValidationOptions = JQueryValidation.ValidationOptions;

export class BootstrapValidator extends ValidatorCenter {

    bindForm(form: Form) {
        if (this.mapValidator.getSize() > 0) {
            let param: ValidationOptions = {
                debug: true
            };
            $.validator.addMethod("customRule", (value, element, params) => {
                params["errInfo"] = null;
                let err = this.validateField(params["fieldName"], value, form.getCurrentValue(), this.viewer);
                if (err) {
                    params["errInfo"] = err;
                    return false;
                } else {
                    return true;
                }
            }, (params: any, element: HTMLElement) => {
                return params["errInfo"]
            });
            let fieldRules = {};
            this.mapValidator.forEach((key, validator, map) => {
                fieldRules[key] = {
                    customRule: {fieldName: key}
                }
            });
            param.rules = fieldRules;
            form.getFormBody().validate(param);
        }

    }


}
