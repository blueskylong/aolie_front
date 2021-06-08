/**
 * 这是节点的动态信息,从流程节点的定义中取得,不存储到数据库
 *
 * @author xxl
 * @version V0.0.1
 * @date 2021/3/8 0008 22:11
 **/
export class WfNode {
    /**
     * 开始节点定义
     */
    public static START_NODE_ID = "0";
    /**
     * 结束节点定义
     */
    public static END_NODE_ID = "1";


    /**
     * 状态名
     */
    private name: string;
    /**
     * 状态编码
     */
    private code: string;
    /**
     * 排序号
     */
    private orderNo: number;
    /**
     * 定义的节点ID
     */
    private defineId: string;

    /**
     * 自定义节点ID
     */
    private actId: string;

    /**
     * 审核类型,和审核模块挂接
     */
    private auditType: string;

    /**
     * 流程实例ID（返回值时使用）
     */
    private processInstanceId: string;

    private isIgnore: boolean;

    /**
     * 直接指定的人
     */
    protected assignee: string;
    /**
     * 任务候选人
     */
    protected candidateUsers = new Array<string>();
    /**
     * 任务候选角色
     */
    protected candidateGroups = new Array<string>();


    public getActId() {
        return this.actId;
    }

    public setActId(actId) {
        this.actId = actId;
    }

    public getProcessInstanceId() {
        return this.processInstanceId;
    }

    public setProcessInstanceId(processInstanceId) {
        this.processInstanceId = processInstanceId;
    }


    public getDefineId() {
        return this.defineId;
    }

    public setDefineId(defineId) {
        this.defineId = defineId;
    }


    /**
     * 生成虚拟的开始节点
     *
     * @return
     */
    public static newStartStatus() {
        let status = new WfNode();
        status.setName("开始");
        status.setCode(WfNode.START_NODE_ID);
        status.setDefineId(WfNode.START_NODE_ID);
        return status;
    }

    /**
     * 生成虚拟的结束节点
     *
     * @return
     */
    public static newEndStatus() {
        let status = new WfNode();
        status.setName("完成");
        status.setCode(WfNode.END_NODE_ID);
        status.setDefineId(WfNode.END_NODE_ID);
        return status;
    }

    public getName() {
        return this.name;
    }

    public setName(name) {
        this.name = name;
    }

    public getCode() {
        return this.code;
    }

    public setCode(code) {
        this.code = code;
    }

    public getOrderNo() {
        return this.orderNo;
    }

    public setOrderNo(orderNo) {
        this.orderNo = orderNo;
    }

    public getIsIgnore() {
        return this.isIgnore;
    }

    public setIgnore(ignore) {
        this.isIgnore = ignore;
    }

    public isEmpty() {
        return this.code == null && this.name == null;
    }


    public getAuditType() {
        return this.auditType;
    }

    public setAuditType(auditType) {
        this.auditType = auditType;
    }

    public getAssignee() {
        return this.assignee;
    }

    public setAssignee(assignee) {
        this.assignee = assignee;
    }

    public getCandidateUsers() {
        return this.candidateUsers;
    }

    public setCandidateUsers(candidateUsers) {
        this.candidateUsers = candidateUsers;
    }

    public getCandidateGroups() {
        return this.candidateGroups;
    }

    public setCandidateGroups(candidateGroups: Array<string>) {
        this.candidateGroups = candidateGroups;
    }

    public genCopy() {
        let node = new WfNode();
        node.setName(this.getName());
        node.setCode(this.getCode());
        node.setOrderNo(this.getOrderNo());
        node.setDefineId(this.getDefineId());
        node.setActId(this.getActId());
        node.setAuditType(this.auditType);
        node.setProcessInstanceId(this.processInstanceId);
        node.isIgnore = this.isIgnore;
        node.assignee = this.assignee;
        if (this.candidateGroups != null) {
            node.candidateGroups = this.candidateGroups;
        }
        if (this.candidateUsers != null) {
            node.candidateUsers = this.candidateUsers;
        }
        return node;
    }
}
