/**
 * 移植自 paper/src/path/CurveLocation.js，裁减为几何核心。
 *
 * 曲线位置用 curve-time `time` 描述曲线上的一个点，取值 0（曲线起点）到
 * 1（曲线终点）。若曲线属于某条路径，还会提供它在路径曲线数组中的 `index`。
 *
 * 相对于原文去掉：序列化与整套 bean 机制。
 */

import { Point } from '../basic/Point';
import { Numerical } from '../util/Numerical';
import { Formatter } from '../util/Formatter';
import { Curve } from './Curve';
import type { Path } from './Path';
import type { Segment } from './Segment';

// 只有 CurveLocation.insert() 需要路径的排序标识：用 WeakMap 给每条路径分配
// 稳定 id，避免给 Path 增加字段。
const pathIds = new WeakMap<Path, number>();
let nextPathId = 1;

function getPathId(path: Path): number {
    let id = pathIds.get(path);
    if (id === undefined)
        pathIds.set(path, id = nextPathId++);
    return id;
}

export class CurveLocation {
    _curve: Curve;
    _path: Path | null;
    _version: number;
    /** 距离该位置最近的线段，按需计算。 */
    _segment: Segment | null;
    _segment1: Segment;
    _segment2: Segment | null;
    _time: number | null;
    _point: Point;
    _offset?: number | null;
    _curveOffset?: number | null;
    _distance?: number;
    _overlap?: boolean;
    /** 与之关联的交点位置。 */
    _intersection: CurveLocation | null;

    constructor(curve: Curve, time: number, point?: Point, overlap?: boolean,
            distance?: number) {
        // 把非常接近曲线末端的交点并入下一条曲线的起点。
        if (time >= 1 - Numerical.CURVETIME_EPSILON) {
            const next = curve.next;
            if (next) {
                time = 0;
                curve = next;
            }
        }
        this._setCurve(curve);
        this._time = time;
        this._point = point || curve.getPointAtTime(time);
        this._overlap = overlap;
        this._distance = distance;
        this._intersection = null;
    }

    _setPath(path: Path | null): void {
        // 路径只用于校验缓存值的版本。为了确保用的是正确的路径（例如拆分
        // 之后），路径总是通过 curve 获取。
        this._path = path;
        this._version = path ? path._version : 0;
    }

    _setCurve(curve: Curve): void {
        this._setPath(curve._path);
        this._curve = curve;
        this._segment = null; // 待 lazy 确定，见 segment
        // 同时保存 segment1 与 segment2 的引用，因为路径拆分或分割之后，
        // 可以用它们重新确定新的曲线。
        this._segment1 = curve._segment1;
        this._segment2 = curve._segment2;
    }

    _setSegment(segment: Segment): void {
        const curve = segment.curve;
        if (curve) {
            this._setCurve(curve);
        } else {
            this._setPath(segment._path || null);
            this._segment1 = segment;
            this._segment2 = null;
        }
        this._segment = segment;
        this._time = segment === this._segment1 ? 0 : 1;
        // 避免 curve / trySegment() 的精度问题
        this._point = segment._point.clone();
    }

    // ---------------------------------------------------------------------
    // segment、curve、path、index

    /** 曲线上距离该位置最近的线段。 */
    get segment(): Segment | null {
        // 先取 curve，这样 _segment 在失同步时会被清空。
        let segment = this._segment;
        if (!segment) {
            const curve = this.curve,
                time = this.time;
            if (curve) {
                if (time === 0) {
                    segment = curve._segment1;
                } else if (time === 1) {
                    segment = curve._segment2;
                } else if (time != null) {
                    // 通过比较曲线长度确定最近的线段
                    segment = curve.getPartLength(0, time)
                        < curve.getPartLength(time, 1)
                            ? curve._segment1
                            : curve._segment2;
                }
            }
            this._segment = segment;
        }
        return segment;
    }

    /** 该位置所属的曲线。 */
    get curve(): Curve | null {
        const path = this._path,
            that = this;
        if (path && path._version !== this._version) {
            // 若路径的线段已变化，则清除缓存的 time 与 offset 值，并强制
            // 重新获取正确的曲线。
            this._time = this._offset = this._curveOffset = null;
            this._curve = null as any;
        }
        // 若路径已失同步，则通过 segment1 / segment2 取当前曲线对象。由于
        // 期间可能发生过路径拆分或分割，先试 segment1 的曲线并检查点是否
        // 仍在其上，否则假定是 segment2 之前的曲线。
        function trySegment(segment: Segment | null): Curve | undefined {
            const curve = segment && segment.curve;
            if (curve && (that._time = curve.getTimeOf(that._point)) != null) {
                // 重新取路径，因为它可能已经属于新的路径。
                that._setCurve(curve);
                return curve;
            }
        }

        return this._curve
            || trySegment(this._segment)
            || trySegment(this._segment1)
            || trySegment(this._segment2 && this._segment2.previous)
            || null;
    }

