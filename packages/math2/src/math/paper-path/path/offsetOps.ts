/**
 * 移植自 paper/src/path/PathItem.Offset.js。
 *
 * 原文把这些函数放在 `PathItem.inject(new function() { ... })` 的闭包里，并把
 * `offset` / `outline` 注入 `PathItem`。这里拆成两部分:公开方法写在 `PathItem`
 * 类体里，算法与辅助函数放在本模块。
 *
 * 与原文的差异:
 * - 没有 Style:`outline()` 的描边宽度只能来自 `options.width`，默认 0（调用方
 *   必须显式传 width）；`join` 默认 `'miter'`、`cap` 默认 `'butt'`、
 *   `miterLimit` 默认 10。
 * - 去掉 `insert` / `insertAbove` / `copyAttributes` / 颜色设置。
 * - 没有 item 矩阵，`prepare()` 只做克隆与化简。
 * - `addProfilePath()`（按 `Path#strokeProfile` 的笔形扫描轮廓）已移植:
 *   带 stroke profile 的路径会按笔形扫描，而不是退回等半径描边。
 */

import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { Line } from '../basic/Line';
import { Numerical } from '../util/Numerical';
import { Curve } from './Curve';
import { Segment } from './Segment';
import { reducePath } from './booleanOps';
import { PathItem } from './PathItem';
import type { Path, StrokeProfileEntry } from './Path';
import type { CompoundPath } from './CompoundPath';

/** `offset()` 的选项。 */
export interface OffsetOptions {
    /** 路径转向外侧时拐角的形状。 */
    join?: 'miter' | 'round' | 'bevel';
    /** 斜接拐角的长度上限。 */
    miterLimit?: number;
}

/** `outline()` 的选项。 */
export interface OutlineOptions extends OffsetOptions {
    /** 描边宽度。没有 Style，默认 0，调用方必须显式传入。 */
    width?: number;
    /** 描边端点的形状。 */
    cap?: 'round' | 'square' | 'butt';
}

const abs = Math.abs,
    min = Math.min,
    max = Math.max,
    clamp = Numerical.clamp,
    errorThreshold = 0.1,
    epsilon = Numerical.EPSILON,
    geomEpsilon = Numerical.GEOMETRIC_EPSILON;

/** 采样笔形边缘的角度及其正余弦，所有笔形共用。 */
const penSamples: { phi: number; cos: number; sin: number }[] = [];
for (let i = 0; i <= 32; i++) {
    const phi = (i + 0.5) * Math.PI / 16;
    penSamples.push({ phi: phi, cos: Math.cos(phi), sin: Math.sin(phi) });
}

// -------------------------------------------------------------------------
// 结果对象的创建：构造函数由 `Path` / `CompoundPath` 在加载时注册到 `PathItem`

function createPath(segments: Segment[] = [], closed = false): Path {
    const create = PathItem._createPath;
    if (!create)
        throw new Error('Path 尚未注册：请从包入口导入，或先加载 ./path/Path');
    return create(segments, closed);
}

function createCompoundPath(children: Path[]): CompoundPath {
    const create = PathItem._createCompoundPath;
    if (!create)
        throw new Error('CompoundPath 尚未注册：请从包入口导入，或先加载 ./path/CompoundPath');
    return create(children);
}

/** 复合路径取子路径，普通路径取自身。 */
function getPaths(item: PathItem): Path[] {
    const children = (item as CompoundPath)._children;
    return children || [item as Path];
}

// -------------------------------------------------------------------------
// 描边轮廓

/** 曲线两端的方向，供接缝与端点使用。 */
interface CurveEnd {
    curve: Curve;
    start: Point;
    end: Point;
}

/** 笔触在偏移处的形状:椭圆的两个半轴、角度，以及它们沿路径的一、二阶导数。 */
interface Pen {
    /** 沿笔触椭圆第一个轴（角度方向）的半轴。 */
    a: number;
    /** 沿第二个轴（与角度垂直）的半轴。 */
    b: number;
    /** 笔触角度，单位为弧度。 */
    angle: number;
    da: number;
    db: number;
    dda: number;
    ddb: number;
    dAngle: number;
    ddAngle: number;
}

/** 笔触值按停靠点插值后保持一段的区间:从 `entry` 到 `next`。 */
interface Span {
    entry: StrokeProfileEntry;
    next: StrokeProfileEntry;
}

/** 路径上的一段曲线，按路径长度记录位置，供笔形扫描使用。 */
interface Part {
    /** 曲线的 8 个 values。 */
    v: number[];
    /** 这一段在路径上的起始偏移。 */
    offset: number;
    /** 这一段在路径上的长度。 */
    length: number;
    /** 这一段自身的曲线长度，`getOffset()` 用它做比例换算。 */
    curveLength?: number;
}

/** 笔触椭圆上与扫过区域边界相切的点，附带它沿曲线长度的导数。 */
interface Side {
    /** 该点在单位圆上的角度。 */
    phi: number;
    point: Point;
    /** 该点沿曲线长度的导数。 */
    derivative: Point;
    /** 该点到曲线上对应点的法向距离。 */
    distance: number;
}

/** 笔触椭圆上被扫过的一段，从 `from` 到 `to`。 */
interface Strip {
    from: Side;
    to: Side;
    distance: number;
}

/** 某个时刻笔触与扫过区域边界的接触情况。 */
interface Contacts {
    sides: Side[] | null;
    strips: Strip[];
}

/** 曲线两端，供笔形扫描的接缝与端点使用。 */
interface ProfileEnd {
    point: Point;
    first: Part;
    last: Part;
    start: Point;
    end: Point;
}

/**
 * 返回所有路径描边轮廓的并集:各段扫过的区域、接缝与端点的并。
 * 曲线会在偏移出现尖点处切开，并在每段只朝一个方向扫过之处切开，避免方向
 * 相反的绕数互相抵消。
 */
