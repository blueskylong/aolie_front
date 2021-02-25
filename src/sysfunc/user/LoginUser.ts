import {UserDto} from "./UserDto";
import {RoleDto} from "../right/RoleDto";

export class LoginUser extends UserDto  {
    //登录角色
    protected roleDto: RoleDto;

    getRoleDto() {
        return this.roleDto;
    }

    setRoleDto(roleDto: RoleDto) {
        this.roleDto = roleDto;
    }
}
