/**
 * 权限树,生成时,可检查权限树是不是出现循环
 *
 * @author xxl
 * @version V0.0.1
 * @date 2021/2/20 0020 10:43
 **/
import {RightResourceDto} from "../service/RightResourceDto";

export class RightNode {
    /**
     * 下级权限节点,根据关系 配置查询
     */
    private lstSub = new Array<RightNode>();

    private lstParent = new Array<RightNode>();
    /**
     * 权限ID
     */
    private rightId: number;
    /**
     * 权限名称
     */
    private rightName: string;

    private dto: RightResourceDto;


    public getLstSub(): Array<RightNode> {
        return this.lstSub;
    }

    public setLstSub(lstSub: Array<RightNode>) {
        this.lstSub = lstSub;
    }

    public addSubNode(node: RightNode) {
        this.lstSub.push(node);
    }

    public addParentNode(node: RightNode) {
        this.lstParent.push(node);
    }

    public getRightId() {
        return this.rightId;
    }

    public setRightId(rightId: number) {
        this.rightId = rightId;
    }

    public getRightName(): string {
        return this.rightName;
    }

    public setRightName(rightName: string) {
        this.rightName = rightName;
    }

    public getDto(): RightResourceDto {
        return this.dto;
    }

    public setDto(dto: RightResourceDto) {
        this.dto = dto;
    }

    public getLstParent(): Array<RightNode> {
        return this.lstParent;
    }

    public setLstParent(lstParent: Array<RightNode>) {
        this.lstParent = lstParent;
    }

}
