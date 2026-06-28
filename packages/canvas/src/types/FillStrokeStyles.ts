import { Matrix2D } from "src/math/Matrix2D"
import { PathBuilder } from "src/math/PathBuilder"
import { Gradient } from "src/core/Gradient"
import { Pattern } from "src/core/Pattern"
export type ColorStop = {
    offset: number
    color: string
}

export type FillStyle = 'none' | string | Gradient | Pattern
export type StrokeStyle = 'none' | string | Gradient | Pattern

/** 填充规则 */
export type FillRule = 'nonzero' | 'evenodd'

/** 线段连接处样式 */
export type LineJoin = 'miter' | 'round' | 'bevel'

/** 线段端点样式 */
export type LineCap = 'butt' | 'round' | 'square'

/** 文本对齐方式 */
export type TextAlign = 'start' | 'end' | 'left' | 'right' | 'center'

/** 文本基线 */
export type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'

/** 文本方向 */
export type Direction = 'ltr' | 'rtl' | 'inherit'

/** 字体样式 */
export type FontStyle = 'normal' | 'italic' | 'oblique'

/** 字重（支持 CSS font-weight 数值与关键字） */
export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number

/** 字体变体（小型大写字母等） */
export type FontVariantCaps =
    | 'normal'
    | 'small-caps'
    | 'all-small-caps'
    | 'petite-caps'
    | 'all-petite-caps'
    | 'unicase'
    | 'titling-caps'

/** 字体拉伸 */
export type FontStretch =
    | 'normal'
    | 'ultra-condensed'
    | 'extra-condensed'
    | 'condensed'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'expanded'
    | 'extra-expanded'
    | 'ultra-expanded'

/** 字距调节 */
export type FontKerning = 'auto' | 'normal' | 'none'

/** 文本渲染策略 */
export type TextRendering = 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision'

/**
 * 填充样式状态
 *
 * 用于 `fill()` / `fillText()` / `fillRect()` 等填充类绘制操作。
 */
export type FillStyles = {
    /** 填充样式：CSS 颜色字符串、渐变或图案 */
    fillStyle: FillStyle
    /** 填充规则：nonzero（默认）或 evenodd，决定路径内部区域的判定方式 */
    fillRule: FillRule
}

/**
 * 描边样式状态
 *
 * 用于 `stroke()` / `strokeText()` / `strokeRect()` 等描边类绘制操作。
 */
export type StrokeStyles = {
    /** 描边样式：CSS 颜色字符串、渐变或图案 */
    strokeStyle: StrokeStyle
    /** 线宽（px），必须 > 0 */
    lineWidth: number
    /** 线段端点样式 */
    lineCap: LineCap
    /** 线段连接处样式 */
    lineJoin: LineJoin
    /** miter 接合的长度上限（lineJoin='miter' 时生效，默认 10） */
    miterLimit: number
    /** 虚线段长度数组（如 [10, 5] 表示 10px 实线 + 5px 空白循环） */
    lineDash: number[]
    /** 虚线起始偏移（px） */
    lineDashOffset: number
}

/**
 * 阴影样式状态
 *
 * 阴影会在 `fill()` / `stroke()` / `fillText()` / `strokeText()` /
 * `drawImage()` 等绘制操作中应用到绘制结果上。
 */
export type ShadowStyles = {
    /** 阴影颜色（CSS 颜色字符串，alpha=0 时阴影不可见） */
    shadowColor: string
    /** 阴影模糊半径（px，0 = 锐利边缘） */
    shadowBlur: number
    /** 阴影水平偏移（px） */
    shadowOffsetX: number
    /** 阴影垂直偏移（px） */
    shadowOffsetY: number
}

export type TextStyles = {

    /** 字母间距 */
    letterSpacing: number
    /** 单词间距 */
    wordSpacing: number
    /** 字体渲染 */
    textRendering: TextRendering
    /** 文本对齐方式 */
    textAlign: TextAlign
    /** 文本基线 */
    textBaseline: TextBaseline
    /** 文本方向 */
    direction: Direction


    font:string
    // ---- 字体分解属性（用于精细控制） ----
    /** 字体 */
    fontFamily: string
    /** 字体大小（px） */
    fontSize: number
    /** 字体拉伸 */
    fontStretch: FontStretch
    /** 字体样式 */
    fontStyle: FontStyle
    /** 字体变体（小型大写字母等） */
    fontVariantCaps: FontVariantCaps

    /** 字体粗细 */
    fontWeight: FontWeight
    /** 行高（px） */
    lineHeight: number
    /** 字距调节策略 */
    fontKerning: FontKerning

}
export type GlobalCompositeOperation="color" | "color-burn" | "color-dodge" | "copy" | "darken" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";
/** 合成状态 */
export interface CompositingStyles {
    /** 全局透明度（0-1） */
    globalAlpha: number
    /** 合成模式 */
    globalCompositeOperation: GlobalCompositeOperation
    /** CSS filter（如 'blur(5px)' / 'brightness(1.5)'） */
    filter: string
}
/** 图像平滑状态 */
export type ImageSmoothingStyles = {
    /** 是否启用图像平滑 */
    imageSmoothingEnabled: boolean
    /** 平滑质量 */
    imageSmoothingQuality: ImageSmoothingQuality
}

/** 剪切 */
export interface ClipStyles {
    /** 剪切路径 */
    clipPath: PathBuilder
    /** 剪切规则 */
    clipRule: FillRule
}


export type FillStrokeStyles = FillStyles & StrokeStyles & ShadowStyles & TextStyles & CompositingStyles & ImageSmoothingStyles


