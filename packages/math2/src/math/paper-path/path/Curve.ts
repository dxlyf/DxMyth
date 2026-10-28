/**
 * 移植自 paper/src/path/Curve.js，裁减为几何核心。
 *
 * 曲线是路径上两个线段之间的部分：`segment1` 提供起点及其
 * 出向手柄，`segment2` 提供终点及其
 * 入向手柄。
 *
 * 相对于原文去掉的内容：
 * - 序列化（`_class`、`_serialize`）、选中（`selected`）、
 *   `Base` 类以及整套 bean 机制，
 * - 参数解析式构造函数：只保留 `new Curve(segment1?, segment2?)`
 *   这一种形式，
 * - 所有依赖 `Rectangle`（尚未移植）的成员：`bounds`、
 *   `strokeBounds`、`handleBounds`、`getBounds()`、`getStrokeBounds()`。
 *
 * 依赖：
 * - `Line` 已正式移植到 basic/Line.ts。
 * - `CollisionDetection.findCurveBoundsCollisions()` 仍是 util/CollisionDetection.ts
 *   里的简化实现（O(n²)），等完整移植 CollisionDetection.js 后再替换。
 */

import { Point } from '../basic/Point';
import { Line } from '../basic/Line';
import { Numerical } from '../util/Numerical';
import { findCurveBoundsCollisions } from '../util/CollisionDetection';
import { Segment } from './Segment';
import { CurveLocation } from './CurveLocation';
import type { Matrix } from '../basic/Matrix';
import type { Path } from './Path';

// -------------------------------------------------------------------------
// 私有曲线辅助函数，移植自 Curve.js 里的闭包作用域。

/** 三次贝塞尔曲线的类型，见 `Curve.classify()`。 */
export interface CurveClassification {
    type: string;
    roots: number[] | null;
}

interface LocalPoint {
    x: number;
    y: number;
    ex: number;
    ey: number;
}

/** Bernstein 形式的多项式，附带各系数的舍入误差。 */
interface Polynomial {
    coefficients: number[];
    errors: number[];
}

const CURVETIME_EPSILON = Numerical.CURVETIME_EPSILON;

/** 曲线多项式导数的系数。 */
function getLengthIntegrand(v: number[]): (t: number) => number {
    const c = getCoefficients(v),
        ax = 3 * c[0], bx = 2 * c[1], cx = c[2],
        ay = 3 * c[3], by = 2 * c[4], cy = c[5];

    return function(t: number): number {
        // 计算 x、y 方向导数的二次多项式
        const dx = (ax * t + bx) * t + cx,
            dy = (ay * t + by) * t + cy;
        return Math.sqrt(dx * dx + dy * dy);
    };
}

/** 区间 0 <= a < b <= 1 上的积分求值次数 */
function getIterations(a: number, b: number): number {
    // 根据区间大小估计所需精度……
    return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
}

function getCoefficients(v: number[]): number[] {
    const x0 = v[0], y0 = v[1],
        x3 = v[6], y3 = v[7],
        isZero = Numerical.isZero;
    let x1 = v[2], y1 = v[3],
        x2 = v[4], y2 = v[5];
    // 若曲线手柄几乎为零，则把控制点重置到
    // 锚点上。
    if (isZero(x1 - x0) && isZero(y1 - y0)) {
        x1 = x0;
        y1 = y0;
    }
    if (isZero(x2 - x3) && isZero(y2 - y3)) {
        x2 = x3;
        y2 = y3;
    }
    // 计算多项式系数，并与 evaluate()
    // 在两端需要的控制点一起返回：
    const cx = 3 * (x1 - x0),
        bx = 3 * (x2 - x1) - cx,
        ax = x3 - x0 - cx - bx,
        cy = 3 * (y1 - y0),
        by = 3 * (y2 - y1) - cy,
        ay = y3 - y0 - cy - by;
    return [ax, bx, cx, ay, by, cy, x1, y1, x2, y2];
}

function getCoordinate(v0: number, v3: number, a: number, b: number,
        c: number, t: number): number {
    // 由 getCoefficients() 返回的系数计算参数 t 处曲线点的一个坐标。
    // 在 t === 0 / 1 处做特殊处理，
    // 以避免精度损失。见 #960
    return t === 0 ? v0 : t === 1 ? v3 : ((a * t + b) * t + c) * t + v0;
}

function evaluate(v: number[], t: number | null, type: number,
        normalized?: boolean): Point | null {
    // 参数超出范围或无效时不产生结果。
    if (t == null || t < 0 || t > 1)
        return null;
    const x0 = v[0], y0 = v[1],
        x3 = v[6], y3 = v[7],
        c = getCoefficients(v),
        ax = c[0], bx = c[1], cx = c[2],
        ay = c[3], by = c[4], cy = c[5],
        x1 = c[6], y1 = c[7],
        x2 = c[8], y2 = c[9];
    let x: number, y: number;
    if (type === 0) {
        // type === 0：getPoint()
        x = getCoordinate(x0, x3, ax, bx, cx, t);
        y = getCoordinate(y0, y3, ay, by, cy, t);
    } else {
        // type === 1：getTangent()
        // type === 2：getNormal()
        // type === 3：getCurvature()
        const tMin = CURVETIME_EPSILON,
            tMax = 1 - tMin;
        // 1：切线，一阶导数
        // 2：法线，一阶导数
        // 3：曲率，一阶导数与二阶导数
        // 避免长度为 0 的切线和法线：
        // https://stackoverflow.com/questions/10506868/
        if (t < tMin) {
            x = cx;
            y = cy;
        } else if (t > tMax) {
            x = 3 * (x3 - x2);
            y = 3 * (y3 - y2);
        } else {
            x = (3 * ax * t + 2 * bx) * t + cx;
            y = (3 * ay * t + 2 * by) * t + cy;
        }
        if (normalized) {
            // 当 t 处切线为零且位于曲线起点或
            // 终点时，可以用两个手柄之间的向量，
            // 但仅在归一化时使用，因为其加权长度为 0。
            if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
                x = x2 - x1;
                y = y2 - y1;
            }
            // 现在归一化 x 与 y
            const len = Math.sqrt(x * x + y * y);
            if (len) {
                x /= len;
                y /= len;
            }
        }
        if (type === 3) {
            // 计算二阶导数，并由此得到曲率：
            // http://cagd.cs.byu.edu/~557/text/ch2.pdf page#31
            // k = |dx * d2y - dy * d2x| / (( dx^2 + dy^2 )^(3/2))
            const x2d = 6 * ax * t + 2 * bx,
                y2d = 6 * ay * t + 2 * by,
                d = Math.pow(x * x + y * y, 3 / 2);
            // 为了 JS 优化，即使曲率只是数值，也总是返回 Point，
            // 数值存放在 x 中：
            x = d !== 0 ? (x * y2d - y * x2d) / d : 0;
            y = 0;
        }
    }
    // 法线就是旋转后的切线：
    return type === 2 ? new Point(y, -x) : new Point(x, y);
}

/** 由 `Curve.getValues()` 的 8 个值构造曲线。 */
function curveFromValues(v: number[]): Curve {
    const x1 = v[0], y1 = v[1],
        x2 = v[6], y2 = v[7];
    return new Curve(
        new Segment(
            new Point(x1, y1),
            undefined,
            new Point(v[2] - x1, v[3] - y1)),
        new Segment(
            new Point(x2, y2),
            new Point(v[4] - x2, v[5] - y2),
            undefined));
}

/** `isStraight()` 的共用判断，作用于 8 个曲线坐标。 */
function isStraightTest(x1: number, y1: number, h1x: number, h1y: number,
        h2x: number, h2y: number, x2: number, y2: number): boolean {
    const isZero = Numerical.isZero;
    if (isZero(h1x) && isZero(h1y) && isZero(h2x) && isZero(h2y)) {
        // 没有手柄。
        return true;
    } else {
        const isCollinear = Point.isCollinear,
            vx = x2 - x1,
            vy = y2 - y1;
        if (isZero(vx) && isZero(vy)) {
            // 零长度直线，但定义了一些手柄。
            return false;
        } else if (isCollinear(vx, vy, h1x, h1y) &&
                isCollinear(vx, vy, h2x, h2y)) {
            // 手柄共线：除 isCollinear() 检查外，还需要
            // 测量到直线的距离，以便使用与
            // Curve#getTimeOf() 相同的 epsilon，见 #1066。
            const getDistance = Line.getDistance,
                epsilon = Numerical.GEOMETRIC_EPSILON;
            if (getDistance(x1, y1, vx, vy, x1 + h1x, y1 + h1y, true)
                    < epsilon &&
                getDistance(x1, y1, vx, vy, x2 + h2x, y2 + h2y, true)
                    < epsilon) {
                // 把手柄投影到直线上，检查是否在范围内：
                const div = vx * vx + vy * vy,
                    s1 = (vx * h1x + vy * h1y) / div,
                    s2 = (vx * h2x + vy * h2y) / div;
                return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
            }
        }
    }
    return false;
}

/** `isLinear()` 的共用判断，作用于 8 个曲线坐标。 */
function isLinearTest(x1: number, y1: number, h1x: number, h1y: number,
        h2x: number, h2y: number, x2: number, y2: number): boolean {
    const x = (x2 - x1) / 3,
        y = (y2 - y1) / 3;
    return h1x === x && h1y === y && -h2x === x && -h2y === y;
}

// -------------------------------------------------------------------------
// 求交辅助函数。

function addLocation(locations: CurveLocation[],
        include: ((location: CurveLocation) => boolean) | undefined | null,
        c1: Curve, t1: number | null, c2: Curve, t2: number | null,
        overlap?: boolean): void {
    // 判断曲线两端的位置是否应排除：
    // 若两条曲线相邻则排除，但若这些点属于重叠检查，
    // 则不排除两曲线之间的连接点，
    // 因为它们可能是自重叠。
    const excludeStart = !overlap && c1.previous === c2,
        excludeEnd = !overlap && c1 !== c2 && c1.next === c2,
        tMin = CURVETIME_EPSILON,
        tMax = 1 - tMin;
    // 根据 excludeStart / End 检查 t1 与 t2 的边界：
    // - excludeStart 表示 c1 的起点与 c2 的终点相连
    // - excludeEnd 表示 c1 的终点与 c2 的起点相连
    // - 若 c1 或 c2 位于路径末端，则排除其终点（它连接到起点），
    //   但仅当它不属于已找到的重叠时；
    //   普通的交点已经在起点处找到，
    //   否则会被重复添加。
    if (t1 !== null && t1 >= (excludeStart ? tMin : 0)
            && t1 <= (excludeEnd ? tMax : 1)) {
        if (t2 !== null && t2 >= (excludeEnd ? tMin : 0)
                && t2 <= (excludeStart ? tMax : 1)) {
            const loc1 = new CurveLocation(c1, t1, undefined, overlap),
                loc2 = new CurveLocation(c2, t2, undefined, overlap);
            // 把两个位置互相链接。
            loc1._intersection = loc2;
            loc2._intersection = loc1;
            if (!include || include(loc1))
                CurveLocation.insert(locations, loc1, true);
        }
    }
}

