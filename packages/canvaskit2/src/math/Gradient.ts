// ============================================================
// Gradient — 渐变填充，实现 types/Gradient 接口
// 线性、径向、锥形各为独立子类，type 为字面量类型
// ============================================================

import type {
  Gradient as IGradient,
  GradientStop,
  LinearGradient as ILinearGradient,
  RadialGradient as IRadialGradient,
  ConicGradient as IConicGradient,
} from '../types/Gradient'
import type { Matrix2DLike } from '../types/Matrix2D'
import type { ColorValue } from '../types/Color'


// ==================== 基类（共享通用属性） ====================

export abstract class Gradient implements IGradient {
  abstract type: 'linear' | 'radial' | 'conic'
  stops: GradientStop[]
  worldSpace?: boolean
  matrix?: Matrix2DLike

  constructor(stops: GradientStop[] = []) {
    this.stops = stops
  }

  abstract clone(): IGradient

  abstract copy(gradient: IGradient): this

  /** 从任意 IGradient 创建对应子类实例 */
  static from(source: IGradient): Gradient {
    switch (source.type) {
      case 'linear': return LinearGradient.from(source as ILinearGradient)
      case 'radial': return RadialGradient.from(source as IRadialGradient)
      case 'conic': return ConicGradient.from(source as IConicGradient)
    }
  }

  addStop(offset: number, color: ColorValue): this {
    this.stops.push({ offset, color })
    return this
  }
}

// ==================== 线性渐变 ====================

export class LinearGradient extends Gradient implements ILinearGradient {
  type: 'linear' = 'linear'
  x0: number
  y0: number
  x1: number
  y1: number

  constructor(x0: number, y0: number, x1: number, y1: number, stops?: GradientStop[]) {
    super(stops)
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }

  static linear(
    x0: number, y0: number, x1: number, y1: number,
    stops?: GradientStop[],
    options?: { worldSpace?: boolean; matrix?: Matrix2DLike },
  ): LinearGradient {
    const g = new LinearGradient(x0, y0, x1, y1, stops)
    if (options) {
      g.worldSpace = options.worldSpace
      g.matrix = options.matrix
    }
    return g
  }

  static from(source: ILinearGradient): LinearGradient {
    const g = new LinearGradient(
      source.x0 ?? 0, source.y0 ?? 0,
      source.x1 ?? 1, source.y1 ?? 1,
      source.stops.map(s => ({ offset: s.offset, color: s.color })),
    )
    g.worldSpace = source.worldSpace
    g.matrix = source.matrix
    return g
  }

  clone(): LinearGradient {
    return LinearGradient.from(this)
  }

  copy(gradient: IGradient): this {
    this.stops = gradient.stops.map(s => ({ offset: s.offset, color: s.color }))
    this.worldSpace = gradient.worldSpace
    this.matrix = gradient.matrix
    if (gradient.type === 'linear') {
      const s = gradient as ILinearGradient
      this.x0 = s.x0 ?? 0; this.y0 = s.y0 ?? 0
      this.x1 = s.x1 ?? 1; this.y1 = s.y1 ?? 1
    }
    return this
  }

  /** 设置线性渐变端点 */
  set(x0: number, y0: number, x1: number, y1: number): this {
    this.x0 = x0; this.y0 = y0
    this.x1 = x1; this.y1 = y1
    return this
  }
}

// ==================== 径向渐变 ====================

export class RadialGradient extends Gradient implements IRadialGradient {
  type: 'radial' = 'radial'
  cx: number
  cy: number
  r: number
  fx?: number
  fy?: number
  fr?: number

  constructor(cx: number, cy: number, r: number, stops?: GradientStop[], fx?: number, fy?: number, fr?: number) {
    super(stops)
    this.cx = cx
    this.cy = cy
    this.r = r
    this.fx = fx
    this.fy = fy
    this.fr = fr
  }

  static radial(
    cx: number, cy: number, r: number,
    stops?: GradientStop[],
    options?: { fx?: number; fy?: number; fr?: number; worldSpace?: boolean; matrix?: Matrix2DLike },
  ): RadialGradient {
    const g = new RadialGradient(cx, cy, r, stops, options?.fx, options?.fy, options?.fr)
    if (options) {
      g.worldSpace = options.worldSpace
      g.matrix = options.matrix
    }
    return g
  }

  static from(source: IRadialGradient): RadialGradient {
    const g = new RadialGradient(
      source.cx ?? 0, source.cy ?? 0, source.r ?? 0,
      source.stops.map(s => ({ offset: s.offset, color: s.color })),
      source.fx, source.fy, source.fr,
    )
    g.worldSpace = source.worldSpace
    g.matrix = source.matrix
    return g
  }

  clone(): RadialGradient {
    return RadialGradient.from(this)
  }

  copy(gradient: IGradient): this {
    this.stops = gradient.stops.map(s => ({ offset: s.offset, color: s.color }))
    this.worldSpace = gradient.worldSpace
    this.matrix = gradient.matrix
    if (gradient.type === 'radial') {
      const s = gradient as IRadialGradient
      this.cx = s.cx ?? 0; this.cy = s.cy ?? 0; this.r = s.r ?? 0
      this.fx = s.fx; this.fy = s.fy; this.fr = s.fr
    }
    return this
  }

  /** 设置径向渐变外圆 */
  set(cx: number, cy: number, r: number): this {
    this.cx = cx; this.cy = cy; this.r = r
    return this
  }

  /** 设置内圆（焦点） */
  setFocus(fx: number, fy: number, fr?: number): this {
    this.fx = fx; this.fy = fy; this.fr = fr
    return this
  }
}

// ==================== 锥形渐变 ====================

export class ConicGradient extends Gradient implements IConicGradient {
  type: 'conic' = 'conic'
  centerX: number
  centerY: number
  angle: number

  constructor(centerX: number, centerY: number, angle: number, stops?: GradientStop[]) {
    super(stops)
    this.centerX = centerX
    this.centerY = centerY
    this.angle = angle
  }

  static conic(
    centerX: number, centerY: number, angle: number,
    stops?: GradientStop[],
    options?: { worldSpace?: boolean; matrix?: Matrix2DLike },
  ): ConicGradient {
    const g = new ConicGradient(centerX, centerY, angle, stops)
    if (options) {
      g.worldSpace = options.worldSpace
      g.matrix = options.matrix
    }
    return g
  }

  static from(source: IConicGradient): ConicGradient {
    const g = new ConicGradient(
      source.centerX ?? 0, source.centerY ?? 0, source.angle ?? 0,
      source.stops.map(s => ({ offset: s.offset, color: s.color })),
    )
    g.worldSpace = source.worldSpace
    g.matrix = source.matrix
    return g
  }

  clone(): ConicGradient {
    return ConicGradient.from(this)
  }

  copy(gradient: IGradient): this {
    this.stops = gradient.stops.map(s => ({ offset: s.offset, color: s.color }))
    this.worldSpace = gradient.worldSpace
    this.matrix = gradient.matrix
    if (gradient.type === 'conic') {
      const s = gradient as IConicGradient
      this.centerX = s.centerX ?? 0; this.centerY = s.centerY ?? 0; this.angle = s.angle ?? 0
    }
    return this
  }

  /** 设置锥形渐变参数 */
  set(centerX: number, centerY: number, angle: number): this {
    this.centerX = centerX; this.centerY = centerY; this.angle = angle
    return this
  }
}
