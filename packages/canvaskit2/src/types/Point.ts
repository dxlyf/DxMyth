/**
 * 二维坐标点接口
 * 提供基本的向量/点运算方法
 */
/** 类 Point 对象（只需包含 x、y 属性） */
export type PointLike = { x: number; y: number }

export interface Point {
  /** x 坐标 */
  x: number
  /** y 坐标 */
  y: number

  /** 注册变更回调，坐标变化时触发 */
  onChange(cb: () => void): this

  // ---- 写入 ----

  /** 设置 x、y 坐标（仅当值有变化时更新并触发回调） */
  set(x: number, y: number): this
  /** 从另一个 Point 拷贝坐标 */
  copy(v: PointLike): this
  /** 置零（x=0, y=0） */
  zero(): this

  // ---- 运算 ----

  /** 加上另一个点（向量加法） */
  add(v: PointLike): this
  /** 减去另一个点（向量减法） */
  subtract(v: PointLike): this
  /** 逐分量乘法 */
  multiply(v: PointLike): this
  /** 标量乘法 */
  multiplyScalar(s: number): this
  /** 标量除法 */
  divide(s: number): this
  /** 取反（-x, -y） */
  negate(): this
  /** 归一化，使长度为 1；零向量保持不变 */
  normalize(): this
  /** 平移 (tx, ty) */
  translate(tx: number, ty: number): this
  /** 绕原点或指定中心旋转（angle 单位为弧度） */
  rotate(angle: number, center?: PointLike): this
  /** 缩放 (sx, sy) */
  scale(sx: number, sy: number): this
  /** 垂直向量（顺时针旋转 90°：(-y, x)） */
  perpendicular(): this

  // ---- 查询 ----

  /** 向量长度 */
  magnitude(): number
  /** 向量长度的平方（避免开根号） */
  magnitudeSquared(): number
  /** 点积 */
  dot(v: PointLike): number
  /** 叉积（二维返回标量） */
  cross(v: PointLike): number
  /** 到另一个点的距离 */
  distanceTo(v: PointLike): number
  /** 到另一个点距离的平方 */
  distanceSquaredTo(v: PointLike): number
  /** 与另一个点的夹角（弧度） */
  angle(v: PointLike): number
  /** 是否与另一个点相等 */
  equals(v: PointLike): boolean
  /** 是否在容差范围内近似相等 */
  equalsEpsilon(v: PointLike, epsilon?: number): boolean
  /** 坐标是否均为有限数 */
  isFinite(): boolean
  /** 是否为零点 (x===0 && y===0) */
  isZero(): boolean

  // ---- 工具 ----

  /** 克隆一个新的 Point */
  clone(): Point
  /** 转换为数组 [x, y] */
  toArray(): [number, number]
  /** 转换为字符串表示 */
  toString(): string
}