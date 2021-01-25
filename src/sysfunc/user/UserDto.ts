import {BaseDto} from "../../datamodel/dto/BaseDto";

export class UserDto extends BaseDto {
    userId: number;
    userName: string;
    phone: string;
    addr: string;
    eMail: string;
    enabled: number;
    password: string;
    avatar: string;
    state: string;
    accountCode: string;
    lockoutTime;
    belongOrg: number;
}