function outlineStroke(paths: Path[], radius: number, join: string, cap: string,
        miterLimit: number): PathItem {
    // 偏移的误差，相对于较小的半径。
    const tolerance = Math.min(errorThreshold, radius / 100),
        areas: PathItem[] = [];

    /**
     * 添加一段曲线两侧之间的区域，保留第二条侧边上的 segment（它们共用渐屈线）。
     * 描边轮廓的条带会略去薄于容差的细条，它们只会添加彼此近到无法区分的点。
     */
    function addSides(side1: Segment[], side2: Segment[], isStrip?: boolean): void {
        const part = createPath(side1);
        for (let i = side2.length - 1; i >= 0; i--)
            part.add(side2[i].reversed());
        part.closed = true;
        const united = part.unite();
        // 折叠到自身的部分可能什么都不剩。
        if (isStrip ? 2 * abs(united.getArea())
                > tolerance * (united as Path).length : !(united as Path).isEmpty())
            areas.push(united);
    }

    /**
     * 添加曲线 values v 对应那一段扫过的区域。当它比半径转得更紧时，内侧会
     * 越过渐屈线向后扫，因此在那里分成两块 (Nehab)。
     */
    function addPart(v: number[]): void {
        const curvature = Curve.getCurvature(v, 0.5);
        if (abs(curvature) * radius > 1) {
            // 曲率中心位于法线方向。
            const inner = curvature > 0 ? -radius : radius,
                evolute = getEvolute(v, inner, tolerance);
            addSides(getOffsetSegments(v, -inner, tolerance), evolute);
            addSides(getOffsetSegments(v, inner, tolerance), evolute);
        } else {
            addSides(getOffsetSegments(v, radius, tolerance),
                    getOffsetSegments(v, -radius, tolerance));
        }
    }

    /**
     * 添加圆角接缝或端点，即两条法线之间的扇形，它止于两侧区域的边界，而不是
     * 像整圆那样以很小的角度与它们相交。
     */
    function addSector(point: Point, normal1: Point, normal2: Point,
            direction: Point): void {
        const sector = createPath();
        sector.moveTo(point);
        sector.lineTo(point.add(normal1));
        sector.arcTo(point.add(direction.normalize(radius)),
                point.add(normal2));
        sector.closePath();
        areas.push(sector);
    }

    function addPolygon(points: Point[]): void {
        areas.push(createPath(points.map((point) => new Segment(point)), true));
    }

    /**
     * 在两条曲线方向之间的拐点处添加接缝，位于转向的外侧，除非它们彼此延续。
     */
    function addJoin(point: Point, tangent1: Point, tangent2: Point): void {
        // Paper.js 的法线方向用来按夹角判断外侧。
        let normal1 = new Point(tangent1.y, -tangent1.x).multiply(radius),
            normal2 = new Point(tangent2.y, -tangent2.x).multiply(radius);
        const angle = normal1.getDirectedAngle(normal2);
        if (!Numerical.isZero(tangent1.cross(tangent2))
                || tangent1.dot(tangent2) < 0) {
            if (angle < 0) {
                normal1 = normal1.negate();
                normal2 = normal2.negate();
            }
            // 把接缝向两侧的区域加宽，让它与它们重叠，而不是在小角度处共享
            // 边（并集无法分辨）。它的弧仍落在这些偏移的容差范围内。
            const widening = Math.sqrt(tolerance / radius) * 180 / Math.PI
                    * (angle < 0 ? -1 : 1),
                outer1 = normal1.rotate(-widening),
                outer2 = normal2.rotate(widening);
            let direction = normal1.add(normal2);
            // 尖点会先于第一条曲线回头。
            if (direction.length < geomEpsilon * radius)
                direction = tangent1;
            if (join === 'round') {
                addSector(point, outer1, outer2, direction);
            } else {
                const length = radius / Math.cos(abs(angle) * Math.PI / 360),
                    points = [point, point.add(outer1), point.add(normal1)];
                if (join === 'miter' && length <= miterLimit * radius)
                    points.push(point.add(direction.normalize(length)));
                addPolygon(points.concat(point.add(normal2),
                        point.add(outer2)));
            }
        }
    }

    /**
     * 在路径端点处添加端点，方向为切线方向。
     */
    function addCap(point: Point, tangent: Point): void {
        const normal = new Point(-tangent.y, tangent.x).multiply(radius);
        if (cap === 'round') {
            addSector(point, normal, normal.negate(), tangent);
        } else if (cap === 'square') {
            const ahead = tangent.multiply(radius);
            addPolygon([point.add(normal), point.add(normal).add(ahead),
                    point.subtract(normal).add(ahead),
                    point.subtract(normal)]);
        }
    }

    /**
     * 法线在半径处转过不到容差的窄段只会添加细条，因此与其邻段合并；比容差
     * 更短且转向同样小的段也一样。
     */
    function isSliver(v: number[], t1: number, t2: number): boolean {
        return getTurn(v, t1, t2) * radius < tolerance
                && (abs(Curve.getCurvature(v, (t1 + t2) / 2)) * radius > 1
                    || Curve.getLength(v, t1, t2) < tolerance);
    }

    function addPath(path: Path): void {
        const segments = path._segments,
            closed = path._closed,
            curves = path.curves;
        // 把在容差内已经算平滑的 segment 真正调平滑:它们的曲线移动小于容差，
        // 否则它们的接缝只会添加细条，各段的拐角也近到无法区分。
        for (let i = 0, l = segments.length; i < l; i++) {
            const segment = segments[i],
                handleIn = segment._handleIn,
                handleOut = segment._handleOut;
            if (!handleIn.isZero() && !handleOut.isZero()) {
                const angle = abs(handleOut.getDirectedAngle(
                        handleIn.negate())) * Math.PI / 180,
                    lengthIn = handleIn.length,
                    lengthOut = handleOut.length;
                if (angle && angle * Math.max(radius, lengthIn, lengthOut)
                        < tolerance) {
                    const direction = handleOut.normalize().subtract(
                            handleIn.normalize());
                    segment.handleIn = direction.normalize(-lengthIn);
                    segment.handleOut = direction.normalize(lengthOut);
                }
            }
        }
        if (!path.length) {
            // 一个点，按端点形状画成圆或方（端点只对开放路径有效）。
            if (segments.length && !closed && cap !== 'butt') {
                const center = segments[0]._point;
                areas.push(cap === 'round'
                    ? pathConstructor().Circle(center, radius)
                    : pathConstructor().Rectangle(new Rectangle(
                        center.x - radius, center.y - radius,
                        2 * radius, 2 * radius)));
            }
        } else {
            // 各曲线及其两端的方向，供各段使用，接缝与端点由它们延续。
            const ends: CurveEnd[] = [];
            for (let i = 0, l = curves.length; i < l; i++) {
                const curve = curves[i];
                if (curve.hasLength(geomEpsilon)) {
                    const v = regularize(curve.getValues(), tolerance / 4),
                        reversals = Curve.getReversals(v, tolerance);
                    let start = Curve.getTangent(v, 0)!,
                        end = Curve.getTangent(v, 1)!;
                    if (reversals.length) {
                        // 沿直线反向的曲线:反向点之间是直线段，接缝按圆角处理，
                        // 作为一个急转的极限 (kurbo 的 do_linear())。
                        const points = [new Point(v[0], v[1])];
                        for (let j = 0, m = reversals.length; j < m; j++)
                            points.push(Curve.getPoint(v, reversals[j])!);
                        points.push(new Point(v[6], v[7]));
                        start = points[1].subtract(points[0]).normalize();
                        end = points[points.length - 1].subtract(
                                points[points.length - 2]).normalize();
                        for (let j = 1, m = points.length; j < m; j++) {
                            const p1 = points[j - 1],
                                p2 = points[j];
                            addPart([p1.x, p1.y, p1.x, p1.y, p2.x, p2.y,
                                    p2.x, p2.y]);
                            if (j < m - 1) {
                                // 这个转折扫过整个圆，前后各一半，止于各段的侧边。
                                const tangent = p2.subtract(p1).normalize(),
                                    normal = new Point(-tangent.y, tangent.x)
                                        .multiply(radius);
                                addSector(p2, normal, normal.negate(), tangent);
                                addSector(p2, normal.negate(), normal,
                                        tangent.negate());
                            }
                        }
                    } else {
                        const times = getCuspTimes(v, radius).concat(1);
                        for (let j = 0, t0 = 0, m = times.length; j < m; j++) {
                            const t = times[j];
                            if (t === 1 || !isSliver(v, t0, t)
                                    && !isSliver(v, t, times[j + 1])) {
                                addPart(Curve.getPart(v, t0, t));
                                t0 = t;
                            }
                        }
                    }
                    ends.push({ curve: curve, start: start, end: end });
                }
            }
            for (let i = 1, l = ends.length; i <= l; i++) {
                const end1 = ends[i - 1],
                    end2 = ends[i % l];
                if (i < l || closed)
                    addJoin(end2.curve._segment1._point, end1.end, end2.start);
            }
            if (!closed && ends.length) {
                const first = ends[0],
                    last = ends[ends.length - 1];
                addCap(first.curve._segment1._point, first.start.negate());
                addCap(last.curve._segment2._point, last.end);
            }
        }
    }

    /**
     * 添加路径 stroke profile 的笔触扫过的区域:沿曲线在各停靠点之间变化的椭圆笔触，
     * 见 `Path#strokeProfile`。描边的两侧位于运动笔触与区域边界相切之处，我们在曲线
     * 的每个时刻精确求出这些点，并用三次曲线拟合。笔触突然变化或两侧结束的地方
     * （停靠点、台阶、拐角与反向），直接把它们按原样加入，因为它们都在区域内部。
     */
    function addProfilePath(path: Path): void {
        const pens = path._getStrokeProfilePens(),
            getValues = path._getStrokeProfileValues(),
            closed = path._closed,
            length = path.length,
            curves = path.curves,
            spans: Span[] = [],
            ends: ProfileEnd[] = [],
            allParts: Part[] = [];

        /**
         * 偏移处的笔触，用椭圆的半轴与弧度角表示，并带上它们沿路径的一、二阶导数。
         * 若该偏移处有台阶，`after` 选择台阶之后的一侧。b 是宽度与纵横比的乘积，
         * 两者的变化都会影响它。
         */
        function getPen(offset: number, after: boolean): Pen {
            const values = getValues(offset, after),
                width = values.width,
                aspect = values.aspect,
                angle = values.angle,
                toRadians = Math.PI / 180,
                a = radius * width[0];
            return {
                a: a,
                b: a * aspect[0],
                angle: angle[0] * toRadians,
                da: radius * width[1],
                db: radius * (width[1] * aspect[0] + width[0] * aspect[1]),
                dda: radius * width[2],
                ddb: radius * (width[2] * aspect[0]
                        + 2 * width[1] * aspect[1] + width[0] * aspect[2]),
                dAngle: angle[1] * toRadians,
                ddAngle: angle[2] * toRadians
            };
        }

        /**
         * 区间内偏移处的笔触，也用于舍入把偏移带到区间两端之外，或带到台阶的另一侧。
         */
        function getSpanPen(span: Span, offset: number): Pen {
            const end = span.next.offset;
            return offset < end
                    ? getPen(Math.max(offset, span.entry.offset), true)
                    : getPen(end, false);
        }

        /**
         * 曲线上时刻对应的路径偏移。正规化可能让它的曲线比这一段沿路径略长或略短，
         * 所以按比例缩放长度，使各段在相同的偏移处以相同的笔触相接。
         */
        function getOffset(part: Part, t: number): number {
            return part.offset + part.length
                    * Curve.getLength(part.v, 0, t) / part.curveLength!;
        }

        /** `getOffset()` 的逆:路径偏移对应的曲线上时刻。 */
        function getTime(part: Part, offset: number): number {
            const start = part.offset;
            return offset <= start ? 0 : offset >= start + part.length ? 1
                    : Curve.getTimeAt(part.v, (offset - start)
                        * part.curveLength! / part.length)!;
        }

        function getSpan(offset: number, after?: boolean): Span {
            for (let i = 0, l = spans.length; i < l; i++) {
                const span = spans[i];
                if (after ? offset < span.next.offset
                        : offset <= span.next.offset)
                    return span;
            }
            return spans[spans.length - 1];
        }

        /**
         * 在点处加入笔触，并把点加在那些在此结束与开始的条带与它相切的角度上，
         * 使它与条带在那里相接，而不是以很浅的角度穿过它们（按轴上的点画椭圆会
         * 这样）。
         */
        function addPen(point: Point, pen: Pen, strips?: Strip[]): void {
            // 单位圆上的点，由笔触的矩阵映射。
            function getPoint(phi: number): Point {
                return new Point(Math.cos(phi), Math.sin(phi));
            }

            if (pen.a > 0 && pen.b > 0) {
                const full = 2 * Math.PI,
                    angles: number[] = [],
                    ellipse = createPath();
                (strips || []).forEach((strip) => {
                    [strip.from.phi, strip.to.phi].forEach((phi) => {
                        angles.push((phi % full + full) % full);
                    });
                });
                angles.sort((a, b) => a - b);
                if (!angles.length)
                    angles.push(0);
                angles.push(angles[0] + full);
                ellipse.moveTo(getPoint(angles[0]));
                for (let i = 1, l = angles.length; i < l; i++) {
                    const phi0 = angles[i - 1],
                        sweep = angles[i] - phi0,
                        // 最多 90° 的弧，与 Path.Ellipse 一致。
                        count = Math.ceil(sweep / (Math.PI / 2) - 1e-9),
                        step = sweep / count;
                    if (sweep > geomEpsilon) {
                        for (let j = 1; j <= count; j++) {
                            ellipse.arcTo(
                                    getPoint(phi0 + (j - 0.5) * step),
                                    getPoint(phi0 + j * step));
                        }
                    }
                }
                ellipse.closePath(geomEpsilon);
                ellipse.transform(new Matrix().translate(point.x, point.y)
                        .rotate(pen.angle * 180 / Math.PI)
                        .scale(pen.a, pen.b));
                areas.push(ellipse);
            }
        }

        /** 笔触椭圆的两个轴。 */
        function getAxes(pen: Pen): [Point, Point] {
            const cos = Math.cos(pen.angle),
                sin = Math.sin(pen.angle);
            return [new Point(cos, sin), new Point(-sin, cos)];
        }

        /**
         * 返回曲线在时刻 t 的笔触与它扫过区域边界相切的位置，以及这些点沿曲线长度的
         * 导数。在笔触 p + a cos(φ) e1 + b sin(φ) e2 上，它们位于运动沿其边缘的方向，
         * 即三角二次函数 f(φ) 的根；我们先括住再细化。它们之间 f(φ) > 0 的边缘弧向外
         * 扫过区域，形成两端路径之间的条带。通常只有一段（描边两侧之间），笔触转得比
         * 移动更快时有两段。它们与两侧一样按曲线的法向排序。
         */
        function getContacts(part: Part, t: number, span: Span): Contacts {
            const v = part.v,
                pen = getSpanPen(span, getOffset(part, t)),
                a = pen.a,
                b = pen.b,
                da = pen.da,
                db = pen.db,
                dAngle = pen.dAngle,
                contacts: Contacts = { sides: null, strips: [] };
            if (a > 0) {
                const point = Curve.getPoint(v, t)!,
                    tangent = Curve.getTangent(v, t)!,
                    normal = new Point(-tangent.y, tangent.x),
                    curvature = Curve.getCurvature(v, t),
                    axes = getAxes(pen),
                    // 笔触轴上的切线及其变化。
                    t1 = tangent.dot(axes[0]),
                    t2 = tangent.dot(axes[1]),
                    dt1 = (dAngle - curvature) * t2,
                    dt2 = (curvature - dAngle) * t1,
                    // f(φ) 及其对 cos(φ)、sin(φ) 的导数（采样点已经算好了它们）。
                    fcs = (c: number, s: number): number => {
                        return t1 * b * c + t2 * a * s + da * b * c * c
                                + a * db * s * s
                                + dAngle * (a * a - b * b) * s * c;
                    },
                    dfcs = (c: number, s: number): number => {
                        return -t1 * b * s + t2 * a * c
                                + 2 * (a * db - da * b) * s * c
                                + dAngle * (a * a - b * b) * (c * c - s * s);
                    },
                    f = (phi: number): number => fcs(Math.cos(phi),
                            Math.sin(phi)),
                    df = (phi: number): number => dfcs(Math.cos(phi),
                            Math.sin(phi));
                let sample = penSamples[0],
                    phi0 = sample.phi,
                    f0 = fcs(sample.cos, sample.sin),
                    d0 = dfcs(sample.cos, sample.sin);
                const roots: Side[] = [];

                /**
                 * 加入两个角度之间 f(φ) 的根处的那一侧，并带上保持它在那里的 φ 随长度的
                 * 变化，作为它点的导数。
                 */
                const addRoot = (phi0: number, phi1: number, f0: number,
                        f1: number): void => {
                    const phi = Numerical.findSignChange(f, phi0, phi1, f0,
                            f1, epsilon),
                        c = Math.cos(phi),
                        s = Math.sin(phi),
                        dfs = (dt1 * b + t1 * db) * c
                            + (dt2 * a + t2 * da) * s + da * db
                            + pen.dda * b * c * c + a * pen.ddb * s * s
                            + (pen.ddAngle * (a * a - b * b)
                                + 2 * dAngle * (a * da - b * db)) * s * c,
                        dfphi = df(phi),
                        dphi = dfphi ? -dfs / dfphi : 0,
                        side: Side = {
                            phi: phi,
                            point: point.add(axes[0].multiply(a * c))
                                .add(axes[1].multiply(b * s)),
                            derivative: axes[0].multiply(t1 + da * c
                                    - (a * dphi + dAngle * b) * s)
                                .add(axes[1].multiply(t2 + db * s
                                    + (b * dphi + dAngle * a) * c)),
                            distance: 0
                        };
                    side.distance = side.point.subtract(point).dot(normal);
                    roots.push(side);
                };

                for (let i = 1, l = penSamples.length; i < l; i++) {
                    const sample = penSamples[i],
                        phi1 = sample.phi,
                        f1 = fcs(sample.cos, sample.sin),
                        d1 = dfcs(sample.cos, sample.sin);
                    if (f0 * f1 <= 0 && f0 !== f1) {
                        addRoot(phi0, phi1, f0, f1);
                    } else if (d0 * d1 < 0) {
                        // 两个靠得很近的根会在采样点之间跨过极值时被藏起来。
                        const phi = Numerical.findSignChange(df, phi0, phi1,
                                d0, d1, epsilon),
                            f2 = f(phi);
                        if (f2 * f0 < 0) {
                            addRoot(phi0, phi, f0, f2);
                            addRoot(phi, phi1, f2, f1);
                        }
                    }
                    phi0 = phi1;
                    f0 = f1;
                    d0 = d1;
                }
                const count = roots.length;
                for (let i = 0; i < count; i++) {
                    const from = roots[i],
                        to = roots[(i + 1) % count],
                        phi = from.phi + ((to.phi - from.phi + 2 * Math.PI)
                                % (2 * Math.PI) || 2 * Math.PI) / 2;
                    if (f(phi) > 0) {
                        contacts.strips.push({
                            from: from,
                            to: to,
                            distance: axes[0].multiply(a * Math.cos(phi))
                                .add(axes[1].multiply(b * Math.sin(phi)))
                                .dot(normal)
                        });
                    }
                }
                contacts.strips.sort((a, b) => b.distance - a.distance);
                if (count > 1) {
                    roots.sort((a, b) => b.distance - a.distance);
                    contacts.sides = [roots[0], roots[count - 1]];
                }
            }
            return contacts;
        }

        function getSides(part: Part, t: number, span: Span): Side[] | null {
            return getContacts(part, t, span).sides;
        }

        /**
         * 加入笔触在区间内沿曲线从 ta 到 tb 扫过的区域，即它触及区域边界的那些点的
         * 路径之间的条带，见 `getContacts()`。在这些点出现或消失、两条条带互换位置、
         * 条带因一端回头折叠到自己上面之处切开。前两种情况下的笔触位于区域内部并盖住
         * 条带末端。折叠的条带会扫过自己的内边缘，所以我们在其中静止的点处把它切成两块，
         * 与 `addPart()` 中处理渐屈线相同 (Nehab)。
         */
        function addPiece(part: Part, span: Span, ta: number,
                tb: number): void {
            // 触及边界的点会随笔触与曲线的转动绕笔触移动，至少每 10° 采样一次。
            const v = part.v,
                turn = abs(getSpanPen(span, getOffset(part, tb)).angle
                    - getSpanPen(span, getOffset(part, ta)).angle)
                    + getTurn(v, ta, tb),
                count = Math.max(16, Math.ceil(turn * 18 / Math.PI)),
                // 各段的结束处与下一段的开始处。
                splits: [number, number][] = [[ta, ta], [tb, tb]],
                cache: { [key: number]: Strip[] } = {};

            // 拟合时条带的两端会反复查询同一个时刻。
            function getStrips(t: number): Strip[] {
                return cache[t] || (cache[t] =
                        getContacts(part, t, span).strips);
            }

            /**
             * 条带端点在时刻 t 的位置；若采样点之间的变化让条带消失，就用曲线上的点，
             * 它也在笔触内部。
             */
            function getEnd(t: number, j: number, end: 'from' | 'to'): Point {
                const strip = getStrips(t)[j];
                return strip ? strip[end].point : Curve.getPoint(v, t)!;
            }

            /** 条带两端跨过它们之间连线的运动。 */
            function getMotions(strip: Strip): [number, number] {
                const vector = strip.to.point.subtract(strip.from.point),
                    normal = new Point(-vector.y, vector.x);
                return [
                    strip.from.derivative.dot(normal),
                    strip.to.derivative.dot(normal)
                ];
            }

            /** 条带是否与之前相同、顺序也相同，按它们在笔触上开始的角度判断。 */
            function isSame(strips: Strip[], before: Strip[]): boolean {
                if (strips.length !== before.length)
                    return false;
                for (let i = 0, l = strips.length; i < l; i++) {
                    const phi = strips[i].from.phi;
                    for (let j = 0; j < l; j++) {
                        if (j !== i && getAngle(phi, before[j].from.phi)
                                < getAngle(phi, before[i].from.phi))
                            return false;
                    }
                }
                return true;
            }

            function getAngle(phi1: number, phi2: number): number {
                const angle = Math.abs(phi1 - phi2) % (2 * Math.PI);
                return Math.min(angle, 2 * Math.PI - angle);
            }

            /**
             * 相同条带的端点是否在笔触上移动不到 20°，也就是它们在一对条带于采样点
             * 之间出现又消失时跳变。
             */
            function isClose(strips: Strip[], before: Strip[]): boolean {
                return strips.every((strip, i) => {
                    const other = before[i];
                    return getAngle(strip.from.phi, other.from.phi) < 0.35
                            && getAngle(strip.to.phi, other.to.phi) < 0.35;
                });
            }

            // 均匀采样条带，并在曲率取极值或变号处也采样，因为条带会在那里折叠。
            const samples: number[] = [];
            for (let i = 0; i < count; i++)
                samples.push(ta + (tb - ta) * i / count);
            // 正好加在末尾，因为舍入可能把它带过去。
            samples.push(tb);
            getCurvatureExtrema(v).concat(getInflections(v)).forEach((t) => {
                if (t > ta && t < tb)
                    samples.push(t);
            });
            samples.sort((a, b) => a - b);
            for (let i = 1, t0 = ta, s0 = getStrips(ta); i < samples.length;
                    i++) {
                const t1 = samples[i],
                    s1 = getStrips(t1);
                if (isSame(s1, s0) && !isClose(s1, s0)
                        && t1 - t0 > Numerical.CURVETIME_EPSILON) {
                    // 先在中点采样再继续。
                    samples.splice(i--, 0, (t0 + t1) / 2);
                    continue;
                }
                // 采样点之间可能有多于一次变化。
                while (!isSame(s1, s0)) {
                    let t = t0,
                        u = t1;
                    for (let j = 0; j < 40; j++) {
                        const middle = (t + u) / 2;
                        if (isSame(getStrips(middle), s0)) {
                            t = middle;
                        } else {
                            u = middle;
                        }
                    }
                    splits.push([t, u]);
                    addPen(Curve.getPoint(v, t)!,
                            getSpanPen(span, getOffset(part, t)),
                            getStrips(t).concat(getStrips(u)));
                    t0 = u;
                    s0 = getStrips(u);
                }
                s0.forEach((strip, j) => {
                    const m0 = getMotions(strip),
                        m1 = getMotions(s1[j]);
                    for (let k = 0; k < 2; k++) {
                        if (m0[k] * m1[k] < 0) {
                            const t = Numerical.findSignChange(
                                (t: number) => {
                                    const strip = getStrips(t)[j];
                                    return strip ? getMotions(strip)[k] : 0;
                                }, t0, t1, m0[k], m1[k], 1e-9);
                            splits.push([t, t]);
                        }
                    }
                });
                t0 = t1;
                s0 = s1;
            }
            splits.sort((a, b) => a[0] - b[0]);
            for (let i = 1, l = splits.length; i < l; i++) {
                const t0 = splits[i - 1][1],
                    t1 = splits[i][0],
                    strips = t1 - t0 > geomEpsilon
                        ? getStrips((t0 + t1) / 2) : [];
                strips.forEach((strip, j) => {
                    const motions = getMotions(strip),
                        from = fitSide((t) => getEnd(t, j, 'from'), t0, t1),
                        to = fitSide((t) => getEnd(t, j, 'to'), t0, t1);
                    if (motions[0] * motions[1] < 0) {
                        const still = fitSide((t) => {
                            const strip = getStrips(t)[j];
                            if (!strip)
                                return Curve.getPoint(v, t)!;
                            const motions = getMotions(strip),
                                point = strip.from.point,
                                // 在条带内部，也在它的运动比采样所述变化更大之处。
                                factor = clamp(motions[0]
                                    / (motions[0] - motions[1]), 0, 1);
                            return point.add(strip.to.point.subtract(point)
                                    .multiply(factor));
                        }, t0, t1);
                        addSides(from, still, true);
                        addSides(to, still, true);
                    } else {
                        addSides(from, to, true);
                    }
                });
            }
        }

        /** 加入一段曲线被它跨越的区间切开后的部分。 */
        function addPart(part: Part): void {
            const start = part.offset,
                end = start + part.length;
            // 只量一次，供 getOffset() 与 getTime() 使用。
            part.curveLength = Curve.getLength(part.v);
            for (let i = 0, l = spans.length; i < l; i++) {
                const span = spans[i],
                    from = Math.max(span.entry.offset, start),
                    to = Math.min(span.next.offset, end),
                    ta = getTime(part, from),
                    tb = getTime(part, to);
                if (to > from && tb > ta)
                    addPiece(part, span, ta, tb);
            }
        }

        /**
         * 用最小二乘把三次曲线拟合到 `evaluate` 在 t0 到 t1 之间返回的点，并带上两端的
         * 方向；误差超过容差时继续细分。
         */
        function fitSide(evaluate: (t: number) => Point, t0: number,
                t1: number): Segment[] {
            const count = 8,
                segments = [new Segment(evaluate(t0))];

            function fit(t0: number, t1: number, p0: Point, p3: Point,
                    depth: number): void {
                const delta = (t1 - t0) * 1e-5,
                    chord = p3.subtract(p0),
                    // 端点方向，退化时退回弦方向。
                    tangent0 = (() => {
                        const tangent = evaluate(t0 + delta).subtract(p0);
                        return (tangent.isZero() ? chord : tangent).normalize();
                    })(),
                    tangent3 = (() => {
                        const tangent = p3.subtract(evaluate(t1 - delta));
                        return (tangent.isZero() ? chord : tangent).normalize();
                    })(),
                    points: Point[] = [],
                    times: number[] = [];
                let total = 0;
                for (let i = 0, prev = p0; i <= count; i++) {
                    const point = i < count
                            ? evaluate(t0 + (t1 - t0) * (i + 1) / (count + 1))
                            : p3;
                    total += point.getDistance(prev);
                    if (i < count) {
                        points.push(point);
                        times.push(total);
                    }
                    prev = point;
                }
                // 点先按弦长比例作为它在三次曲线上的时刻，曲线偏离时再细化到最近时刻
                // (Schneider)。
                for (let i = 0; i < count; i++)
                    times[i] = total ? times[i] / total : 0;
                const fitLength = chord.length;
                let handle1 = new Point(),
                    handle2 = new Point(),
                    c: number[] = [],
                    error = 0;
                for (let iteration = 0; iteration < 4; iteration++) {
                    // 使各点处误差最小的控制柄长度。
                    let c11 = 0, c12 = 0, c22 = 0, x1 = 0, x2 = 0;
                    for (let i = 0; i < count; i++) {
                        const u = times[i],
                            w = 1 - u,
                            a1 = tangent0.multiply(3 * w * w * u),
                            a2 = tangent3.multiply(-3 * w * u * u),
                            rest = points[i]
                                .subtract(p0.multiply(w * w * (w + 3 * u)))
                                .subtract(p3.multiply(u * u * (u + 3 * w)));
                        c11 += a1.dot(a1);
                        c12 += a1.dot(a2);
                        c22 += a2.dot(a2);
                        x1 += a1.dot(rest);
                        x2 += a2.dot(rest);
                    }
                    const det = c11 * c22 - c12 * c12;
                    let alpha = det ? (x1 * c22 - x2 * c12) / det : 0,
                        beta = det ? (c11 * x2 - c12 * x1) / det : 0;
                    if (!(alpha > epsilon && beta > epsilon
                            && alpha < 2 * total && beta < 2 * total)) {
                        alpha = beta = fitLength / 3;
                    }
                    handle1 = tangent0.multiply(alpha);
                    handle2 = tangent3.multiply(-beta);
                    c = [p0.x, p0.y, p0.x + handle1.x, p0.y + handle1.y,
                        p3.x + handle2.x, p3.y + handle2.y, p3.x, p3.y];
                    error = 0;
                    for (let i = 0; i < count; i++) {
                        const time = Curve.getNearestTime(c, points[i]);
                        error = Math.max(error, points[i].getDistance(
                                Curve.getPoint(c, time)!));
                        times[i] = time;
                    }
                    if (error <= tolerance)
                        break;
                }
                // 在点之间的中点也量一次误差，三次曲线可能在那里鼓出。
                for (let i = 0; i <= count; i++) {
                    const point = evaluate(t0 + (t1 - t0) * (i + 0.5)
                            / (count + 1));
                    error = Math.max(error, point.getDistance(
                            Curve.getPoint(c,
                                Curve.getNearestTime(c, point))!));
                }
                if (error > tolerance && depth < 12) {
                    const t = (t0 + t1) / 2,
                        point = evaluate(t);
                    fit(t0, t, p0, point, depth + 1);
                    fit(t, t1, point, p3, depth + 1);
                } else {
                    segments[segments.length - 1].handleOut = handle1;
                    segments.push(new Segment(p3, handle2));
                }
            }

            fit(t0, t1, segments[0]._point, evaluate(t1), 0);
            return segments;
        }

        /**
         * 在两条曲线端点之间的点加入接缝，位于它们转向的外侧，除非它们彼此延续。
         * 圆角接缝就是笔触本身，其他接缝在那里连接它的两侧。
         */
        function addJoin(end1: ProfileEnd, end2: ProfileEnd): void {
            const point = end2.point,
                part1 = end1.last,
                part2 = end2.first,
                offset = part2.offset,
                tangent1 = end1.end,
                tangent2 = end2.start,
                cross = tangent1.cross(tangent2),
                span = getSpan(offset, true),
                pen = getSpanPen(span, offset);
            // 曲线彼此延续时，它们的部分在同一点相接，不需要接缝。
            if (!Numerical.isZero(cross) || tangent1.dot(tangent2) < 0) {
                if (join === 'round') {
                    addPen(point, pen, getContacts(part1, 1,
                            getSpan(offset, false)).strips.concat(
                                getContacts(part2, 0, span).strips));
                } else {
                    const span1 = getSpan(offset, false),
                        // 与转向相反的一侧，见 getSides()。
                        k = cross > 0 ? 1 : 0,
                        sides1 = getSides(part1, 1, span1),
                        sides2 = getSides(part2, 0, span);
                    if (sides1 && sides2) {
                        const side1 = sides1[k].point,
                            side2 = sides2[k].point,
                            direction1 = sides1[k].derivative.normalize(),
                            direction2 = sides2[k].derivative.normalize(),
                            // 把接缝向两侧加宽，与上面的 addJoin() 一样。
                            widening = Math.sqrt(tolerance * pen.a),
                            // 从内侧开始，因为各段的端点只经过笔触不变的那个点。
                            // 它们都在笔触上。
                            points = [sides1[1 - k].point,
                                side1.subtract(direction1.multiply(widening)),
                                side1];
                        if (join === 'miter') {
                            const miter = Line.intersect(
                                    side1.x, side1.y,
                                    direction1.x, direction1.y,
                                    side2.x, side2.y,
                                    direction2.x, direction2.y,
                                    true, true);
                            if (miter && miter.getDistance(point)
                                    <= miterLimit * pen.a)
                                points.push(miter);
                        }
                        addPolygon(points.concat(side2, side2.add(
                                direction2.multiply(widening)),
                                sides2[1 - k].point));
                    }
                }
            }
        }

        /**
         * 在这一段时刻 t 的端点处按切线方向加入端点。圆角端点就是笔触本身，方角端点
         * 把它的两侧延伸到它向前够到的位置。
         */
        function addCap(part: Part, t: number, tangent: Point): void {
            const offset = part.offset + (t ? part.length : 0),
                span = getSpan(offset, !t),
                pen = getSpanPen(span, offset);
            if (cap === 'round') {
                addPen(Curve.getPoint(part.v, t)!, pen,
                        getContacts(part, t, span).strips);
            } else if (cap === 'square') {
                const sides = getSides(part, t, span);
                if (sides) {
                    const axes = getAxes(pen),
                        reach = new Point(pen.a * tangent.dot(axes[0]),
                            pen.b * tangent.dot(axes[1])).length,
                        ahead = tangent.multiply(reach),
                        side0 = sides[0].point,
                        side1 = sides[1].point;
                    addPolygon([side0, side0.add(ahead), side1.add(ahead),
                            side1]);
                }
            }
        }

        if (!length) {
            // 一个点，按笔触或它周围的方形画出；端点只对开放路径有效。
            const segments = path._segments;
            if (segments.length && !closed && cap !== 'butt') {
                const center = segments[0]._point,
                    pen = getPen(0, true),
                    axes = getAxes(pen);
                if (cap === 'round') {
                    addPen(center, pen);
                } else {
                    const x = axes[0].multiply(pen.a),
                        y = axes[1].multiply(pen.b);
                    addPolygon([center.subtract(x).subtract(y),
                            center.add(x).subtract(y),
                            center.add(x).add(y),
                            center.subtract(x).add(y)]);
                }
            }
        } else {
            for (let i = 1, l = pens.length; i < l; i++) {
                if (pens[i].offset > pens[i - 1].offset)
                    spans.push({ entry: pens[i - 1], next: pens[i] });
            }
            let offset = 0;
            for (let i = 0, l = curves.length; i < l; i++) {
                const curve = curves[i],
                    curveLength = curve.length;
                if (curve.hasLength(geomEpsilon)) {
                    const v = regularize(curve.getValues(), tolerance / 4),
                        reversals = Curve.getReversals(v, tolerance),
                        parts: Part[] = [];
                    if (reversals.length) {
                        // 沿直线反向的曲线:反向点之间是直线段，与 addPath() 相同，
                        // 笔触在折返处随之转动。
                        const points = [new Point(v[0], v[1])];
                        for (let j = 0, m = reversals.length; j < m; j++)
                            points.push(Curve.getPoint(v, reversals[j])!);
                        points.push(new Point(v[6], v[7]));
                        for (let j = 1, start = offset,
                                m = points.length; j < m; j++) {
                            const p1 = points[j - 1],
                                p2 = points[j],
                                third = p2.subtract(p1).divide(3),
                                distance = p1.getDistance(p2);
                            parts.push({
                                v: [p1.x, p1.y, p1.x + third.x,
                                    p1.y + third.y, p2.x - third.x,
                                    p2.y - third.y, p2.x, p2.y],
                                offset: start,
                                length: distance
                            });
                            start += distance;
                        }
                    } else {
                        parts.push({
                            v: regularizeCusp(v, tolerance / 4),
                            offset: offset,
                            length: curveLength
                        });
                    }
                    parts.forEach(addPart);
                    // 直线段在相接处反向，笔触在那里绕回。
                    for (let j = 1, m = parts.length; j < m; j++) {
                        const part = parts[j],
                            start = part.offset,
                            span = getSpan(start);
                        addPen(new Point(part.v[0], part.v[1]),
                                getSpanPen(span, start),
                                getContacts(parts[j - 1], 1, span).strips
                                    .concat(getContacts(part, 0, span).strips));
                    }
                    allParts.push(...parts);
                    const first = parts[0],
                        last = parts[parts.length - 1];
                    ends.push({
                        point: curve._segment1._point,
                        first: first,
                        last: last,
                        start: Curve.getTangent(first.v, 0)!,
                        end: Curve.getTangent(last.v, 1)!
                    });
                }
                offset += curveLength;
            }
            // 区间相接处、笔触突变处的笔触，两侧在那里跳变，台阶除外（台阶像平头
            // 端点那样把各段直着截断）。笔触平滑变化时，各段在同一点相接。
            for (let i = 0, l = pens.length; i < l; i++) {
                const offset = pens[i].offset,
                    isStep = i > 0 && pens[i - 1].offset === offset
                        || i < l - 1 && pens[i + 1].offset === offset;
                if (!isStep && (closed ? offset < length
                        : offset > 0 && offset < length)) {
                    const pen = getPen(offset, true),
                        before = getPen(offset, false),
                        // 两侧大致跳多远，按笔触大小估计。值在停靠点处按直线变化时，
                        // 两侧的变化率只差舍入。
                        size = Math.max(pen.a, pen.b),
                        jump = size * (Math.abs(pen.da - before.da)
                            + Math.abs(pen.db - before.db)
                            + size * Math.abs(pen.dAngle - before.dAngle));
                    if (jump > geomEpsilon) {
                        // 停靠点所在的那一段，以及它开始前的那一段。
                        let j = 0;
                        for (; j < allParts.length
                                && allParts[j].offset + allParts[j].length
                                    <= offset; j++) {}
                        const part = allParts[j],
                            t = getTime(part, offset),
                            previous = t ? part : allParts[j - 1]
                                || allParts[allParts.length - 1];
                        addPen(Curve.getPoint(part.v, t)!, pen,
                                getContacts(previous, t || 1,
                                    getSpan(offset, false)).strips.concat(
                                        getContacts(part, t,
                                            getSpan(offset, true)).strips));
                    }
                }
            }
            for (let i = 1, l = ends.length; i <= l; i++) {
                if (i < l || closed)
                    addJoin(ends[i - 1], ends[i % l]);
            }
            if (!closed && ends.length) {
                const first = ends[0],
                    last = ends[ends.length - 1];
                addCap(first.first, 0, first.start.negate());
                addCap(last.last, 1, last.end);
            }
        }
    }

    for (let i = 0, l = paths.length; i < l; i++) {
        const path = paths[i];
        // 带 stroke profile 的路径按笔形扫描，否则按等半径描边。
        if (path._strokeProfile) {
            addProfilePath(path);
        } else {
            addPath(path);
        }
    }
    return areas.length
            ? areas.length > 1 ? areas[0].unite(areas.slice(1)) : areas[0]
            : createPath();
}

