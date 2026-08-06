import { Color, ColorLike } from '../math/Color'
import { PaintShader } from './PaintShader'

export enum StrokeCap {
    Butt,
    Round,
    Square,
}
export enum StrokeJoin {
    Miter,
    Round,
    Bevel,
}
// ============================================================
// Paint — 通用绘制样式存储类，参考 Skia Paint 设计
// 集中管理颜色、描边、填充、混合模式等绘制属性
// ============================================================

/** 绘制样式：填充 / 描边 / 两者 */
export enum PaintStyle {
    Fill = 0,
    Stroke = 1,
    FillAndStroke = 2,
}

/** 混合模式（与 Canvas globalCompositeOperation 对齐） */
export const enum BlendMode {
    SourceOver = 'source-over',
    SourceIn = 'source-in',
    SourceOut = 'source-out',
    SourceAtop = 'source-atop',
    DestinationOver = 'destination-over',
    DestinationIn = 'destination-in',
    DestinationOut = 'destination-out',
    DestinationAtop = 'destination-atop',
    Lighter = 'lighter',
    Copy = 'copy',
    Xor = 'xor',
    Multiply = 'multiply',
    Screen = 'screen',
    Overlay = 'overlay',
    Darken = 'darken',
    Lighten = 'lighten',
    ColorDodge = 'color-dodge',
    ColorBurn = 'color-burn',
    HardLight = 'hard-light',
    SoftLight = 'soft-light',
    Difference = 'difference',
    Exclusion = 'exclusion',
    Hue = 'hue',
    Saturation = 'saturation',
    Color = 'color',
    Luminosity = 'luminosity',
}

/**
 * Paint — 存储绘制样式的通用属性类。
 *
 * 直接对应 Canvas 2D 的绘制属性集，使用时通过 applyTo(ctx) 一键应用到上下文。
 *
 * @example
 * ```ts
 * const paint = new Paint()
 * paint.setColor(Color.fromBytes(255, 0, 0))
 * paint.style = PaintStyle.Fill
 *
 * const paint2 = paint.clone()
 * paint2.setStrokeWidth(2)
 * paint2.style = PaintStyle.Stroke
 * ```
 */
export class Paint {
    // ---- 核心属性 ----

    /** 填充/描边颜色 */
    color: ColorLike

    /** 绘制样式 */
    style: PaintStyle

    /** 描边宽度（像素） */
    strokeWidth: number

    /** 描边端点样式 */
    strokeCap: StrokeCap

    /** 描边连接样式 */
    strokeJoin: StrokeJoin

    /** 斜接限制（仅 StrokeJoin.Miter 时生效） */
    strokeMiter: number

    /** 全局透明度 (0-1) */
    alpha: number

    /** 是否开启抗锯齿 */
    antiAlias: boolean

    /** 混合模式 */
    blendMode: BlendMode

    /** shader（渐变/图案/纯色），优先级高于 color。类似 Skia 的 setShader */
    shader: PaintShader | null

    // ---- 虚线 ----

    /** 虚线间隔数组（如 [5, 3] 表示 5px 实线 + 3px 空白），null 表示实线 */
    dashIntervals: number[] | null

    /** 虚线偏移（相位） */
    dashOffset: number

    constructor() {
        this.color = new Color(0, 0, 0, 1)
        this.style = PaintStyle.Fill
        this.strokeWidth = 1
        this.strokeCap = StrokeCap.Butt
        this.strokeJoin = StrokeJoin.Miter
        this.strokeMiter = 10
        this.alpha = 1
        this.antiAlias = true
        this.blendMode = BlendMode.SourceOver
        this.shader = null
        this.dashIntervals = null
        this.dashOffset = 0
    }


    // ==================== 复制 / 克隆 ====================

    /** 深拷贝到目标 Paint */
    copy(target: Paint): void {
        this.color=target.color.slice()
        this.style=target.style
        this.strokeWidth=target.strokeWidth
        this.strokeCap=target.strokeCap
        this.strokeJoin=target.strokeJoin
        this.strokeMiter=target.strokeMiter
        this.alpha=target.alpha
        this.antiAlias=target.antiAlias
        this.blendMode=target.blendMode
        this.shader=target.shader
        this.dashIntervals=target.dashIntervals?target.dashIntervals.slice():null
        this.dashOffset=target.dashOffset

    }

    /** 创建副本 */
    clone(): Paint {
        const p = new Paint()
        this.copy(p)
        return p
    }
}
