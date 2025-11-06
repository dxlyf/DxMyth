import { VectorArray } from './vector';
export type MatrixArray = number[];
/**
 * Create a identity matrix.
 */
export declare function create(): MatrixArray;
/**
 * 设置矩阵为单位矩阵
 */
export declare function identity(out: MatrixArray): MatrixArray;
/**
 * 复制矩阵
 */
export declare function copy(out: MatrixArray, m: MatrixArray): MatrixArray;
/**
 * 矩阵相乘
 */
export declare function mul(out: MatrixArray, m1: MatrixArray, m2: MatrixArray): MatrixArray;
/**
 * 平移变换
 */
export declare function translate(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray;
/**
 * Suppose positive y is towards screen-bottom and positive x is towards screen-right;
 * positive rotation means rotating anticlockwise. (opposite to CSS transform rotate)
 */
export declare function rotate(out: MatrixArray, a: MatrixArray, rad: number, pivot?: VectorArray): MatrixArray;
/**
 * 缩放变换
 */
export declare function scale(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray;
/**
 * 求逆矩阵
 */
export declare function invert(out: MatrixArray, a: MatrixArray): MatrixArray | null;
/**
 * Clone a new matrix.
 */
export declare function clone(a: MatrixArray): MatrixArray;
