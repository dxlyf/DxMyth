// ============================================================
// Color — RGBA 颜色，实现 types/Color 接口
// ============================================================

import type { Color as IColor, ColorValue } from '../types/Color'

/**
 * 颜色类
 * r/g/b 存储为 0-255，a 存储为 0-1
 */
export class Color implements IColor {
  r: number = 0
  g: number = 0
  b: number = 0
  a: number = 1

  constructor(value?: ColorValue) {
    if (value !== undefined) {
      this.set(value)
    }
  }

  // ==================== 静态工厂 ====================

  /** 从 ColorValue 创建 Color */
  static from(value: ColorValue): Color {
    return new Color(value)
  }

  /** 从 RGBA 分量（0-255）创建 */
  static fromRGBA(r: number, g: number, b: number, a: number = 1): Color {
    return new Color().setRGBA(r, g, b, a)
  }

  /** 从 RGB 分量（0-1 浮点）创建 */
  static fromFloatRGBA(r: number, g: number, b: number, a: number = 1): Color {
    return new Color().setFloatRGBA(r, g, b, a)
  }

  /** 从 HSL 创建（h:0-360, s:0-100, l:0-100, a:0-1） */
  static fromHSL(h: number, s: number, l: number, a: number = 1): Color {
    return new Color()._setHSL(h, s, l, a)
  }

  /** 从 HSV 创建（h:0-360, s:0-100, v:0-100, a:0-1） */
  static fromHSV(h: number, s: number, v: number, a: number = 1): Color {
    return new Color()._setHSV(h, s, v, a)
  }

  /** 从十六进制字符串创建（支持 #RGB、#RRGGBB、#RRGGBBAA、0x 前缀） */
  static fromHex(hex: string): Color {
    return new Color()._setHex(hex)
  }

  /** 从 RGBA 数组创建 */
  static fromArray(arr: [number, number, number, number?]): Color {
    return new Color().set(arr)
  }

  // ==================== 写入 ====================

  set(value: ColorValue): this {
    if (typeof value === 'string') {
      return this._setString(value)
    }
    if (typeof value === 'number') {
      return this._setNumber(value)
    }
    if (Array.isArray(value)) {
      this.r = clamp(value[0], 0, 255)
      this.g = clamp(value[1], 0, 255)
      this.b = clamp(value[2], 0, 255)
      this.a = value[3] !== undefined ? clamp(value[3], 0, 1) : 1
      return this
    }
    // { r, g, b, a? }
    if ('r' in value && 'g' in value && 'b' in value) {
      const v = value as { r: number; g: number; b: number; a?: number }
      this.r = clamp(v.r, 0, 255)
      this.g = clamp(v.g, 0, 255)
      this.b = clamp(v.b, 0, 255)
      this.a = v.a !== undefined ? clamp(v.a, 0, 1) : 1
      return this
    }
    return this
  }

  setRGBA(r: number, g: number, b: number, a?: number): this {
    this.r = clamp(r, 0, 255)
    this.g = clamp(g, 0, 255)
    this.b = clamp(b, 0, 255)
    this.a = a !== undefined ? clamp(a, 0, 1) : 1
    return this
  }

  copy(c: IColor): this {
    this.r = c.r
    this.g = c.g
    this.b = c.b
    this.a = c.a
    return this
  }

  setFloatRGBA(r: number, g: number, b: number, a?: number): this {
    this.r = clamp(Math.round(r * 255), 0, 255)
    this.g = clamp(Math.round(g * 255), 0, 255)
    this.b = clamp(Math.round(b * 255), 0, 255)
    this.a = a !== undefined ? clamp(a, 0, 1) : 1
    return this
  }

  // ==================== 转换 ====================

