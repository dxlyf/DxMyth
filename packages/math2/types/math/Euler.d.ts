import { Quaternion, QuaternionLike } from './Quaternion';
import { Matrix3, Matrix3Like } from './Matrix3';
import { Matrix4 } from './Matrix4';
export type EulerOrder = 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY';
export type EulerLike = {
    x: number;
    y: number;
    z: number;
    order?: EulerOrder;
};
export declare class Euler {
    static zero(): Euler;
    static fromValues(x?: number, y?: number, z?: number, order?: EulerOrder): Euler;
    static from(e: EulerLike): Euler;
    static fromArray(arr: ArrayLike<number>): Euler;
    /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角 */
    static fromMatrix3(m: Matrix3Like, order?: EulerOrder): Euler;
    /** 从四元数提取欧拉角 */
    static fromQuaternion(q: QuaternionLike, order?: EulerOrder): Euler;
    static equals(a: EulerLike, b: EulerLike): boolean;
    static equalsEpsilon(a: EulerLike, b: EulerLike, epsilon?: number): boolean;
    static add(out: Euler, a: EulerLike, b: EulerLike): Euler;
    static subtract(out: Euler, a: EulerLike, b: EulerLike): Euler;
    static lerp(out: Euler, a: EulerLike, b: EulerLike, t: number): Euler;
    x: number;
    y: number;
    z: number;
    order: EulerOrder;
    constructor(x?: number, y?: number, z?: number, order?: EulerOrder);
    set(x: number, y: number, z: number, order?: EulerOrder): this;
    copy(e: EulerLike): this;
    zero(): this;
    add(e: EulerLike): this;
    subtract(e: EulerLike): this;
    lerp(to: EulerLike, t: number): this;
    equals(e: EulerLike): boolean;
    equalsEpsilon(e: EulerLike, epsilon?: number): boolean;
    /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角，支持六种旋转顺序（three.js 算法） */
    setFromRotationMatrix3(m: Matrix3Like, order?: EulerOrder): this;
    /** 从四元数提取欧拉角（q → 旋转矩阵 → 欧拉角） */
    setFromQuaternion(q: QuaternionLike, order?: EulerOrder): this;
    /** 转换为四元数（旋转顺序决定乘法次序，three.js 算法） */
    toQuaternion(out?: Quaternion): Quaternion;
    /** 转换为 3x3 旋转矩阵 */
    toMatrix3(out?: Matrix3): Matrix3;
    /** 转换为 4x4 旋转矩阵（左上 3x3 + 单位第四行/列） */
    toMatrix4(out?: Matrix4): Matrix4;
    clone(): Euler;
    toArray(): [number, number, number];
    toString(): string;
}
