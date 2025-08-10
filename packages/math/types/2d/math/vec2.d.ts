export type Vector2Like = number[] | Float32Array | Vector2;
export type Vector2Point = {
    x: number;
    y: number;
};
/**
 * 设置向量的x和y坐标
 *
 * @param out 输出向量
 * @param x x坐标
 * @param y y坐标
 * @returns 返回更新后的向量
 */
declare function setXY<T extends Vector2Like = Vector2Like>(out: T, x: number, y: number): T;
declare function add<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
declare function subtract<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
declare function multiply<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
declare function multiplyScalar<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: number): T;
declare function divide<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
/**
 * 计算两个二维向量的点积
 *
 * @param a 第一个二维向量，支持数组或包含x和y属性的对象
 * @param b 第二个二维向量，支持数组或包含x和y属性的对象
 * @returns 返回两个二维向量的点积
 */
declare function dot(a: Vector2Like, b: Vector2Like): number;
/**
 * 计算两个二维向量的叉积。
 *
 * @param a 第一个二维向量或类似对象，包含两个数值属性 [0] 和 [1]。
 * @param b 第二个二维向量或类似对象，包含两个数值属性 [0] 和 [1]。
 * @returns 返回一个数值，表示两个向量的叉积。
 */
declare function cross(a: Vector2Like, b: Vector2Like): number;
declare function distance(a: Vector2Like, b: Vector2Like): number;
declare function distanceSquared(a: Vector2Like, b: Vector2Like): number;
declare function lengthSquared(a: Vector2Like): number;
declare function length(a: Vector2Like): number;
declare function manhattanDistance(a: Vector2Like, b: Vector2Like): number;
declare function chebyshevDistance(a: Vector2Like, b: Vector2Like): number;
/**
 * 将一个二维向量归一化
 *
 * @param out 归一化后的向量
 * @param a 待归一化的向量
 * @returns 归一化后的向量
 */
declare function normalize<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
/**
 * 对两个二维向量进行线性插值
 *
 * @param out 存储结果的二维向量
 * @param a 第一个二维向量
 * @param b 第二个二维向量
 * @param t 插值参数，取值范围为[0, 1]
 * @returns 插值后的二维向量
 */
declare function lerp<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, t: number): T;
/**
 * 平滑插值函数，用于在两个二维向量之间进行平滑过渡
 *
 * @param out 输出向量，存储插值结果
 * @param a 起始向量
 * @param b 目标向量
 * @param t 插值参数，范围在0到1之间
 * @returns 输出向量，存储插值结果
 */
declare function smoonthStep<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like, t: number): T;
/**
 * 计算向量的角度
 *
 * @param a 一个二维向量对象或数组，包含两个元素，分别代表向量的x和y坐标
 * @returns 返回向量的角度（以弧度为单位）
 */
declare function angle(a: Vector2Like): number;
/**
 * 计算两个二维向量之间的夹角（以弧度为单位）。
 *
 * @param a 第一个二维向量。
 * @param b 第二个二维向量。
 * @returns 返回两个向量之间的夹角，以弧度为单位。[0,pi]
 */
declare function angleToUnsigned(a: Vector2Like, b: Vector2Like): number;
/**
 * 计算两个二维向量之间的夹角（以弧度为单位），范围为 -π 到 π 之间。
 *
 * @param a 第一个二维向量
 * @param b 第二个二维向量
 * @returns 返回两个向量之间的夹角（以弧度为单位）
 */
declare function angleBetweenPI2(a: Vector2Like, b: Vector2Like): number;
/**
 * 计算给定向量的垂直向量
 *
 * @param out 存储结果的向量对象
 * @param a 原始向量对象
 * @returns 返回存储结果的向量对象
 */
declare function perpendicular<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
/**
 * 反射函数
 *
 * @param out 输出向量，用于存储反射后的结果
 * @param a 输入向量
 * @param n 法向量
 * @returns 返回输出向量 out
 */
declare function reflect<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, n: Vector2Like): T;
declare function negate<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
declare function abs<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
declare function round<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
declare function floor<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
declare function ceil<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
declare function min<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
declare function max<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
declare function clamp<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, min: Vector2Like, max: Vector2Like): T;
/**
 * 计算向量的分数部分
 *
 * @param out 存储结果的向量
 * @param a 输入的向量
 * @returns 存储结果的向量
 */
declare function fractal<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like): T;
/**
 * 计算向量a对向量b的模运算结果，并将结果存储在向量out中
 *
 * @param out 存储结果的向量
 * @param a 被除数的向量
 * @param b 除数的向量
 * @returns 存储结果的向量
 */
declare function floorMod<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, b: Vector2Like): T;
/**
 * 将向量 a 绕原点旋转 rad 弧度并存储到 out 中
 *
 * @param out 存储旋转后向量的数组
 * @param a 待旋转的向量数组
 * @param rad 旋转角度（弧度）
 * @returns 旋转后的向量数组
 */
declare function rotate<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, rad: number): T;
/**
 * 围绕指定中心点旋转一个二维向量
 *
 * @param out 输出的二维向量
 * @param a 要旋转的二维向量
 * @param center 旋转中心点
 * @param rad 旋转角度（弧度）
 * @returns 旋转后的二维向量
 */
