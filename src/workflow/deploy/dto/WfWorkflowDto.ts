/**
 * @author xxl
 * @version 1.0
 * @date 2021-03-06 20:35:14
 */
import {BaseDto} from "../../../datamodel/dto/BaseDto";

export class WfWorkflowDto extends BaseDto {

    private wfId: number;
    private wfName: string;
    private wfKey: string;
    private isStrict: number;
    private modelId: number;
    private deployTime: Date;
    private deployUser: string;

    public setWfId(wfId) {
        this.wfId = wfId;
    }

    public getWfId() {
        return this.wfId;
    }

    public setWfName(wfName) {
        this.wfName = wfName;
    }

    public getWfName() {
        return this.wfName;
    }

    public setWfKey(wfKey) {
        this.wfKey = wfKey;
    }

    public getWfKey() {
        return this.wfKey;
    }


    public getIsStrict() {
        return this.isStrict;
    }

    public setIsStrict(isStrict) {
        this.isStrict = isStrict;
    }

    public getModelId() {
        return this.modelId;
    }

    public setModelId(modelId) {
        this.modelId = modelId;
    }

    public getDeployTime() {
        return this.deployTime;
    }

    public setDeployTime(deployTime) {
        this.deployTime = deployTime;
    }

    public getDeployUser() {
        return this.deployUser;
    }

    public setDeployUser(deployUser) {
        this.deployUser = deployUser;
    }
}