function addCurveIntersections(v1: number[], v2: number[], c1: Curve,
        c2: Curve, locations: CurveLocation[],
        include: ((location: CurveLocation) => boolean) | undefined | null,
        flip: boolean, recursion: number, calls: number, tMin: number,
        tMax: number, uMin: number, uMax: number,
        tolerance?: number): number {
    // 通过统计递归总次数与调用总次数来限制递归深度，
    // 避免出现巨大的调用树，
    // 参见 @iconexperience 在 #904#issuecomment-225283430 中的建议。
    // 另见：#565 #899 #1074
    if (++calls >= 4096 || ++recursion >= 40)
        return calls;
    // 在 fat-line clipping 代码中使用比 CURVETIME_EPSILON 更小的
    // epsilon 比较 curve-time 参数。
    const fatLineEpsilon = 1e-9,
        // 设 P 为第一条曲线，Q 为第二条曲线
        q0x = v2[0], q0y = v2[1], q3x = v2[6], q3y = v2[7],
        getSignedDistance = Line.getSignedDistance,
        // Q 的 fat-line L 由其基线 l 与两个偏移构成，
        // 这两个偏移完全包住曲线 P。
        d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]),
        d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]),
        factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9,
        dMin = factor * Math.min(0, d1, d2),
        dMax = factor * Math.max(0, d1, d2),
        // 计算非参数化贝塞尔曲线 D(ti, di(t))：
        // - di(t) 是 P 到 fat-line 基线 l 的距离
        // - ti 在 [0, 1] 上等距分布
        dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]),
        dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]),
        dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]),
        dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]),
        // 取凸包的上、下两部分
        hull = getConvexHull(dp0, dp1, dp2, dp3),
        top = hull[0],
        bottom = hull[1];
    let tMinClip: number | null, tMaxClip: number | null;
    // 若所有点与控制点都共线，则停止迭代。
    if (d1 === 0 && d2 === 0
            && dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0
        // 用 dMin 与 dMax 裁剪凸包，并考虑：
        // 若其中一个结果为 null，则不存在交点。
        || (tMinClip = clipConvexHull(top, bottom, dMin, dMax)) == null
        || (tMaxClip = clipConvexHull(top.reverse(), bottom.reverse(),
            dMin, dMax)) == null)
        return calls;
    // tMin 与 tMax 位于 (0, 1) 内，把它们投影回
    // v2 的原始参数范围。
    let tMinNew = tMin + (tMax - tMin) * tMinClip,
        tMaxNew = tMin + (tMax - tMin) * tMaxClip;
    if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
        // 已以足够精度隔离出交点
        const t = (tMinNew + tMaxNew) / 2,
            u = (uMin + uMax) / 2;
        addLocation(locations, include,
                flip ? c2 : c1, flip ? u : t,
                flip ? c1 : c2, flip ? t : u);
    } else {
        // 把裁剪结果应用到曲线 1：
        v1 = Curve.getPart(v1, tMinClip, tMaxClip);
        const uDiff = uMax - uMin;
        if (tMaxClip - tMinClip > 0.8) {
            // 若给了容差，相邻曲线共享端点处、落在容差内的交点
            // 会合并到该端点：按弧长切掉两部分位于容差内的
            // 部分，再对剩余部分重新裁剪。
            // 否则，在裁剪停滞处用 v2 的隐式形式求交点，
            // 除非两部分都位于同一条隐式曲线上
            // （即同一条曲线的两个部分）：
            const isNext = tolerance && tMaxNew === 1 && uMin === 0
                    && c1.next === c2,
                isPrevious = tolerance && !isNext && tMinNew === 0
                    && uMax === 1 && c1.previous === c2;
            if (isNext || isPrevious) {
                const offset = isNext ? tolerance : -tolerance,
                    s1 = Curve.getTimeAt(v1, -offset),
                    s2 = Curve.getTimeAt(v2, offset);
                // 短于容差的部分已无剩余：
                if (s1 !== null && s2 !== null) {
                    const t = tMinNew + (tMaxNew - tMinNew) * s1,
                        u = uMin + (uMax - uMin) * s2;
                    if (isNext) {
                        v1 = Curve.getPart(v1, 0, s1);
                        v2 = Curve.getPart(v2, s2, 1);
                        tMaxNew = t;
                        uMin = u;
                    } else {
                        v1 = Curve.getPart(v1, s1, 1);
                        v2 = Curve.getPart(v2, 0, s2);
                        tMinNew = t;
                        uMax = u;
                    }
                    calls = addCurveIntersections(
                            v1, v2, c1, c2, locations, include, flip,
                            recursion, calls, tMinNew, tMaxNew, uMin, uMax,
                            tolerance);
                }
            } else if (!(tolerance && addImplicitIntersections(
                    v1, v2, c1, c2, locations, include, flip,
                    tMinNew, tMaxNew, uMin, uMax, tolerance))) {
                // 细分收敛程度较低的那条曲线。
                if (tMaxNew - tMinNew > uDiff) {
                    const parts = Curve.subdivide(v1, 0.5),
                        t = (tMinNew + tMaxNew) / 2;
                    calls = addCurveIntersections(
                            v2, parts[0], c2, c1, locations, include, !flip,
                            recursion, calls, uMin, uMax, tMinNew, t,
                            tolerance);
                    calls = addCurveIntersections(
                            v2, parts[1], c2, c1, locations, include, !flip,
                            recursion, calls, uMin, uMax, t, tMaxNew,
                            tolerance);
                } else {
                    const parts = Curve.subdivide(v2, 0.5),
                        u = (uMin + uMax) / 2;
                    calls = addCurveIntersections(
                            parts[0], v1, c2, c1, locations, include, !flip,
                            recursion, calls, uMin, u, tMinNew, tMaxNew,
                            tolerance);
                    calls = addCurveIntersections(
                            parts[1], v1, c2, c1, locations, include, !flip,
                            recursion, calls, u, uMax, tMinNew, tMaxNew,
                            tolerance);
                }
            }
        } else { // Iterate
            // 出于某些不明原因，这里需要检查 uDiff === 0，
            // 以防止出现回归，见 #1638。
            if (uDiff === 0 || uDiff >= fatLineEpsilon) {
                calls = addCurveIntersections(
                        v2, v1, c2, c1, locations, include, !flip,
                        recursion, calls, uMin, uMax, tMinNew, tMaxNew,
                        tolerance);
            } else {
                // 另一条曲线上的区间已经足够紧，
                // 因此继续在同一条曲线上迭代。
                calls = addCurveIntersections(
                        v1, v2, c1, c2, locations, include, flip,
                        recursion, calls, tMinNew, tMaxNew, uMin, uMax,
                        tolerance);
            }
        }
    }
    return calls;
}

/**
 * 把片段 v1 与片段 v2 的交点，作为 v2 的隐式形式
 * f(x, y) = 0 沿 v1 的根来添加：f(v1(t)) 是
 * 9 次 Bernstein 形式的多项式（若 v2 为二次曲线则为 6 次）。其根通过
 * 细分隔离；若两条曲线在 v1 的某段上彼此距离小于容差，
 * 且该段长度小于容差，则该段算作一个
 * 交点。隐式曲线会延伸到 v2 之外，因此只保留落在 v2
 * 自身上的根。若 f(v1(t)) 恒为零（两者位于同一条隐式曲线上），
 * 或误差导致根数超过次数允许值，则返回 false。
 */
function addImplicitIntersections(v1: number[], v2: number[], c1: Curve,
        c2: Curve, locations: CurveLocation[],
        include: ((location: CurveLocation) => boolean) | undefined | null,
        flip: boolean, tMin: number, tMax: number, uMin: number, uMax: number,
        tolerance?: number): boolean {
    const x0 = v2[0],
        y0 = v2[1];
    let size = 0;
    for (let i = 0; i < 8; i += 2) {
        size = Math.max(size, Math.abs(v1[i] - x0), Math.abs(v1[i + 1] - y0),
                Math.abs(v2[i] - x0), Math.abs(v2[i + 1] - y0));
    }
    if (size) {
        // 在相对 v2 起点与尺度的坐标中计算，使多项式
        // 系数保持在 1 的量级。三次曲线的隐式形式在
        // 曲线实为二次曲线时会退化为零，因此在容差内改用
        // 二次曲线：两者距离至多为三次曲线
        // 三阶差分的 4/27。
        const p = getLocalPoints(v1, x0, y0, size),
            q = getLocalPoints(v2, x0, y0, size),
            dx = v2[6] - 3 * (v2[4] - v2[2]) - x0,
            dy = v2[7] - 3 * (v2[5] - v2[3]) - y0,
            isQuadratic = 4 / 27 * Math.sqrt(dx * dx + dy * dy) <= tolerance,
            polynomial = isQuadratic
                ? getQuadraticImplicit(p, [q[0], getQuadraticHandle(q), q[3]])
                : getCubicImplicit(p, q),
            roots: number[] = [];
        // v1 移动距离小于容差的 curve-time 宽度，
        // 由其速度上界推出：
        let speed = 0;
        for (let i = 0; i < 6; i += 2) {
            speed = Math.max(speed,
                    3 * Math.sqrt(Math.pow(v1[i + 2] - v1[i], 2)
                        + Math.pow(v1[i + 3] - v1[i + 1], 2)));
        }
        if (polynomial.coefficients.every(function(coefficient, i) {
            return Math.abs(coefficient) <= polynomial.errors[i];
        }))
            return false;
        const count = Numerical.solveBernstein(polynomial.coefficients,
                polynomial.errors, roots, speed ? tolerance / speed : 1);
        // 根数超过次数说明误差淹没了多项式，
        // 例如 v2 的片段远短于 v1 时：
        if (count >= polynomial.coefficients.length)
            return false;
        for (let i = 0; i < count; i++) {
            let t = roots[i];
            const u = Curve.getTimeOf(v2, Curve.getPoint(v1, t) as Point,
                    tolerance);
            if (u !== null) {
                t = tMin + (tMax - tMin) * t;
                const uu = uMin + (uMax - uMin) * u;
                addLocation(locations, include,
                        flip ? c2 : c1, flip ? uu : t,
                        flip ? c1 : c2, flip ? t : uu);
            }
        }
        return true;
    }
    return false;
}

// 下面的多项式为每个系数附带舍入误差上界，
// 通过每步运算累积：操作数的误差
// 加上结果的舍入误差 u * |result|。

function getLocalPoints(v: number[], x0: number, y0: number,
        size: number): LocalPoint[] {
    const u = Numerical.MACHINE_EPSILON,
        points: LocalPoint[] = [];
    for (let i = 0; i < 8; i += 2) {
        const x = (v[i] - x0) / size,
            y = (v[i + 1] - y0) / size;
        // 一次减法与一次除法：
        points.push({ x: x, y: y, ex: 2 * u * Math.abs(x),
                ey: 2 * u * Math.abs(y) });
    }
    return points;
}