    /** 该位置所在的路径。 */
    get path(): Path | null {
        const curve = this.curve;
        return curve && curve._path || null;
    }

    /** 曲线在路径曲线数组中的下标。 */
    get index(): number | null {
        const curve = this.curve;
        return curve ? curve.index : null;
    }

    // ---------------------------------------------------------------------
    // time、point、offsets

    /**
     * curve-time 参数，供各种贝塞尔曲线计算使用。取值 0（曲线起点）到 1
     * （曲线终点）。
     */
    get time(): number | null {
        const curve = this.curve,
            time = this._time;
        return curve && time == null
            ? this._time = curve.getTimeOf(this._point)
            : time;
    }

    /** 由 curve 与 time 确定的点。 */
    get point(): Point {
        return this._point;
    }

    /**
     * 从路径起点到该位置的长度。若曲线不属于路径，则返回曲线内的长度。
     */
    get offset(): number {
        let offset = this._offset;
        if (offset == null) {
            offset = 0;
            const path = this.path,
                index = this.index;
            if (path && index != null) {
                const curves = path.curves;
                for (let i = 0; i < index; i++)
                    offset += curves[i].length;
            }
            this._offset = offset += this.curveOffset;
        }
        return offset;
    }

    /** 从曲线起点到该位置的长度。 */
    get curveOffset(): number {
        let offset = this._curveOffset;
        if (offset == null) {
            const curve = this.curve,
                time = this.time;
            this._curveOffset = offset = time != null && curve
                    ? curve.getPartLength(0, time)
                    : null;
        }
        return offset as number;
    }

    // ---------------------------------------------------------------------
    // 交点

    /**
     * 相交曲线上的对应位置；若该位置是 `PathItem#getIntersections()` 或
     * `Curve#getIntersections()` 的结果，则该值不为空。
     */
    get intersection(): CurveLocation | null {
        return this._intersection;
    }

    /** 查询点到该位置的距离。 */
    get distance(): number | undefined {
        return this._distance;
    }

    /** 该位置处曲线的切向量。 */
    get tangent(): Point | null {
        const curve = this.curve,
            time = this.time;
        return time != null && curve ? curve.getTangentAtTime(time) : null;
    }

    /** 该位置处曲线的法向量。 */
    get normal(): Point | null {
        const curve = this.curve,
            time = this.time;
        return time != null && curve ? curve.getNormalAtTime(time) : null;
    }

    /** 该位置处曲线的曲率。 */
    get curvature(): number | null {
        const curve = this.curve,
            time = this.time;
        return time != null && curve ? curve.getCurvatureAtTime(time) : null;
    }

    // ---------------------------------------------------------------------

    divide(): Curve | null {
        const curve = this.curve,
            res = curve && curve.divideAtTime(this.time as number);
        // 切换到新插入的线段，同时调整 _time。
        if (res)
            this._setSegment(res._segment1);
        return res;
    }

    split(): Path | null {
        const curve = this.curve,
            path = curve && curve._path,
            res = curve && curve.splitAtTime(this.time as number);
        if (res && path)
            // 拆分后把线段设为路径的末线段。
            this._setSegment(path.lastSegment);
        return res;
    }

    /**
     * 判断两个 CurveLocation 是否描述路径上的同一位置，采用与处理
     * curve-time 参数一致的容差。
     */
    equals(location: CurveLocation, _ignoreOther?: boolean): boolean {
        let res = this === location;
        if (!res && location instanceof CurveLocation) {
            const c1 = this.curve,
                c2 = location.curve,
                p1 = c1 && c1._path,
                p2 = c2 && c2._path;
            if (p1 === p2) {
                // 不直接比较 curve-time，而是比较两个位置的实际偏移来判断
                // 是否在同一处，并考虑路径首尾的环绕。这样可以避免
                // CURVETIME_EPSILON 精度带来的问题。
                const epsilon = Numerical.GEOMETRIC_EPSILON,
                    diff = Math.abs(this.offset - location.offset),
                    i1 = !_ignoreOther && this._intersection,
                    i2 = !_ignoreOther && location._intersection;
                res = (diff < epsilon
                        || !!p1 && Math.abs(p1.length - diff) < epsilon)
                    // 同时比较另一个位置，但传入 true 以避免无限递归。
                    && (!i1 && !i2 || !!i1 && !!i2 && i1.equals(i2, true));
            }
        }
        return res;
    }

