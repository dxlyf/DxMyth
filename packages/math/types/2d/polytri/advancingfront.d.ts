export class AdvancingFront {
    private constructor();
    /** @return {Node} */
    head(): Node;
    /** @param {Node} node */
    setHead(node: Node): void;
    head_: Node | undefined;
    /** @return {Node} */
    tail(): Node;
    /** @param {Node} node */
    setTail(node: Node): void;
    tail_: Node | undefined;
    /** @return {Node} */
    search(): Node;
    /** @param {Node} node */
    setSearch(node: Node): void;
    search_node_: any;
    /** @return {Node} */
    findSearchNode(): Node;
    /**
     * @param {number} x value
     * @return {Node}
     */
    locateNode(x: number): Node;
    /**
     * @param {!XY} point - Point
     * @return {Node}
     */
    locatePoint(point: XY): Node;
}
/**
 * Advancing front node
 * @constructor
 * @private
 * @struct
 * @param {!XY} p - Point
 * @param {Triangle=} t triangle (optional)
 */
export function Node(p: XY, t?: Triangle | undefined): void;
export class Node {
    private constructor();
    /** @type {XY} */
    point: XY;
    /** @type {Triangle|null} */
    triangle: Triangle | null;
    /** @type {Node|null} */
    next: Node | null;
    /** @type {Node|null} */
    prev: Node | null;
    /** @type {number} */
    value: number;
}
