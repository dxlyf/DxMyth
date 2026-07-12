import { CubicBezier } from "./CubicBezier";
import { QuadraticBezier } from "./QuadraticBezier";
import { PathBuilder } from "./PathBuilder";
import { Point } from "./Point";

/**
 * 路径描边轮廓生成。
 *
 * 将一条任意路径（含 lineTo / quadTo / cubicTo / close）展开成一条闭合的填充轮廓，
 * 等价于把 CanvasRenderingContext2D.stroke() 的几何结果作为可 fill 的路径。
 *
 * 整体流程（参见 Skia PathStroker）：
 *   1. 把贝塞尔段 flatten 为折线，得到若干子路径（subPath）；
 *   2. 逐段计算单位法向量（prevUnitNormal / afterUnitNormal）；
 *   3. 在每个拐点用 joiner（miter / round / bevel）连接前后两段的外侧/内侧偏移点；
 *   4. 在子路径的起止两端用 capper（butt / round / square）封口；
 *   5. 外侧正向走完 → end cap → 内侧反向回走 → start cap → closePath。
 *
 * 关键约定（屏幕坐标系，Y 轴向下）：
 *   - 单位法向量 = 切线顺时针旋转 90° 后再取反，指向线段"左侧"；
 *   - 法向量乘以 radius 即得外侧偏移点，取反得内侧偏移点；
 *   - radius = lineWidth / 2。
 */


export enum LineJoin {
    Miter = 'miter',
    Round = 'round',
    Bevel = 'bevel'
}
export enum LineCap {
    Butt = 'butt',
    Round = 'round',
    Square = 'square'
}
export type StrokeOptions = {
    lineWidth?: number;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    miterLimit?: number;
    scale?: number;
}


function setNormalUnitNormal(
    before: Point,
    after: Point,
    scale: number,
    radius: number,
    normal: Point,
    unitNormal: Point,
): boolean {
    if (!unitNormal.setLengthTo((after.x - before.x) * scale, (after.y - before.y) * scale, 1)) {
        return false;
    }

    unitNormal.perpendicular().negate();
    normal.copy(unitNormal).multiplyScalar(radius);
    return true
}
type CapProc = (
    pivot: Point, // 上一个点
    normal: Point,
    stop: Point,
    otherPath: PathBuilder | null,
    path: PathBuilder,
) => void;

type JoinProc = (
    beforeUnitNormal: Point, //l0->l1 线段的，旋转-90度的单位法向量
    pivot: Point,// 上一个lineTo点
    afterUnitNormal: Point, // l1->l2 线段的，旋转-90度的单位法向量
    radius: number, // 线段宽的一半
    invMiterLimit: number,// 1/miter_limit   
    prevIsLine: boolean, // 上一个绘制命令是否是lineTo
    currIsLine: boolean, // 当前绘制命令是否是lineTo
    builders: SwappableBuilders,
) => void
/**
 * 处理内侧连接：先经过 pivot 点再连到偏移点。
 * 半径大于线段长度时，直接连接两段内侧会产生对角穿透，
 * 经过 pivot 点可避免该问题（代价是多一个点）。
 */
function handleInnerJoin(pivot: Point, after: Point, inner: PathBuilder) {
    inner.lineTo(pivot.x, pivot.y)
    inner.lineTo(pivot.x - after.x, pivot.y - after.y)
}

/**
 * 替换路径最后一个点为新坐标（用于 prevIsLine 时避免拐角处多余台阶）。
 */
function setLastPoint(path: PathBuilder, x: number, y: number) {
    const lp = path.lastPoint
    if (lp) {
        lp.x = x
        lp.y = y
    }
}

/**
 * 圆角连接：外侧用 arcTo 画一段半径为 radius 的圆弧，
 * 内侧仍走 pivot 点避免对角穿透。
 */