/** 取 `Path` 构造函数，供圆角连接/端点的 `Circle`/`Rectangle` 使用。 */
function pathConstructor(): typeof Path {
    const ctor = PathItem._pathClass;
    if (!ctor)
        throw new Error('Path 尚未注册：请从包入口导入，或先加载 ./path/Path');
    return ctor;
}

// -------------------------------------------------------------------------
// 开放路径的偏移

/**
 * 开放路径的偏移:取其描边轮廓在偏移一侧、带平头端点的那部分曲线，不含端点。
 */
function offsetSide(path: Path, offset: number, join: string,
        miterLimit: number): Path[] {
    const radius = abs(offset),
        outline = outlineStroke([path], radius, join, 'butt', miterLimit),
        first = path.firstSegment!,
        last = path.lastSegment!,
        caps: [Point, Point][] = [
            [first._point, path.firstCurve!.getNormalAtTime(0)!],
            [last._point, path.lastCurve!.getNormalAtTime(1)!]
        ],
        tolerance = radius / 1e4,
        paths: Path[] = [];

    // 端点是沿两端法线的直线曲线。
    function isCap(curve: Curve): boolean {
        if (!curve.hasHandles()) {
            for (let i = 0; i < 2; i++) {
                const point = caps[i][0],
                    normal = caps[i][1],
                    vector1 = curve._segment1._point.subtract(point),
                    vector2 = curve._segment2._point.subtract(point);
                if (abs(vector1.cross(normal)) < tolerance
                        && abs(vector2.cross(normal)) < tolerance)
                    return true;
            }
        }
        return false;
    }

    function isOnSide(curve: Curve): boolean {
        const point = curve.getPointAtTime(0.5),
            location = path.getNearestLocation(point);
        return !isCap(curve) && !!location && point.subtract(location.point)
                .dot(location.normal!) * offset > 0;
    }

    function addRun(curves: Curve[]): void {
        const segments = [new Segment(curves[0]._segment1._point, undefined,
                curves[0]._segment1._handleOut)];
        for (let i = 0, l = curves.length; i < l; i++) {
            const segment = curves[i]._segment2;
            segments.push(new Segment(segment._point, segment._handleIn,
                    i < l - 1 ? segment._handleOut : undefined));
        }
        const run = createPath(segments);
        // 让它沿路径的方向。
        const first = run.firstSegment!,
            lastSeg = run.lastSegment!,
            from = path.getNearestLocation(first._point),
            to = path.getNearestLocation(lastSeg._point);
        if (from && to && from.offset > to.offset)
            run.reverse();
        paths.push(run);
    }

    const contours = (outline as CompoundPath)._children || [outline];
    for (let i = 0, l = contours.length; i < l; i++) {
        const contour = contours[i] as Path,
            curves = contour.curves,
            count = curves.length,
            keeps: boolean[] = [];
        let start = -1;
        for (let j = 0; j < count; j++) {
            keeps.push(isOnSide(curves[j]));
            if (!keeps[j])
                start = j;
        }
        if (count && start === -1) {
            // 整条轮廓都在这一侧。
            paths.push(contour.clone());
        } else {
            // 收集位于这一侧的连续曲线段，从一个不在侧边的曲线之后开始，
            // 这样没有一段会跨过轮廓的末尾。
            let run: Curve[] = [];
            for (let j = 1; j <= count; j++) {
                const index = (start + j) % count;
                if (keeps[index]) {
                    run.push(curves[index]);
                } else if (run.length) {
                    addRun(run);
                    run = [];
                }
            }
        }
    }
    return paths;
}

