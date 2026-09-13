import { PointLike } from './Point';
import { Vector2 } from './Vector2';
export declare const EPSILON = 0.000001;
export declare const PI: number;
export declare const PI_2: number;
export declare const PI_4: number;
export declare const TWO_PI: number;
export declare const DEG_TO_RAD: number;
export declare const RAD_TO_DEG: number;
export declare const degToRad: (deg: number) => number;
export declare const radToDeg: (rad: number) => number;
export declare const equalsEpsilon: (a: number, b: number, epsilon?: number) => boolean;
export declare const equals: (a: number, b: number) => boolean;
export declare const isFinite: (v: number) => boolean;
export declare const interpolate: (a: number, b: number, t: number) => number;
export declare function inverseLerp(start: number, end: number, value: number): number;
export declare const random: (min: number, max: number) => number;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const smoothStep: (start: number, end: number, value: number) => number;
export declare const mix: (start: number, end: number, value: number) => number;
export declare function findIndexRight<T = any>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
export declare function as_signed(value: number, bits?: number): number;
export declare function as_unsigned(value: number, bits?: number): number;
export declare function calcLowBit(value: number): number;
export declare function calcHighBit(value: number): number;
export declare function includeBit(value: number, bit: number): boolean;
export declare function removeBit(value: number, bit: number): number;
export declare function calcBitIndex(value: number): number;
export declare function calc32Shift(value: number): number;
export declare function calcArcGoldenRatio(delta: number): number;
export declare function calcArcCubicBezierSteps(sweepAngle: number): number;
/**
  * 由容差反推圆弧的最大步进角：弦高 sagitta = R·(1 − cos(θ/2)) ≤ tol。
  *
  * 早期实现用 `max(16, …)` 之类的**固定段数**，半径一大弦高就超容差
  * （半径 22 的圆角只用 2 段 → 弦高约 1.7px，肉眼可见的“折角”）。
  */
export declare function arcStepCount(sweep: number, radius: number, tol: number): number;
/** 视口状态：世界点 (0, 0) 落在屏幕 offset 处，放大 zoom 倍 */
interface Viewport {
    offset: PointLike;
    zoom: number;
}
/** screen = world · zoom + offset */
export declare function worldToScreen(vp: Viewport, wx: number, wy: number): PointLike;
/** world = (screen − offset) / zoom */
export declare function screenToWorld(vp: Viewport, sx: number, sy: number): PointLike;
/** 以屏幕点 (sx, sy) 为锚点缩放：offset' = 锚点屏幕坐标 − 锚点世界坐标 · zoom' */
export declare function zoomAt(vp: Viewport, sx: number, sy: number, next: number, min: number, max: number): Viewport;
export declare const calcZoomPan: (out: PointLike, oldScale: number, newScale: number, offset: PointLike, origin: PointLike) => PointLike;
/**
 *
 * @param value 映射值
 * @param inMin 定义域domain 输入
 * @param inMax
 * @param outMin 值域range 输出
 * @param outMax
 * @returns
 */
export declare function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
export declare const sign: (x: number) => 0 | 1 | -1;
export declare const absSign: (x: number) => 1 | -1;
export declare const randomFloor: (min: number, max: number) => number;
export declare const randomCeil: (min: number, max: number) => number;
export declare const randomRound: (min: number, max: number) => number;
export declare const fract: (v: number) => number;
export declare const ceilMod: (v: number, m: number) => number;
export declare const floorMod: (v: number, m: number) => number;
export declare const truncMod: (v: number, m: number) => number;
export declare const calcStartCoordinateValue: (unit: number, offset: number, scalar: number) => number;
export declare const calcStartGraduationValue: (unit: number, offset: number, scalar: number) => number;
export declare const generateGraduations: (options: {
    width: number;
    height: number;
    tickSplitHeight: number;
    tickMarkHeight: number;
    rulerUnit: number;
    offset: number;
    scaleFactor: number;
    tickSplitStep: number;
}) => void;
export declare function dcmp(x: number, eps?: number): 0 | 1 | -1;
export declare const deCasteljauBezier: (out: PointLike, controls: PointLike[], t: number) => PointLike;
export declare const summation: (i: number, n: number, add: (sum: number, index: number, len: number) => number) => number;
export declare const bernstein: (n: number, i: number, t: number) => number;
export declare const bezier: (out: PointLike, controls: PointLike[], t: number) => PointLike;
export declare const rationalBezier: (out: PointLike, controls: PointLike[], weight: number[], t: number) => PointLike;
/**
 *
我们定义屏幕坐标（screen）与世界坐标（world）的关系为：
screen=world*𝑠+𝑜
其中：
s = scale（缩放倍率）
o = offset（平移）
world = 世界坐标（理想数学坐标）
screen = 屏幕像素坐标
这是所有 2D 平移 + 缩放摄像机的标准形式。
先对世界坐标乘以 scale
然后再加一个偏移 offset
已知一个屏幕坐标 screen = c（例如鼠标位置），我们想知道它对应的世界坐标是什么。
c=w*s+0
解：
w=(c-o)/s

我们用以下约定（这是常见的画布变换约定）：
scale = s：当前缩放（屏幕每个像素对应世界单位的比例因子）。
offset = o：屏幕坐标 = 世界坐标 * s + o（向量运算）。
center = c：鼠标在屏幕坐标系的位置（screenX, screenY）。
zoomFactor = z，新的缩放 s' = s * z。
我们要保证：鼠标所在的世界点在放大前后仍映射到同一个屏幕点 c。
先求放大前该屏幕点对应的世界坐标 w：
w=(c-o)/s
放大后要求:
c=w*s'+o'
解出新的偏移量o'
o'=c-w*s' =c-(c-o)/s*s'=c-(c-o)*(s'/s)

 *
 *      mat2d.translate(m, m, [mx, my])//设置原点
        mat2d.scale(m, m, [zoom / oldZoom, zoom / oldZoom])
        mat2d.translate(m, m, [-mx, -my])
       let xy = vec2.transformMat2d([], [x, y], m);

 * @param out 最新偏移，缩放后的偏移
 * @param mouse 鼠标位置
 * @param oldScale 旧缩放
 * @param newScale 新缩放
 * @param offset 当前偏移
 * @returns
 */