  toCSS_RGBA(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  toCSS_Hex(): string {
    const r = this.r.toString(16).padStart(2, '0')
    const g = this.g.toString(16).padStart(2, '0')
    const b = this.b.toString(16).padStart(2, '0')
    if (this.a < 1) {
      const a = Math.round(this.a * 255).toString(16).padStart(2, '0')
      return `#${r}${g}${b}${a}`
    }
    return `#${r}${g}${b}`
  }

  toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a]
  }

  toRGBA(): { r: number; g: number; b: number; a: number } {
    return { r: this.r, g: this.g, b: this.b, a: this.a }
  }

  toFloatRGBA(): { r: number; g: number; b: number; a: number } {
    return { r: this.r / 255, g: this.g / 255, b: this.b / 255, a: this.a }
  }

  // ==================== 运算 ====================

  blend(other: IColor, t: number): this {
    t = clamp(t, 0, 1)
    this.r = Math.round(this.r + (other.r - this.r) * t)
    this.g = Math.round(this.g + (other.g - this.g) * t)
    this.b = Math.round(this.b + (other.b - this.b) * t)
    this.a = this.a + (other.a - this.a) * t
    return this
  }

  multiplyScalar(s: number): this {
    this.r = clamp(Math.round(this.r * s), 0, 255)
    this.g = clamp(Math.round(this.g * s), 0, 255)
    this.b = clamp(Math.round(this.b * s), 0, 255)
    return this
  }

  // ==================== 查询 ====================

  equals(other: IColor): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a
  }

  luminance(): number {
    const rs = this.r / 255
    const gs = this.g / 255
    const bs = this.b / 255
    // sRGB relative luminance
    const rl = rs <= 0.03928 ? rs / 12.92 : ((rs + 0.055) / 1.055) ** 2.4
    const gl = gs <= 0.03928 ? gs / 12.92 : ((gs + 0.055) / 1.055) ** 2.4
    const bl = bs <= 0.03928 ? bs / 12.92 : ((bs + 0.055) / 1.055) ** 2.4
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  }

  // ==================== 工具 ====================

  clone(): IColor {
    return new Color().setRGBA(this.r, this.g, this.b, this.a)
  }

  toString(): string {
    return this.toCSS_RGBA()
  }

  // ==================== 内部解析 ====================

  private _setString(value: string): this {
    const s = value.trim()

    // 空字符串
    if (!s) return this

    // hex: #RGB, #RRGGBB, #RRGGBBAA, 0x 前缀
    if (s.startsWith('#')) {
      return this._setHex(s)
    }
    if (s.startsWith('0x')) {
      return this._setNumber(parseInt(s, 16))
    }

    // rgba/rgb
    const rgbaMatch = s.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i)
    if (rgbaMatch) {
      this.r = clamp(parseInt(rgbaMatch[1]), 0, 255)
      this.g = clamp(parseInt(rgbaMatch[2]), 0, 255)
      this.b = clamp(parseInt(rgbaMatch[3]), 0, 255)
      this.a = rgbaMatch[4] !== undefined ? clamp(parseFloat(rgbaMatch[4]), 0, 1) : 1
      return this
    }

    // hsla/hsl
    const hslaMatch = s.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/i)
    if (hslaMatch) {
      return this._setHSL(parseFloat(hslaMatch[1]), parseFloat(hslaMatch[2]), parseFloat(hslaMatch[3]),
        hslaMatch[4] !== undefined ? clamp(parseFloat(hslaMatch[4]), 0, 1) : 1)
    }

    // hsva/hsv
    const hsvaMatch = s.match(/^hsva?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/i)
    if (hsvaMatch) {
      return this._setHSV(parseFloat(hsvaMatch[1]), parseFloat(hsvaMatch[2]), parseFloat(hsvaMatch[3]),
        hsvaMatch[4] !== undefined ? clamp(parseFloat(hsvaMatch[4]), 0, 1) : 1)
    }

    // 预定义颜色名（简化版）
    const named = _namedColors[s.toLowerCase()]
    if (named) {
      this.r = named[0]
      this.g = named[1]
      this.b = named[2]
      this.a = 1
      return this
    }

    return this
  }

  private _setNumber(value: number): this {
    const hex = value >>> 0
    if (hex > 0xffffff) {
      // 0xRRGGBBAA
      this.r = (hex >> 24) & 0xff
      this.g = (hex >> 16) & 0xff
      this.b = (hex >> 8) & 0xff
      this.a = (hex & 0xff) / 255
    } else {
      this.r = (hex >> 16) & 0xff
      this.g = (hex >> 8) & 0xff
      this.b = hex & 0xff
      this.a = 1
    }
    return this
  }

  private _setHex(hex: string): this {
    let h = hex.replace(/^#/, '')
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    }
    if (h.length === 4) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
    }
    const num = parseInt(h, 16)
    if (h.length === 8) {
      this.r = (num >> 24) & 0xff
      this.g = (num >> 16) & 0xff
      this.b = (num >> 8) & 0xff
      this.a = (num & 0xff) / 255
    } else {
      this.r = (num >> 16) & 0xff
      this.g = (num >> 8) & 0xff
      this.b = num & 0xff
      this.a = 1
    }
    return this
  }

  /** HSL → RGB 转换 */
  private _setHSL(h: number, s: number, l: number, a: number = 1): this {
    h = ((h % 360) + 360) % 360
    s = clamp(s, 0, 100) / 100
    l = clamp(l, 0, 100) / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r1 = 0, g1 = 0, b1 = 0
    if (h < 60) { r1 = c; g1 = x; b1 = 0 }
    else if (h < 120) { r1 = x; g1 = c; b1 = 0 }
    else if (h < 180) { r1 = 0; g1 = c; b1 = x }
    else if (h < 240) { r1 = 0; g1 = x; b1 = c }
    else if (h < 300) { r1 = x; g1 = 0; b1 = c }
    else { r1 = c; g1 = 0; b1 = x }

    this.r = Math.round((r1 + m) * 255)
    this.g = Math.round((g1 + m) * 255)
    this.b = Math.round((b1 + m) * 255)
    this.a = a
    return this
  }

  /** HSV → RGB 转换 */
  private _setHSV(h: number, s: number, v: number, a: number = 1): this {
    h = ((h % 360) + 360) % 360
    s = clamp(s, 0, 100) / 100
    v = clamp(v, 0, 100) / 100

    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r1 = 0, g1 = 0, b1 = 0
    if (h < 60) { r1 = c; g1 = x; b1 = 0 }
    else if (h < 120) { r1 = x; g1 = c; b1 = 0 }
    else if (h < 180) { r1 = 0; g1 = c; b1 = x }
    else if (h < 240) { r1 = 0; g1 = x; b1 = c }
    else if (h < 300) { r1 = x; g1 = 0; b1 = c }
    else { r1 = c; g1 = 0; b1 = x }

    this.r = Math.round((r1 + m) * 255)
    this.g = Math.round((g1 + m) * 255)
    this.b = Math.round((b1 + m) * 255)
    this.a = a
    return this
  }
}

