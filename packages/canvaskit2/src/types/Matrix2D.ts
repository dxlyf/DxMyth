/**
 * 二维仿射变换矩阵接口
 * 内存布局: [0]=a, [1]=b, [2]=c, [3]=d, [4]=tx, [5]=ty
 *
 * 矩阵形式:
 *   | a  c  tx |
 *   | b  d  ty |
 *   | 0  0  1  |
 */

/** 类矩阵类型（数值数组或 Float32Array，至少 6 个元素） */
export type Matrix2DLike = number[] | Float32Array

export interface Matrix2D extends Float32Array {
  // ---- 命名属性访问器 ----

  /** 水平缩放（cosθ） */
  a: number
  /** 垂直倾斜（sinθ） */
  b: number
  /** 水平倾斜（-sinθ） */
  c: number
  /** 垂直缩放（cosθ） */
  d: number
  /** 水平平移 */
  tx: number
  /** 垂直平移 */
  ty: number

  // ---- 写入 ----

  /** 设置 6 个矩阵元素 */
  fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): this
  /** 重置为单位矩阵 */
  identity(): this
  /** 从数组拷贝矩阵元素 */
  fromArray(m: Matrix2DLike): this
  /** 从另一个矩阵拷贝 */
  copy(m: Matrix2DLike): this
  /** 重置为平移矩阵 */
  fromTranslate(tx: number, ty: number): this
  /** 重置为缩放矩阵 */
  fromScale(sx: number, sy: number): this
  /** 重置为旋转矩阵（angle 为弧度） */
  fromRotation(angle: number): this
  /** 重置为倾斜矩阵 */
  fromSkew(sx: number, sy: number): this

  // ---- 自身变换（this = this * op） ----

  /** 平移：this = this * T(tx, ty) */
  translate(tx: number, ty: number): this
  /** 缩放：this = this * S(sx, sy) */
  scale(sx: number, sy: number): this
  /** 旋转：this = this * R(angle)（angle 为弧度） */
  rotate(angle: number): this
  /** 倾斜：this = this * Sk(sx, sy) */
  skew(sx: number, sy: number): this
  /** 右乘：this = this * m */
  multiply(m: Matrix2DLike): this
  /** 左乘：this = m * this */
  premultiply(m: Matrix2DLike): this
  /** this = a * b */
  multiplyMatrices(a: Matrix2DLike, b: Matrix2DLike): this

  /** 逆矩阵；行列式为 0 时返回 null */
  invert(): this | null

  // ---- 组合构建 ----

  /** 从平移 + 旋转 + 缩放构建（pivot = (0,0)） */
  fromTranslationRotationScale(position: { x: number; y: number }, angleInRad: number, scale: { x: number; y: number }): this
  /** 从平移 + 旋转 + 缩放 + 轴心构建 */
  fromTranslationRotationScalePivot(
    position: { x: number; y: number },
    angleInRad: number,
    scale: { x: number; y: number },
    pivot: { x: number; y: number },
  ): this
  /** 从变换对象构建 */
  fromTransform(transform: {
    position: { x: number; y: number }
    scale?: { x: number; y: number }
    skew?: { x: number; y: number }
    rotation?: number
    origin?: { x: number; y: number }
    pivot?: { x: number; y: number }
  }): this

  /** 从平移 + 旋转 + 倾斜 + 缩放 + 原点构建 */
  fromTranslateRotationSkewScaleOrigin(
    position: { x: number; y: number },
    rotation: number,
    skew: { x: number; y: number },
    scale?: { x: number; y: number },
    origin?: { x: number; y: number },
  ): this

  // ---- 查询 ----

  /** 行列式 */
  determinant(): number
  /** 是否为单位矩阵 */
  isIdentity(): boolean
  /** 是否奇异（行列式为 0） */
  isSingular(): boolean
  /** 是否与另一个矩阵相等 */
  equals(m: Matrix2DLike): boolean
  /** 水平缩放量 */
  getScaleX(): number
  /** 垂直缩放量 */
  getScaleY(): number
  /** 几何平均缩放量 */
  getScale(): number
  /** 旋转角（弧度） */
  getRotation(): number

  // ---- 点变换 ----

  /** 变换单个点，结果写入 out */
  mapPoint(out: { x: number; y: number }, v: { x: number; y: number }): { x: number; y: number }
  /** 变换一组点 */
  mapPoints(out: { x: number; y: number }[], points: { x: number; y: number }[]): { x: number; y: number }[]
  /** 变换单个点，返回新对象 */
  transformPoint(v: { x: number; y: number }): { x: number; y: number }

  // ---- 工具 ----

  /** 克隆一个新矩阵 */
  clone(): Matrix2D
  /** 转换为数组 [a, b, c, d, tx, ty] */
  toArray(): number[]
  /** 转换为字符串表示 */
  toString(): string
}
