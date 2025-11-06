import { MatrixArray } from './matrix';
export type VectorArray = number[];
/**
 * 创建一个向量
 */
export declare function create(x?: number, y?: number): VectorArray;
/**
 * 复制向量数据
 */
export declare function copy<T extends VectorArray>(out: T, v: VectorArray): T;
/**
 * 克隆一个向量
 */
export declare function clone(v: VectorArray): VectorArray;
/**
 * 设置向量的两个项
 */
export declare function set<T extends VectorArray>(out: T, a: number, b: number): T;
/**
 * 向量相加
 */
export declare function add<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
/**
 * 向量缩放后相加
 */
export declare function scaleAndAdd<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray, a: number): T;
/**
 * 向量相减
 */
export declare function sub<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
/**
 * 向量长度
 */
export declare function len(v: VectorArray): number;
export declare const length: typeof len;
/**
 * 向量长度平方
 */
export declare function lenSquare(v: VectorArray): number;
export declare const lengthSquare: typeof lenSquare;
/**
 * 向量乘法
 */
export declare function mul<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
/**
 * 向量除法
 */
export declare function div<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
/**
 * 向量点乘
 */
export declare function dot(v1: VectorArray, v2: VectorArray): number;
/**
 * 向量缩放
 */
export declare function scale<T extends VectorArray>(out: T, v: VectorArray, s: number): T;
/**
 * 向量归一化
 */
export declare function normalize<T extends VectorArray>(out: T, v: VectorArray): T;
/**
 * 计算向量间距离
 */
export declare function distance(v1: VectorArray, v2: VectorArray): number;
export declare const dist: typeof distance;
/**
 * 向量距离平方
 */
export declare function distanceSquare(v1: VectorArray, v2: VectorArray): number;
export declare const distSquare: typeof distanceSquare;
/**
 * 求负向量
 */
export declare function negate<T extends VectorArray>(out: T, v: VectorArray): T;
/**
 * 插值两个点
 */
export declare function lerp<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray, t: number): T;
/**
 * 矩阵左乘向量
 */
export declare function applyTransform<T extends VectorArray>(out: T, v: VectorArray, m: MatrixArray): T;
/**
 * 求两个向量最小值
 */
export declare function min<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
/**
 * 求两个向量最大值
 */
export declare function max<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
