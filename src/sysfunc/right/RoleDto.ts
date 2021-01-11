import {BaseDto} from "../../datamodel/dto/BaseDto";

export class RoleDto extends BaseDto {
    roleId: number;
    roleName: string;
    roleType: string;
    xh: number;
}