// -------------------------------------------------------------------------
// 微分几何辅助

/**
 * 返回曲线 v 的切线从 t1 转到 t2 的总角度（弧度），在拐点处累加。
 */
function getTurn(v: number[], t1: number, t2: number): number {
    const times = [t1].concat(getInflections(v).filter((t) =>
            t > t1 && t < t2), t2);
    let turn = 0;
    for (let i = 1, l = times.length; i < l; i++) {
        turn += abs(Curve.getTangent(v, times[i - 1])!.getDirectedAngle(
                Curve.getTangent(v, times[i])!));
    }
    return turn * Math.PI / 180;
}

/**
 * 返回曲线两侧偏移出现尖点的 times:曲率半径等于偏移距离处。在曲率的极值点
 * 与拐点之间，曲率大小单调变化，因此每个区间至多有一个尖点。
 */
function getCuspTimes(v: number[], radius: number): number[] {
    const times = getCurvatureExtrema(v).concat(getInflections(v), 0, 1)
            .sort((a, b) => a - b),
        cusps: number[] = [];

    function f(t: number): number {
        const curvature = Curve.getCurvature(v, t) * radius;
        return 1 - curvature * curvature;
    }

    for (let i = 1, l = times.length; i < l; i++) {
        const t0 = times[i - 1],
            t1 = times[i],
            f0 = f(t0),
            f1 = f(t1);
        if (f0 * f1 < 0)
            cusps.push(Numerical.findSignChange(f, t0, t1, f0, f1, epsilon));
    }
    return cusps;
}