/** 由两因子的误差推算乘积 a * b 的误差。 */
function getProductError(a: number, ea: number, b: number,
        eb: number): number {
    return Math.abs(a) * eb + Math.abs(b) * ea + ea * eb
            + Numerical.MACHINE_EPSILON * Math.abs(a * b);
}

/**
 * 隐式形式的线性因子 l(i, j)(x, y)，作为沿三次曲线 p 的
 * Bernstein 形式多项式：由于它们对 x、y 是线性的，其在 p 的
 * 控制点处的值就是它们的系数。
 */
function getLinearFactor(p: LocalPoint[], q: LocalPoint[], i: number,
        j: number, factor: number): Polynomial {
    const u = Numerical.MACHINE_EPSILON,
        coefficients: number[] = [],
        errors: number[] = [];
    for (let k = 0; k < 4; k++) {
        const r = p[k],
            dx1 = q[i].x - r.x,
            dy1 = q[j].y - r.y,
            dx2 = q[j].x - r.x,
            dy2 = q[i].y - r.y,
            error1 = getProductError(dx1,
                q[i].ex + r.ex + u * Math.abs(dx1),
                dy1, q[j].ey + r.ey + u * Math.abs(dy1)),
            error2 = getProductError(dx2,
                q[j].ex + r.ex + u * Math.abs(dx2),
                dy2, q[i].ey + r.ey + u * Math.abs(dy2)),
            difference = dx1 * dy1 - dx2 * dy2,
            value = factor * difference;
        coefficients.push(value);
        errors.push(factor * (error1 + error2 + u * Math.abs(difference))
                + u * Math.abs(value));
    }
    return { coefficients: coefficients, errors: errors };
}

// 三次隐式形式所需次数以内的二项式系数：
const binomials: number[][] = [[1]];
for (let i = 1; i <= 9; i++) {
    const row = [1];
    for (let j = 1; j < i; j++)
        row.push(binomials[i - 1][j - 1] + binomials[i - 1][j]);
    row.push(1);
    binomials.push(row);
}

/** 相乘两个 Bernstein 形式的多项式。 */
function multiplyPoly(a: Polynomial, b: Polynomial): Polynomial {
    const u = Numerical.MACHINE_EPSILON,
        m = a.coefficients.length - 1,
        n = b.coefficients.length - 1,
        coefficients: number[] = [],
        errors: number[] = [];
    for (let k = 0; k <= m + n; k++) {
        let sum = 0,
            error = 0;
        for (let i = Math.max(0, k - n), l = Math.min(m, k); i <= l; i++) {
            const factor = binomials[m][i] * binomials[n][k - i]
                    / binomials[m + n][k],
                a1 = a.coefficients[i],
                b1 = b.coefficients[k - i],
                term = factor * (a1 * b1);
            sum += term;
            // 因子的除法、其乘积，以及求和：
            error += factor * getProductError(a1, a.errors[i],
                        b1, b.errors[k - i])
                    + u * (2 * Math.abs(term) + Math.abs(sum));
        }
        coefficients.push(sum);
        errors.push(error);
    }
    return { coefficients: coefficients, errors: errors };
}

function addPoly(a: Polynomial, b: Polynomial, sign: number): Polynomial {
    const coefficients: number[] = [],
        errors: number[] = [];
    for (let i = 0, l = a.coefficients.length; i < l; i++) {
        const sum = a.coefficients[i] + sign * b.coefficients[i];
        coefficients.push(sum);
        errors.push(a.errors[i] + b.errors[i]
                + Numerical.MACHINE_EPSILON * Math.abs(sum));
    }
    return { coefficients: coefficients, errors: errors };
}

function getCubicImplicit(p: LocalPoint[], q: LocalPoint[]): Polynomial {
    // f(x, y) = | l32  l31        l30 |
    //           | l31  l30 + l21  l20 |
    //           | l30  l20        l10 |
    const l32 = getLinearFactor(p, q, 3, 2, 1 * 3),
        l31 = getLinearFactor(p, q, 3, 1, 1 * 3),
        l30 = getLinearFactor(p, q, 3, 0, 1 * 1),
        l21 = getLinearFactor(p, q, 2, 1, 3 * 3),
        l20 = getLinearFactor(p, q, 2, 0, 3 * 1),
        l10 = getLinearFactor(p, q, 1, 0, 3 * 1),
        m = addPoly(l30, l21, 1);
    return addPoly(addPoly(
            multiplyPoly(l32, addPoly(multiplyPoly(m, l10),
                multiplyPoly(l20, l20), -1)),
            multiplyPoly(l31, addPoly(multiplyPoly(l31, l10),
                multiplyPoly(l20, l30), -1)),
            -1),
            multiplyPoly(l30, addPoly(multiplyPoly(l31, l20),
                multiplyPoly(m, l30), -1)),
            1);
}

/** 退化为二次曲线的三次曲线的控制点，(3 * q1 - q0) / 2。 */
function getQuadraticHandle(q: LocalPoint[]): LocalPoint {
    const u = Numerical.MACHINE_EPSILON,
        x = (3 * q[1].x - q[0].x) / 2,
        y = (3 * q[1].y - q[0].y) / 2;
    return { x: x, y: y,
            ex: (3 * q[1].ex + q[0].ex) / 2 + 2 * u * Math.abs(x),
            ey: (3 * q[1].ey + q[0].ey) / 2 + 2 * u * Math.abs(y) };
}

function getQuadraticImplicit(p: LocalPoint[], q: LocalPoint[]): Polynomial {
    // f(x, y) = | l21  l20 |
    //           | l20  l10 |
    const l21 = getLinearFactor(p, q, 2, 1, 1 * 2),
        l20 = getLinearFactor(p, q, 2, 0, 1 * 1),
        l10 = getLinearFactor(p, q, 1, 0, 2 * 1);
    return addPoly(multiplyPoly(l21, l10), multiplyPoly(l20, l20), -1);
}

type HullPoint = [number, number];

/**
 * 计算非参数化贝塞尔曲线 D(ti, di(t)) 的凸包。
 * ti 在 [0..1] 上等距分布，对 di(t) 即 [0, 1/3, 2/3, 1]，
 * 分别对应 [dq0, dq1, dq2, dq3]。
 *
 * 凸包以 [TOP, BOTTOM] 两部分返回（均位于
 * y 向上增长、原点在左下的坐标系中）：
 * TOP：位于“中线”（连接曲线端点的直线）上方的部分，
 * BOTTOM：位于该中线下方的部分。
 */
function getConvexHull(dq0: number, dq1: number, dq2: number,
        dq3: number): HullPoint[][] {
    const p0: HullPoint = [0, dq0],
        p1: HullPoint = [1 / 3, dq1],
        p2: HullPoint = [2 / 3, dq2],
        p3: HullPoint = [1, dq3],
        // 求 p1、p2 到直线 [p0, p3] 的竖直有向距离
        dist1 = dq1 - (2 * dq0 + dq3) / 3,
        dist2 = dq2 - (dq0 + 2 * dq3) / 3;
    let hull: HullPoint[][];
    // 检查 p1、p2 是否位于直线 [p0, p3] 的两侧
    if (dist1 * dist2 < 0) {
        // p1、p2 在 [p0, p3] 两侧，凸包是四边形，
        // 且线段 [p0, p3] 不属于凸包，
        // 基本就完成了。上部分包含 p1，
        // 若不符则稍后反转。
        hull = [[p0, p1, p3], [p0, p2, p3]];
    } else {
        // p1、p2 在 [p0, p3] 同侧，凸包可能是三角形
        // 或四边形，且线段 [p0, p3] 属于凸包。
        const distRatio = dist1 / dist2;
        hull = [
            // p2 在内侧，凸包为三角形。
            distRatio >= 2 ? [p0, p1, p3]
            // p1 在内侧，凸包为三角形。
            : distRatio <= 0.5 ? [p0, p2, p3]
            // 凸包为四边形，需要按正确顺序取所有边。
            : [p0, p1, p2, p3],
            // 线段 [p0, p3] 属于凸包。
            [p0, p3]
        ];
    }
    // 若 dist1 为负，或 dist1 为零且 dist2 为负，则反转凸包
    return (dist1 || dist2) < 0 ? hull.reverse() : hull;
}

/** 裁剪凸包，返回其中曲线对应的 [tMin, tMax]。 */
function clipConvexHull(hullTop: HullPoint[], hullBottom: HullPoint[],
        dMin: number, dMax: number): number | null {
    if (hullTop[0][1] < dMin) {
        // 凸包左端低于 dMin，沿凸包前进直到进入
        // dMin 与 dMax 之间的区域
        return clipConvexHullPart(hullTop, true, dMin);
    } else if (hullBottom[0][1] > dMax) {
        // 凸包左端高于 dMax，沿凸包前进直到进入
        // dMin 与 dMax 之间的区域
        return clipConvexHullPart(hullBottom, false, dMax);
    } else {
        // 凸包左端位于 dMin 与 dMax 之间，无需裁剪
        return hullTop[0][0];
    }
}

function clipConvexHullPart(part: HullPoint[], top: boolean,
        threshold: number): number | null {
    let px = part[0][0],
        py = part[0][1];
    for (let i = 1, l = part.length; i < l; i++) {
        const qx = part[i][0],
            qy = part[i][1];
        if (top ? qy >= threshold : qy <= threshold) {
            return qy === threshold ? qx
                    : px + (threshold - py) * (qx - px) / (qy - py);
        }
        px = qx;
        py = qy;
    }
    // 凸包的所有点都在阈值之上 / 之下
    return null;
}

/**
 * 曲线与直线的求交在这里变得相当简单，
 * 这主要得益于 Numerical 类。可以把曲线与直线旋转，
 * 使直线落在 X 轴上，再对 X 轴与曲线
 * 求解隐式方程。
 */
function getCurveLineIntersections(v: number[], px: number, py: number,
        vx: number, vy: number): number[] {
    const isZero = Numerical.isZero;
    if (isZero(vx) && isZero(vy)) {
        // 处理没有方向的直线（即一个点）这一特例，并
        // 检查它是否在曲线上。
        const t = Curve.getTimeOf(v, new Point(px, py));
        return t === null ? [] : [t];
    }
    // 计算相对 x 轴 (1, 0) 的角度。
    const angle = Math.atan2(-vy, vx),
        sin = Math.sin(angle),
        cos = Math.cos(angle),
        // (rlx1, rly1) = (0, 0)
        // 计算旋转后曲线的曲线值。
        rv: number[] = [],
        roots: number[] = [];
    for (let i = 0; i < 8; i += 2) {
        const x = v[i] - px,
            y = v[i + 1] - py;
        rv.push(
            x * cos - y * sin,
            x * sin + y * cos);
    }
    // 对 y = 0 求解。需要包含 t = 0、1，
    // 由 addLocation() 负责过滤，以覆盖重要边界情况。
    Curve.solveCubic(rv, 1, 0, roots, 0, 1);
    // 若曲线端点的旋转后 y 约等于 0，则端点在直线上；
    // 即使旋转的舍入使 solveCubic() 找不到它们，
    // 例如零长度手柄处的二重根（#1848）：
    const epsilon = Numerical.GEOMETRIC_EPSILON;
    if (Math.abs(rv[1]) < epsilon)
        roots.push(0);
    if (Math.abs(rv[7]) < epsilon)
        roots.push(1);
    return roots;
}

