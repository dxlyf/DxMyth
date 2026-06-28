import { merge } from 'src/utils'
import { FillStrokeStyles, FillRule, StrokeStyle, LineCap, LineJoin, TextAlign, TextBaseline, TextRendering, FillStyle, Direction, FontKerning, FontStretch, FontVariantCaps, FontStyle, FontWeight } from 'src/types/FillStrokeStyles'
import { Pattern } from 'src/core/Pattern'
import { Gradient } from 'src/core/Gradient'
import { Matrix2D, Matrix2DLike } from 'src/math/Matrix2D'
import * as Matrix2DUtil from 'src/math/Matrix2D'

// ============================================================
// 默认值与样式键名表
// ============================================================

type PaintStyle = {
  type: 'color' | 'gradient' | 'pattern'
  color?: string
  gradient?: Gradient
  pattern?: Pattern
}
type RenderStateSnapshot = FillStrokeStyles & {
  matrix: Matrix2DLike
}
/** Canvas 2D Context 默认样式值 */
const RENDER_STATE_DEFAULTS: Omit<RenderStateSnapshot, 'matrix'> = {
  // 填充
  fillStyle: '#000000',
  fillRule: 'nonzero',
  // 描边
  strokeStyle: '#000000',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  lineDash: [],
  lineDashOffset: 0,
  // 阴影
  shadowColor: 'rgba(0, 0, 0, 0)',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  // 文本
  textAlign: 'start',
  textBaseline: 'alphabetic',
  direction: 'inherit',
  letterSpacing: 0,
  wordSpacing: 0,
  fontKerning: 'auto',
  fontStretch: 'normal',
  fontVariantCaps: 'normal',
  textRendering: 'auto',
  fontFamily: 'sans-serif',
  fontSize: 10,
  fontStyle: 'normal',
  fontWeight: 'normal',
  lineHeight: 1.2,
  font:'12px sans-serif',
  // 合成
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  filter: '',
  imageSmoothingEnabled: false,
  imageSmoothingQuality: 'high',


} as const

/** 样式属性键名列表（不含方法），用于统一拷贝 */
const RENDER_STATE_KEYS = Object.keys(RENDER_STATE_DEFAULTS) as (keyof typeof RENDER_STATE_DEFAULTS)[]
const RENDER_STATE_KEYS_SET = new Set<string>(RENDER_STATE_KEYS)

const cloneFillStyle=(fill:FillStyle)=>{
    if(typeof fill==='string'){
      return fill
    }else if(fill instanceof Gradient){
        return fill.clone()
    }else if(fill instanceof Pattern){
      return fill.clone()
    }
    return fill
}
export const cloneRenderStateSnapshot = (snapshot: RenderStateSnapshot) => {
  const clone = {} as RenderStateSnapshot
  clone.fillStyle = cloneFillStyle(snapshot.fillStyle)
  clone.fillRule = snapshot.fillRule
  clone.strokeStyle =  cloneFillStyle(snapshot.strokeStyle)
  clone.lineWidth = snapshot.lineWidth
  clone.lineCap = snapshot.lineCap
  clone.lineJoin = snapshot.lineJoin
  clone.miterLimit = snapshot.miterLimit
  clone.lineDash = [...snapshot.lineDash]
  clone.lineDashOffset = snapshot.lineDashOffset
  clone.shadowColor = snapshot.shadowColor
  clone.shadowBlur = snapshot.shadowBlur
  clone.shadowOffsetX = snapshot.shadowOffsetX
  clone.shadowOffsetY = snapshot.shadowOffsetY
  clone.textAlign = snapshot.textAlign
  clone.textBaseline = snapshot.textBaseline
  clone.direction = snapshot.direction
  clone.letterSpacing = snapshot.letterSpacing
  clone.wordSpacing = snapshot.wordSpacing
  clone.fontKerning = snapshot.fontKerning
  clone.fontStretch = snapshot.fontStretch
  clone.fontVariantCaps = snapshot.fontVariantCaps
  clone.textRendering = snapshot.textRendering
  clone.fontFamily = snapshot.fontFamily
  clone.fontSize = snapshot.fontSize
  clone.fontStyle = snapshot.fontStyle
  clone.fontWeight = snapshot.fontWeight
  clone.lineHeight = snapshot.lineHeight
  clone.globalAlpha = snapshot.globalAlpha
  clone.globalCompositeOperation = snapshot.globalCompositeOperation
  clone.filter = snapshot.filter
  clone.imageSmoothingEnabled = snapshot.imageSmoothingEnabled
  clone.imageSmoothingQuality = snapshot.imageSmoothingQuality
  clone.matrix = { a: snapshot.matrix.a, b: snapshot.matrix.b, c: snapshot.matrix.c, d: snapshot.matrix.d, tx: snapshot.matrix.tx, ty: snapshot.matrix.ty }
  return clone
}