declare function rotateAround<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, center: Vector2Like, rad: number): T;
declare function scale<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, sx: number, sy: number): T;
declare function scaleAround<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, center: Vector2Like, scale: Vector2Like): T;
declare function translate<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, x: number, y: number): T;
declare function transformMat2d<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, m: ArrayLike<number>): T;
declare function transformMat3d<T extends Vector2Like = Vector2Like>(out: T, a: Vector2Like, m: ArrayLike<number>): T;
declare function equals(a: Vector2Like, b: Vector2Like): boolean;
declare function isZero(a: Vector2Like): boolean;
declare function equalsEpsilon(a: Vector2Like, b: Vector2Like, epsilon?: number): boolean;
export declare class Vector2 extends Float32Array {
    static readonly BYTE_LENGTH: number;
    static create(x: number, y: number): Vector2;
    static from(values: Vector2Like): Vector2;
    static fromPoint(values: {
        x: number;
        y: number;
    }): Vector2;
    static fromRotation(rad: number): Vector2;
    static default(): Vector2;
    static zero(): Vector2;
    static splat(x: number): Vector2;
    static makeZeroArray(size: number): Vector2[];
    static set: typeof setXY;
    static setXY: typeof setXY;
    static add: typeof add;
    static sub: typeof subtract;
    static mul: typeof multiply;
    static mulScalar: typeof multiplyScalar;
    static multiply: typeof multiply;
    static div: typeof divide;
    static divide: typeof divide;
    static dot: typeof dot;
    static cross: typeof cross;
    static distance: typeof distance;
    static distanceSquared: typeof distanceSquared;
    static lengthSquared: typeof lengthSquared;
    static length: typeof length;
    static manhattanDistance: typeof manhattanDistance;
    static chebyshevDistance: typeof chebyshevDistance;
    static normalize: typeof normalize;
    static lerp: typeof lerp;
    static smoonthStep: typeof smoonthStep;
    static angle: typeof angle;
    static angleTo: typeof angleToUnsigned;
    static angleBetweenPI2: typeof angleBetweenPI2;
    static perpendicular: typeof perpendicular;
    static perp: typeof perpendicular;
    static reflect: typeof reflect;
    static negate: typeof negate;
    static abs: typeof abs;
    static round: typeof round;
    static floor: typeof floor;
    static ceil: typeof ceil;
    static min: typeof min;
    static max: typeof max;
    static clamp: typeof clamp;
    static fractal: typeof fractal;
    static floorMod: typeof floorMod;
    static rotate: typeof rotate;
    static rotateAround: typeof rotateAround;
    static scale: typeof scale;
    static scaleAround: typeof scaleAround;
    static translate: typeof translate;
    static transformMat2d: typeof transformMat2d;
    static transformMat3d: typeof transformMat3d;
    static equals: typeof equals;
    static isZero: typeof isZero;
    static equalsEpsilon: typeof equalsEpsilon;
    constructor(x: number, y: number);
    constructor(values: Vector2Like);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    copy(source: Vector2Like): this;
    clone(): Vector2;
    set(array: ArrayLike<number>, offset?: number): this;
    set(x: number, y: number): this;
    setXY(x: number, y: number): this;
    setLength(len: number): this;
    setLengthFromPoint(x: number, y: number, len: number): this;
    setRotation(rad: number): this;
    splat(x: number): this;
    add(other: Vector2Like): this;
    addVectors(a: Vector2Like, b: Vector2Like): this;
    subtract(other: Vector2Like): this;
    sub(other: Vector2Like): this;
    subVectors(a: Vector2Like, b: Vector2Like): this;
    subtractVectors(a: Vector2Like, b: Vector2Like): this;
    mul(other: Vector2Like): this;
    multiply(other: Vector2Like): this;
    multiplyVectors(a: Vector2Like, b: Vector2Like): this;
    mulVectors(a: Vector2Like, b: Vector2Like): this;
    mulScalar(scalar: number): this;
    multiplyScalar(scalar: number): this;
    div(other: Vector2Like): this;
    divide(other: Vector2Like): this;
    divideVectors(a: Vector2Like, b: Vector2Like): this;
    dot(other: Vector2Like): number;
    cross(other: Vector2Like): number;
    distance(other: Vector2Like): number;
    distanceSquared(other: Vector2Like): number;
    magnitudeSquared(): number;
    magnitude(): number;
    manhattanDistance(other: Vector2Like): number;
    chebyshevDistance(other: Vector2Like): number;
    normalize(): this;
    lerp(other: Vector2Like, t: number): this;
    smoonthStep(other: Vector2Like, t: number): this;
    angle(): number;
    angleTo(other: Vector2Like): number;
    angleToOrigin(origin: Vector2Like): number;
    angleBetween(a: Vector2Like, b: Vector2Like): number;
    perp(): this;
    ccw(): this;
    cw(): this;
    reflect(other: Vector2Like): this;
    refract(incident: Vector2, normal: Vector2, eta1: number, eta2: number): this | null;
    negate(): this;
    abs(): this;
    round(): this;
    floor(): this;
    ceil(): this;
    min(other: Vector2Like): this;
    max(other: Vector2Like): this;
    clamp(min: Vector2Like, max: Vector2Like): this;
    fractal(): this;
    modDown(other: Vector2Like): this;
    modUp(other: Vector2Like): this;
    rotate(rad: number): this;
    rotateAround(center: Vector2Like, rad: number): this;
    scale(sx: number, sy: number): this;
    scaleAround(center: Vector2Like, scale: Vector2Like): this;
    translate(x: number, y: number): this;
    transformMat2d(m: Vector2Like): this;
    applyMatrix2D(m: Vector2Like): this;
    applyMatrix3D(m: Vector2Like): this;
    transformMat3d(m: Vector2Like): this;
    isFinite(): boolean;
    isZero(): boolean;
    equals(other: Vector2Like): boolean;
    equalsEpsilon(other: Vector2Like, epsilon?: number): boolean;
    canNormalize(): boolean;
    toZero(b: Vector2Like): this;
    toArray(): number[];
}
export {};