const roundJoin: JoinProc = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
    const dir = beforeUnitNormal.cross(afterUnitNormal)
    if (dir === 0) {
        return // 平行
    }

    // 角平分线方向 + miter 长度
    const cosh = beforeUnitNormal.dot(afterUnitNormal)
    const halfSin = Math.sqrt((1 + cosh) / 2)
    const miterLen = radius / halfSin

    // 准备外侧法向量（dir<0 时需翻转，使 n0/n1 指向凸角外侧）
    let n0 = beforeUnitNormal
    let n1 = afterUnitNormal
    if (dir < 0) {
        builders.swap()
        n0 = beforeUnitNormal.clone().negate()
        n1 = afterUnitNormal.clone().negate()
    }

    // 三点：前段外端、尖角、后段外端
    const p0 = Point.fromPoint(pivot).add(Point.fromPoint(n0).multiplyScalar(radius))
    const p1 = Point.fromPoint(pivot).add(Point.fromPoint(n1).multiplyScalar(radius))
    const mid = Point.fromPoint(n0).add(n1).normalize().multiplyScalar(miterLen).add(pivot)

    // prevIsLine 时替换前段终点，避免拐角处产生台阶
    if (prevIsLine) {
        setLastPoint(builders.outer, p0.x, p0.y)
    } else {
        builders.outer.lineTo(p0.x, p0.y)
    }
    builders.outer.arcTo(mid.x, mid.y, p1.x, p1.y, radius)

    // 内侧：经过 pivot 点再到内侧偏移点（避免半径大时对角穿透）
    handleInnerJoin(pivot, Point.fromPoint(n1).multiplyScalar(radius), builders.inner)
}
/**
 * 尖角连接：外侧连到前后两段法向量的角平分线延长点（miter 尖角点）。
 * 当尖角过尖（halfSin < invMiterLimit）时自动回落为 bevelJoin。
 */
const miterJoin: JoinProc = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
    const dir = beforeUnitNormal.cross(afterUnitNormal)
    if (dir === 0) {
        return // 平行
    }
    // 超过 miterLimit，转 bevel
    const cosh = beforeUnitNormal.dot(afterUnitNormal)
    const halfSin = Math.sqrt((1 + cosh) / 2)
    if (halfSin < invMiterLimit) {
        bevelJoin(beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders)
        return
    }

    // 准备外侧法向量（dir<0 时需翻转，使 n0/n1 指向凸角外侧）
    let n0 = beforeUnitNormal
    let n1 = afterUnitNormal
    if (dir < 0) {
        builders.swap()
        n0 = beforeUnitNormal.clone().negate()
        n1 = afterUnitNormal.clone().negate()
    }

    // miter 尖角点 = pivot + (n0+n1)归一化 * miterLen
    const miterLen = radius / halfSin
    const miterPt = Point.fromPoint(n0).add(n1).normalize().multiplyScalar(miterLen).add(pivot)

    // prevIsLine 时替换前段终点为 miter 尖角点，避免半径大时拐角处产生多余台阶
    if (prevIsLine) {
        setLastPoint(builders.outer, miterPt.x, miterPt.y)
    } else {
        builders.outer.lineTo(miterPt.x, miterPt.y)
    }
    // 非 lineTo 段需要补到 after 偏移点
    if (!currIsLine) {
        const afterPt = Point.fromPoint(pivot).add(Point.fromPoint(n1).multiplyScalar(radius))
        builders.outer.lineTo(afterPt.x, afterPt.y)
    }

    // 内侧：经过 pivot 点再到内侧偏移点（避免半径大时对角穿透）
    handleInnerJoin(pivot, Point.fromPoint(n1).multiplyScalar(radius), builders.inner)
}
/**
 * 斜角连接：外侧直接连到下一段外侧偏移点形成斜切角，
 * 内侧仍走 pivot 点。超过 miterLimit 的尖角会回落到这里。
 */