interface EvolutePoint {
    point: Point;
    derivative: Point;
    /** 速度的分子，在曲率极值处为 0。 */
    speed: number;
    /** 带符号的曲率半径，沿 perp(d1) 方向。 */
    radius: number;
}

/**
 * 返回曲线 v 在 t 处的曲率中心、它的导数以及速度的分子。设曲线的导数为
 * d1、d2、d3，则曲率中心位于 p + perp(d1) * |d1|² / (d1 × d2)，并沿 perp(d1) 移动。
 */
function getEvoluteAt(v: number[], t: number): EvolutePoint {
    const x0 = v[0],
        y0 = v[1],
        cx = 3 * (v[2] - x0),
        cy = 3 * (v[3] - y0),
        bx = 3 * (v[4] - v[2]) - cx,
        by = 3 * (v[5] - v[3]) - cy,
        ax = v[6] - x0 - cx - bx,
        ay = v[7] - y0 - cy - by,
        dx = (3 * ax * t + 2 * bx) * t + cx,
        dy = (3 * ay * t + 2 * by) * t + cy,
        ddx = 6 * ax * t + 2 * bx,
        ddy = 6 * ay * t + 2 * by,
        cross = dx * ddy - dy * ddx,
        length2 = dx * dx + dy * dy,
        speed = 3 * (dx * ddx + dy * ddy) * cross
            - length2 * (dx * 6 * ay - dy * 6 * ax),
        perp = new Point(-dy, dx);
    return {
        point: Curve.getPoint(v, t)!.add(perp.multiply(length2 / cross)),
        derivative: perp.multiply(speed / (cross * cross)),
        speed: speed,
        radius: length2 * Math.sqrt(length2) / cross
    };
}

