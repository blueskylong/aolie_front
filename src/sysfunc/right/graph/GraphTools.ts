import {RightNode} from "./RightNode";
import {StringMap} from "../../../common/StringMap";
import {DirectedGraph} from "./DirectedGraph";
import {RightResourceDto} from "../service/RightResourceDto";

export class GraphTools {
    static toNode(graph: DirectedGraph<RightResourceDto>): RightNode {

        let root = new RightNode();
        root.setRightId(-1);
        root.setRightName("权限关系");
        let mapNode = new StringMap<RightNode>();
        //第一遍,生成node
        graph.forEach((key, el, map) => {
            let node = new RightNode();
            node.setRightId(el.getRsId());
            node.setRightName(el.getRsName());
            node.setDto(el);
            mapNode.set(node.getRightId() + "", node);
        });
        //再次遍历,生成层次
        mapNode.forEach((key, node, map) => {

            let lstToDtos = graph.edgesFrom(node.getDto());
            if (lstToDtos != null && lstToDtos.length > 0) {
                //如果有子节点,则要加入到父节点上
                lstToDtos.forEach((el) => {
                    node.addSubNode(mapNode.get(el.getRsId() + ""));
                });
            }
            let lstFromResource = graph.edgesTo(node.getDto());
            if (lstFromResource != null && lstFromResource.length > 0) {
                lstFromResource.forEach((el) => {
                    node.addParentNode(mapNode.get(el.getRsId() + ""));
                });
            } else {
                //如果没有你节点,则直接挂接到根节点
                root.addSubNode(node);
            }
        });
        return root;
    }


}
