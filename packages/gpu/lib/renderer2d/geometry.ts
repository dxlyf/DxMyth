/**
 * 2D 后端的共用几何工具。
 *
 * Canvas 后端可以把命令直接重放给原生 Canvas2D，而 WebGL2 / WebGPU
 * 必须自己把命令流变成三角形：
 *
 *   Path2DCommand 流 --flattenPath--> 折线轮廓 --tessellateFill--> 填充三角形
 *                                        \--tessellateStroke--> 描边三角形
 *
 * 三件事分别复用已有实现：路径离散走 `PathBuilder`，虚线切分走 `PathDash`，
 * 描边轮廓走 `GenerateOutline`；本模块只做坐标格式转换、朝向归一与 tess2 三角化。
 *
 * 所有结果都在「用户坐标系」（即记录命令时的坐标系）中，
 * 由各后端在绘制时再乘以当前矩阵与 pixelRatio 烘焙成设备像素，
 * 这样几何缓存与变换解耦。
 */
import type { IPath2DReadable } from '../math/Path2D'
import { PathBuilder, type FlattenedContour } from '../math/PathBuilder'
import { generateOutline } from '../math/GenerateOutline'
import { dashContours } from '../math/PathDash'
import { LineCap as PathLineCap, LineJoin as PathLineJoin } from '../math/PathStroke'
import type { PointLike } from '../math/Point'
import { tesselate, WINDING } from '../math/tess2-ts'
import type { FillRule, LineCap, LineJoin } from './Paint'

/** 扁平坐标轮廓：points 为 [x0, y0, x1, y1, ...]，closed 表示被 closePath 闭合 */
export interface PathContour {
    points: number[]
    closed: boolean
}

/** CPU 侧三角化结果，positions 为 [x0, y0, x1, y1, ...] */
export interface Mesh2D {
    positions: Float32Array
    indices: Uint32Array
}

export const EMPTY_MESH: Mesh2D = { positions: new Float32Array(0), indices: new Uint32Array(0) }

export function isEmptyMesh(mesh: Mesh2D): boolean {
    return mesh.indices.length === 0
}

/** 曲线离散参数 */
export interface FlattenOptions {
    /** 离散误差（用户坐标单位），默认 0.25 */
    tolerance?: number
}

/** 描边展开参数 */
export interface StrokeOptions {
    lineWidth: number
    lineCap?: LineCap
    lineJoin?: LineJoin
    miterLimit?: number
    lineDash?: readonly number[]
    lineDashOffset?: number
}

// ============================================================
// 路径离散
// ============================================================

/**
 * 把路径命令流离散成折线轮廓。
 *
 * 命令流先转交给 `PathBuilder`，由它统一处理圆弧 / 圆角矩形等语义，
 * 再用 `getSubPaths` 按 `tolerance` 把曲线展平成折线，
 * 结果可直接交给三角化器使用。
 */
export function flattenPath(path: IPath2DReadable, options: FlattenOptions = {}): PathContour[] {
    const tolerance = Math.max(1e-4, options.tolerance ?? 0.25)
    const builder = new PathBuilder()

    path.visit({
        moveTo: (c) => builder.moveTo(c.x, c.y),
        lineTo: (c) => builder.lineTo(c.x, c.y),
        bezierCurveTo: (c) => builder.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y),
        quadraticCurveTo: (c) => builder.quadraticCurveTo(c.cpx, c.cpy, c.x, c.y),
        closePath: () => builder.closePath(),
        rect: (c) => builder.rect(c.x, c.y, c.w, c.h),
        roundRect: (c) => builder.roundRect(c.x, c.y, c.w, c.h, c.radii),
        arc: (c) => builder.arc(c.x, c.y, c.radius, c.startAngle, c.endAngle, c.counterclockwise),
        arcTo: (c) => builder.arcTo(c.x1, c.y1, c.x2, c.y2, c.radius),
        ellipse: (c) => builder.ellipse(c.x, c.y, c.radiusX, c.radiusY, c.rotation, c.startAngle, c.endAngle, c.counterclockwise),
    })

    // closed 只反映真实的 closePath，填充的隐式闭合交给 tess2 处理
    return builder.getSubPaths({ tolerance, autoClose: false, skipDegenerate: true }).map((contour) => ({
        points: toFlatPoints(contour.points),
        closed: contour.closed,
    }))
}

// ============================================================
// 填充三角化
// ============================================================

/**
 * 用 tess2 三角化填充区域。
 *
 * `fillRule` 直接映射到 tess2 的 ODD / NONZERO 环绕规则，
 * 开放轮廓会被隐式闭合（与 canvas fill 一致）。
 */