// ==================== 工具函数 ====================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** 常用颜色名 → RGB */
const _namedColors: Record<string, [number, number, number]> = {
  transparent: [0, 0, 0],
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  purple: [128, 0, 128],
  brown: [165, 42, 42],
  navy: [0, 0, 128],
  teal: [0, 128, 128],
  maroon: [128, 0, 0],
  coral: [255, 127, 80],
  tomato: [255, 99, 71],
  gold: [255, 215, 0],
  silver: [192, 192, 192],
  lime: [0, 255, 0],
  olive: [128, 128, 0],
  aqua: [0, 255, 255],
  fuchsia: [255, 0, 255],
  indigo: [75, 0, 130],
  violet: [238, 130, 238],
  skyblue: [135, 206, 235],
  khaki: [240, 230, 140],
  plum: [221, 160, 221],
  wheat: [245, 222, 179],
  tan: [210, 180, 140],
  salmon: [250, 128, 114],
  chocolate: [210, 105, 30],
  sienna: [160, 82, 45],
  steelblue: [70, 130, 180],
  midnightblue: [25, 25, 112],
  darkslateblue: [72, 61, 139],
  mediumslateblue: [123, 104, 238],
  slateblue: [106, 90, 205],
  darkslategray: [47, 79, 79],
  dimgray: [105, 105, 105],
  lightgray: [211, 211, 211],
  lightgrey: [211, 211, 211],
  gainsboro: [220, 220, 220],
  whitesmoke: [245, 245, 245],
  floralwhite: [255, 250, 240],
  oldlace: [253, 245, 230],
  linen: [250, 240, 230],
  antiquewhite: [250, 235, 215],
  papayawhip: [255, 239, 213],
  blanchedalmond: [255, 235, 205],
  bisque: [255, 228, 196],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  peachpuff: [255, 218, 185],
  mistyrose: [255, 228, 225],
  lavenderblush: [255, 240, 245],
  lavender: [230, 230, 250],
  thistle: [216, 191, 216],
  orchid: [218, 112, 214],
  mediumorchid: [186, 85, 211],
  darkorchid: [153, 50, 204],
  darkviolet: [148, 0, 211],
  darkmagenta: [139, 0, 139],
  mediumvioletred: [199, 21, 133],
  palevioletred: [219, 112, 147],
  deeppink: [255, 20, 147],
  hotpink: [255, 105, 180],
  lightpink: [255, 182, 193],
  indianred: [205, 92, 92],
  lightcoral: [240, 128, 128],
  darkred: [139, 0, 0],
  firebrick: [178, 34, 34],
  crimson: [220, 20, 60],
  darksalmon: [233, 150, 122],
  lightsalmon: [255, 160, 122],
  darkorange: [255, 140, 0],
  lightyellow: [255, 255, 224],
  lemonchiffon: [255, 250, 205],
  lightgoldenrodyellow: [250, 250, 210],
  palegoldenrod: [238, 232, 170],
  darkkhaki: [189, 183, 107],
  yellowgreen: [154, 205, 50],
  lawngreen: [124, 252, 0],
  chartreuse: [127, 255, 0],
  limegreen: [50, 205, 50],
  palegreen: [152, 251, 152],
  lightgreen: [144, 238, 144],
  mediumspringgreen: [0, 250, 154],
  springgreen: [0, 255, 127],
  mediumseagreen: [60, 179, 113],
  seagreen: [46, 139, 87],
  forestgreen: [34, 139, 34],
  darkgreen: [0, 100, 0],
  darkolivegreen: [85, 107, 47],
  darkseagreen: [143, 188, 143],
  mediumaquamarine: [102, 205, 170],
  aquamarine: [127, 255, 212],
  paleturquoise: [175, 238, 238],
  mediumturquoise: [72, 209, 204],
  lightseagreen: [32, 178, 170],
  turquoise: [64, 224, 208],
  darkturquoise: [0, 206, 209],
  lightcyan: [224, 255, 255],
  palegray: [238, 238, 238],
  palegrey: [238, 238, 238],
  aliceblue: [240, 248, 255],
  azure: [240, 255, 255],
  honeydew: [240, 255, 240],
  mintcream: [245, 255, 250],
  snow: [255, 250, 250],
  ivory: [255, 255, 240],
  seashell: [255, 245, 238],
  beige: [245, 245, 220],
  cornsilk: [255, 248, 220],
  darkcyan: [0, 139, 139],
  darkblue: [0, 0, 139],
  mediumblue: [0, 0, 205],
  royalblue: [65, 105, 225],
  dodgerblue: [30, 144, 255],
  deepskyblue: [0, 191, 255],
  cornflowerblue: [100, 149, 237],
  lightsblue: [173, 216, 230],
  lightsteelblue: [176, 196, 222],
  powderblue: [176, 224, 230],
  lightskyblue: [135, 206, 250],
  cadetblue: [95, 158, 160],
  darkgoldenrod: [184, 134, 11],
  peru: [205, 133, 63],
  burlywood: [222, 184, 135],
  saddlebrown: [139, 69, 19],
  sandybrown: [244, 164, 96],
  rosybrown: [188, 143, 143],
}
