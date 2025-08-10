import { PathArray } from '../types';
/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 */
export declare function getTotalLength(pathInput: string | PathArray): number;