function addCurveLineIntersections(v1: number[], v2: number[], c1: Curve,
        c2: Curve, locations: CurveLocation[],
        include: ((location: CurveLocation) => boolean) | undefined | null,
        flip: boolean): void {
    // addCurveLineIntersections() 约定 v1 总是曲线、
    // v2 是直线。flip 表示调用 addLocation() 时
    // 是否需要交换两条曲线。
    const x1 = v2[0], y1 = v2[1],
        x2 = v2[6], y2 = v2[7],
        roots = getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);
    // 注意：count 可能为 -1（无穷多解），但那只应
    // 出现在直线情形，而这里不该出现。
    for (let i = 0, l = roots.length; i < l; i++) {
        // 对旋转曲线上每个解，取真实曲线上的点，
        // 并据此得到直线上的位置。
        const t1 = roots[i],
            p1 = Curve.getPoint(v1, t1) as Point,
            t2 = Curve.getTimeOf(v2, p1);
        if (t2 !== null) {
            // 只有在没有递归时才使用该时间值，
            // 否则交给 addLocation() 计算实际时间值。
            addLocation(locations, include,
                    flip ? c2 : c1, flip ? t2 : t1,
                    flip ? c1 : c2, flip ? t1 : t2);
        }
    }
}

function addLineIntersection(v1: number[], v2: number[], c1: Curve, c2: Curve,
        locations: CurveLocation[],
        include: ((location: CurveLocation) => boolean) | undefined | null): void {
    const pt = Line.intersect(
            v1[0], v1[1], v1[6], v1[7],
            v2[0], v2[1], v2[6], v2[7]);
    if (pt) {
        addLocation(locations, include,
                c1, Curve.getTimeOf(v1, pt),
                c2, Curve.getTimeOf(v2, pt));
    }
}

function getCurveIntersections(v1: number[], v2: number[], c1: Curve,
        c2: Curve, locations: CurveLocation[],
        include?: ((location: CurveLocation) => boolean) | null,
        tolerance?: number): CurveLocation[] {
    const min = Math.min,
        max = Math.max,
        abs = Math.abs,
        minX1 = min(v1[0], v1[2], v1[4], v1[6]),
        maxX1 = max(v1[0], v1[2], v1[4], v1[6]),
        minY1 = min(v1[1], v1[3], v1[5], v1[7]),
        maxY1 = max(v1[1], v1[3], v1[5], v1[7]),
        minX2 = min(v2[0], v2[2], v2[4], v2[6]),
        maxX2 = max(v2[0], v2[2], v2[4], v2[6]),
        minY2 = min(v2[1], v2[3], v2[5], v2[7]),
        maxY2 = max(v2[1], v2[3], v2[5], v2[7]),
        // 仅相切的边界需要容差，在大坐标下同样如此：
        epsilon = Numerical.getEpsilon(max(
                abs(minX1), abs(maxX1), abs(minY1), abs(maxY1),
                abs(minX2), abs(maxX2), abs(minY2), abs(maxY2)));

    // 若完全在控制包围盒之外则跳过检查，
    // 但 getOverlaps() 仍可能判定为重叠的曲线除外：
    const boundsEpsilon = max(epsilon,
            tolerance || Numerical.GEOMETRIC_EPSILON);
    if (maxX1 + boundsEpsilon > minX2 && minX1 - boundsEpsilon < maxX2 &&
        maxY1 + boundsEpsilon > minY2 && minY1 - boundsEpsilon < maxY2) {
        // 现在检测并处理重叠：
        const overlaps = findOverlaps(v1, v2, tolerance);
        if (overlaps) {
            for (let i = 0; i < 2; i++) {
                const overlap = overlaps[i];
                addLocation(locations, include,
                        c1, overlap[0],
                        c2, overlap[1], true);
            }
        } else {
            const straight1 = Curve.isStraight(v1),
                straight2 = Curve.isStraight(v2),
                straight = straight1 && straight2,
                flip = straight1 && !straight2,
                before = locations.length;
            // 根据是一条还是两条曲线为直线，
            // 选择正确的求交方法：
            if (straight) {
                addLineIntersection(flip ? v2 : v1, flip ? v1 : v2,
                        flip ? c2 : c1, flip ? c1 : c2, locations, include);
            } else if (straight1 || straight2) {
                addCurveLineIntersections(flip ? v2 : v1, flip ? v1 : v2,
                        flip ? c2 : c1, flip ? c1 : c2, locations, include,
                        flip);
            } else {
                addCurveIntersections(flip ? v2 : v1, flip ? v1 : v2,
                        flip ? c2 : c1, flip ? c1 : c2, locations, include,
                        flip,
                        // recursion、calls、tMin、tMax、uMin、uMax
                        0, 0, 0, 1, 0, 1, tolerance);
            }
            // 处理特例：一条曲线的起点 / 终点落在
            // 另一条曲线上（若给了容差，则在该容差内），
            // 但仅当尚未找到直线-直线交点时：
            // #805#issuecomment-148503018
            if (!straight || locations.length === before) {
                const endEpsilon = tolerance || epsilon;
                for (let i = 0; i < 4; i++) {
                    const isSecond = i >> 1, // 0, 0, 1, 1
                        t = i & 1, // 0, 1, 0, 1
                        v = isSecond ? v2 : v1,
                        x = v[t * 6],
                        y = v[t * 6 + 1];
                    // 只有落在另一曲线包围盒内的端点才可能在其上：
                    if (isSecond
                            ? x >= minX1 - endEpsilon
                                && x <= maxX1 + endEpsilon
                                && y >= minY1 - endEpsilon
                                && y <= maxY1 + endEpsilon
                            : x >= minX2 - endEpsilon
                                && x <= maxX2 + endEpsilon
                                && y >= minY2 - endEpsilon
                                && y <= maxY2 + endEpsilon) {
                        const u = Curve.getTimeOf(isSecond ? v1 : v2,
                                new Point(x, y), endEpsilon);
                        if (u !== null) {
                            addLocation(locations, include,
                                    c1, isSecond ? u : t,
                                    c2, isSecond ? t : u);
                        }
                    }
                }
            }
        }
    }
    return locations;
}

function getSelfIntersection(v1: number[], c1: Curve,
        locations: CurveLocation[],
        include?: ((location: CurveLocation) => boolean) | null
        ): CurveLocation[] {
    const info = Curve.classify(v1);
    if (info.type === 'loop') {
        const roots = info.roots;
        addLocation(locations, include,
                c1, roots[0],
                c1, roots[1]);
    }
    return locations;
}

function findIntersections(curves1: Curve[], curves2?: Curve[] | null,
        include?: ((location: CurveLocation) => boolean) | null,
        matrix1?: Matrix, matrix2?: Matrix, _returnFirst?: boolean,
        _tolerance?: number,
        _collisions?: (number[] | null)[] | null): CurveLocation[] {
    // 布尔运算会传入自己的容差，即两条曲线算作
    // 重叠或相切的距离阈值：
    const self = !curves2;
    if (self)
        curves2 = curves1;
    const length1 = curves1.length,
        length2 = curves2.length,
        values1: number[][] = new Array(length1),
        values2: number[][] = self ? values1 : new Array(length2),
        locations: CurveLocation[] = [];

    for (let i = 0; i < length1; i++) {
        values1[i] = curves1[i].getValues(matrix1);
    }
    if (!self) {
        for (let i = 0; i < length2; i++) {
            values2[i] = curves2[i].getValues(matrix2);
        }
    }
    // 布尔运算可能传入曲线包围盒的碰撞结果，
    // 这些结果是按不小于其容差的范围求出的。
    const boundsCollisions = _collisions
            || findCurveBoundsCollisions(values1, values2,
                _tolerance || Numerical.GEOMETRIC_EPSILON);
    for (let index1 = 0; index1 < length1; index1++) {
        const curve1 = curves1[index1],
            v1 = values1[index1];
        if (self) {
            // 先检查同一条曲线内部的自交点。
            getSelfIntersection(v1, curve1, locations, include);
        }
        // 再检查与可能相交的曲线的交点。
        const collisions1 = boundsCollisions[index1];
        if (collisions1) {
            for (let j = 0; j < collisions1.length; j++) {
                // 上面的自交检查可能已经加入了一个位置，
                // 若只需返回第一个交点则直接返回。
                if (_returnFirst && locations.length)
                    return locations;
                const index2 = collisions1[j];
                if (!self || index2 > index1) {
                    const curve2 = curves2[index2],
                        v2 = values2[index2];
                    getCurveIntersections(v1, v2, curve1, curve2,
                            locations, include, _tolerance);
                }
            }
        }
    }
    return locations;
}

/**
 * 检测相交曲线重叠的代码，基于
 * @iconexperience 在 #648 中的工作。
 */