export class RenderStyleState {
  declare fillStyle: FillStyle
  declare fillRule: FillRule
  declare strokeStyle: StrokeStyle
  declare lineWidth: number
  declare lineCap: LineCap
  declare lineJoin: LineJoin
  declare miterLimit: number
  declare lineDash: number[]
  declare lineDashOffset: number
  declare shadowColor: string
  declare shadowBlur: number
  declare shadowOffsetX: number
  declare shadowOffsetY: number
  declare font: string
  declare textAlign: TextAlign
  declare textBaseline: TextBaseline
  declare direction: Direction
  declare letterSpacing: number
  declare wordSpacing: number
  declare fontKerning: FontKerning
  declare fontStretch: FontStretch
  declare fontVariantCaps: FontVariantCaps
  declare textRendering: TextRendering
  declare fontFamily: string
  declare fontSize: number
  declare fontStyle: FontStyle
  declare fontWeight: FontWeight
  declare lineHeight: number
  declare wordWrap: boolean
  declare globalAlpha: number
  declare globalCompositeOperation: GlobalCompositeOperation
  declare filter: string
  declare imageSmoothingEnabled: boolean
  declare imageSmoothingQuality: ImageSmoothingQuality

}
export class RenderState extends RenderStyleState {
  matrix: Matrix2D = Matrix2D.identity()
  /** 状态栈：每帧记录 save 后被 setter 修改过的字段原值 */
  private _stack: RenderStateSnapshot[] = []
  
  // ---- 类型声明（运行时由 constructor 中 defineProperty 提供 getter/setter） ----

  constructor() {
    super()
    this.reset()
    this.delegateStateProperties(this)
  }
  delegateStateProperties(target: any) {
    for (const key of RENDER_STATE_KEYS) {
      Object.defineProperty(target, key, {
        get: () => {
            return this.currentState[key]
        },
        set: (value: any) => {
          if (this.currentState[key] !== value) {
            (this.currentState as any)[key] = value
          }
        },
        enumerable: true,
        configurable: true,
      })
    }
  }
  reset() {
    this._stack = [merge({ matrix: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 } } as any, RENDER_STATE_DEFAULTS)]
  }
  get currentState(): RenderStateSnapshot {
    return this._stack[this._stack.length - 1]
  }
  get currentTransform() {
    return this.matrix
  }
  translate(tx: number, ty: number) {
    Matrix2DUtil.translate(this.currentTransform, this.currentTransform, tx, ty)
  }
  rotate(angle: number) {
    Matrix2DUtil.rotate(this.currentTransform, this.currentTransform, angle)
  }
  scale(sx: number, sy: number) {
    Matrix2DUtil.scale(this.currentTransform, this.currentTransform, sx, sy)
  }
  transform(a: number, b: number, c: number, d: number, tx: number, ty: number) {
    Matrix2DUtil.multiply(this.currentTransform, this.currentTransform, { a, b, c, d, tx, ty })
  }
  transformMatrix2D(matrix: Matrix2DLike) {
    Matrix2DUtil.multiply(this.currentTransform, this.currentTransform, matrix)
  }
  setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number) {
    Matrix2DUtil.fromValues(this.currentTransform, a, b, c, d, tx, ty)
  }
  resetTransform() {
    Matrix2DUtil.fromValues(this.currentTransform, 1, 0, 0, 1, 0, 0)
  }
  save() {
    // 内联 clone 逻辑，避免函数调用；缓存 currentState 减少 getter 调用
    const cur = this.currentState
    const curMatrix=this.currentTransform
    Matrix2DUtil.fromValues(cur.matrix,curMatrix.a,curMatrix.b,curMatrix.c,curMatrix.d,curMatrix.tx,curMatrix.ty)
    const newState: RenderStateSnapshot = cloneRenderStateSnapshot(cur)
    this._stack.push(newState)
  
  }
  restore() {
    const stack = this._stack
    if (stack.length > 0) {
      stack.pop()
      this.matrix.copy(this.currentState.matrix)
    } else {
      this.reset()
    }
  }
  setStyles(styles: Partial<RenderStateSnapshot>) {
    for (const key of Object.keys(styles)) {
      if (RENDER_STATE_KEYS_SET.has(key)) {
        (this as any)[key] = (styles as any)[key]
      }
    }
  }

}
