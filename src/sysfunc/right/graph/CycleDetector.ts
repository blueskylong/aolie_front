/**
 * 循环检查,摘自 https://www.tuicool.com/articles/ERfiym
 *
 * @version V0.0.1
 * @modified by  xxl
 * @date 2021/2/20 0020 15:22
 **/
import {DirectedGraph} from "./DirectedGraph";
import {StringMap} from "../../../common/StringMap";

export class CycleDetector<T> {
    private static marked = "marked";

    private static complete = "complete";

    private graph: DirectedGraph<T>;

    private marks: StringMap<String>;

    private verticesInCycles: Array<T>;

    constructor(graph: DirectedGraph<T>) {
        this.graph = graph;
        this.marks = new StringMap<String>();
        this.verticesInCycles = new Array<T>();
    }

    public containsCycle(): boolean {
        this.graph.forEach((key, value, map) => {
            // 如果v正在遍历或者遍历完成,不需要进入mark(),因为mark是一个递归调用，使用的是深度优先搜索算法;
            // 这是为了保证1个顶点只会遍历一次
            if (!this.marks.has(value.toString())) {
                if (this.mark(value)) {
                    // return true;
                }
            }
        });

        return this.verticesInCycles.length > 0;
    }

    //DFS算法,遍历顶点vertex
    // @return 当前顶点是否在环上
    private mark(vertex: T): boolean {
        let localCycles = new Array<T>();

        // 当前顶点vertex,遍历开始
        this.marks.set(vertex.toString(), CycleDetector.marked);

        for (let u of this.graph.edgesFrom(vertex)) {
            // u的遍历还没有结束,说明存在u->vertex的通路,也存在vertex->u的通路,形成了循环
            if (this.marks.has(u.toString()) && this.marks.get(u.toString()) == CycleDetector.marked) {
                localCycles.push(vertex);
                // return true;
            } else if (!this.marks.has(u.toString())) {
                if (this.mark(u)) {
                    localCycles.push(vertex);
                    // return true;
                }
            }
        }

        // 当前顶点vertex,遍历完成
        this.marks.set(vertex.toString(), CycleDetector.complete);

        this.verticesInCycles.push(...localCycles);
        return localCycles.length > 0;
    }

    public getVerticesInCycles(): Array<T> {
        return this.verticesInCycles;
    }
}
