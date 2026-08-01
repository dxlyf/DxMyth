/**
 * 渐变填充接口
 * 支持线性渐变、径向渐变、锥形渐变
 */
import type { ColorValue } from './Color'
import type { Matrix2DLike } from './Matrix2D'

/** 渐变类型 */
export type GradientType = 'linear' | 'radial' | 'conic'

/** 颜色停止点 */
export interface GradientStop {
  /** 位置（0-1） */
  offset: number
  /** 颜色值 */
  color: ColorValue
}

/** 渐变参数 */
export interface Gradient {
  /** 渐变类型 */
  type: GradientType

  /** 颜色停止点 */
  stops: GradientStop[]

  // ---- 通用 ----
  /** 是否使用全局坐标（默认 false，使用本地坐标） */
  worldSpace?: boolean

  /** 变换矩阵，对渐变进行额外变换 */
  matrix?: Matrix2DLike

  /** 克隆 */
  clone(): Gradient
  /** 从另一个渐变填充拷贝参数 */
  copy(gradient: Gradient): this
}

export interface LinearGradient extends Gradient {
  type: 'linear'
  /** 起点 x */
  x0?: number
  /** 起点 y */
  y0?: number
  /** 终点 x */
  x1?: number
  /** 终点 y */
  y1?: number
}
export interface RadialGradient extends Gradient {
  type: 'radial'
  /** 内圆中心 x（默认同 cx） */
  fx?: number
  /** 内圆中心 y（默认同 cy） */
  fy?: number
  /** 内圆半径（默认 0） */
  fr?: number
  /** 外圆中心 x */
  cx?: number
  /** 外圆中心 y */
  cy?: number
  /** 外圆半径 */
  r?: number
}
export interface ConicGradient extends Gradient {
  type: 'conic'
  /** 锥形中心 x */
  centerX?: number
  /** 锥形中心 y */
  centerY?: number
  /** 起始角度（弧度） */
  angle?: number
}
