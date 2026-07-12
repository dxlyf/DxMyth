import { Color, type ColorLike } from '../math/Color'
import type { IPattern } from '../math/Pattern'
import { type IGradient } from '../math/Gradient'

// ============================================================
// Canvas 转换工具 — 将 Paint 枚举/类型转换为 Canvas API 值
// ============================================================

/** 描边端点样式 */
export enum StrokeCap {
    Butt = 0,
    Round = 1,
    Square = 2,
}

/** 描边连接样式 */
export enum StrokeJoin {
    Miter = 0,
    Round = 1,
    Bevel = 2,
}

const STROKE_CAP_MAP: Record<StrokeCap, CanvasLineCap> = {
    [StrokeCap.Butt]: 'butt',
    [StrokeCap.Round]: 'round',
    [StrokeCap.Square]: 'square',
}

const STROKE_JOIN_MAP: Record<StrokeJoin, CanvasLineJoin> = {
    [StrokeJoin.Miter]: 'miter',
    [StrokeJoin.Round]: 'round',
    [StrokeJoin.Bevel]: 'bevel',
}

/** 将 StrokeCap 转换为 CanvasLineCap */
export function toCanvasLineCap(cap: StrokeCap): CanvasLineCap {
    return STROKE_CAP_MAP[cap]
}

/** 将 StrokeJoin 转换为 CanvasLineJoin */
export function toCanvasLineJoin(join: StrokeJoin): CanvasLineJoin {
    return STROKE_JOIN_MAP[join]
}

/**
 * 将项目 Gradient 类型转为原生 CanvasGradient。
 * 支持 LinearGradient、RadialGradient、ConicGradient。
 */
export function toCanvasGradient(
    ctx: CanvasRenderingContext2D,
    gradient: IGradient,
): CanvasGradient {
    let canvasGrad: CanvasGradient

    switch (gradient.elementType) {
        case 'linear-gradient': {
            const g = gradient as import('../math/Gradient').LinearGradient
            canvasGrad = ctx.createLinearGradient(g.x0, g.y0, g.x1, g.y1)
            break
        }
        case 'radial-gradient': {
            const g = gradient as import('../math/Gradient').RadialGradient
            canvasGrad = ctx.createRadialGradient(g.x0, g.y0, g.r0, g.x1, g.y1, g.r1)
            break
        }
        case 'conic-gradient': {
            const g = gradient as import('../math/Gradient').ConicGradient
            // conic-gradient 在某些浏览器可能不支持，尝试 createConicGradient
            const ctxExtended = ctx as CanvasRenderingContext2D & {
                createConicGradient?(startAngle: number, x: number, y: number): CanvasGradient
            }
            if (ctxExtended.createConicGradient) {
                canvasGrad = ctxExtended.createConicGradient(g.startAngle, g.x, g.y)
            } else {
                // 回退为径向渐变
                canvasGrad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, Math.max(ctx.canvas.width, ctx.canvas.height))
            }
            break
        }
        default:
            throw new Error(`Unknown gradient type: ${(gradient as any).elementType}`)
    }

    // 应用 colorStops
    for (const stop of gradient.stops) {
        canvasGrad.addColorStop(stop.offset, Color.toCSS_RGBA(stop.color))
    }

    // 应用 matrix 变换（如果存在）
    // 注意：CanvasGradient 本身不支持 transform，这里通过容器的 setTransform 实现
    // 如需使用 matrix，外部应在调用 createGradient 前自行处理坐标系

    return canvasGrad
}

/**
 * 将 shader（渐变/图案/颜色）转换为 Canvas fillStyle / strokeStyle 可接受的值。
 * 优先级：pattern > gradient > color。
 */
export function toCanvasStyle(
    ctx: CanvasRenderingContext2D,
    color: ColorLike,
    shader?: IGradient | IPattern | null,
): string | CanvasGradient | CanvasPattern {
    if (!shader) {
        return Color.toCSS_RGBA(color)
    }
    if ((shader as IPattern).type === 'pattern') {
        const pattern = shader as IPattern
        return ctx.createPattern(pattern.source, pattern.repeat ?? 'repeat')!
    }
    if ((shader as IGradient).type === 'gradient') {
        return toCanvasGradient(ctx, shader as IGradient)
    }
    return Color.toCSS_RGBA(color)
}

/** 将虚线配置应用到 Canvas 上下文 */
export function applyCanvasDash(
    ctx: CanvasRenderingContext2D,
    intervals: number[] | null,
    offset: number = 0,
): void {
    if (intervals) {
        ctx.setLineDash(intervals)
        ctx.lineDashOffset = offset
    } else {
        ctx.setLineDash([])
    }
}