const bevelJoin: JoinProc = (beforeUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit, prevIsLine, currIsLine, builders) => {
    const dir = beforeUnitNormal.cross(afterUnitNormal)
    if (dir === 0) {
        return // 平行
    }
    const afterNormal = afterUnitNormal.clone().multiplyScalar(radius)
    if (dir < 0) {
        builders.swap()
        afterNormal.negate()
    }

    builders.outer.lineTo(pivot.x + afterNormal.x, pivot.y + afterNormal.y)
    // 内侧经过 pivot 点连接，避免半径大于线段长度时的对角穿透
    handleInnerJoin(pivot, afterNormal, builders.inner)
}
const buttCap: CapProc = (pivot, normal, stop, otherPath, path) => {
    // 直接连接到 stop（内侧端点）
    path.lineTo(stop.x, stop.y)
}
const squareCap: CapProc = (pivot, normal, stop, otherPath, path) => {
    // parallelNormal = normal 旋转 90°，即路径切线方向（向外延伸方向）
    const parallelNormal = normal.clone().perpendicular()
    const start = pivot.clone().add(parallelNormal).add(normal)
    const end = pivot.clone().add(parallelNormal).subtract(normal)
    if (otherPath) {
        // otherPath 非空表示该端连接的是 lineTo 段：
        // outer 的最后一点已是 lineTo 的外侧偏移点，这里应替换为 cap 角点，
        // 避免半径大时在 cap 起点产生台阶
        setLastPoint(path, start.x, start.y)
        path.lineTo(end.x, end.y)
    } else {
        path.lineTo(start.x, start.y)
        path.lineTo(end.x, end.y)
        path.lineTo(stop.x, stop.y)
    }
}
const roundCap: CapProc = (pivot, normal, stop, otherPath, path) => {
    // 用两段带权 conic（权重 √2/2）近似半圆
    const parallelNormal = normal.clone().perpendicular()
    const center = pivot.clone().add(parallelNormal)
    const start = center.clone().add(normal)
    path.conicTo(start.x, start.y, center.x, center.y, Math.SQRT1_2)
    start.copy(center).subtract(normal)
    path.conicTo(start.x, start.y, stop.x, stop.y, Math.SQRT1_2)
}
const joinFunc = {
    [LineJoin.Round]: roundJoin,
    [LineJoin.Miter]: miterJoin,
    [LineJoin.Bevel]: bevelJoin
}
const capFunc = {
    [LineCap.Butt]: buttCap,
    [LineCap.Round]: roundCap,
    [LineCap.Square]: squareCap
}

class SwappableBuilders {
    constructor(public inner: PathBuilder, public outer: PathBuilder) {
    }
    swap() {
        [this.inner, this.outer] = [this.outer, this.inner]
        return this
    }

}
export class PathStroke {
    static default() {
        return new this()
    }
    radius: number;
    lineJoin: LineJoin = LineJoin.Miter;
    lineCap: LineCap = LineCap.Butt;
    miterLimit: number = 10;
    invertMiterLimit: number = 1 / 10;
    declare outer: PathBuilder;
    declare inner: PathBuilder;

    segmentCount: number = 0;
    resScale: number = 1;
    invResScale = 1 // 逆分辨率缩放系数
    firstPoint: Point = Point.default();
    firstUnitNormal: Point = Point.default();
    firstNormal: Point = Point.default();

    prevPoint: Point = Point.default();
    prevUnitNormal: Point = Point.default();
    prevNormal: Point = Point.default();
    prevIsLine: boolean = false;