    toString(): string {
        const parts: string[] = [],
            point = this.point,
            f = Formatter.instance;
        if (point)
            parts.push('point: ' + point);
        const index = this.index;
        if (index != null)
            parts.push('index: ' + index);
        const time = this.time;
        if (time != null)
            parts.push('time: ' + f.number(time));
        if (this._distance != null)
            parts.push('distance: ' + f.number(this._distance));
        return '{ ' + parts.join(', ') + ' }';
    }

    // ---------------------------------------------------------------------
    // 判断

    /**
     * 若该位置是与其他曲线的交点，判断它只是接触另一条曲线，而不是穿过。
     */
    isTouching(): boolean {
        const inter = this._intersection,
            tangent = this.tangent;
        if (inter && tangent) {
            const interTangent = inter.tangent;
            if (interTangent && tangent.isCollinear(interTangent)) {
                // 只有两条直线段的直线不相交时，才把它们视为接触。
                const curve1 = this.curve,
                    curve2 = inter.curve;
                return !(curve1 && curve2
                        && curve1.isStraight() && curve2.isStraight()
                        && curve1.getLine().intersect(curve2.getLine()));
            }
        }
        return false;
    }

    /**
     * 若该位置是与其他曲线的交点，判断它是穿过另一条曲线，而不只是接触。
     */
    isCrossing(): boolean {
        // 实现大致基于 Andy Finnell 的工作：
        // http://losingfight.com/blog/2011/07/09/
        const inter = this._intersection;
        if (!inter)
            return false;
        const t1 = this.time,
            t2 = inter.time,
            tMin = Numerical.CURVETIME_EPSILON,
            tMax = 1 - tMin,
            // t*Inside 表示交点位于曲线内部。
            t1Inside = t1 != null && t1 >= tMin && t1 <= tMax,
            t2Inside = t2 != null && t2 >= tMin && t2 <= tMax;
        // 若交点位于两条曲线的中部，则它要么是切点要么是穿越点，
        // 无需下面针对角点的详细检查。
        if (t1Inside && t2Inside)
            return !this.isTouching();
        // 取出与该交点相关的 4 条曲线：c1、c2 是第一条路径上交点两侧的曲线，
        // c3、c4 是第二条路径上的对应曲线。
        let c2 = this.curve,
            c1 = c2 && (t1 as number) < tMin ? c2.previous : c2,
            c4 = inter.curve,
            c3 = c4 && (t2 as number) < tMin ? c4.previous : c4;
        // 若 t1 / t2 位于末端，则步进到下一条曲线。
        if ((t1 as number) > tMax)
            c2 = c2 && c2.next;
        if ((t2 as number) > tMax)
            c4 = c4 && c4.next;
        if (!c1 || !c2 || !c3 || !c4)
            return false;

        // 计算交点处 4 条切线的明确角度：
        // - 若交点位于曲线内部，切线方向是明确的。
        // - 若交点位于线段端点，则在每条曲线上按相同偏移量离开交点，
        //   用交点指向新位置的向量来确定角度。
        const offsets: number[] = [];

        function addOffsets(curve: Curve, end: boolean): void {
            // 找出曲线上方向明确的最大偏移量，考虑环、尖点、拐点与“峰值”。
            const v = curve.getValues(),
                roots = Curve.classify(v).roots || Curve.getPeaks(v),
                count = roots.length,
                offset = Curve.getLength(v,
                    end && count ? roots[count - 1] : 0,
                    !end && count ? roots[0] : 1);
            // 没找到根时计算的是全长，取其中一个比例。经试验 32 效果良好。
            offsets.push(count ? offset : offset / 32);
        }

        function isInRange(angle: number, min: number, max: number): boolean {
            return min < max
                    ? angle > min && angle < max
                    // min > max：范围跨越 -180 / 180 度
                    : angle > min || angle < max;
        }

        if (!t1Inside) {
            addOffsets(c1, true);
            addOffsets(c2, false);
        }
        if (!t2Inside) {
            addOffsets(c3, true);
            addOffsets(c4, false);
        }
        const pt = this.point,
            // 取所有方向明确的曲线中最短的偏移量，作为公共偏移量。
            offset = Math.min.apply(Math, offsets),
            v2 = t1Inside ? c2.getTangentAtTime(t1 as number)
                    : (c2.getPointAt(offset) as Point).subtract(pt),
            v1 = t1Inside ? v2.negate()
                    : (c1.getPointAt(-offset) as Point).subtract(pt),
            v4 = t2Inside ? c4.getTangentAtTime(t2 as number)
                    : (c4.getPointAt(offset) as Point).subtract(pt),
            v3 = t2Inside ? v4.negate()
                    : (c3.getPointAt(-offset) as Point).subtract(pt),
            a1 = v1.angle,
            a2 = v2.angle,
            a3 = v3.angle,
            a4 = v4.angle;
        // 统计 curve2 的角度落在 curve1 两个角度之间的次数。若每一对角度
        // 都把另一对分开，则两条边相交。用 t1Inside 决定检查哪一对角度：
        // 若 t1 位于曲线内部，则检查 a3、a4，否则检查 a1、a2。
        return !!(t1Inside
                ? (isInRange(a1, a3, a4) !== isInRange(a2, a3, a4))
                    && (isInRange(a1, a4, a3) !== isInRange(a2, a4, a3))
                : (isInRange(a3, a1, a2) !== isInRange(a4, a1, a2))
                    && (isInRange(a3, a2, a1) !== isInRange(a4, a2, a1)));
    }

