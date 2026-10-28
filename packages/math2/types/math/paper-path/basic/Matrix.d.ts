import { Point } from './Point';
import { Rectangle } from './Rectangle';
export declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    /**
     * `new Matrix()` 是单位矩阵，`new Matrix(a, b, c, d, tx, ty)` 设置全部值。
     */
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
    clone(): Matrix;
    equals(matrix: Matrix): boolean;
    toString(): string;
    /** 把矩阵重置为单位矩阵。 */
    reset(): this;
    /** 在当前矩阵上连接一个平移。 */
    translate(x: number, y: number): this;
    /** 在当前矩阵上连接一个缩放，可指定中心点。 */
    scale(sx: number, sy?: number, center?: Point): this;
    /** 在当前矩阵上连接一个旋转，可指定中心点。 */
    rotate(angle: number, center?: Point): this;
    /** 在当前矩阵上连接一个错切，可指定中心点。 */
    shear(sx: number, sy: number, center?: Point): this;
    /** 在当前矩阵上连接一个斜切，角度单位为度。 */
    skew(sx: number, sy: number, center?: Point): this;
    /** 追加指定矩阵:`(当前矩阵) * (指定矩阵)`。 */
    append(matrix: Matrix | null): this;
    /** 前置指定矩阵:`(指定矩阵) * (当前矩阵)`。 */
    prepend(matrix: Matrix | null): this;
    /** 返回追加指定矩阵后的新矩阵。 */
    appended(matrix: Matrix | null): Matrix;
    /** 返回前置指定矩阵后的新矩阵。 */
    prepended(matrix: Matrix | null): Matrix;
    /**
     * 原地求逆，使矩阵执行相反的变换。
     * 矩阵奇异时返回 `null`。
     */
    invert(): Matrix | null;
    /** 返回求逆后的新矩阵，矩阵奇异时为 `null`。 */
    inverted(): Matrix | null;
    /** 去掉平移部分后的副本。 */
    _shiftless(): Matrix;
    /** 单位矩阵时返回 `null`，否则返回自身。 */
    _orNullIfIdentity(): Matrix | null;
    isIdentity(): boolean;
    /**
     * 矩阵是否可逆。行列式为 0，或有任何值为 Infinity / NaN 时不可逆。
     */
    isInvertible(): boolean;
    /** 缩放因子的几何平均值，用于描边宽度换算。 */
    _getMeanScale(): number;
    /** 矩阵是否奇异（即不可逆）。 */
    isSingular(): boolean;
    /** 变换一个点并返回结果。 */
    transform(point: Point): Point;
    /** 只接受一个点的快速版本。 */
    _transformPoint(point: Point): Point;
    /** 原地变换一个 x/y 坐标对数组。 */
    _transformCoordinates(src: number[], dst: number[], count: number): number[];
    /**
     * 变换矩形的四个角，返回这些角的新包围盒（不是变换后的矩形本身）。
     * 对应原文 `Matrix#_transformBounds()`（Matrix.js 第 643 行）。
     *
     * @param bounds 要变换的矩形
     * @param dest 可选的目标矩形，传了就把结果写进去
     */
    _transformBounds(bounds: Rectangle, dest?: Rectangle): Rectangle;
    /** 反向变换一个点，不可逆时返回 `null`。 */
    inverseTransform(point: Point): Point | null;
    _inverseTransform(point: Point): Point | null;
    /**
     * 把仿射变换分解为 `translation`、`rotation`、`scaling` 和 `skewing`。
     */
    decompose(): {
        translation: Point;
        rotation: number;
        scaling: Point;
        skewing: Point;
    };
    /** 矩阵值数组，顺序与构造函数一致。 */
    get values(): number[];
    /** 矩阵的平移量，以向量表示。 */
    get translation(): Point;
    /** 矩阵的缩放值（可分解时）。 */
    get scaling(): Point;
    /** 矩阵的旋转角度（可分解时）。 */
    get rotation(): number;
}
