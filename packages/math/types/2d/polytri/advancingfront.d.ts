/**
 * Advancing front node
 * @constructor
 * @private
 * @struct
 * @param {!XY} p - Point
 * @param {Triangle=} t triangle (optional)
 */
declare var Node: (p: any, t: any) => void;
/**
 * @constructor
 * @private
 * @struct
 * @param {Node} head
 * @param {Node} tail
 */
declare var AdvancingFront: (head: any, tail: any) => void;
export { AdvancingFront, Node };
