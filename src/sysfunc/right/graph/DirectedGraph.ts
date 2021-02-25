/**
 * 有向图, 摘自 https://www.tuicool.com/articles/ERfiym
 *
 * @author xxl
 * @version V0.0.1
 * @date 2021/2/20 0020 15:19
 **/
import {StringMap} from "../../../common/StringMap";


export class DirectedGraph<T> {

    private mNode = new StringMap<T>();
    private mGraphChildren = new StringMap<Array<T>>();
    private mGraphParent = new StringMap<Array<T>>();

    /**
     * Adds a new node to the graph. If the node already exists, this function is a no-op.
     *
     * @param node The node to add.
     * @return Whether or not the node was added.
     */
    public addNode(node: T): boolean {
        /* If the node already exists, don't do anything. */
        if (this.mGraphChildren.has(node.toString())) {
            return false;
        }
        this.mNode.set(node.toString(), node);

        /* Otherwise, add the node with an empty set of outgoing edges. */
        this.mGraphChildren.set(node.toString(), new Array<T>());
        this.mGraphParent.set(node.toString(), new Array<T>());
        return true;
    }

    /**
     * Given a start node, and a destination, adds an arc from the start node to the destination. If an arc already exists, this operation is a no-op.
     * If either endpoint does not exist in the graph, throws a NoSuchElementException.
     *
     * @param start The start node.
     * @param dest  The destination node.
     * @throws NoSuchElementException If either the start or destination nodes do not exist.
     */
    public addEdge(start: T, dest: T) {
        /* Confirm both endpoints exist. */
        if (!this.mGraphChildren.has(start.toString())) {
            throw new Error("The start node does not exist in the graph.");
        } else if (!this.mGraphChildren.has(dest.toString())) {
            throw new Error("The destination node does not exist in the graph.");
        }
        /* Add the edge. */
        this.mGraphChildren.get(start.toString()).push(dest);
        this.mGraphParent.get(dest.toString()).push(start);
    }

    /**
     * Removes the edge from start to dest from the graph. If the edge does not exist, this operation is a no-op. If either endpoint does not exist,
     * this throws a NoSuchElementException.
     *
     * @param start The start node.
     * @param dest  The destination node.
     * @throws NoSuchElementException If either node is not in the graph.
     */
    public removeEdge(start: T, dest: T) {
        /* Confirm both endpoints exist. */
        if (!this.mGraphChildren.has(start.toString())) {
            throw new Error("The start node does not exist in the graph.");
        } else if (!this.mGraphChildren.has(dest.toString())) {
            throw new Error("The destination node does not exist in the graph.");
        }
        this.mGraphChildren.get(start.toString()).splice(this.mGraphChildren.get(start.toString()).indexOf(dest), 1);
        this.mGraphChildren.get(dest.toString()).splice(this.mGraphChildren.get(dest.toString()).indexOf(dest), 1);
    }

    /**
     * Given two nodes in the graph, returns whether there is an edge from the first node to the second node. If either node does not exist in the
     * graph, throws a NoSuchElementException.
     *
     * @param start The start node.
     * @param end   The destination node.
     * @return Whether there is an edge from start to end.
     * @throws NoSuchElementException If either endpoint does not exist.
     */
    public edgeExists(start: T, end: T): boolean {
        /* Confirm both endpoints exist. */
        if (!this.mGraphChildren.has(start.toString())) {
            throw new Error("The start node does not exist in the graph.");
        } else if (!this.mGraphChildren.has(end.toString())) {
            throw new Error("The end node does not exist in the graph.");
        }
        return this.mGraphChildren.get(start.toString()).indexOf(end) != -1;
    }

    /**
     * Given a node in the graph, returns an immutable view of the edges leaving that node as a set of endpoints.
     *
     * @param node The node whose edges should be queried.
     * @return An immutable view of the edges leaving that node.
     * @throws NoSuchElementException If the node does not exist.
     */
    public edgesFrom(node: T): Array<T> {
        /* Check that the node exists. */
        let arcs = this.mGraphChildren.get(node.toString());
        if (arcs == null) {
            throw new Error("Source node does not exist.");
        }
        return arcs;
    }

    /**
     * Given a node in the graph, returns an immutable view of the edges from that node as a set of startpoints.
     *
     * @param node The node whose edges should be queried.
     * @return An immutable view of the edges leaving that node.
     * @throws NoSuchElementException If the node does not exist.
     */
    public edgesTo(node: T): Array<T> {
        /* Check that the node exists. */
        let arcs = this.mGraphParent.get(node.toString());
        if (arcs == null) {
            throw new Error("Source node does not exist.");
        }
        return arcs;
    }

    /**
     * Returns an iterator that can traverse the nodes in the graph.
     *
     * @return An iterator that traverses the nodes in the graph.
     */

    public forEach(callback: (key: string, value: T, map: StringMap<T>) => any) {
        this.mNode.forEach(callback);
    }

    /**
     * Returns the number of nodes in the graph.
     *
     * @return The number of nodes in the graph.
     */
    public size() {
        return this.mGraphChildren.getSize();
    }

    /**
     * Returns whether the graph is empty.
     *
     * @return Whether the graph is empty.
     */
    public isEmpty() {
        return this.mGraphChildren.getSize() > 0;
    }


}
