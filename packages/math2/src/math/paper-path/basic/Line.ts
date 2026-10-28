/**
 * 移植自 paper/src/basic/Line.js，裁减为几何核心。
 *
 * 直线由一个起点和一个方向向量描述。去掉了 Base、参数解析（数字 / 数组 /
 * `{x, y}` 对象形式）、序列化与 bean 机制，构造只接受两个 `Point`。
 *
 * 注意：`getSide()` 中判断点位于有限直线哪一侧的分支沿用了原文的
 * `(v2x * vx + v2x * vx)`。原文即如此（看起来是 `v2x * vx + v2y * vy`
 * 的笔误），为保持行为一致这里不改。
 */

import { Point } from './Point';
import { Numerical } from '../util/Numerical';

export class Line {
    /** 起点的 x 坐标。 */
    private _px: number;
    /** 起点的 y 坐标。 */
    private _py: number;
    /** 方向向量的 x 分量。 */
    private _vx: number;
    /** 方向向量的 y 分量。 */
    private _vy: number;

    /**
     * `asVector` 为 true 时，`point2` 被当作方向向量而不是第二个点。
     */
    constructor(point1: Point, point2: Point, asVector?: boolean) {
        this._px = point1.x;
        this._py = point1.y;
        this._vx = asVector ? point2.x : point2.x - point1.x;
        this._vy = asVector ? point2.y : point2.y - point1.y;
    }

    /** 直线的起点。 */
    get point(): Point {
        return new Point(this._px, this._py);
    }

    /** 直线的方向向量。 */
    get vector(): Point {
        return new Point(this._vx, this._vy);
    }

    /** 直线的长度。 */
    get length(): number {
        return Math.sqrt(this._vx * this._vx + this._vy * this._vy);
    }

    /**
     * 与另一条直线的交点。
     *
     * @return 交点；两线平行时返回 `null`
     */
    intersect(line: Line, isInfinite?: boolean): Point | null {
        return Line.intersect(
                this._px, this._py, this._vx, this._vy,
                line._px, line._py, line._vx, line._vy,
                true, isInfinite);
    }

    /**
     * 点位于直线的哪一侧：`-1`、`0` 或 `1`。
     */
    getSide(point: Point, isInfinite?: boolean): number {
        return Line.getSide(
                this._px, this._py, this._vx, this._vy,
                point.x, point.y, true, isInfinite);
    }

    /** 点到直线的距离。 */
    getDistance(point: Point): number {
        return Math.abs(this.getSignedDistance(point));
    }

    /** 点到直线的有向距离。 */
    getSignedDistance(point: Point): number {
        return Line.getSignedDistance(this._px, this._py, this._vx, this._vy,
                point.x, point.y, true);
    }

    /** 两条直线的方向是否共线。 */
    isCollinear(line: Line): boolean {
        return Point.isCollinear(this._vx, this._vy, line._vx, line._vy);
    }

    /** 两条直线的方向是否垂直。 */
    isOrthogonal(line: Line): boolean {
        return Point.isOrthogonal(this._vx, this._vy, line._vx, line._vy);
    }

    // ---------------------------------------------------------------------
    // 静态方法

    /**
     * 两条直线的交点。
     *
     * @param asVector 为 true 时 `v1x/v1y`、`v2x/v2y` 已是方向向量
     * @param isInfinite 为 true 时把两条直线视为无限长
     * @return 交点，两线平行时返回 `null`
     */
    static intersect(p1x: number, p1y: number, v1x: number, v1y: number,
            p2x: number, p2y: number, v2x: number, v2y: number,
            asVector?: boolean, isInfinite?: boolean): Point | null {
        // 若第二个点不是以向量形式给出，则转换为向量。
        if (!asVector) {
            v1x -= p1x;
            v1y -= p1y;
            v2x -= p2x;
            v2y -= p2y;
        }
        const cross = v1x * v2y - v1y * v2x;
        // 避免除以 0，以及分母过于接近 0 带来的误差
        if (!Numerical.isMachineZero(cross)) {
            const dx = p1x - p2x,
                dy = p1y - p2y;
            let u1 = (v2x * dy - v2y * dx) / cross,
                u2 = (v1x * dy - v1y * dx) / cross;
            // 若直线不允许超出定义点范围，则检查 u 参数的取值范围，
            // 并在 [0, 1] 边界上用 EPSILON 作为容差进行比较。
            const epsilon = Numerical.EPSILON,
                uMin = -epsilon,
                uMax = 1 + epsilon;
            if (isInfinite
                    || uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
                if (!isInfinite) {
                    // 边界上的容差通过裁剪到实际范围来处理。
                    u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
                }
                return new Point(
                        p1x + u1 * v1x,
                        p1y + u1 * v1y);
            }
        }
        return null;
    }

    /**
     * 点位于直线的哪一侧，返回 `-1`、`0` 或 `1`。
     */
    static getSide(px: number, py: number, vx: number, vy: number,
            x: number, y: number, asVector?: boolean,
            isInfinite?: boolean): number {
        if (!asVector) {
            vx -= px;
            vy -= py;
        }
        const v2x = x - px,
            v2y = y - py;
        // ccw = v2.cross(v1);
        let ccw = v2x * vy - v2y * vx;
        if (!isInfinite && Numerical.isMachineZero(ccw)) {
            // 若点在无限长直线上，再检查它是否也在有限线段上：
            // 把 v2 投影到 v1 上，用 u 值判断点位于有限线段的哪一侧。
            // u = v2.dot(v1) / v1.dot(v1)
            //
            // 注意：原文即如此（`v2x * vx + v2x * vx`，疑为
            // `v2x * vx + v2y * vy` 的笔误），为保持行为一致保留。
            ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
            // 若 u 落在 [0, 1] 内，ccw 置 0，否则保留其符号即可。
            if (ccw >= 0 && ccw <= 1)
                ccw = 0;
        }
        return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
    }

    /**
     * 点到直线的有向距离。
     */
    static getSignedDistance(px: number, py: number, vx: number, vy: number,
            x: number, y: number, asVector?: boolean): number {
        if (!asVector) {
            vx -= px;
            vy -= py;
        }
        // 基于 @iconexperience 在 #799 中给出的误差分析
        return vx === 0 ? (vy > 0 ? x - px : px - x)
            : vy === 0 ? (vx < 0 ? y - py : py - y)
            : ((x - px) * vy - (y - py) * vx) / (
                // 注意：这里比较 vy > vx 而不是它们的绝对值，
                // 以保持 fat-line clipping 的结果不变。
                vy > vx
                    ? Math.abs(vy) * Math.sqrt(1 + (vx * vx) / (vy * vy))
                    : Math.abs(vx) * Math.sqrt(1 + (vy * vy) / (vx * vx))
            );
    }

    /**
     * 点到直线的距离。
     */
    static getDistance(px: number, py: number, vx: number, vy: number,
            x: number, y: number, asVector?: boolean): number {
        return Math.abs(
                Line.getSignedDistance(px, py, vx, vy, x, y, asVector));
    }
}