function findOverlaps(v1: number[], v2: number[],
        tolerance?: number): number[][] | null {
    // 直线段只有在共线时才可能重叠。这里不使用
    // isCollinear() 检查，而是取两条曲线中按直线处理时更长的一条，
    // 再看另一条线段的起点与终点到
    // 这条直线（视为无限长）的距离。但即使曲线
    // 不是直线，它们的手柄也可能小到落在几何 epsilon
    // 距离内，因此也要检查这种情况。

    function getSquaredLineLength(v: number[]): number {
        const x = v[6] - v[0],
            y = v[7] - v[1];
        return x * x + y * y;
    }

    const abs = Math.abs,
        getDistance = Line.getDistance,
        timeEpsilon = CURVETIME_EPSILON,
        geomEpsilon = tolerance || Numerical.GEOMETRIC_EPSILON,
        flip = getSquaredLineLength(v1) < getSquaredLineLength(v2),
        l1 = flip ? v2 : v1,
        l2 = flip ? v1 : v2,
        // 取出 l1 的起点与终点坐标，便于快速引用。
        px = l1[0], py = l1[1],
        vx = l1[6] - px, vy = l1[7] - py;
    let straight1 = Curve.isStraight(v1),
        straight2 = Curve.isStraight(v2),
        straightBoth = straight1 && straight2;
    // 检查第二条曲线的起点与终点是否非常接近
    // 所选直线。注意所选直线对应的曲线
    // 未必真是直线，因此之后还要做更多检查。
    if (getDistance(px, py, vx, vy, l2[0], l2[1], true) < geomEpsilon &&
        getDistance(px, py, vx, vy, l2[6], l2[7], true) < geomEpsilon) {
        // 若两条曲线不都是直线，则检查它们的手柄，
        // 距离足够近时按直线处理。
        if (!straightBoth &&
            getDistance(px, py, vx, vy, l1[2], l1[3], true) < geomEpsilon &&
            getDistance(px, py, vx, vy, l1[4], l1[5], true) < geomEpsilon &&
            getDistance(px, py, vx, vy, l2[2], l2[3], true) < geomEpsilon &&
            getDistance(px, py, vx, vy, l2[4], l2[5], true) < geomEpsilon) {
            straight1 = straight2 = straightBoth = true;
        }
    } else if (straightBoth) {
        // 若两条曲线都是直线且彼此距离不近，
        // 则不可能重叠。
        return null;
    }
    if (straight1 !== straight2) {
        // 若一条是直线，另一条也必须是直线，
        // 否则不可能重叠。
        return null;
    }

    const v = [v1, v2];
    let pairs: number[][] | null = [];
    // 遍历所有端点：
    // 先取曲线 1、2 的 p1，再取曲线 1、2 的 p2。
    for (let i = 0; i < 4 && (pairs as number[][]).length < 2; i++) {
        const i1 = i & 1, // 0, 1, 0, 1
            i2 = i1 ^ 1, // 1, 0, 1, 0
            t1 = i >> 1, // 0, 0, 1, 1
            t2 = Curve.getTimeOf(v[i1], new Point(
                v[i2][t1 ? 6 : 0],
                v[i2][t1 ? 7 : 1]), geomEpsilon);
        if (t2 != null) { // If point is on curve
            const pair = i1 ? [t1, t2] : [t2, t1];
            const current = pairs as number[][];
            // 过滤掉极小的重叠。
            if (!current.length
                    || abs(pair[0] - current[0][0]) > timeEpsilon
                    && abs(pair[1] - current[0][1]) > timeEpsilon) {
                current.push(pair);
            }
        }
        // 已检查 3 个点仍无匹配，两条曲线不可能重叠。
        if (i > 2 && !(pairs as number[][]).length)
            break;
    }
    if ((pairs as number[][]).length !== 2) {
        pairs = null;
    } else if (!straightBoth) {
        // 直线对无需进一步检查。若找到 2 对，
        // v1 与 v2 上的端点应相同。
        const found = pairs as number[][],
            o1 = Curve.getPart(v1, found[0][0], found[1][0]),
            o2 = Curve.getPart(v2, found[0][1], found[1][1]);
        // 检查重叠曲线的手柄是否也相同。
        if (abs(o2[2] - o1[2]) > geomEpsilon ||
            abs(o2[3] - o1[3]) > geomEpsilon ||
            abs(o2[4] - o1[4]) > geomEpsilon ||
            abs(o2[5] - o1[5]) > geomEpsilon)
            pairs = null;
    }
    return pairs;
}

// -------------------------------------------------------------------------

export class Curve {
    _segment1: Segment;
    _segment2: Segment;
    _path?: Path | null;
    /** 缓存的长度，由 `_changed()` 清除。 */
    _length?: number;

    constructor(segment1?: Segment, segment2?: Segment) {
        this._segment1 = segment1 || new Segment();
        this._segment2 = segment2 || new Segment();
    }

    _changed(): void {
        // 清除缓存值。
        this._length = undefined;
    }

    /** 返回曲线的副本。 */
    clone(): Curve {
        return new Curve(this._segment1, this._segment2);
    }

    toString(): string {
        const parts = ['point1: ' + this._segment1._point];
        if (!this._segment1._handleOut.isZero())
            parts.push('handle1: ' + this._segment1._handleOut);
        if (!this._segment2._handleIn.isZero())
            parts.push('handle2: ' + this._segment2._handleIn);
        parts.push('point2: ' + this._segment2._point);
        return '{ ' + parts.join(', ') + ' }';
    }

    /** 从路径中移除该曲线，并合并相关线段的手柄。 */
    remove(): boolean {
        let removed = false;
        if (this._path) {
            const segment2 = this._segment2,
                handleOut = segment2._handleOut;
            removed = segment2.remove();
            if (removed)
                this._segment1._handleOut._set(handleOut.x, handleOut.y);
        }
        return removed;
    }

    // ---------------------------------------------------------------------
    // 点与手柄

    /** 曲线的第一个锚点。 */
    get point1(): Point {
        return this._segment1._point;
    }

    set point1(point: Point) {
        this._segment1._point._set(point.x, point.y);
    }

    /** 曲线的第二个锚点。 */
    get point2(): Point {
        return this._segment2._point;
    }

    set point2(point: Point) {
        this._segment2._point._set(point.x, point.y);
    }

    /** 描述第一个锚点处切线的手柄。 */
    get handle1(): Point {
        return this._segment1._handleOut;
    }

    set handle1(handle: Point) {
        this._segment1._handleOut._set(handle.x, handle.y);
    }

    /** 描述第二个锚点处切线的手柄。 */
    get handle2(): Point {
        return this._segment2._handleIn;
    }

    set handle2(handle: Point) {
        this._segment2._handleIn._set(handle.x, handle.y);
    }

    /** 曲线的第一个线段。 */
    get segment1(): Segment {
        return this._segment1;
    }

    /** 曲线的第二个线段。 */
    get segment2(): Segment {
        return this._segment2;
    }

    /** 曲线所属的路径。 */
    get path(): Path | null {
        return this._path || null;
    }

    /** 曲线在路径曲线数组中的下标。 */
    get index(): number | null {
        const index = this._segment1._index;
        return index !== undefined ? index : null;
    }

    /** 路径曲线数组中的下一条曲线。 */
    get next(): Curve | null {
        const path = this._path,
            curves = path && path._curves;
        return curves && (curves[this._segment1._index + 1]
                || path._closed && curves[0]) || null;
    }

    /** 路径曲线数组中的上一条曲线。 */
    get previous(): Curve | null {
        const path = this._path,
            curves = path && path._curves;
        return curves && (curves[this._segment1._index - 1]
                || path._closed && curves[curves.length - 1]) || null;
    }

    /** 是否为路径曲线数组中的第一条曲线。 */
    isFirst(): boolean {
        return !this._segment1._index;
    }

    /** 是否为路径曲线数组中的最后一条曲线。 */
    isLast(): boolean {
        const path = this._path;
        return path && this._segment1._index === path._curves.length - 1
                || false;
    }

    /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
    getValues(matrix?: Matrix): number[] {
        return Curve.getValues(this._segment1, this._segment2, matrix);
    }

    /** 曲线几何的 4 个绝对坐标点。 */
    getPoints(): Point[] {
        const coords = this.getValues(),
            points: Point[] = [];
        for (let i = 0; i < 8; i += 2)
            points.push(new Point(coords[i], coords[i + 1]));
        return points;
    }

    /** 曲线的近似长度。 */
    get length(): number {
        if (this._length == null)
            this._length = Curve.getLength(this.getValues(), 0, 1);
        return this._length;
    }

    /** 曲线几何覆盖的面积。 */
    get area(): number {
        return Curve.getArea(this.getValues());
    }

    /** 两个锚点之间的直线，供 `isCollinear()` 使用。 */
    getLine(): Line {
        return new Line(this._segment1._point, this._segment2._point);
    }

    /** 在给定 curve-time 区间内取子曲线。 */
    getPart(from: number, to: number): Curve {
        return curveFromValues(Curve.getPart(this.getValues(), from, to));
    }

    /** 给定 curve-time 区间内的曲线长度。 */
    getPartLength(from: number, to: number): number {
        return Curve.getLength(this.getValues(), from, to);
    }

    /** 给定 curve-time 处的曲线偏移。 */
    getOffsetAtTime(time: number): number {
        return this.getPartLength(0, time);
    }

    /**
     * 在给定偏移或位置处分割曲线。曲线本身
     * 成为第一部分，返回第二部分。
     */
    divideAt(location: number | CurveLocation): Curve | null {
        // 既接受偏移，也接受 CurveLocation 以及行为类似的对象，
        // 与原实现一致。
        const time = location && (location as CurveLocation).curve === this
            ? (location as CurveLocation).time
            : this.getTimeAt(location as number);
        return time == null ? null : this.divideAtTime(time);
    }

    /**
     * 在给定 curve-time 处分割曲线。曲线本身成为
     * 第一部分，返回第二部分；若曲线属于某条路径，
     * 还会插入该路径。
     */
    divideAtTime(time: number): Curve | null {
        // 仅在不在起点或终点时才分割。
        const tMin = CURVETIME_EPSILON,
            tMax = 1 - tMin;
        let res: Curve | null = null;
        if (time >= tMin && time <= tMax) {
            const parts = Curve.subdivide(this.getValues(), time),
                left = parts[0],
                right = parts[1],
                setHandles = this.hasHandles(),
                seg1 = this._segment1,
                seg2 = this._segment2,
                path = this._path;
            if (setHandles) {
                // 调整已有线段上的手柄。新线段
                // 将插入到现有 segment1 与 segment2 之间：
                // 绝对坐标 -> 相对坐标
                seg1._handleOut._set(left[2] - left[0], left[3] - left[1]);
                seg2._handleIn._set(right[4] - right[6], right[5] - right[7]);
            }
            // 创建新线段：
            const x = left[6],
                y = left[7],
                segment = new Segment(new Point(x, y),
                        setHandles ? new Point(left[4] - x, left[5] - y)
                            : undefined,
                        setHandles ? new Point(right[2] - x, right[3] - y)
                            : undefined);
            // 如有需要，把它插入线段列表：
            if (path) {
                // 插入到 seg1.index + 1 处，可确保闭合路径的
                // 收尾曲线插入到末尾，
                // 若用 segment2.index 则会插到 0 处。
                path.insert(seg1._index + 1, segment);
                // 新插入的线段是下一条曲线的起点：
                res = this.next;
            } else {
                // 否则用分割结果创建它
                this._segment2 = segment;
                this._changed();
                res = new Curve(segment, seg2);
            }
        }
        return res;
    }

    /** 在给定偏移或位置处拆分曲线所属的路径。 */
    splitAt(location: number | CurveLocation | null): Path | null {
        const path = this._path;
        if (!path || location == null)
            return null;
        return typeof location === 'number'
                ? path.splitAt(location)
                : path.split(location);
    }

    /** 在给定 curve-time 处拆分曲线所属的路径。 */
    splitAtTime(time: number): Path | null {
        return this.splitAt(this.getLocationAtTime(time));
    }

    /** 返回反向的曲线副本，不修改原曲线。 */
    reversed(): Curve {
        return new Curve(this._segment2.reversed(), this._segment1.reversed());
    }

    /** 清除手柄，使曲线变为直线。 */
    clearHandles(): void {
        this._segment1._handleOut._set(0, 0);
        this._segment2._handleIn._set(0, 0);
    }

