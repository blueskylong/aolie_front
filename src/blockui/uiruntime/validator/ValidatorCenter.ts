import {BlockViewer} from "../BlockViewer";
import {StringMap} from "../../../common/StringMap";
import {IValidator} from "../IValidator";
import {ApplicationContext} from "../../../decorator/decorator";
import {Component} from "../Component";
import {Form} from "../../Form";

export abstract class ValidatorCenter implements IValidator {
    protected lstValidator;
    protected viewer: BlockViewer;

    protected mapValidator: StringMap<Array<IValidator>>;

    constructor(viewer: BlockViewer) {
        this.initFieldValidator(viewer);
    }

    initFieldValidator(viewer: BlockViewer) {
        if (!viewer) {
            return;
        }
        this.viewer = viewer;
        let lstValidator = ApplicationContext.getValidates();
        this.mapValidator = new StringMap();
        let lstComValidator = new Array<IValidator>();
        for (let com of viewer.getLstComponent()) {
            lstComValidator = new Array<IValidator>();
            for (let validator of lstValidator) {
                if (validator.isConcerned(com, viewer)) {
                    lstComValidator.push(validator.getInstance(com, viewer));
                }
            }
            if (lstComValidator.length > 0) {
                this.mapValidator.set(com.getColumn().getColumnDto().fieldName, lstComValidator);
            }
        }
    }

    getInstance(component: Component, viewer: BlockViewer): IValidator {
        return this;
    }

    isConcerned(component: Component, viewer: BlockViewer): boolean {
        return this.mapValidator.has(component.getColumn().getColumnDto().fieldName);
    }

    validateField(fieldName, value, row, viewer?: BlockViewer): string {
        let lstValidator = this.mapValidator.get(fieldName);
        if (!lstValidator) {
            return null;
        }
        let errs = "";
        for (let validator of lstValidator) {
            let err = validator.validateField(fieldName, value, row, viewer);
            if (err) {
                errs += err + ";";
            }
        }
        return errs;
    }

    abstract bindForm($form: Form);

}
