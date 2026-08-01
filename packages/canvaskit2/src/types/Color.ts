/**
 * 颜色值类型
 * 支持多种格式：CSS 字符串、RGBA 对象、十六进制数值、RGBA 数组
 */
export type ColorValue =
  | string
  | { r: number; g: number; b: number; a?: number }
  | number
  | [number, number, number, number?]
  | [number, number, number]

/**
 * 颜色接口
 * 以 RGBA 四通道表示颜色，提供常见转换与操作方法
 */
export interface Color {
  /** 红色通道（0-255） */
  r: number
  /** 绿色通道（0-255） */
  g: number
  /** 蓝色通道（0-255） */
  b: number
  /** 透明度（0-1） */
  a: number

  // ---- 写入 ----

  /** 从 ColorValue 设置颜色 */
  set(value: ColorValue): this
  /** 分别设置 RGBA 分量 */
  setRGBA(r: number, g: number, b: number, a?: number): this
  /** 从另一个 Color 拷贝 RGBA 值 */
  copy(c: Color): this
  /** 设置 RGBA（r/g/b 为 0-1 浮点数，自动映射到 0-255） */
  setFloatRGBA(r: number, g: number, b: number, a?: number): this

  // ---- 转换 ----

  /** 转为 CSS rgba() 字符串 */
  toCSS_RGBA(): string
  /** 转为 CSS hex 字符串（#RRGGBB / #RRGGBBAA） */
  toCSS_Hex(): string
  /** 转为 RGBA 数组 [r, g, b, a] */
  toArray(): [number, number, number, number]
  /** 转为 RGBA 对象（r/g/b 为 0-255） */
  toRGBA(): { r: number; g: number; b: number; a: number }
  /** 转为 RGBA 对象（r/g/b 为 0-1 浮点数） */
  toFloatRGBA(): { r: number; g: number; b: number; a: number }

  // ---- 运算 ----

  /** 与另一个颜色混合（alpha 混合） */
  blend(other: Color, t: number): this
  /** 亮度倍增 */
  multiplyScalar(s: number): this

  // ---- 查询 ----

  /** 是否等于另一个颜色 */
  equals(other: Color): boolean
  /** 亮度（0-1，基于相对 luminance 公式） */
  luminance(): number

  // ---- 工具 ----

  /** 克隆一个新的 Color */
  clone(): Color
  /** 调试用字符串 */
  toString(): string
}