/** 返回曲率取极值处的 times。 */
function getCurvatureExtrema(v: number[]): number[] {
    const count = 32,
        times: number[] = [];

    function f(t: number): number {
        return getEvoluteAt(v, t).speed;
    }

    for (let i = 1, f0 = f(0); i <= count; i++) {
        const t0 = (i - 1) / count,
            t1 = i / count,
            f1 = f(t1);
        if (f0 * f1 < 0)
            times.push(Numerical.findSignChange(f, t0, t1, f0, f1, epsilon));
        f0 = f1;
    }
    return times;
}

/**
 * 返回曲线 v 的渐屈线（曲率中心构成的曲线）的 segments，在尖点之间用三次
 * Hermite 曲线拟合。当曲率中心越过内侧偏移或位于另一侧时，内侧不会向后扫，
 * 渐屈线改走内侧偏移。
 */
function getEvolute(v: number[], inner: number,
        tolerance: number): Segment[] {
    const c = regularizeCusp(v, tolerance / 4),
        times = getCurvatureExtrema(c).concat(1),
        segments = [new Segment(evaluate(0).point)];
    let t0 = 0,
        e0 = evaluate(0);

    function evaluate(t: number): EvolutePoint {
        let e = getEvoluteAt(c, t);
        // Paper.js 的法线与 perp(d1) 反向。
        const distance = inner > 0 ? -e.radius : e.radius;
        // 半径未定义（导数为 0）、或落在内侧偏移的容差之内时也走内侧偏移，
        // 这样两者恰好在窄段的端点相接。
        if (!(distance >= 0 && distance < abs(inner) - tolerance)) {
            const derivative = Curve.getWeightedTangent(c, t)!;
            e = {
                point: Curve.getPoint(c, t)!.add(
                        Curve.getNormal(c, t)!.multiply(inner)),
                derivative: derivative.multiply(
                        1 + inner * Curve.getCurvature(c, t)),
                speed: 0,
                radius: 0
            };
        }
        return e;
    }

    function fit(t0: number, e0: EvolutePoint, t1: number, e1: EvolutePoint,
            depth: number): void {
        const tm = (t0 + t1) / 2,
            em = evaluate(tm),
            h0 = e0.derivative.multiply((t1 - t0) / 3),
            h1 = e1.derivative.multiply((t0 - t1) / 3),
            mid = e0.point.add(e1.point).multiply(0.5)
                .add(h0.add(h1).multiply(3 / 8));
        if (depth < 8 && mid.getDistance(em.point) > tolerance / 10) {
            fit(t0, e0, tm, em, depth + 1);
            fit(tm, em, t1, e1, depth + 1);
        } else {
            segments[segments.length - 1].handleOut = h0;
            segments.push(new Segment(e1.point, h1));
        }
    }

    for (let i = 0, l = times.length; i < l; i++) {
        const e1 = evaluate(times[i]);
        fit(t0, e0, times[i], e1, 0);
        t0 = times[i];
        e0 = e1;
    }
    return segments;
}

/** 返回曲线 v 偏移后的 segments。 */
function getOffsetSegments(v: number[], offset: number,
        tolerance: number): Segment[] {
    if (Curve.isStraight(v)) {
        // 沿两端法线偏移，接缝与端点也使用同样的点。
        return [
            new Segment(new Point(v[0], v[1]).add(
                    Curve.getNormal(v, 0)!.multiply(offset))),
            new Segment(new Point(v[6], v[7]).add(
                    Curve.getNormal(v, 1)!.multiply(offset)))
        ];
    } else {
        // Paper.js 的法线与下面方法的方向相反，见 getUnitNormal()。
        return offsetCubic(v, -offset, tolerance);
    }
}

interface OffsetPart {
    t0: number;
    t1: number;
    utan0: Point;
    utan1: Point;
    cusp0: number;
    cusp1: number;
    depth: number;
}

/**
 * 三次贝塞尔曲线的偏移，移植自 kurbo 的 offset_cubic()（Raph Levien 与
 * Linebender 贡献者，Apache-2.0 OR MIT）:
 * https://github.com/linebender/kurbo/blob/main/kurbo/src/offset.rs
 * 每段先画成圆弧，再用最小二乘细化，误差超限时细分，并优先在偏移的尖点处切开。
 */