export function tessellateFill(contours: readonly PathContour[], fillRule: FillRule = 'nonzero'): Mesh2D {
    const inputs: number[][] = []
    for (const contour of contours) {
        if (contour.points.length >= 6) inputs.push(contour.points)
    }
    if (inputs.length === 0) return EMPTY_MESH

    let result: ReturnType<typeof tesselate>
    try {
        result = tesselate({
            windingRule: fillRule === 'evenodd' ? WINDING.ODD : WINDING.NONZERO,
            polySize: 3,
            vertexSize: 2,
            normal: [0, 0, 1],
            contours: inputs,
        })
    } catch {
        // 退化几何（自相交到无法恢复）时放弃这一次填充，而不是让整帧崩掉
        return EMPTY_MESH
    }
    if (!result || result.elementCount === 0) return EMPTY_MESH

    const positions = new Float32Array(result.vertices)
    const indices = new Uint32Array(result.elements.length)
    let count = 0
    for (let i = 0; i < result.elements.length; i++) {
        const index = result.elements[i]
        if (index < 0) continue
        indices[count++] = index
    }
    return { positions, indices: indices.subarray(0, count) }
}

// ============================================================
// 描边展开
// ============================================================

/**
 * 把折线轮廓展开成描边三角形。
 *
 * 虚线切分交给 `PathDash.dashContours`，描边轮廓交给 `GenerateOutline.generateOutline`
 *（线段矩形 + 拐点补角 + 端点补帽），这里只做单位换算与三角化。
 */
export function tessellateStroke(contours: readonly PathContour[], options: StrokeOptions): Mesh2D {
    const polygons = buildStrokePolygons(contours, options)
    if (polygons.length === 0) return EMPTY_MESH
    return tessellateFill(
        polygons.map((points) => ({ points, closed: true })),
        'nonzero',
    )
}

/** 展开后的描边多边形（每项为闭合环的扁平坐标） */
export function buildStrokePolygons(
    contours: readonly PathContour[],
    options: StrokeOptions,
): number[][] {
    const dash =
        options.lineDash && options.lineDash.length > 0
            ? { intervals: options.lineDash, phase: options.lineDashOffset ?? 0 }
            : null
    const fragments = dashContours(contours.map(toFlattenedContour), dash)

    const outline = generateOutline(fragments, {
        lineWidth: Math.max(0.0001, options.lineWidth ?? 1),
        lineCap: toPathLineCap(options.lineCap),
        lineJoin: toPathLineJoin(options.lineJoin),
        miterLimit: Math.max(1, options.miterLimit ?? 10),
    })

    // 各多边形描边后方向不定，统一成逆时针后再用 NONZERO 求并集
    return outline.map((contour) => makeCcw(toFlatPoints(contour.points)))
}

// ============================================================
// 工具
// ============================================================

function toFlattenedContour(contour: PathContour): FlattenedContour {
    const flat = contour.points
    const count = flat.length >> 1
    const points: PointLike[] = new Array(count)
    for (let i = 0; i < count; i++) {
        points[i] = { x: flat[i * 2], y: flat[i * 2 + 1] }
    }
    return { points, closed: contour.closed }
}

function toFlatPoints(points: readonly PointLike[]): number[] {
    const out = new Array<number>(points.length * 2)
    for (let i = 0; i < points.length; i++) {
        out[i * 2] = points[i].x
        out[i * 2 + 1] = points[i].y
    }
    return out
}

function toPathLineCap(cap: LineCap | undefined): PathLineCap {
    return cap === 'round' ? PathLineCap.Round : cap === 'square' ? PathLineCap.Square : PathLineCap.Butt
}

function toPathLineJoin(join: LineJoin | undefined): PathLineJoin {
    return join === 'round' ? PathLineJoin.Round : join === 'bevel' ? PathLineJoin.Bevel : PathLineJoin.Miter
}

/** 调整成逆时针（正面积），保证 tess2 的 NONZERO 求并集正确 */
function makeCcw(points: number[]): number[] {
    if (signedArea(points) < 0) {
        const out: number[] = []
        for (let i = points.length - 2; i >= 0; i -= 2) out.push(points[i], points[i + 1])
        return out
    }
    return points
}

function signedArea(points: number[]): number {
    let area = 0
    const n = points.length / 2
    for (let i = 0, j = n - 1; i < n; j = i++) {
        area += points[j * 2] * points[i * 2 + 1] - points[i * 2] * points[j * 2 + 1]
    }
    return area / 2
}