    // ---------------------------------------------------------------------
    // 判断

    /** 曲线是否设置了手柄。 */
    hasHandles(): boolean {
        return !this._segment1._handleOut.isZero()
                || !this._segment2._handleIn.isZero();
    }

    /** 曲线长度是否大于给定 epsilon。 */
    hasLength(epsilon?: number): boolean {
        return (!this.point1.equals(this.point2) || this.hasHandles())
                && this.length > (epsilon || 0);
    }

    /**
     * 曲线是否表现为直线：没有手柄，
     * 或手柄与锚点连线共线且
     * 不超出该线段。
     */
    isStraight(): boolean {
        const p1 = this._segment1._point,
            h1 = this._segment1._handleOut,
            h2 = this._segment2._handleIn,
            p2 = this._segment2._point;
        return isStraightTest(p1._x, p1._y, h1._x, h1._y, h2._x, h2._y,
                p2._x, p2._y);
    }

    /** 曲线是否是参数线性的。 */
    isLinear(): boolean {
        const p1 = this._segment1._point,
            h1 = this._segment1._handleOut,
            h2 = this._segment2._handleIn,
            p2 = this._segment2._point;
        return isLinearTest(p1._x, p1._y, h1._x, h1._y, h2._x, h2._y,
                p2._x, p2._y);
    }

    /** 两条曲线是否描述共线的直线。 */
    isCollinear(curve: Curve | null): boolean {
        return !!curve && this.isStraight() && curve.isStraight()
                && this.getLine().isCollinear(curve.getLine());
    }

    /** 曲线是否为水平直线。 */
    isHorizontal(): boolean {
        const tangent = this.getTangentAtTime(0.5);
        return this.isStraight()
                && !!tangent
                && Math.abs(tangent.y) < Numerical.TRIGONOMETRIC_EPSILON;
    }

    /** 曲线是否为竖直直线。 */
    isVertical(): boolean {
        const tangent = this.getTangentAtTime(0.5);
        return this.isStraight()
                && !!tangent
                && Math.abs(tangent.x) < Numerical.TRIGONOMETRIC_EPSILON;
    }

    // ---------------------------------------------------------------------
    // 曲线上的位置

    /** 给定偏移处的曲线位置；超出范围时为 `null`。 */
    getLocationAt(offset: number): CurveLocation | null {
        return this.getLocationAtTime(this.getTimeAt(offset));
    }

    /** 给定 curve-time 处的曲线位置；超出范围时为 `null`。 */
    getLocationAtTime(time: number | null): CurveLocation | null {
        return time != null && time >= 0 && time <= 1
                ? new CurveLocation(this, time)
                : null;
    }

    /**
     * 给定偏移处相对可选起点的 curve-time，
     * 若偏移超出曲线长度则返回 `null`。
     */
    getTimeAt(offset: number, start?: number): number | null {
        return Curve.getTimeAt(this.getValues(), offset, start);
    }

    /** 若点在曲线上，返回其 curve-time。 */
    getTimeOf(point: Point): number | null {
        return Curve.getTimeOf(this.getValues(), point);
    }

    /**
     * 曲线与给定切线相切处的 curve-time 参数，
     * 至多两个。起点或终点处的切线也包含在内。
     */
    getTimesWithTangent(tangent: Point): number[] {
        return tangent.isZero()
                ? []
                : Curve.getTimesWithTangent(this.getValues(), tangent);
    }

    /** 若点在曲线上，返回到该点的路径长度。 */
    getOffsetOf(point: Point): number | null {
        const location = this.getLocationAtTime(this.getTimeOf(point));
        return location ? location.offset : null;
    }

    /** 曲线上距离给定点最近的位置。 */
    getNearestLocation(point: Point): CurveLocation {
        const values = this.getValues(),
            time = Curve.getNearestTime(values, point),
            pt = Curve.getPoint(values, time) as Point;
        return new CurveLocation(this, time, pt, undefined,
                point.getDistance(pt));
    }

    /** 曲线上距离给定点最近的点。 */
    getNearestPoint(point: Point): Point | null {
        const location = this.getNearestLocation(point);
        return location ? location.point : null;
    }

    // ---------------------------------------------------------------------
    // 求值：按偏移的形式与按 curve-time 的形式

    getPointAt(location: number): Point | null {
        const values = this.getValues();
        return Curve.getPoint(values, Curve.getTimeAt(values, location));
    }

    getPointAtTime(time: number): Point | null {
        return Curve.getPoint(this.getValues(), time);
    }

    getTangentAt(location: number): Point | null {
        const values = this.getValues();
        return Curve.getTangent(values, Curve.getTimeAt(values, location));
    }

    getTangentAtTime(time: number): Point | null {
        return Curve.getTangent(this.getValues(), time);
    }

    getNormalAt(location: number): Point | null {
        const values = this.getValues();
        return Curve.getNormal(values, Curve.getTimeAt(values, location));
    }

    getNormalAtTime(time: number): Point | null {
        return Curve.getNormal(this.getValues(), time);
    }

    getWeightedTangentAt(location: number): Point | null {
        const values = this.getValues();
        return Curve.getWeightedTangent(values, Curve.getTimeAt(values, location));
    }

    getWeightedTangentAtTime(time: number): Point | null {
        return Curve.getWeightedTangent(this.getValues(), time);
    }

    getWeightedNormalAt(location: number): Point | null {
        const values = this.getValues();
        return Curve.getWeightedNormal(values, Curve.getTimeAt(values, location));
    }

    getWeightedNormalAtTime(time: number): Point | null {
        return Curve.getWeightedNormal(this.getValues(), time);
    }

    getCurvatureAt(location: number): number {
        const values = this.getValues();
        return Curve.getCurvature(values, Curve.getTimeAt(values, location));
    }

    getCurvatureAtTime(time: number): number {
        return Curve.getCurvature(this.getValues(), time);
    }

    // ---------------------------------------------------------------------
    // 求交

    /** 与另一条曲线的所有交点；不传则为自交点。 */
    getIntersections(curve?: Curve | null): CurveLocation[] {
        const v1 = this.getValues(),
            v2 = curve && curve !== this && curve.getValues();
        return v2
                ? getCurveIntersections(v1, v2, this, curve, [])
                : getSelfIntersection(v1, this, []);
    }

    // ---------------------------------------------------------------------
    // 静态方法

    /** 曲线几何的 8 个值：point1、handle1、handle2、point2。 */
    static getValues(segment1: Segment, segment2: Segment, matrix?: Matrix,
            straight?: boolean): number[] {
        const p1 = segment1._point,
            h1 = segment1._handleOut,
            h2 = segment2._handleIn,
            p2 = segment2._point,
            x1 = p1.x, y1 = p1.y,
            x2 = p2.x, y2 = p2.y,
            values = straight
                ? [x1, y1, x1, y1, x2, y2, x2, y2]
                : [
                    x1, y1,
                    x1 + h1._x, y1 + h1._y,
                    x2 + h2._x, y2 + h2._y,
                    x2, y2
                ];
        if (matrix)
            matrix._transformCoordinates(values, values, 4);
        return values;
    }

    /** 在 `t` 处把曲线值分成左右两条子曲线。 */
    static subdivide(v: number[], t?: number): number[][] {
        const x0 = v[0], y0 = v[1],
            x1 = v[2], y1 = v[3],
            x2 = v[4], y2 = v[5],
            x3 = v[6], y3 = v[7];
        if (t === undefined)
            t = 0.5;
        // 三角形插值计算，循环已展开。
        const u = 1 - t,
            // 由 4 个点插值出 3 个点
            x4 = u * x0 + t * x1, y4 = u * y0 + t * y1,
            x5 = u * x1 + t * x2, y5 = u * y1 + t * y2,
            x6 = u * x2 + t * x3, y6 = u * y2 + t * y3,
            // 由 3 个点插值出 2 个点
            x7 = u * x4 + t * x5, y7 = u * y4 + t * y5,
            x8 = u * x5 + t * x6, y8 = u * y5 + t * y6,
            // 由 2 个点插值出 1 个点
            x9 = u * x7 + t * x8, y9 = u * y7 + t * y8;
        // 现在已具备构造子曲线所需的全部值：
        return [
            [x0, y0, x4, y4, x7, y7, x9, y9], // left
            [x9, y9, x8, y8, x6, y6, x3, y3] // right
        ];
    }

    /**
     * 把曲线值拆成在指定坐标方向上单调的若干曲线，
     * `dir` 为 false 表示 x 方向，为 true 表示 y 方向。
     */
    static getMonoCurves(v: number[], dir?: boolean): number[][] {
        const curves: number[][] = [],
            // 确定坐标在曲线值数组中的下标。
            io = dir ? 0 : 1,
            o0 = v[io + 0],
            o1 = v[io + 2],
            o2 = v[io + 4],
            o3 = v[io + 6];
        if ((o0 >= o1) === (o1 >= o2) && (o1 >= o2) === (o2 >= o3)
                || Curve.isStraight(v)) {
            // 直线，以及相关点在该坐标方向上
            // 单调排列的曲线，必定单调。
            curves.push(v);
        } else {
            const a = 3 * (o1 - o2) - o0 + o3,
                b = 2 * (o0 + o2) - 4 * o1,
                c = o1 - o0,
                tMin = CURVETIME_EPSILON,
                tMax = 1 - tMin,
                roots: number[] = [],
                n = Numerical.solveQuadratic(a, b, c, roots, tMin, tMax);
            if (!n) {
                curves.push(v);
            } else {
                roots.sort();
                let t = roots[0],
                    parts = Curve.subdivide(v, t);
                curves.push(parts[0]);
                if (n > 1) {
                    t = (roots[1] - t) / (1 - t);
                    parts = Curve.subdivide(parts[1], t);
                    curves.push(parts[0]);
                }
                curves.push(parts[1]);
            }
        }
        return curves;
    }

    /**
     * 把某一坐标轴上的点坐标 (p0, p1, p2, p3) 转换为
     * 多项式系数，并对 `val` 求解该多项式。
     */
    static solveCubic(v: number[], coord: number, val: number, roots: number[],
            min?: number, max?: number): number {
        const v0 = v[coord],
            v1 = v[coord + 2],
            v2 = v[coord + 4],
            v3 = v[coord + 6];
        // 若 val 在曲线值范围之外，则无解。
        if (!(v0 < val && v3 < val && v1 < val && v2 < val ||
                v0 > val && v3 > val && v1 > val && v2 > val)) {
            const c = 3 * (v1 - v0),
                b = 3 * (v2 - v1) - c,
                a = v3 - v0 - c - b;
            return Numerical.solveCubic(a, b, c, v0 - val, roots, min, max);
        }
        return 0;
    }

