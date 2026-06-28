import { Point, type PointLike } from './Point'
import { getQuadraticBezierBounds, QuadraticBezier } from './QuadraticBezier'
import { getCubicBezierBounds, CubicBezier } from './CubicBezier'
import { BoundingRect } from './BoundingRect'
import { normalizeAngles } from './Arc'

import { windCubicBezier, windLine, windQuadraticBezier } from './PathIntersection'
import { Matrix2DLike } from './Matrix2D'
import { Matrix2D } from './Matrix2D'
import { fromSvgPath } from './ParseSvgPath'
import {PathStroke} from './PathStroke'

export enum PathVerb {
    MoveTo = 1<<0,
    LineTo = 1<<1,
    QuadraticTo = 1<<2,
    CubicTo = 1<<3,
    Close = 1<<4,
}
export const PathSegmentType={
    Arc:1<<0,  
    Rect:1<<1,
    Ellipse:1<<2,
    RoundRect:1<<3
}
export const PathVerbCount={
    [PathVerb.MoveTo]:1,
    [PathVerb.LineTo]:1,
    [PathVerb.QuadraticTo]:2,
    [PathVerb.CubicTo]:3,
    [PathVerb.Close]:0,
}
export enum PathCmd{
    M='M', // 移动到
    L='L', // 直线
    Q='Q', // 二次贝塞尔曲线
    C='C', // 三次贝塞尔曲线
    Z='Z', // 关闭路径
    A='A', // 圆弧线
    R='R', // 矩形
    E='E',// 椭圆
    RR='RR',// 圆角矩形
}
type PathVisitCallbacks = {
    moveTo?: (point: PointLike) => void
    lineTo?: (start: PointLike, end: PointLike) => void
    quadraticCurveTo?: (p0: PointLike, p1: PointLike, p2: PointLike) => void
    cubicCurveTo?: (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike) => void
    close?: (lastPoint: PointLike, movePoint: PointLike) => void
}