    firstOuterPoint: Point = Point.default();
    declare capper: CapProc
    declare joiner: JoinProc
    stroke(path: PathBuilder, options: StrokeOptions) {
        this.lineJoin = options.lineJoin ?? LineJoin.Miter;
        this.lineCap = options.lineCap ?? LineCap.Butt;
        this.miterLimit = options.miterLimit ?? 10;
        this.invertMiterLimit = 1 / this.miterLimit
        this.radius = (options.lineWidth ?? 1) / 2;
        this.resScale = options.scale ?? 1;
        this.invResScale = 1 / this.resScale
        this.outer = PathBuilder.default();
        this.inner = PathBuilder.default();
        this.capper = capFunc[this.lineCap]
        this.joiner = joinFunc[this.lineJoin]
        this.outer.reset()
        this.inner.reset()

        return this._stroke(path);
    }
    _stroke(path: PathBuilder) {
        let lastSegmentLine = false
        path.visit({
            moveTo: (p) => {
                this.moveTo(Point.fromPoint(p))
            },
            lineTo: (p0, p1) => {
                this.lineTo(Point.fromPoint(p1))
                lastSegmentLine = true
            },
            quadraticCurveTo: (p0, p1, p2) => {
                this.quadTo(Point.fromPoint(p1), Point.fromPoint(p2))
                lastSegmentLine = false
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                this.cubicTo(Point.fromPoint(p1), Point.fromPoint(p2), Point.fromPoint(p3))
                lastSegmentLine = false
            },
            close: () => {
                // 非 butt cap 退化情形：无任何线段时把 close 当作零长线段处理，
                // 以便 round/square cap 能画出一个点
                if (this.lineCap !== LineCap.Butt) {
                    if (this.segmentCount == 0) {
                        this.lineTo(this.firstPoint)
                        return
                    }
                }
                // 闭合路径：若末段未回到 firstPoint，先生成闭合边（如矩形 D→A）。
                // 这条边会触发倒数第二个拐角的 join，并让 finishContour
                // 在 firstPoint 处正确连接首尾（最后一个拐角）。
                // 否则闭合边缺失，finishContour 会在错误的 pivot 处 join。
                if (this.segmentCount > 0 && !this.prevPoint.equalsEpsilon(this.firstPoint, this.invResScale)) {
                    this.lineTo(this.firstPoint)
                    lastSegmentLine = true
                }
                this.close(lastSegmentLine)
            }
        })
        return this.finish(lastSegmentLine)
    }
    close(isLine: boolean) {
        this.finishContour(true, isLine);
    }
    moveTo(p: Point) {
        // 新子路径开始前，先结束上一条开放轮廓
        if (this.segmentCount > 0) {
            this.finishContour(false, false);
        }
        this.firstPoint.copy(p)
        this.prevPoint.copy(p)
        this.segmentCount = 0
    }
    lineTo(p: Point) {
        this.lineToCore(p, true, true)
    }
    quadTo(p0: Point, p1: Point) {
        // flatten 返回的点序列首点即曲线起点（== prevPoint），从下标 1 开始才是有效展平点
        const points = new QuadraticBezier([this.prevPoint, p0, p1]).flatten()
        let first = true
        for (let i = 1; i < points.length; i++) {
            // 第一个有效展平点与上一段做 join（真实段边界）；
            // 其余展平点为曲线内部线段，直接延伸偏移折线，不 join
            if (this.lineToCore(Point.fromPoint(points[i]), true, first)) {
                first = false
            }
        }
    }
    cubicTo(p0: Point, p1: Point, p2: Point) {
        const points = new CubicBezier([this.prevPoint, p0, p1, p2]).flatten()
        let first = true
        for (let i = 1; i < points.length; i++) {
            if (this.lineToCore(Point.fromPoint(points[i]), true, first)) {
                first = false
            }
        }
    }
    /**
     * 核心线段处理。
     * @param p            本段终点
     * @param currentIsLine 本段是否为 lineTo（曲线展平段也按 line 处理）
     * @param runJoin      是否在拐点执行 joiner。
     *                     真实段边界（lineTo↔lineTo、lineTo↔曲线起点）为 true；
     *                     曲线展平后的内部线段为 false，仅直接延伸内外侧偏移折线，
     *                     避免 handleInnerJoin 在平滑曲线上密集下探 pivot 产生小三角。
     * @returns 是否实际写入了该段（零长段返回 false）
     */
    private lineToCore(p: Point, currentIsLine: boolean, runJoin: boolean): boolean {
        // 近乎零长的线段直接跳过
        if (this.prevPoint.equalsEpsilon(p, this.invResScale)) {
            return false
        }
        const normal = Point.default()
        const unitNormal = Point.default()
        if (!setNormalUnitNormal(this.prevPoint, p, this.resScale, this.radius, normal, unitNormal)) {
            // 无法确定方向（零长）：butt cap 直接跳过；其余 cap 用退化法向
            if (this.capper === buttCap) {
                return false
            }
            normal.set(this.radius, 0)
            unitNormal.set(1, 0)
        }
        if (this.segmentCount === 0) {
            // 子路径第一条线段：记录首段法向，moveTo 到两侧偏移起点
            this.firstNormal.copy(normal)
            this.firstUnitNormal.copy(unitNormal)
            this.firstOuterPoint.copy(this.prevPoint).add(normal)
            this.outer.moveTo(this.prevPoint.x + normal.x, this.prevPoint.y + normal.y)
            this.inner.moveTo(this.prevPoint.x - normal.x, this.prevPoint.y - normal.y)
        } else if (runJoin && this.joiner) {
            // 真实段边界：用 joiner 处理拐角（miter/round/bevel + 内侧 pivot 下探）
            (this.joiner)(
                this.prevUnitNormal,
                this.prevPoint,
                unitNormal,
                this.radius,
                this.invertMiterLimit,
                this.prevIsLine,
                currentIsLine,
                new SwappableBuilders(this.inner, this.outer),
            )
        }
        // 写入本段终点对应的两侧偏移点：
        // - 首段：moveTo 起点 + lineTo 终点
        // - join 段：joiner 已处理拐角起点，lineTo 终点
        // - 曲线内部段：直接 lineTo 终点（无 join，无 pivot 下探 → 无小三角）
        this.outer.lineTo(p.x + normal.x, p.y + normal.y)
        this.inner.lineTo(p.x - normal.x, p.y - normal.y)
        this.prevNormal.copy(normal)
        this.prevUnitNormal.copy(unitNormal)
        this.prevPoint.copy(p)
        this.prevIsLine = currentIsLine
        this.segmentCount++
        return true
    }