    /** 给定 curve-time 区间内的子曲线；`from > to` 时反向。 */
    static getPart(v: number[], from: number, to: number): number[] {
        const flip = from > to;
        if (flip) {
            const tmp = from;
            from = to;
            to = tmp;
        }
        if (from > 0)
            v = Curve.subdivide(v, from)[1]; // [1] right
        // 在新曲线中插值出 'to' 对应的参数并在那里截断。
        if (to < 1)
            v = Curve.subdivide(v, (to - from) / (1 - from))[0]; // [0] left
        // 若 from / to 被交换，则返回反向曲线：
        return flip
                ? [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]]
                : v;
    }

    /**
     * 曲线是否足够平坦，即表现为一条
     * 偏差在 `flatness` 容差内的直线。
     */
    static isFlatEnough(v: number[], flatness: number): boolean {
        // 以下方法感谢 Kaspar Fischer 与 Roger Willcocks：
        // http://hcklbrrfnn.files.wordpress.com/2012/08/bez.pdf
        const x0 = v[0], y0 = v[1],
            x1 = v[2], y1 = v[3],
            x2 = v[4], y2 = v[5],
            x3 = v[6], y3 = v[7],
            ux = 3 * x1 - 2 * x0 - x3,
            uy = 3 * y1 - 2 * y0 - y3,
            vx = 3 * x2 - 2 * x3 - x0,
            vy = 3 * y2 - 2 * y3 - y0;
        return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy)
                <= 16 * flatness * flatness;
    }

    /** 曲线几何覆盖的面积。 */
    static getArea(v: number[]): number {
        // http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
        const x0 = v[0], y0 = v[1],
            x1 = v[2], y1 = v[3],
            x2 = v[4], y2 = v[5],
            x3 = v[6], y3 = v[7];
        return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
                + y1 * (x0 - x2) - x1 * (y0 - y2)
                + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
    }

    /**
     * `Path.getBounds()` 的私有辅助函数：求贝塞尔曲线导数多项式的
     * 零交点，以确定计算曲线边界时的
     * 潜在极值。
     */
    static _addBounds(v0: number, v1: number, v2: number, v3: number,
            coord: number, padding: number, min: number[], max: number[],
            roots: number[]): void {
        // 代码移植并进一步优化自：
        // http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
        function add(value: number, pad: number): void {
            const left = value - pad,
                right = value + pad;
            if (left < min[coord])
                min[coord] = left;
            if (right > max[coord])
                max[coord] = right;
        }

        const minPad = min[coord] + padding,
            maxPad = max[coord] - padding;
        // 先做粗略的边界检查：只有当至少一个值超出
        // min-max 范围时，曲线才可能扩展当前边界。
        if (v0 < minPad || v1 < minPad || v2 < minPad || v3 < minPad ||
                v0 > maxPad || v1 > maxPad || v2 > maxPad || v3 > maxPad) {
            if (v1 < v0 !== v1 < v3 && v2 < v0 !== v2 < v3) {
                // 若曲线的值是有序的，极值就是
                // 起点与终点。
                add(v0, 0);
                add(v3, 0);
            } else {
                // 计算贝塞尔多项式的导数并除以 3。
                // 这样 a、b、c 的计算更简单，
                // 且得到相同的二次方程根。
                const a = 3 * (v1 - v2) - v0 + v3,
                    b = 2 * (v0 + v2) - 4 * v1,
                    c = v1 - v0,
                    count = Numerical.solveQuadratic(a, b, c, roots),
                    // 对有效的根加一些容差，因为 t = 0、1 会
                    // 单独加入，而且不希望
                    // 在 getStrokeBounds() 中以半径加入连接处
                    tMin = CURVETIME_EPSILON,
                    tMax = 1 - tMin;
                // 这里 padding = 0 的原因见上文：
                add(v3, 0);
                for (let i = 0; i < count; i++) {
                    const t = roots[i],
                        u = 1 - t;
                    // 只把有效的根加入边界。
                    if (tMin <= t && t <= tMax)
                    // 计算 t 处的贝塞尔多项式值。
                        add(u * u * u * v0
                            + 3 * u * u * t * v1
                            + 3 * u * t * t * v2
                            + t * t * t * v3,
                            padding);
                }
            }
        }
    }

    /** 判断三次贝塞尔曲线的类型，并求出其根。 */
    static classify(v: number[]): CurveClassification {
        // 参见：Loop 与 Blinn, 2005, Resolution Independent Curve Rendering
        // 论文《Using Programmable Graphics Hardware》，GPU Gems 3 第 25 章
        //
        // 可能的类型：
        //   'line'       （d1 == d2 == d3 == 0）
        //   'quadratic'  （d1 == d2 == 0）
        //   'serpentine' （d > 0）
        //   'cusp'       （d == 0）
        //   'loop'       （d < 0）
        //   'arch'       （serpentine、cusp 或 loop，但根在 0..1 之外）
        //
        // 注意：serpentine、cusp 与 loop 曲线的根只在
        // 位于 0..1 内时才考虑。若根在范围外，
        // 则把曲线类型降级为 'arch'。
        const x0 = v[0], y0 = v[1],
            x1 = v[2], y1 = v[3],
            x2 = v[4], y2 = v[5],
            x3 = v[6], y3 = v[7],
            // 计算 I(s, t) 的系数，其根为
            // 拐点。
            a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2,
            a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3,
            a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0,
            isZero = Numerical.isZero;
        let d3 = 3 * a3,
            d2 = d3 - a2,
            d1 = d2 - a2 + a1;
        // 归一化向量 (d1, d2, d3) 以保持误差一致，
        // 若其大小在上式坐标乘积的舍入误差内，
        // 则视为零（与直线情形相同）：
        const l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3),
            magnitude = Math.max(
                Math.abs(x0), Math.abs(y0), Math.abs(x1), Math.abs(y1),
                Math.abs(x2), Math.abs(y2), Math.abs(x3), Math.abs(y3)),
            s = l > magnitude * Numerical.getEpsilon(magnitude) ? 1 / l : 0;
        d1 *= s;
        d2 *= s;
        d3 *= s;

        function build(type: string, t1?: number, t2?: number)
                : CurveClassification {
            // 端点处的根（与 getPeaks() 一样在 curve-time epsilon 内）
            // 就是端点本身，而不是曲线内部的点，
            // 否则会让 isCrossing() 在零距离处取样（#1879、
            // #1387）：
            const tMin = CURVETIME_EPSILON,
                tMax = 1 - tMin,
                hasRoots = t1 !== undefined;
            let t1Ok = hasRoots && t1 > tMin && t1 < tMax,
                t2Ok = hasRoots && t2 > tMin && t2 < tMax,
                resultType = type;
            // 若在 0..1 内找不到解，则把 serpentine、cusp 或 loop
            // 降级为 arch。loop 需要 2 个解才有效。
            if (hasRoots && (!(t1Ok || t2Ok)
                    || type === 'loop' && !(t1Ok && t2Ok))) {
                resultType = 'arch';
                t1Ok = t2Ok = false;
            }
            return {
                type: resultType,
                roots: t1Ok || t2Ok
                        ? t1Ok && t2Ok
                            ? t1 < t2 ? [t1, t2] : [t2, t1] // 2 solutions
                            : [t1Ok ? t1 : t2] // 1 solution
                        : null
            };
        }

        if (isZero(d1)) {
            return isZero(d2)
                    ? build(isZero(d3) ? 'line' : 'quadratic') // 5. / 4.
                    : build('serpentine', d3 / (3 * d2)); // 3b.
        }
        const d = 3 * d2 * d2 - 4 * d1 * d3;
        if (isZero(d)) {
            return build('cusp', d2 / (2 * d1)); // 3a.
        }
        const f1 = d > 0 ? Math.sqrt(d / 3) : Math.sqrt(-d),
            f2 = 2 * d1;
        return build(d > 0 ? 'serpentine' : 'loop', // 1. / 2.
                (d2 + f1) / f2,
                (d2 - f1) / f2);
    }

    /** 曲线长度，或 `a` 到 `b` 之间部分的长度。 */
    static getLength(v: number[], a?: number, b?: number,
            ds?: (t: number) => number): number {
        if (a === undefined)
            a = 0;
        if (b === undefined)
            b = 1;
        if (Curve.isStraight(v)) {
            // 把线性曲线在 a、b 处细分，这样就可以直接用
            // 勾股定理计算该区间的长度。
            let c = v;
            if (b < 1) {
                c = Curve.subdivide(c, b)[0]; // left
                a /= b; // Scale parameter to new sub-curve.
            }
            if (a > 0) {
                c = Curve.subdivide(c, a)[1]; // right
            }
            // 直线段的长度可以更简单地计算。
            const dx = c[6] - c[0], // x3 - x0
                dy = c[7] - c[1]; // y3 - y0
            return Math.sqrt(dx * dx + dy * dy);
        }
        return Numerical.integrate(ds || getLengthIntegrand(v), a, b,
                getIterations(a, b));
    }

    /** 给定偏移处相对可选起点的 curve-time。 */
    static getTimeAt(v: number[], offset: number,
            start?: number): number | null {
        if (start === undefined)
            start = offset < 0 ? 1 : 0;
        if (offset === 0)
            return start;
        // 判断是向前还是向后，并分别处理
        const abs = Math.abs,
            epsilon = Numerical.EPSILON,
            forward = offset > 0,
            a = forward ? start : 0,
            b = forward ? 1 : start,
            // 用被积函数在下面的 f(t) 中同时计算
            // 区间长度与部分长度。
            ds = getLengthIntegrand(v),
            // 求整个区间的长度
            rangeLength = Curve.getLength(v, a, b, ds),
            diff = abs(offset) - rangeLength;
        if (abs(diff) < epsilon) {
            // 正好匹配到端点：
            return forward ? b : a;
        } else if (diff > epsilon) {
            // 超出范围。
            return null;
        }
        // 用 offset / rangeLength 作为 t 的初值，
        // 以更快逼近：
        const guess = offset / rangeLength;
        let length = 0;
        // 迭代计算各曲线区间长度并累加，积分精度
        // 随区间大小变化。这比每次都不修改 start
        // 而重新计算总长度更快，
        // 也更精确。
        function f(t: number): number {
            // 当 start > t 时，积分返回负值。
            length += Numerical.integrate(ds, start, t,
                    getIterations(start, t));
            start = t;
            return length - offset;
        }
        // 从 x 的初始猜测值开始。
        // 注意：向后查找时 guess 为负值。
        return Numerical.findRoot(f, ds, start + guess, a, b, 32,
                Numerical.EPSILON);
    }

    /** 若点在曲线上，返回其 curve-time。 */
    static getTimeOf(v: number[], point: Point,
            tolerance?: number): number | null {
        // 先以与下面解相同的几何 epsilon 比较曲线
        // 起点与终点：在没有手柄的直线上，
        // 靠近端点的点会解出离端点较远的时间，因为
        // 那里的距离随时间平方增长。在大坐标下，
        // epsilon 不能低于坐标分辨率：
        const abs = Math.abs,
            x0 = v[0], y0 = v[1],
            x3 = v[6], y3 = v[7],
            px = point.x,
            py = point.y,
            epsilon = tolerance || Numerical.getEpsilon(Math.max(
                    abs(x0), abs(y0), abs(v[2]), abs(v[3]),
                    abs(v[4]), abs(v[5]), abs(x3), abs(y3)),
                    Numerical.GEOMETRIC_EPSILON);

        function isClose(x: number, y: number): boolean {
            const dx = x - px,
                dy = y - py;
            return Math.sqrt(dx * dx + dy * dy) <= epsilon;
        }

        if (isClose(x0, y0))
            return 0;
        if (isClose(x3, y3))
            return 1;
        // 对 x、y 坐标分别解三次方程并考虑所有解，
        // 用同一 epsilon 检验。按 evaluate() 的方式
        // 计算曲线点，但不创建对象：
        const c = getCoefficients(v),
            ax = c[0], bx = c[1], cx = c[2],
            ay = c[3], by = c[4], cy = c[5],
            roots: number[] = [];
        for (let i = 0; i < 2; i++) {
            const count = Curve.solveCubic(v, i, i ? py : px, roots, 0, 1);
            for (let j = 0; j < count; j++) {
                let t = roots[j];
                const x = getCoordinate(x0, x3, ax, bx, cx, t),
                    y = getCoordinate(y0, y3, ay, by, cy, t);
                if (isClose(x, y))
                    return t;
                // 偏离斜曲线的点到某一坐标解的距离大于
                // 到曲线的距离：沿切线移动到其法线
                // 垂足，并对该点再做检验：
                const dx = (3 * ax * t + 2 * bx) * t + cx,
                    dy = (3 * ay * t + 2 * by) * t + cy,
                    length2 = dx * dx + dy * dy;
                if (length2) {
                    t = Math.max(0, Math.min(1,
                            t + ((px - x) * dx + (py - y) * dy) / length2));
                    if (isClose(getCoordinate(x0, x3, ax, bx, cx, t),
                            getCoordinate(y0, y3, ay, by, cy, t)))
                        return t;
                }
            }
        }
        return null;
    }

    /** 距离给定点最近的 curve-time。 */
    static getNearestTime(v: number[], point: Point): number {
        const x0 = v[0], y0 = v[1],
            x3 = v[6], y3 = v[7],
            px = point.x,
            py = point.y;
        if (Curve.isStraight(v)) {
            const vx = x3 - x0, vy = y3 - y0,
                det = vx * vx + vy * vy;
            // 避免除以零。
            if (det === 0)
                return 0;
            // 把点投影到直线上，计算其沿直线的
            // 线性参数 u：
            // u = (point - p1).dot(v) / v.dot(v)
            const u = ((px - x0) * vx + (py - y0) * vy) / det;
            const time = u < Numerical.EPSILON ? 0
                : u > 1 - Numerical.EPSILON ? 1
                : Curve.getTimeOf(v,
                    new Point(x0 + u * vx, y0 + u * vy));
            return time as number;
        }

        // 按 evaluate() 的方式计算曲线点，但不创建对象，
        // 因为 getDistance() 会被频繁调用：
        const c = getCoefficients(v),
            ax = c[0], bx = c[1], cx = c[2],
            ay = c[3], by = c[4], cy = c[5],
            count = 100,
            distances: number[] = [];
        let minDist = Infinity,
            minT = 0;

        function getDistance(t: number): number {
            const dx = getCoordinate(x0, x3, ax, bx, cx, t) - px,
                dy = getCoordinate(y0, y3, ay, by, cy, t) - py;
            return dx * dx + dy * dy;
        }

        for (let i = 0; i <= count; i++)
            distances.push(getDistance(i / count));

        // 在比相邻采样更近的每个采样附近细化，直到
        // 达到所需精度，因为最近点可能落在
        // 任意采样与下一个采样之间：
        for (let i = 0; i <= count; i++) {
            let dist = distances[i];
            if ((i === 0 || dist < distances[i - 1])
                    && (i === count || dist <= distances[i + 1])) {
                let t = i / count,
                    step = 1 / (count * 2);
                while (step > CURVETIME_EPSILON) {
                    const t1 = t - step,
                        t2 = t + step,
                        dist1 = t1 >= 0 ? getDistance(t1) : Infinity,
                        dist2 = t2 <= 1 ? getDistance(t2) : Infinity;
                    if (dist1 < dist && dist1 <= dist2) {
                        t = t1;
                        dist = dist1;
                    } else if (dist2 < dist) {
                        t = t2;
                        dist = dist2;
                    } else {
                        step /= 2;
                    }
                }
                if (dist < minDist) {
                    minDist = dist;
                    minT = t;
                }
            }
        }
        return minT;
    }

    /** 给定 curve-time 处的曲线点。 */
    static getPoint(v: number[], t: number | null): Point | null {
        return evaluate(v, t, 0, false);
    }

    /** 给定 curve-time 处的归一化切线。 */
    static getTangent(v: number[], t: number | null): Point | null {
        return evaluate(v, t, 1, true);
    }

    /** 给定 curve-time 处的加权切线。 */
    static getWeightedTangent(v: number[], t: number | null): Point | null {
        return evaluate(v, t, 1, false);
    }

    /** 给定 curve-time 处的归一化法线。 */
    static getNormal(v: number[], t: number | null): Point | null {
        return evaluate(v, t, 2, true);
    }

    /** 给定 curve-time 处的加权法线。 */
    static getWeightedNormal(v: number[], t: number | null): Point | null {
        return evaluate(v, t, 2, false);
    }

    /** 给定 curve-time 处的曲率。 */
    static getCurvature(v: number[], t: number | null): number {
        // 注意：参数无效时 evaluate() 返回 null。
        return (evaluate(v, t, 3, false) as Point).x;
    }

    /**
     * 曲线“峰值”处的 t 值，即一阶与二阶导数
     * 点积的根。峰值与曲率极值有相似性质，
     * 但计算代价更低。
     */
    static getPeaks(v: number[]): number[] {
        const c = getCoefficients(v),
            ax = c[0], bx = c[1], cx = c[2],
            ay = c[3], by = c[4], cy = c[5],
            tMin = CURVETIME_EPSILON,
            tMax = 1 - tMin,
            roots: number[] = [];
        Numerical.solveCubic(
                9 * (ax * ax + ay * ay),
                9 * (ax * bx + by * ay),
                2 * (bx * bx + by * by) + 3 * (cx * ax + cy * ay),
                (cx * bx + by * cy),
                // 排除 0 与 1，因为它们不算峰值。
                roots, tMin, tMax);
        return roots.sort();
    }

    /**
     * 曲线沿其所有控制点所在直线（容差内）反向处的
     * 时间值，若存在。
     */
    static getReversals(v: number[], tolerance: number): number[] {
        // 直线的方向取弦与手柄中最长者：
        let dx = v[6] - v[0],
            dy = v[7] - v[1];
        for (let i = 0; i < 4; i += 2) {
            const hx = v[i + 2] - v[i],
                hy = v[i + 3] - v[i + 1];
            if (hx * hx + hy * hy > dx * dx + dy * dy) {
                dx = hx;
                dy = hy;
            }
        }
        const length = Math.sqrt(dx * dx + dy * dy),
            o: number[] = [];
        if (!length)
            return [];
        for (let i = 0; i < 8; i += 2) {
            const x = v[i] - v[0],
                y = v[i + 1] - v[1];
            if (Math.abs(x * dy - y * dx) > tolerance * length)
                return [];
            // 控制点沿直线的位置：
            o.push((x * dx + y * dy) / length);
        }
        const roots: number[] = [],
            count = Numerical.solveQuadratic(
                3 * (o[1] - o[2]) - o[0] + o[3],
                2 * (o[0] + o[2]) - 4 * o[1], o[1] - o[0], roots,
                CURVETIME_EPSILON,
                1 - CURVETIME_EPSILON);
        return count > 0 ? roots.slice(0, count).sort((a, b) => a - b) : [];
    }

    /**
     * 曲线与给定切线相切处的 curve-time 参数，
     * 至多两个。起点或终点处的切线也包含在内。
     */
    static getTimesWithTangent(v: number[], tangent: Point): number[] {
        // 算法改编自 https://stackoverflow.com/a/34837312/7615922
        // 曲线多项式导数的系数：
        const c = getCoefficients(v),
            ax = 3 * c[0], bx = 2 * c[1], cx = c[2],
            ay = 3 * c[3], by = 2 * c[4], cy = c[5],
            normalized = tangent.normalize(),
            tx = normalized.x,
            ty = normalized.y,
            den = 2 * ax * ty - 2 * ay * tx,
            times: number[] = [];
        if (Math.abs(den) < CURVETIME_EPSILON) {
            const num = cx * ty - cy * tx,
                den2 = bx * ty - by * tx;
            if (den2 != 0) {
                const t = -num / den2;
                if (t >= 0 && t <= 1)
                    times.push(t);
            }
        } else {
            const delta = (bx * bx - 4 * ax * cx) * ty * ty +
                    (-2 * bx * by + 4 * ay * cx + 4 * ax * cy) * tx * ty +
                    (by * by - 4 * ay * cy) * tx * tx,
                k = bx * ty - by * tx;
            if (delta >= 0 && den != 0) {
                const d = Math.sqrt(delta),
                    t0 = -(k + d) / den,
                    t1 = (-k + d) / den;
                if (t0 >= 0 && t0 <= 1)
                    times.push(t0);
                if (t1 >= 0 && t1 <= 1)
                    times.push(t1);
            }
        }
        return times;
    }

    /** 曲线值是否描述一条直线。 */
    static isStraight(v: number[], epsilon?: number): boolean {
        const x1 = v[0], y1 = v[1],
            x2 = v[6], y2 = v[7];
        return isStraightTest(x1, y1, v[2] - x1, v[3] - y1, v[4] - x2,
                v[5] - y2, x2, y2);
    }

    /** 曲线值是否描述参数线性的曲线。 */
    static isLinear(v: number[], epsilon?: number): boolean {
        const x1 = v[0], y1 = v[1],
            x2 = v[6], y2 = v[7];
        return isLinearTest(x1, y1, v[2] - x1, v[3] - y1, v[4] - x2,
                v[5] - y2, x2, y2);
    }

    /** 两条曲线的重叠部分，以 curve-time 对表示。 */
    static getOverlaps(v1: number[], v2: number[],
            tolerance?: number): number[][] | null {
        return findOverlaps(v1, v2, tolerance);
    }

    /** 两组曲线之间的所有交点。 */
    static getIntersections(curves1: Curve[], curves2?: Curve[] | null,
            include?: ((location: CurveLocation) => boolean) | null,
            matrix1?: Matrix, matrix2?: Matrix, _returnFirst?: boolean,
            _tolerance?: number,
            _collisions?: (number[] | null)[] | null): CurveLocation[] {
        return findIntersections(curves1, curves2, include, matrix1, matrix2,
                _returnFirst, _tolerance, _collisions);
    }
}