function offsetCubic(v: number[], d: number, tolerance: number): Segment[] {
    const c = regularizeCusp(v, tolerance / 4),
        p0 = new Point(c[0], c[1]),
        p1 = new Point(c[2], c[3]),
        p2 = new Point(c[4], c[5]),
        p3 = new Point(c[6], c[7]),
        // 导数的控制点。
        q0 = p1.subtract(p0).multiply(3),
        q1 = p2.subtract(p1).multiply(3),
        q2 = p3.subtract(p2).multiply(3),
        // 二阶与一阶导数的叉积乘以偏移，作为多项式 c0 + c1 * t + c2 * t^2。
        q1xq0 = q1.cross(q0),
        q2xq0 = q2.cross(q0),
        q2xq1 = q2.cross(q1),
        c0 = 2 * d * q1xq0,
        c1 = 2 * d * (q2xq0 - 2 * q1xq0),
        c2 = 2 * d * (q2xq1 - q2xq0 + q1xq0),
        utan0 = Curve.getTangent(c, 0)!,
        utan1 = Curve.getTangent(c, 1)!,
        segments = [new Segment(p0.add(getUnitNormal(utan0, d)))],
        // 最小二乘拟合所用点的贝塞尔权重。
        count = 8,
        weights: number[] = [];
    for (let i = 0; i < count; i++) {
        const t = (i + 1) / (count + 1);
        weights.push(3 * (1 - t) * (1 - t) * t);
    }

    function getUnitNormal(utan: Point, length: number): Point {
        return new Point(-utan.y, utan.x).multiply(length);
    }

    function evaluate(t: number): Point {
        return Curve.getPoint(c, t)!;
    }

    function derive(t: number): Point {
        const u = 1 - t,
            w0 = u * u,
            w1 = 2 * t * u,
            w2 = t * t;
        return new Point(w0 * q0.x + w1 * q1.x + w2 * q2.x,
                w0 * q0.y + w1 * q1.y + w2 * q2.y);
    }

    /** 曲率乘以偏移加 1，在偏移出现尖点处为 0。 */
    function getCusp(t: number): number {
        const ds2 = derive(t).dot(derive(t));
        return ((c2 * t + c1) * t + c0) / (ds2 * Math.sqrt(ds2)) + 1;
    }

    function getEndCusp(tangent: Point, y: number): number {
        const length = Math.max(tangent.length, epsilon);
        return y / (length * length * length) + 1;
    }

    /**
     * 段 t0..t1 的偏移曲线，控制柄按圆弧给出，再由 a、b 调整。
     */
    function getOffsetCurve(part: OffsetPart, a: number, b: number): Point[] {
        const s = (part.t1 - part.t0) / 3,
            start = evaluate(part.t0).add(getUnitNormal(part.utan0, d)),
            end = evaluate(part.t1).add(getUnitNormal(part.utan1, d)),
            l0 = s * derive(part.t0).length + a * d,
            l1 = s * derive(part.t1).length - b * d;
        return [
            start,
            l0 * part.cusp0 > 0
                ? start.add(part.utan0.multiply(l0)) : start,
            l1 * part.cusp1 > 0
                ? end.subtract(part.utan1.multiply(l1)) : end,
            end
        ];
    }

    /**
     * 偏移曲线的误差:取其法线在 ts 处与曲线相交的那些点，用一步牛顿法细化。
     * 这个函数调用频繁，因此直接用坐标计算而不构造 Point。
     */
    function getError(part: OffsetPart, points: Point[], ts: number[]): {
        squared: number;
        normals: Point[];
        vectors: Point[];
    } {
        let error = 0;
        const normals: Point[] = [],
            vectors: Point[] = [],
            x0 = points[0].x, y0 = points[0].y,
            x1 = points[1].x, y1 = points[1].y,
            x2 = points[2].x, y2 = points[2].y,
            x3 = points[3].x, y3 = points[3].y,
            sign = part.cusp0 < 0 ? -1 : 1;
        for (let i = 0; i < count; i++) {
            const ta = (i + 1) / (count + 1),
                u = 1 - ta,
                w0 = u * u * u,
                w1 = 3 * u * u * ta,
                w2 = 3 * u * ta * ta,
                w3 = ta * ta * ta,
                px = w0 * x0 + w1 * x1 + w2 * x2 + w3 * x3,
                py = w0 * y0 + w1 * y1 + w2 * y2 + w3 * y3,
                tx = (x1 - x0) * u * u + (x2 - x1) * 2 * u * ta
                    + (x3 - x2) * ta * ta,
                ty = (y1 - y0) * u * u + (y2 - y1) * 2 * u * ta
                    + (y3 - y2) * ta * ta;
            let t = ts[i];
            const point = evaluate(t),
                derivative = derive(t);
            t += (tx * (px - point.x) + ty * (py - point.y))
                    / (tx * derivative.x + ty * derivative.y);
            t = ts[i] = clamp(t, part.t0, part.t1);
            const p = evaluate(t),
                length = Math.sqrt(tx * tx + ty * ty),
                nx = -ty / length * sign,
                ny = tx / length * sign,
                vx = px - p.x - nx * d,
                vy = py - p.y - ny * d,
                squared = vx * vx + vy * vy;
            normals.push(new Point(nx, ny));
            vectors.push(new Point(vx, vy));
            // 丢弃产生无效值的细化结果。
            error = Math.max(error, isFinite(squared) ? squared : 1e12);
        }
        return { squared: error, normals: normals, vectors: vectors };
    }

    /**
     * 调整 a、b 以最小化最小二乘误差，主要沿偏移的法向，混入少量切向误差。
     */
    function refine(part: OffsetPart, a: number, b: number,
            error: { normals: Point[]; vectors: Point[] }): number[] {
        const blend = 1e-3;
        let aa = 0, ab = 0, ac = 0, bb = 0, bc = 0;
        for (let i = 0; i < count; i++) {
            const n = error.normals[i],
                vector = error.vectors[i],
                cn = vector.dot(n),
                ct = vector.cross(n),
                an = weights[i] * part.utan0.dot(n),
                at = weights[i] * part.utan0.cross(n),
                bn = weights[count - 1 - i] * part.utan1.dot(n),
                bt = weights[count - 1 - i] * part.utan1.cross(n);
            aa += an * an + blend * at * at;
            ab += an * bn + blend * at * bt;
            ac += an * cn + blend * at * ct;
            bb += bn * bn + blend * bt * bt;
            bc += bn * cn + blend * bt * ct;
        }
        const idet = 1 / (d * (aa * bb - ab * ab));
        return [
            a - idet * (ac * bb - ab * bc),
            b - idet * (aa * bc - ac * ab)
        ];
    }

    /**
     * 找出 t0..t1 中切线与 tangent 平行的时间;没有恰好一个时，若 force 为真
     * 则返回导数较小的一端。
     */
    function getTimeWithTangent(utan0: Point, t0: number, t1: number,
            tangent: Point, force: boolean): { t: number; utan: Point } | null {
        const z0 = tangent.cross(q0),
            z1 = tangent.cross(q1),
            z2 = tangent.cross(q2),
            roots: number[] = [],
            found = Numerical.solveQuadratic(z2 - 2 * z1 + z0,
                    2 * (z1 - z0), z0, roots, t0, t1);
        let t = roots[0];
        if (found !== 1) {
            if (!force)
                return null;
            t = derive(t0).length > derive(t1).length ? t1 : t0;
        }
        const q = derive(t);
        return {
            t: t,
            utan: found === 1 && q.dot(q) >= epsilon ? q.normalize()
                : tangent.dot(tangent) >= epsilon ? tangent.normalize()
                // 掉头:任取一个方向。
                : getUnitNormal(utan0, 1)
        };
    }

    /**
     * 在哪里细分:切线在两端之间较均衡时取中点，否则取角平分线方向对应的
     * 切线，若有拐点则取总转向的一半。
     */
    function getSubdivision(part: OffsetPart): { t: number; utan: Point } {
        const t = (part.t0 + part.t1) / 2,
            q = derive(t),
            x0 = abs(part.utan0.cross(q)),
            x1 = abs(part.utan1.cross(q));
        if (x0 > 0.1 * x1 && x1 > 0.1 * x0)
            return { t: t, utan: q.normalize() };
        const chord = evaluate(part.t1).subtract(evaluate(part.t0));
        if (chord.cross(part.utan0) * chord.cross(part.utan1) < 0) {
            const split = getTimeWithTangent(part.utan0, part.t0, part.t1,
                    part.utan0.add(part.utan1), false);
            if (split)
                return split;
        }
        const tangents = [part.utan0],
            ts = [part.t0],
            inflections = getInflections(c);
        for (let i = 0; i < inflections.length; i++) {
            const ti = inflections[i];
            if (ti > part.t0 && ti < part.t1) {
                tangents.push(derive(ti));
                ts.push(ti);
            }
        }
        tangents.push(part.utan1);
        ts.push(part.t1);
        const angles: number[] = [];
        let sum = 0;
        for (let i = 0; i < tangents.length - 1; i++) {
            const angle = Math.atan2(tangents[i].cross(tangents[i + 1]),
                    tangents[i].dot(tangents[i + 1]));
            sum += abs(angle);
            angles.push(angle);
        }
        let target = sum / 2,
            j = 0;
        while (abs(angles[j]) < target) {
            target -= abs(angles[j]);
            j++;
        }
        const base = tangents[j],
            turn = angles[j] < 0 ? -target : target,
            tangent = base.rotate(turn * 180 / Math.PI);
        return getTimeWithTangent(j ? base.normalize() : part.utan0,
                ts[j], ts[j + 1], tangent, true)!;
    }

    function subdivide(part: OffsetPart, t: number, utan: Point,
            cuspMinus: number, cuspPlus: number): void {
        offsetPart({
            t0: part.t0, t1: t, utan0: part.utan0, utan1: utan,
            cusp0: part.cusp0, cusp1: cuspMinus, depth: part.depth + 1
        });
        offsetPart({
            t0: t, t1: part.t1, utan0: utan, utan1: part.utan1,
            cusp0: cuspPlus, cusp1: part.cusp1, depth: part.depth + 1
        });
    }

    function offsetPart(part: OffsetPart): void {
        // 先在偏移的尖点处细分。
        if (part.cusp0 * part.cusp1 < 0) {
            const t = Numerical.findSignChange(getCusp, part.t0, part.t1,
                    part.cusp0, part.cusp1, epsilon);
            subdivide(part, t, derive(t).normalize(),
                    part.cusp0 < 0 ? -epsilon : epsilon,
                    part.cusp1 < 0 ? -epsilon : epsilon);
            return;
        }
        // 从起点法线到终点法线的圆弧。
        const angle = Math.atan2(part.utan1.cross(part.utan0),
                    part.utan1.dot(part.utan0));
        let a = 2 / 3 / (1 + Math.cos(angle / 2)) * 2 * Math.sin(angle / 2);
        let b = -a,
            points = getOffsetCurve(part, a, b);
        const dt = (part.t1 - part.t0) / (count + 1),
            ts: number[] = [];
        for (let i = 0; i < count; i++)
            ts.push(part.t0 + (i + 1) * dt);
        let error = getError(part, points, ts);
        const tolerance2 = tolerance * tolerance;
        for (let i = 0; i < 2 && error.squared > tolerance2; i++) {
            const refined = refine(part, a, b, error),
                points2 = getOffsetCurve(part, refined[0], refined[1]),
                error2 = getError(part, points2, ts);
            if (error2.squared >= error.squared)
                break;
            a = refined[0];
            b = refined[1];
            points = points2;
            error = error2;
        }
        // 与起点距离在容差内的片段误差不会更大:在偏移尖点附近误差不收敛，
        // 细分只会添加没有长度的片段。
        const isShort = points[1].getDistance(points[0]) < tolerance
                && points[2].getDistance(points[0]) < tolerance
                && points[3].getDistance(points[0]) < tolerance;
        if (part.depth < 8 && error.squared > tolerance2 && !isShort) {
            const split = getSubdivision(part),
                cusp = getCusp(split.t);
            subdivide(part, split.t, split.utan, cusp, cusp);
        } else {
            const last = segments[segments.length - 1];
            last.handleOut = points[1].subtract(points[0]);
            segments.push(new Segment(points[3],
                    points[2].subtract(points[3])));
        }
    }

    offsetPart({
        t0: 0, t1: 1, utan0: utan0, utan1: utan1,
        cusp0: getEndCusp(q0, c0),
        cusp1: getEndCusp(q2, c0 + c1 + c2),
        depth: 0
    });
    return segments;
}