export enum PathDirection {
    CW,
    CCW,
    Unknown = 0x7FFFFFFF,
}
export class PathBuilder {
    static fromSvgPath(svgPath: string) {
        return fromSvgPath(svgPath)
    }
    static default(){
        return new PathBuilder()
    }
    _enableCmd=true // 是否记录路径命令
    cmds:[number|string,...any[]][]
    verbs: PathVerb[] // 路径命令
    points: PointLike[]// 路径点
    lastMoveIndex: number = -1 // 最后一个移动点的索引
    needMoveTo: boolean = true // 是否需要移动到下一个点
    segmentType: number = 0 // 路径段类型
    /** 包围盒缓存（null 表示未计算或路径为空） */
    private _bounds: BoundingRect | null = null
    /** 紧凑包围盒缓存（null 表示未计算或路径为空） */
    private _tightBounds: BoundingRect | null = null
    /** 包围盒是否需要重新计算 */
    private _boundsDirty: boolean = true
    private _tightBoundsDirty:boolean=true
    /**路径发生变变化 */
    drity: boolean = false
    constructor(path?:PathBuilder|string) {
        this.verbs = []
        this.points = []
        this.cmds = []
        if(path instanceof PathBuilder) {
            this.copy(path)
        }else if(typeof path === 'string') {
            this.copy(fromSvgPath(path))
        } 
    }
    get lastVerb() {
        return this.verbs[this.verbs.length - 1]
    }
    get lastPoint() {
        return this.points[this.points.length - 1]
    }
    get lastMovePoint() {
        return this.points[this.lastMoveIndex]
    }
    get size() {
        return this.verbs.length
    }
    enableCmd(enable:boolean){
        this._enableCmd=enable
    }
    clone() {
        const path = new PathBuilder()
        path.copy(this)
        return path
    }
    copy(path: PathBuilder) {
        this.cmds = path.cmds.map(d=>d.slice()) as any
        this.verbs = path.verbs.slice()
        this.points = path.points.map((p) => ({ x: p.x, y: p.y }))
        this.lastMoveIndex = path.lastMoveIndex
        this.needMoveTo = path.needMoveTo
        this.segmentType = path.segmentType
        this.drity = path.drity
        this._boundsDirty = path._boundsDirty
    }
    reset() {
        this.cmds = []
        this.verbs = []
        this.points = []
        this.lastMoveIndex = -1
        this.segmentType = 0
        this.needMoveTo = true
        this.drity = true
        this._boundsDirty = true
        this._tightBoundsDirty = true
    }
    addCmd(cmd:number|string,...args:any[]){
        if(this._enableCmd){
            this.cmds.push([cmd,...args])
        }
    }
    setLastCmd(cmd:number|string,...args:any[]){
        if(this._enableCmd){
            this.cmds[this.cmds.length-1]=[cmd,...args]
        }
    }
    markDirty() {
        this.drity = true
        this._boundsDirty = true
        this._tightBoundsDirty = true
    }
    transform(matrix: Matrix2DLike) {
        Matrix2D.mapPoints(this.points, matrix, this.points)
        this.markDirty()
    }
    addPath(path: PathBuilder, matrix?: Matrix2DLike) {
        path = path.clone()
        if (matrix) {
            path.transform(matrix)
        }
        const len = this.points.length
        this.segmentType |= path.segmentType
        this.lastMoveIndex = len + path.lastMoveIndex
        this.needMoveTo = path.needMoveTo
        this.verbs = this.verbs.concat(path.verbs)
        this.points = this.points.concat(path.points)
        this.markDirty()
    }
    addReversePath(path: PathBuilder) {
        path.invertVisit({
            moveTo: (p) => {
                this.moveTo(p.x, p.y)
            },
            lineTo: (p0, p1) => {
                this.lineTo(p1.x, p1.y)
            },
            quadraticCurveTo: (p0, p1, p2) => {
                this.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y)
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                this.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
            },
            close: () => {
                this.closePath()
            }
        })
    }
    // ignore move
    reversePathTo(other: PathBuilder) {
        if (other.isEmpty) {
            return;
        }
        other.invertVisit({
            moveTo: (p) => {

            },
            lineTo: (p0, p1) => {
                this.lineTo(p1.x, p1.y)
            },
            quadraticCurveTo: (p0, p1, p2) => {
                this.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y)
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                this.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
            },
            close: () => {
                this.closePath()
            }
        })
    }
    offset(x: number, y: number) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x += x
            this.points[i].y += y

        }
    }

    get isEmpty() {
        return this.verbs.length === 0
    }
    ensureMove() {
        if (this.needMoveTo) {
            if (this.isEmpty) {
                this.moveTo(0, 0)
            } else {
                this.moveTo(this.lastPoint.x, this.lastPoint.y)
            }
        }
    }
    moveTo(x: number, y: number) {
        if (this.lastVerb === PathVerb.MoveTo) {
            this.lastPoint.x = x
            this.lastPoint.y = y   
            this.setLastCmd(PathCmd.M,x,y)
        } else {
            this.verbs.push(PathVerb.MoveTo)
            this.points.push({ x, y })
            this.addCmd(PathCmd.M,x,y)
        }
        this.lastMoveIndex = this.points.length - 1
        this.needMoveTo = false
        this.markDirty()
    }
    lineTo(x: number, y: number) {
        this.ensureMove()
        this.verbs.push(PathVerb.LineTo)
        this.points.push({ x, y })
        this.addCmd(PathCmd.L,x,y)
        this.markDirty()
    }
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number) {
        this.ensureMove()
        this.verbs.push(PathVerb.QuadraticTo)
        this.points.push({ x: cpX, y: cpY })
        this.points.push({ x, y })
        this.addCmd(PathCmd.Q,cpX,cpY,x,y)
        this.markDirty()
    }
    bezierCurveTo(cpX1: number, cpY1: number, cpX2: number, cpY2: number, x: number, y: number) {
        this.ensureMove()
        this.verbs.push(PathVerb.CubicTo)
        this.points.push({ x: cpX1, y: cpY1 })
        this.points.push({ x: cpX2, y: cpY2 })
        this.points.push({ x, y })
        this.addCmd(PathCmd.C,cpX1,cpY1,cpX2,cpY2,x,y)
        this.markDirty()
    }
    conicTo(cpX: number, cpY: number, x: number, y: number, weight: number) {
        const k = (4 * weight) / (3 * (weight + 1))
        const lastPoint = this.lastPoint
        const cp1X = lastPoint.x + (cpX - lastPoint.x) * k
        const cp1Y = lastPoint.y + (cpY - lastPoint.y) * k
        const cp2X = x + (cpX - x) * k
        const cp2Y = y + (cpY - y) * k
        this.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y);
    }
    rect(x: number, y: number, width: number, height: number) {
        let prev_enableCmd=this._enableCmd
        this.enableCmd(false)
        this.moveTo(x, y)
        this.lineTo(x + width, y)
        this.lineTo(x + width, y + height)
        this.lineTo(x, y + height)
        this.lineTo(x, y)
        this.enableCmd(prev_enableCmd)
        this.addCmd(PathCmd.R,x,y,width,height)
        this.segmentType |= PathSegmentType.Rect
    }

    /**
     * 添加圆弧路径
     *
     * 将圆弧分成最多 90° 一段，每段用三次贝塞尔曲线近似。
     * 近似公式：k = 4/3 * tan(θ/4)，控制点沿切线方向偏移 k * radius。
     *
     * @param x - 圆心 X
     * @param y - 圆心 Y
     * @param radius - 半径
     * @param startAngle - 起始角度（弧度）
     * @param endAngle - 结束角度（弧度）
     * @param counterclockwise - 是否逆时针（默认顺时针）
     */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false): void {
        let prev_enableCmd=this._enableCmd
        this.enableCmd(false)
        const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise)

        const delta = endNorm - startNorm

        // 每段最多 90°，保证贝塞尔近似精度
        const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)))
        const segAngle = delta / segments

        let currentAngle = startNorm
        for (let i = 0; i < segments; i++) {
            const segStart = currentAngle
            const segEnd = currentAngle + segAngle

            const startX = x + radius * Math.cos(segStart)
            const startY = y + radius * Math.sin(segStart)

            if (i === 0) {
                // 与 Canvas API 一致：有子路径则 lineTo 到起点，否则 moveTo
                if (this.isEmpty) {
                    this.moveTo(startX, startY)
                } else {
                    this.lineTo(startX, startY)
                }
            }

            // 三次贝塞尔近似圆弧段（k = 4/3 * tan(θ/4)）
            const theta = segAngle
            const k = (4 / 3) * Math.tan(theta / 4)

            // 起点控制点：沿起点切线方向外推
            const cp1X = startX - k * radius * Math.sin(segStart)
            const cp1Y = startY + k * radius * Math.cos(segStart)

            const endX = x + radius * Math.cos(segEnd)
            const endY = y + radius * Math.sin(segEnd)

            // 终点控制点：沿终点切线方向回推
            const cp2X = endX + k * radius * Math.sin(segEnd)
            const cp2Y = endY - k * radius * Math.cos(segEnd)

            this.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
            currentAngle = segEnd
        }
        this.enableCmd(prev_enableCmd)
        this.addCmd(PathCmd.A,x,y,radius,startAngle,endAngle,counterclockwise)
        this.segmentType |= PathSegmentType.Arc
    }

    /**
     * 添加椭圆路径
     *
     * 参数化：E(t) = center + R(rotation) * (rx·cos(t), ry·sin(t))
     * 每段用三次贝塞尔曲线近似，控制点沿切线方向偏移。
     *
     * @param x - 椭圆中心 X
     * @param y - 椭圆中心 Y
     * @param radiusX - X 轴半径
     * @param radiusY - Y 轴半径
     * @param rotation - 旋转角度（弧度）
     * @param startAngle - 起始角度（弧度）
     * @param endAngle - 结束角度（弧度）
     * @param counterclockwise - 是否逆时针（默认顺时针）
     */
    ellipse(
        x: number, y: number,
        radiusX: number, radiusY: number,
        rotation: number,
        startAngle: number, endAngle: number,
        counterclockwise = false,
    ): void {
        let prev_enableCmd=this._enableCmd
        this.enableCmd(false)
        const { startAngle: startNorm, endAngle: endNorm } = normalizeAngles(startAngle, endAngle, counterclockwise)

        const delta = endNorm - startNorm
        const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)))
        const segAngle = delta / segments

        const cosRot = Math.cos(rotation)
        const sinRot = Math.sin(rotation)

        let currentAngle = startNorm
        for (let i = 0; i < segments; i++) {
            const segStart = currentAngle
            const segEnd = currentAngle + segAngle

            // 参数化椭圆点，含旋转
            const cosStart = Math.cos(segStart)
            const sinStart = Math.sin(segStart)
            const startX = x + cosRot * radiusX * cosStart - sinRot * radiusY * sinStart
            const startY = y + sinRot * radiusX * cosStart + cosRot * radiusY * sinStart

            if (i === 0) {
                if (this.isEmpty) {
                    this.moveTo(startX, startY)
                } else {
                    this.lineTo(startX, startY)
                }
            }

            // 三次贝塞尔近似椭圆弧段
            const theta = segAngle
            const k = (4 / 3) * Math.tan(theta / 4)

            // 端点沿切线方向偏移，切线方向为旋转后的 (-rx·sin(t), ry·cos(t))
            const tanX1 = -radiusX * sinStart
            const tanY1 = radiusY * cosStart
            const cp1X = startX + k * (cosRot * tanX1 - sinRot * tanY1)
            const cp1Y = startY + k * (sinRot * tanX1 + cosRot * tanY1)

            const cosEnd = Math.cos(segEnd)
            const sinEnd = Math.sin(segEnd)
            const endX = x + cosRot * radiusX * cosEnd - sinRot * radiusY * sinEnd
            const endY = y + sinRot * radiusX * cosEnd + cosRot * radiusY * sinEnd

            const tanX2 = -radiusX * sinEnd
            const tanY2 = radiusY * cosEnd
            const cp2X = endX - k * (cosRot * tanX2 - sinRot * tanY2)
            const cp2Y = endY - k * (sinRot * tanX2 + cosRot * tanY2)

            this.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
            currentAngle = segEnd
        }
        this.enableCmd(prev_enableCmd)
        this.addCmd(PathCmd.E,x,y,radiusX,radiusY,rotation,startAngle,endAngle,counterclockwise)
        this.segmentType |= PathSegmentType.Ellipse
    }

    /**
     * 添加圆弧连接（arcTo）
     *
     * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
     * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
     * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
     *
     * @param x1 - 第一条切线的终点 X
     * @param y1 - 第一条切线的终点 Y
     * @param x2 - 第二条切线的终点 X
     * @param y2 - 第二条切线的终点 Y
     * @param radius - 圆弧半径
     */
    arcToConic(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.ensureMove()

        if (radius === 0) {
            this.lineTo(x1, y1)
            return
        }
        const lastPoint = this.lastPoint
        const p0 = Point.fromPoint(lastPoint)
        const p1 = Point.create(x1, y1)
        const p2 = Point.create(x2, y2)

        let d0 = p1.clone().subtract(p0).normalize()
        let d1 = p2.clone().subtract(p1).normalize()
        let cosh = d0.dot(d1)
        let sinh = d0.cross(d1)

        // 如果是水平
        if (!d0.isFinite() || !d1.isFinite() || Math.abs(sinh) <= 1e-6) {
            return this.lineTo(x1, y1);
        }

        // 计算一半正切 (1-cos)/sin)=tan(angle/2)
        // 半径*正切=等夹角高度
        let dist = Math.abs(radius * (1 - cosh) / sinh)
        let start = p1.clone().subtract(d0.multiplyScalar(dist))
        let end = p1.clone().add(d1.multiplyScalar(dist))
        let weight = Math.sqrt(0.5 + cosh * 0.5);
        this.lineTo(start.x, start.y)
        this.conicTo(x1, y1, end.x, end.y, weight)
    }
    /**
     * 添加圆弧连接（arcTo）
     *
     * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
     * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
     * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
     *
     * @param x1 - 第一条切线的终点 X
     * @param y1 - 第一条切线的终点 Y
     * @param x2 - 第二条切线的终点 X
     * @param y2 - 第二条切线的终点 Y
     * @param radius - 圆弧半径
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.ensureMove()
        const p0 = this.lastPoint
        const p0x = p0.x
        const p0y = p0.y

        // 向量 p0->p1 和 p1->p2
        const dx1 = x1 - p0x
        const dy1 = y1 - p0y
        const dx2 = x2 - x1
        const dy2 = y2 - y1

        // 计算两条边的长度
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

        if (len1 < 1e-10 || len2 < 1e-10 || radius < 1e-10) {
            this.lineTo(x1, y1)
            return
        }

        // 单位方向向量
        const ux1 = dx1 / len1
        const uy1 = dy1 / len1
        const ux2 = dx2 / len2
        const uy2 = dy2 / len2

        // 两条边之间的夹角（0 到 π）
        const cosAngle = ux1 * ux2 + uy1 * uy2
        const sinAngle = ux1 * uy2 - uy1 * ux2

        // 平行或接近平行时，直接 lineTo 到 (x1, y1)
        if (Math.abs(sinAngle) < 1e-10) {
            this.lineTo(x1, y1)
            return
        }

        // 符号：顺时针为 -1，逆时针为 +1
        const sign = sinAngle > 0 ? 1 : -1
        // 圆心到拐角的距离（沿角平分线方向）
        const d = Math.abs(radius * Math.tan(Math.acos(cosAngle) / 2))

        // 切点位置
        const t1x = x1 - d * ux1
        const t1y = y1 - d * uy1
        const t2x = x1 + d * ux2
        const t2y = y1 + d * uy2

        // 圆心
        // 从切点沿法线方向偏移 radius，法线方向 = 切线方向旋转 90°
        const nx = -uy1
        const ny = ux1
        const cx = t1x + sign * radius * nx
        const cy = t1y + sign * radius * ny

        // 起始角度和结束角度
        const startAngle = Math.atan2(t1y - cy, t1x - cx)
        const endAngle = Math.atan2(t2y - cy, t2x - cx)

        // 先 lineTo 到第一个切点
        this.lineTo(t1x, t1y)

        // 绘制圆弧
        const counterclockwise = sign < 0
        this.arc(cx, cy, radius, startAngle, endAngle, counterclockwise)
    }

    /**
     * 添加圆角矩形路径
     *
     * 支持统一圆角或多个圆角分别指定。
     *
     * @param x - 矩形左上角 X
     * @param y - 矩形左上角 Y
     * @param w - 矩形宽度
     * @param h - 矩形高度
     * @param radii - 圆角半径（支持多种格式）
     *   - number: 所有角统一半径
     *   - [all]: 四个角统一半径 [r]
     *   - [tl, br]: 左上和右下相同，右上和左下相同
     *   - [tl, tr, br, bl]: 分别指定四个角
     */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void {
        let prev_enableCmd=this._enableCmd
        this.enableCmd(false)
        // 解析圆角参数
        let r = 0
        let r2 = 0
        let r3 = 0
        let r4 = 0

        if (radii === undefined || radii === 0) {
            // 无圆角，就是普通矩形
            this.rect(x, y, w, h)
            return
        }

        if (typeof radii === 'number') {
            r = r2 = r3 = r4 = Math.min(radii, Math.min(w, h) / 2)
        } else {
            const arr = radii
            const len = arr.length
            if (len === 0) {
                this.rect(x, y, w, h)
                return
            }
            const maxR = Math.min(w, h) / 2
            r = Math.min(arr[0], maxR)
            if (len === 1) {
                r2 = r3 = r4 = r
            } else if (len === 2) {
                r2 = Math.min(arr[1], maxR)
                r3 = r
                r4 = r2
            } else if (len === 3) {
                r2 = Math.min(arr[1], maxR)
                r3 = Math.min(arr[2], maxR)
                r4 = r2
            } else {
                r2 = Math.min(arr[1], maxR)
                r3 = Math.min(arr[2], maxR)
                r4 = Math.min(arr[3], maxR)
            }
        }

        // 使用 arcTo 和 lineTo 构建圆角矩形
        this.moveTo(x + r, y)

        // 上边 → 右上角
        this.lineTo(x + w - r2, y)
        if (r2 > 0) this.arcTo(x + w, y, x + w, y + r2, r2)

        // 右边 → 右下角
        this.lineTo(x + w, y + h - r3)
        if (r3 > 0) this.arcTo(x + w, y + h, x + w - r3, y + h, r3)

        // 下边 → 左下角
        this.lineTo(x + r4, y + h)
        if (r4 > 0) this.arcTo(x, y + h, x, y + h - r4, r4)

        // 左边 → 左上角
        this.lineTo(x, y + r)
        if (r > 0) this.arcTo(x, y, x + r, y, r)

        this.closePath()
        this.enableCmd(prev_enableCmd)
        this.addCmd(PathCmd.RR,x,y,w,h,radii)
        this.segmentType |= PathSegmentType.RoundRect
    }

    /**
     * 添加 SVG 椭圆弧路径（SVG Arc A/a 命令转换）
     *
     * 将 SVG 弧线的端点参数化（起点+终点+半径+旋转+大弧/扫掠标志）
     * 转换为中心参数化（圆心+半径+起始/终止角度），再委托 ellipse() 绘制。
     *
     * 算法遵循 SVG 规范：
     *   https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
     *
     * @param x1 - 起点 X
     * @param y1 - 起点 Y
     * @param x2 - 终点 X
     * @param y2 - 终点 Y
     * @param rx - X 轴半径
     * @param ry - Y 轴半径
     * @param rotation - 椭圆的旋转角度（弧度）
     * @param largeArcFlag - true=大弧, false=小弧
     * @param sweepFlag - true=顺时针, false=逆时针
     */
    ellipseSvgArc(
        x1: number, y1: number, x2: number, y2: number,
        rx: number, ry: number, rotation: number,
        largeArcFlag: boolean, sweepFlag: boolean,
    ): void {
        // 起点终点重合时跳过
        if (Math.abs(x1 - x2) < 1e-10 && Math.abs(y1 - y2) < 1e-10) return

        // 半轴取绝对值
        rx = Math.abs(rx)
        ry = Math.abs(ry)
        if (rx < 1e-10 || ry < 1e-10) {
            this.lineTo(x2, y2)
            return
        }

        const cosRot = Math.cos(rotation)
        const sinRot = Math.sin(rotation)

        // (1) 变换到未旋转坐标系
        const dx = (x1 - x2) / 2
        const dy = (y1 - y2) / 2
        const x1p = cosRot * dx + sinRot * dy
        const y1p = -sinRot * dx + cosRot * dy

        // (2) 确保半径足够大（缩放半轴）
        const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
        if (lambda > 1) {
            const sqrtLambda = Math.sqrt(lambda)
            rx *= sqrtLambda
            ry *= sqrtLambda
        }

        // (3) 计算未旋转坐标系下的圆心 (cxp, cyp)
        const rx2 = rx * rx
        const ry2 = ry * ry
        const x1p2 = x1p * x1p
        const y1p2 = y1p * y1p
        const sqrtArg = Math.max(0,
            (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2),
        )
        const sign = largeArcFlag !== sweepFlag ? 1 : -1
        const sqrtVal = Math.sqrt(sqrtArg)
        const cxp = sign * sqrtVal * (rx * y1p / ry)
        const cyp = sign * sqrtVal * (-ry * x1p / rx)

        // (4) 变换回原始坐标系得到 (cx, cy)
        const cx = cosRot * cxp - sinRot * cyp + (x1 + x2) / 2
        const cy = sinRot * cxp + cosRot * cyp + (y1 + y2) / 2

        // (5) 计算起止角度（在未旋转椭圆坐标系下，除以半轴做归一化）
        const ux = (x1p - cxp) / rx
        const uy = (y1p - cyp) / ry
        const vx = (-x1p - cxp) / rx
        const vy = (-y1p - cyp) / ry
        const startAngle = Math.atan2(uy, ux)
        const endAngle = Math.atan2(vy, vx)

        // SVG sweepFlag=1 表示顺时针，对应 ellipse() 的 counterclockwise=false
        this.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, !sweepFlag)
    }

    closePath() {
        
        if (!this.isEmpty) {
            if (this.lastVerb !== PathVerb.Close) {
                this.verbs.push(PathVerb.Close)
                this.addCmd(PathCmd.Z)
            }
            this.needMoveTo = true
        }
    }
    /**
     * 判断点是否在路径填充区域内
     *
     * 先用包围盒快速拒绝，再根据填充规则用绕数法判断：
     * - 'nonzero'（默认）：绕数不为 0 则在内部
     * - 'evenodd'：绕数为奇数则在内部
     *
     * @param px - 测试点 X
     * @param py - 测试点 Y
     * @param fillRule - 填充规则，默认 'nonzero'
     */
    isPointInPath(px: number, py: number, fillRule: 'nonzero' | 'evenodd' = 'nonzero'): boolean {
        // 快速拒绝：点不在包围盒内则一定不在路径内
        const bounds = this.computeTightBounds()
        if (!bounds || !bounds.containsXY(px, py)) {
            return false
        }

        let wind = 0
        this.visit({
            lineTo: (start, end) => {
                wind += windLine(px, py, start.x, start.y, end.x, end.y)
            },
            quadraticCurveTo: (p0, p1, p2) => {
                wind += windQuadraticBezier(px, py,
                    p0,
                    p1,
                    p2,
                )
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                wind += windCubicBezier(px, py,
                    p0,
                    p1,
                    p2,
                    p3,
                )
            },
            close: (lastPoint, movePoint) => {
                if (!Point.equalsEpsilon(lastPoint, movePoint)) {
                    wind += windLine(px, py, lastPoint.x, lastPoint.y, movePoint.x, movePoint.y)
                }
            },
        })
        return fillRule === 'evenodd' ? (wind & 1) !== 0 : wind !== 0
    }
    invertVisit(visitor: PathVisitCallbacks) {
        const points = this.points, verbs = this.verbs
        let lastMoveIndex = 0, needMove = true, needClose = false;
        let lastPont = Point.create()
        for (let i = verbs.length - 1, k = points.length; i >= 0; i--) {
            let verb = verbs[i]
            if (needMove) {
                k -= 1
                needMove = false
                visitor.moveTo?.(points[k])
                lastPont.copy(points[k])
                lastMoveIndex = k
            }
            switch (verb) {
                case PathVerb.MoveTo:
                    if (needClose) {
                        visitor.close?.(lastPont, points[lastMoveIndex])
                        needClose = false
                    }
                    needMove = true
                    break;
                case PathVerb.LineTo:
                    k -= 1
                    visitor.lineTo?.(lastPont, points[k])
                    lastPont.copy(points[k])
                    break;
                case PathVerb.QuadraticTo:
                    k -= 2
                    visitor.quadraticCurveTo?.(lastPont, points[k + 1], points[k])
                    lastPont.copy(points[k])
                    break;
                case PathVerb.CubicTo:
                    k -= 3
                    visitor.cubicCurveTo?.(lastPont, points[k + 2], points[k + 1], points[k])
                    lastPont.copy(points[k])
                    break;
                case PathVerb.Close:
                    needClose = true
                    break;
            }
        }

    }
    visit(cbs: PathVisitCallbacks) {
        const points = this.points
        const size = this.size
        let k = 0, movePoint = Point.default()
        for (let i = 0; i < size; i++) {
            const verb = this.verbs[i]
            const len = PathVerbCount[verb]
            k += len
            switch (verb) {
                case PathVerb.MoveTo:
                    movePoint.copy(points[k - 1])
                    cbs.moveTo?.(points[k - 1])
                    break
                case PathVerb.LineTo:
                    cbs.lineTo?.(points[k - 2], points[k - 1])
                    break
                case PathVerb.QuadraticTo:
                    cbs.quadraticCurveTo?.(points[k - 3], points[k - 2], points[k - 1])
                    break
                case PathVerb.CubicTo:
                    cbs.cubicCurveTo?.(points[k - 4], points[k - 3], points[k - 2], points[k - 1])
                    break
                case PathVerb.Close:
                    cbs.close?.(points[k - 1], movePoint)
                    break

            }
        }
    }
    /**
     * 计算路径的包围盒（带缓存）
     * 路径未变化时返回缓存，避免重复遍历。
     * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
     */
    computeBounds(){
        if(!this._boundsDirty){
            return this._bounds
        }
        if(!this._bounds){
            this._bounds=BoundingRect.default()
        }
        this._bounds.setEmpty()
        this.points.forEach((p) => {
            this._bounds.fromPoint(p)
        })
        if(this.isEmpty){
            this._bounds.set(0, 0, 0, 0)
        }
        this._boundsDirty = false
        return this._bounds
    }
    /**
     * 计算路径的紧凑包围盒（带缓存）
     *
     * 路径未变化时返回缓存，避免重复遍历。
     * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
     */
    computeTightBounds(): BoundingRect | null {
        if (!this._tightBoundsDirty) {
            return this._tightBounds
        }
        if(!this._tightBounds){
            this._tightBounds=BoundingRect.default()
        }
        let hasPoints = false
        this._tightBounds.setEmpty()
        const update = (x: number, y: number) => {
            this._tightBounds.fromPoint({ x, y })
            hasPoints = true
        }

        this.visit({
            moveTo: (p) => update(p.x, p.y),
            lineTo: (start, end) => {
                update(end.x, end.y)
            },
            quadraticCurveTo: (p0, p1, p2) => {
                const b = getQuadraticBezierBounds(p0, p1, p2)
                update(b.minX, b.minY)
                update(b.maxX, b.maxY)
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                const b = getCubicBezierBounds(
                    p0, p1, p2, p3,
                )
                update(b.minX, b.minY)
                update(b.maxX, b.maxY)
            }
        })

        if (!hasPoints) {
            this._tightBounds.set(0, 0, 0, 0)
        }
        this._tightBoundsDirty = false
        return this._tightBounds
    }
    toPolygons(autoClose: boolean = false, epsilon = 0.5) {
        const paths: PointLike[][] = []
        let subPath: PointLike[] = []
        let lastMovePoint = Point.create()
        const handleAutoClose = () => {
            if (autoClose && !Point.equalsEpsilon(subPath[subPath.length - 1], lastMovePoint)) {
                subPath.push({ x: lastMovePoint.x, y: lastMovePoint.y })
            }
        }
        this.visit({
            moveTo: (p) => {
                if (subPath.length > 0) {
                    handleAutoClose()
                    paths.push(subPath)
                    subPath = []
                }
                lastMovePoint.copy(p)
                subPath.push({ x: p.x, y: p.y })
            },
            lineTo: (start, end) => {
                subPath.push({ x: end.x, y: end.y })
            },
            quadraticCurveTo: (p0, p1, p2) => {
                const quad = new QuadraticBezier([p0, p1, p2])
                quad.flatten(epsilon).forEach(p => {
                    subPath.push(p)
                })
            },
            cubicCurveTo: (p0, p1, p2, p3) => {
                const quad = new CubicBezier([p0, p1, p2, p3])
                quad.flatten(epsilon).forEach(p => {
                    subPath.push(p)
                })
            },
            close: (lastPoint, movePoint) => {
                handleAutoClose()
                paths.push(subPath)
                subPath = []
            }
        })
        if (subPath.length > 0) {
            handleAutoClose()
        }
        return paths
    }
    getPath2D() {
        const path = new window.Path2D()
        this.toCanvasPath2D(path)
        return path
    }
    toCanvasPath2D(path:CanvasRenderingContext2D|Path2D=new Path2D()){
        this.visit({
            moveTo: (p) => path.moveTo(p.x, p.y),
            lineTo: (start, end) => path.lineTo(end.x, end.y),
            quadraticCurveTo: (p0, p1, p2) => path.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y),
            cubicCurveTo: (p0, p1, p2, p3) => path.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y),
            close: (lastPoint, movePoint) => path.closePath(),
        })
        return path
    }
    toCanvasPath2DFromCmds(path:CanvasRenderingContext2D|Path2D){
        
        this.cmds.forEach(cmdData => {
            const [cmd, ...args] = cmdData
            switch (cmd) {
                case PathCmd.M:
                    path.moveTo(args[0],args[1])
                    break
                case PathCmd.L:
                    path.lineTo(args[0],args[1])
                    break
                case PathCmd.Q:
                    path.quadraticCurveTo(args[0],args[1],args[2],args[3])
                    break
                case PathCmd.C:
                    path.bezierCurveTo(args[0],args[1],args[2],args[3],args[4],args[5])
                    break
                case PathCmd.A:
                    path.arc(args[0],args[1],args[2],args[3],args[4],args[5])
                    break
                case PathCmd.E:
                    path.ellipse(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7])
                    break
                case PathCmd.R:
                    path.rect(args[0],args[1],args[2],args[3])
                    break
                case PathCmd.RR:
                    path.roundRect(args[0],args[1],args[2],args[3],args[4])
                    break
                case PathCmd.Z:
                    path.closePath()
                    break
            }
        })
    }
   
}