    /** 该位置是否属于两条路径的重叠部分。 */
    hasOverlap(): boolean {
        return !!this._overlap;
    }

    // ---------------------------------------------------------------------
    // 静态方法

    /**
     * 把一个位置插入已排序的列表；若已有描述同一处的位置，则与之合并。
     *
     * @return 插入的位置，或合并到的已有位置
     */
    static insert(locations: CurveLocation[], location: CurveLocation,
            merge?: boolean): CurveLocation {
        // 按路径、曲线与 time 做插入排序，便于之后用 equals() 合并重复项。
        const length = locations.length;
        let l = 0,
            r = length - 1;

        function search(index: number, dir: number): CurveLocation | null {
            // 到达列表首尾时还要与另一端比较，因为路径是环形列表。
            for (let i = index + dir; i >= -1 && i <= length; i += dir) {
                // 环绕下标，以便与另一端匹配。
                const loc2 = locations[((i % length) + length) % length];
                // 一旦超出一处，就停止搜索。
                if (!location.point.isClose(loc2.point,
                        Numerical.GEOMETRIC_EPSILON))
                    break;
                if (location.equals(loc2))
                    return loc2;
            }
            return null;
        }

        while (l <= r) {
            const m = (l + r) >>> 1,
                loc2 = locations[m];
            let found: CurveLocation | null = null;
            // 判断两个位置是否实为同一处，是则合并；否则用 search() 检查
            // 相邻位置。
            if (merge && (found = location.equals(loc2) ? loc2
                    : (search(m, -1) || search(m, 1)))) {
                // 传递重叠标记。
                if (location._overlap && found._intersection)
                    found._intersection._overlap = true;
                found._overlap = true;
                return found;
            }
            const path1 = location.path,
                path2 = loc2.path,
                // 注意：equals() 会比较交点位置，而这里计算 diff 时不会。
                diff = path1 !== path2 && path1 && path2
                    // 按路径 id 排序，把同一路径上的位置聚在一起。
                    ? getPathId(path1) - getPathId(path2)
                    // 同一路径上按 index 与 time 之和排序，方便比较。
                    : ((location.index || 0) + (location.time || 0))
                        - ((loc2.index || 0) + (loc2.time || 0));
            if (diff < 0) {
                r = m - 1;
            } else {
                l = m + 1;
            }
        }
        // 没有可合并的已有位置，直接插入。
        locations.splice(l, 0, location);
        return location;
    }

    /**
     * 把传入的位置列表与其关联的交点位置一起展开，并按顺序排好。
     */
    static expand(locations: CurveLocation[]): CurveLocation[] {
        // 复制一份，因为 insert() 会不断修改数组并按排序位置插入。
        const expanded = locations.slice();
        for (let i = locations.length - 1; i >= 0; i--) {
            const inter = locations[i]._intersection;
            if (inter)
                CurveLocation.insert(expanded, inter);
        }
        return expanded;
    }
}
