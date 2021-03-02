import {BaseDto} from "../../datamodel/dto/BaseDto";

export class UserDto extends BaseDto {
    private userId: number;
    private userName: string;
    private phone: string;
    private addr: string;
    private eMail: string;
    private enabled: number;
    private password: string;
    private avatar: string;
    private state: string;
    private accountCode: string;
    private lockoutTime;
    private belongOrg: number;


    getUserId(): number {
        return this.userId;
    }

    setUserId(value: number) {
        this.userId = value;
    }

    getUserName(): string {
        return this.userName;
    }

    setUserName(value: string) {
        this.userName = value;
    }

    getPhone(): string {
        return this.phone;
    }

    setPhone(value: string) {
        this.phone = value;
    }

    getAddr(): string {
        return this.addr;
    }

    setAddr(value: string) {
        this.addr = value;
    }

    getEMail(): string {
        return this.eMail;
    }

    setEMail(value: string) {
        this.eMail = value;
    }

    getEnabled(): number {
        return this.enabled;
    }

    setEnabled(value: number) {
        this.enabled = value;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(value: string) {
        this.password = value;
    }

    getAvatar(): string {
        return this.avatar;
    }

    setAvatar(value: string) {
        this.avatar = value;
    }

    getState(): string {
        return this.state;
    }

    setState(value: string) {
        this.state = value;
    }

    getAccountCode(): string {
        return this.accountCode;
    }

    setAccountCode(value: string) {
        this.accountCode = value;
    }

    getLockoutTime() {
        return this.lockoutTime;
    }

    setLockoutTime(value) {
        this.lockoutTime = value;
    }

    getBelongOrg(): number {
        return this.belongOrg;
    }

    seBelongOrg(value: number) {
        this.belongOrg = value;
    }
}