export declare const wheelToScaleArtboard: (out: PointLike, oldScale: number, newScale: number, offset: PointLike, mouse: PointLike) => PointLike;
/**
 * 计算阶乘，使用缓存优化性能
 */
export declare const factorial: (n: number) => number;
/**
   * 计算二项式系数 C(n, k)
   */
export declare function binomialCoefficient(n: number, k: number): number;
export declare enum AngleType {
    Nearly180 = 0,// 近似-1 ，角度为180度
    Sharp = 1,// -1<dot<0，角度为90<x<180度
    Shallow = 2,// 0<dot<1，角度为0<x<90度
    NearlyLine = 3
}
export declare function isNearlyZero(value: number, epsilon?: number): boolean;
export declare function dotToAngleType(dot: number): AngleType;
/**
 * 计算组合数 C(n,k) = n! / (k! * (n-k)!)
 * 使用递推公式优化，避免大数溢出
 */
export declare const nCr: (n: number, k: number) => number;
/**
 * 计算排列数 P(n,k) = n! / (n-k)!
 */
export declare const nPr: (n: number, k: number) => number;
/**
 * 求解一元二次方程 ax² + bx + c = 0（a ≠ 0）
 * @param a - 二次项系数
 * @param b - 一次项系数
 * @param c - 常数项
 * @returns 实根数组（可能 0、1、2 个根）
 */
export declare function solveQuadratic(a: number, b: number, c: number): number[];
/**
 * 卡尔丹公式求解一元三次方程 ax³ + bx² + cx + d = 0（a ≠ 0）
 *
 * 令 x = y - b/(3a)，化为缺项三次方程 y³ + py + q = 0
 * 判别式 Δ = (q/2)² + (p/3)³
 *
 * @param a - 三次项系数
 * @param b - 二次项系数
 * @param c - 一次项系数
 * @param d - 常数项
 * @returns 实根数组（可能 1、2、3 个根）
 */
export declare function solveCubicByCardano(a: number, b: number, c: number, d: number): number[];
/**
 * 盛金公式求解一元三次方程 ax³ + bx² + cx + d = 0（a ≠ 0）
 *
 * A = b² - 3ac
 * B = bc - 9ad
 * C = c² - 3bd
 * Δ = B² - 4AC
 *
 * @param a - 三次项系数
 * @param b - 二次项系数
 * @param c - 一次项系数
 * @param d - 常数项
 * @returns 实根数组（可能 1、2、3 个根）
 */
export declare function solveCubicByShengjin(a: number, b: number, c: number, d: number): number[];
export declare const getIntersectionGridCell: (options: {
    start: Vector2;
    dir: Vector2;
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
    onCollisionDetection?: (x: number, y: number) => boolean;
}) => Vector2[];
export declare const getRays3D: (player: {
    rotate: number;
    x: number;
    y: number;
}, map: number[][], fovAngle: number, width: number, height: number, cellSize: number, fish?: boolean) => {
    diffuse: number;
    x: number;
    row: number;
    col: number;
    value: number;
    side: boolean;
    dir: Vector2;
    origin: Vector2;
    distance: number;
    noFishDistance: number;
}[];
export {};
