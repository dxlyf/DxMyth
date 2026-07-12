import { PathBuilder } from './PathBuilder';
/** 布尔运算类型 */
export declare enum BoolOp {
    Union = "union",// 并集 A ∪ B
    Intersect = "intersect",// 交集 A ∩ B
    Difference = "difference",// 差集 A - B
    Xor = "xor"
}
/**
 * Perform a boolean operation on two paths (union, intersect, difference, xor).
 *
 * Curves (quadratic/cubic beziers) are preserved in the output.
 * The algorithm uses recursive subdivision for curve-curve intersection detection
 * and Greiner-Hormann style polygon clipping for the boolean logic.
 *
 * @param subject - The subject (first) path
 * @param clip - The clip (second) path
 * @param op - The boolean operation
 * @returns A new PathBuilder containing the result with curve segments preserved
 */
export declare function pathBooleanOp(subject: PathBuilder, clip: PathBuilder, op: BoolOp): PathBuilder;