/** 返回曲线的拐点 times。 */
function getInflections(v: number[]): number[] {
    const p0 = new Point(v[0], v[1]),
        p1 = new Point(v[2], v[3]),
        p2 = new Point(v[4], v[5]),
        p3 = new Point(v[6], v[7]),
        a = p1.subtract(p0),
        b = p2.subtract(p1).subtract(a),
        c = p3.subtract(p0).subtract(p2.subtract(p1).multiply(3)),
        roots: number[] = [],
        count = Numerical.solveQuadratic(b.cross(c), a.cross(c),
                a.cross(b), roots, 0, 1);
    return count > 0 ? roots.slice(0, count) : [];
}

/**
 * 把短于 dimension 的控制柄沿各自方向拉到该长度（它们的方向就是曲线的切线
 * 方向），没有方向时朝下一个控制点，使曲线端点处的导数不为 0
 * （移植自 kurbo 的 CubicBez::regularize()）。
 */
function regularize(v: number[], dimension: number): number[] {
    const p0 = new Point(v[0], v[1]),
        p3 = new Point(v[6], v[7]),
        handle1 = new Point(v[2], v[3]).subtract(p0),
        handle2 = new Point(v[4], v[5]).subtract(p3);
    let p1 = new Point(v[2], v[3]),
        p2 = new Point(v[4], v[5]);
    if (handle1.length < dimension) {
        if (!handle1.isZero()) {
            p1 = p0.add(handle1.normalize(dimension));
        } else if (p0.getDistance(p2) >= dimension) {
            p1 = p0.add(p2.subtract(p0).normalize(dimension));
        } else {
            p1 = p0.add(p3.subtract(p0).divide(3));
            p2 = p3.add(p0.subtract(p3).divide(3));
        }
    }
    if (handle2.length < dimension) {
        if (!handle2.isZero()) {
            p2 = p3.add(handle2.normalize(dimension));
        } else if (p3.getDistance(p1) >= dimension) {
            p2 = p3.add(p1.subtract(p3).normalize(dimension));
        } else {
            p1 = p0.add(p3.subtract(p0).divide(3));
            p2 = p3.add(p0.subtract(p3).divide(3));
        }
    }
    return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y];
}

/**
 * 微调带尖点（导数为 0）的曲线的控制柄，使曲率保持有限
 * （移植自 kurbo 的 regularize_cusp()）。
 */
function regularizeCusp(v: number[], dimension: number): number[] {
    const p0 = new Point(v[0], v[1]),
        p3 = new Point(v[6], v[7]);
    let p1 = new Point(v[2], v[3]),
        p2 = new Point(v[4], v[5]);
    const d01 = p1.subtract(p0),
        d02 = p2.subtract(p0),
        d03 = p3.subtract(p0),
        d12 = p2.subtract(p1),
        d23 = p3.subtract(p2),
        det012 = d01.cross(d02),
        det123 = d12.cross(d23),
        det013 = d01.cross(d03),
        det023 = d02.cross(d03);
    if (det012 * det123 > 0 && det012 * det013 < 0
            && det012 * det023 < 0) {
        // 导数是 q0、q1、q2 的二次曲线。找出它最短的位置及其曲率。
        const q0 = d01.multiply(3),
            q1 = d12.multiply(3),
            q2 = d23.multiply(3),
            t = Curve.getNearestTime([q0.x, q0.y,
                    q0.x + (q1.x - q0.x) * 2 / 3,
                    q0.y + (q1.y - q0.y) * 2 / 3,
                    q2.x + (q1.x - q2.x) * 2 / 3,
                    q2.y + (q1.y - q2.y) * 2 / 3, q2.x, q2.y],
                    new Point(0, 0)),
            u = 1 - t,
            q = q0.multiply(u * u).add(q1.multiply(2 * t * u))
                .add(q2.multiply(t * t)),
            dq = q1.subtract(q0).multiply(2 * u)
                .add(q2.subtract(q1).multiply(2 * t)),
            cross = q.cross(dq),
            distance2 = q.dot(q);
        if (distance2 * distance2 * distance2
                <= cross * dimension * cross * dimension) {
            const a = 3 * det012 + det023 - 2 * det013,
                b = -3 * det012 + det013,
                discriminant = b * b - 4 * a * det012,
                l01 = d01.length,
                l23 = d23.length;
            if (discriminant > 0) {
                // 二重拐点:控制柄至少保持 dimension 那么长。
                if (l01 > 2 * dimension)
                    p1 = p1.subtract(d01.multiply(dimension / l01));
                if (l23 > 2 * dimension)
                    p2 = p2.add(d23.multiply(dimension / l23));
            } else {
                // 一个环。
                p1 = p1.add(d01.multiply(dimension / l01));
                p2 = p2.subtract(d23.multiply(dimension / l23));
            }
        }
    }
    return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y];
}

// -------------------------------------------------------------------------
// 公开入口

/** 返回路径项的副本，去掉空子路径（没有 item 矩阵需要应用）。 */
function prepare(item: PathItem): PathItem {
    // `Path#clone()` 已经会复制 stroke profile，这里只做去空与单路径折叠。
    return reducePath((item as Path).clone());
}

function createResult(item: PathItem, result: PathItem,
        options?: OffsetOptions): PathItem {
    // 没有场景图，也没有样式需要复制。
    return result;
}

/**
 * 按距离偏移路径项。闭合路径与复合路径在正距离时外扩、负距离时收缩；开放
 * 路径在正距离时沿法线偏移，负距离时反向。
 */
export function offsetItem(item: PathItem, distance: number,
        options?: OffsetOptions): PathItem {
    const join = options && options.join || 'miter',
        miterLimit = options && options.miterLimit || 10,
        path = prepare(item),
        paths = getPaths(path);
    let result: PathItem;
    if (!distance) {
        result = path;
    } else if ((item as CompoundPath)._children || item._closed) {
        const outline = outlineStroke(paths, abs(distance), join, 'butt',
                miterLimit);
        result = distance > 0 ? path.unite(outline)
                : path.subtract(outline);
    } else {
        result = reducePath(createCompoundPath((path as Path).isEmpty() ? []
                : offsetSide(path as Path, distance, join, miterLimit)));
    }
    return createResult(item, result, options);
}

/**
 * 返回路径项描边覆盖的区域。宽度只能来自 `options.width`（没有 Style），
 * 默认 0，调用方必须显式传入。
 */
export function outlineItem(item: PathItem,
        options?: OutlineOptions): PathItem {
    const opts = options || {},
        path = prepare(item),
        result = outlineStroke(getPaths(path),
            (opts.width || 0) / 2,
            opts.join || 'miter',
            opts.cap || 'butt',
            opts.miterLimit || 10);
    return createResult(item, reducePath(result), options);
}