    finishContour(close: boolean, currIsLine: boolean) {
        // 仅在有实际线段时才生成轮廓；否则跳过（避免 close 后 finish 重复处理，
        // 也避免空 moveTo 产生退化 cap）
        if (this.segmentCount > 0) {
            if (close) {
                
                // 闭合路径：用 joiner 连接首尾，outer 闭合；inner 作为独立轮廓反向追加
                (this.joiner)(
                    this.prevUnitNormal,
                    this.prevPoint,
                    this.firstUnitNormal,
                    this.radius,
                    this.invertMiterLimit,
                    this.prevIsLine,
                    currIsLine,
                    new SwappableBuilders(this.inner, this.outer),
                );
                this.outer.closePath();

                let pt = this.inner.lastPoint ?? Point.create(0, 0);
                this.outer.moveTo(pt.x, pt.y);
                this.outer.reversePathTo(this.inner);
                this.outer.closePath();
            } else {
                // 开放路径：end cap → 反向 inner → start cap → 闭合
                let otherPath = currIsLine ? this.inner : null;
                let lastPoint = this.inner.lastPoint ? Point.fromPoint(this.inner.lastPoint) : Point.default()
                this.capper(this.prevPoint, this.prevNormal, lastPoint, otherPath, this.outer)

                this.outer.reversePathTo(this.inner)

                otherPath = this.prevIsLine ? this.inner : null;
                this.capper(this.firstPoint, this.firstNormal.clone().negate(), this.firstOuterPoint, otherPath, this.outer)

                this.outer.closePath()
            }
        }
        // inner 为临时缓冲，每条轮廓结束后清空以便复用（多轮廓路径必需）
        this.inner.reset();
        this.segmentCount = -1;
    }
    finish(currIsLine: boolean) {
        this.finishContour(false, currIsLine)
        return this.outer
    }
}