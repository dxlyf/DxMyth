/**
 * W3C Compositing and Blending 规范定义的颜色混合模式。
 * - separable（可分离）：normal/multiply/screen/overlay/darken/lighten/color-dodge/color-burn/hard-light/soft-light/difference/exclusion
 * - non-separable（不可分离，需 HSL 联合处理）：hue/saturation/color/luminosity
 */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

/**
 * WebGL 混合因子（对应 gl.blendFunc 的参数）。
 * 命名对齐 WebGL 常量，去掉 GL_ 前缀。
 */
export type BlendFactor =
  | 'ZERO'                  // gl.ZERO
  | 'ONE'                   // gl.ONE
  | 'SRC_COLOR'             // gl.SRC_COLOR
  | 'ONE_MINUS_SRC_COLOR'   // gl.ONE_MINUS_SRC_COLOR
  | 'SRC_ALPHA'             // gl.SRC_ALPHA
  | 'ONE_MINUS_SRC_ALPHA'   // gl.ONE_MINUS_SRC_ALPHA
  | 'DST_ALPHA'             // gl.DST_ALPHA
  | 'ONE_MINUS_DST_ALPHA'   // gl.ONE_MINUS_DST_ALPHA
  | 'DST_COLOR'             // gl.DST_COLOR
  | 'ONE_MINUS_DST_COLOR'   // gl.ONE_MINUS_DST_COLOR
  | 'SRC_ALPHA_SATURATE';   // gl.SRC_ALPHA_SATURATE（仅用于 srcFactor）

/**
 * WebGL 混合方程（对应 gl.blendEquation 的参数）。
 */
export type BlendEquation =
  | 'ADD'               // gl.FUNC_ADD：src + dst
  | 'SUBTRACT'          // gl.FUNC_SUBTRACT：src - dst
  | 'REVERSE_SUBTRACT'  // gl.FUNC_REVERSE_SUBTRACT：dst - src
  | 'MIN'               // gl.MIN：min(src, dst)
  | 'MAX';              // gl.MAX：max(src, dst)


export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // ---- 工厂方法 ----

  static fromHex(hex: string): Color {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length === 6) {
      h += 'FF';
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const a = parseInt(h.substring(6, 8), 16) / 255;
    return new Color(r, g, b, a);
  }

  static fromHSL(h: number, s: number, l: number, a: number = 1): Color {
    const c = new Color();
    c.a = a;

    const hue = ((h % 360) + 360) % 360;
    const sat = Math.max(0, Math.min(1, s));
    const light = Math.max(0, Math.min(1, l));

    if (sat === 0) {
      const v = Math.round(light * 255);
      c.r = v;
      c.g = v;
      c.b = v;
      return c;
    }

    const hueToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    const hNorm = hue / 360;

    c.r = Math.round(hueToRgb(p, q, hNorm + 1 / 3) * 255);
    c.g = Math.round(hueToRgb(p, q, hNorm) * 255);
    c.b = Math.round(hueToRgb(p, q, hNorm - 1 / 3) * 255);

    return c;
  }

  static fromHSV(h: number, s: number, v: number, a: number = 1): Color {
    const c = new Color();
    c.a = a;

    const hue = ((h % 360) + 360) % 360;
    const sat = Math.max(0, Math.min(1, s));
    const val = Math.max(0, Math.min(1, v));

    const i = Math.floor(hue / 60);
    const f = hue / 60 - i;
    const p = val * (1 - sat);
    const q = val * (1 - f * sat);
    const t = val * (1 - (1 - f) * sat);
    const mod = i % 6;

    let r: number, g: number, b: number;
    switch (mod) {
      case 0: r = val; g = t; b = p; break;
      case 1: r = q; g = val; b = p; break;
      case 2: r = p; g = val; b = t; break;
      case 3: r = p; g = q; b = val; break;
      case 4: r = t; g = p; b = val; break;
      case 5: r = val; g = p; b = q; break;
      default: r = 0; g = 0; b = 0;
    }

    c.r = Math.round(r * 255);
    c.g = Math.round(g * 255);
    c.b = Math.round(b * 255);

    return c;
  }

  /**
   * 从 CSS 颜色字符串解析为 Color 实例。
   * 支持格式：
   * - hex：`#rgb` / `#rrggbb`
   * - hexa：`#rgba` / `#rrggbbaa`
   * - rgb：`rgb(r, g, b)` / `rgb(r g b)` / `rgb(r g b / a)`
   * - rgba：`rgba(r, g, b, a)`
   * - hsl：`hsl(h, s%, l%)` / `hsl(h s% l% / a)`
   * - hsla：`hsla(h, s%, l%, a)`
   * - hsv：`hsv(h, s%, v%)`
   * - hsva：`hsva(h, s%, v%, a)`
   * - 关键字：`transparent`（等价于 rgba(0,0,0,0)）
   *
   * 分量规则：
   * - rgb 分量支持 `0-255` 或 `0%-100%`
   * - hsl/hsv 的 s/l/v 支持 `0%-100%` 或 `0-1`
   * - 角度 h 支持 `deg`/`rad`/`turn`/`grad` 单位，无单位视为 deg
   * - alpha 支持 `0-1` 或 `0%-100%`
   */
  static from(color: string): Color {
    if (typeof color !== 'string') {
      throw new TypeError('Color.from expects a string');
    }
    const str = color.trim().toLowerCase();

    if (str === 'transparent' || str === 'none') {
      return new Color(0, 0, 0, 0);
    }

    // 1) 十六进制：#rgb / #rgba / #rrggbb / #rrggbbaa
    if (str.startsWith('#')) {
      return Color._fromHex(str);
    }

    // 2) 函数式：rgb()/rgba()/hsl()/hsla()/hsv()/hsva()
    const match = str.match(/^([a-z]+)\(([^)]*)\)$/);
    if (!match) {
      throw new Error(`Unsupported color format: ${color}`);
    }
    const fn = match[1];
    // 同时支持逗号、空白、斜杠分隔（兼容 CSS Color L4 语法）
    const args = match[2]
      .split(/[\s,/]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    switch (fn) {
      case 'rgb':
      case 'rgba':
        return Color._fromRgbArgs(args);
      case 'hsl':
      case 'hsla':
        return Color._fromHslArgs(args);
      case 'hsv':
      case 'hsva':
        return Color._fromHsvArgs(args);
      default:
        throw new Error(`Unsupported color function: ${fn}()`);
    }
  }

  // ---- 内部解析辅助 ----

  /** 解析十六进制颜色（支持 3/4/6/8 位） */
  private static _fromHex(str: string): Color {
    let h = str.slice(1).trim();
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    } else if (h.length === 4) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    } else if (h.length === 6) {
      h += 'ff';
    } else if (h.length !== 8) {
      throw new Error(`Invalid hex color: ${str}`);
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const a = parseInt(h.substring(6, 8), 16) / 255;
    return new Color(r, g, b, a);
  }

  /** 解析角度（deg/rad/turn/grad，无单位视为 deg） */
  private static _parseAngle(value: string): number {
    if (value.endsWith('deg')) return parseFloat(value);
    if (value.endsWith('rad')) return (parseFloat(value) * 180) / Math.PI;
    if (value.endsWith('turn')) return parseFloat(value) * 360;
    if (value.endsWith('grad')) return parseFloat(value) * 0.9;
    return parseFloat(value);
  }

  /** 解析分量：百分比按 max 缩放，否则视为原始数值 */
  private static _parseComponent(value: string, max: number): number {
    if (value.endsWith('%')) {
      return (parseFloat(value) / 100) * max;
    }
    return parseFloat(value);
  }

  /** 解析 alpha：百分比 → 0-1，否则 0-1 */
  private static _parseAlpha(value: string): number {
    if (value.endsWith('%')) return parseFloat(value) / 100;
    return parseFloat(value);
  }

  /** 从 rgb()/rgba() 参数构造 Color */
  private static _fromRgbArgs(args: string[]): Color {
    if (args.length < 3) {
      throw new Error(`rgb() expects at least 3 arguments, got ${args.length}`);
    }
    const r = Color._parseComponent(args[0], 255);
    const g = Color._parseComponent(args[1], 255);
    const b = Color._parseComponent(args[2], 255);
    const a = args.length >= 4 ? Color._parseAlpha(args[3]) : 1;
    return new Color(r, g, b, a);
  }

  /** 从 hsl()/hsla() 参数构造 Color */
  private static _fromHslArgs(args: string[]): Color {
    if (args.length < 3) {
      throw new Error(`hsl() expects at least 3 arguments, got ${args.length}`);
    }
    const h = Color._parseAngle(args[0]);
    const s = Color._parseComponent(args[1], 1);
    const l = Color._parseComponent(args[2], 1);
    const a = args.length >= 4 ? Color._parseAlpha(args[3]) : 1;
    return Color.fromHSL(h, s, l, a);
  }

  /** 从 hsv()/hsva() 参数构造 Color */
  private static _fromHsvArgs(args: string[]): Color {
    if (args.length < 3) {
      throw new Error(`hsv() expects at least 3 arguments, got ${args.length}`);
    }
    const h = Color._parseAngle(args[0]);
    const s = Color._parseComponent(args[1], 1);
    const v = Color._parseComponent(args[2], 1);
    const a = args.length >= 4 ? Color._parseAlpha(args[3]) : 1;
    return Color.fromHSV(h, s, v, a);
  }

  // ---- 导出 ----

  toHex(): string {
    const r = Math.round(Math.max(0, Math.min(255, this.r)));
    const g = Math.round(Math.max(0, Math.min(255, this.g)));
    const b = Math.round(Math.max(0, Math.min(255, this.b)));
    const a = Math.round(Math.max(0, Math.min(255, this.a * 255)));
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  }

  toHexRGB(): string {
    return this.toHex().substring(0, 7);
  }

  toHSL(): { h: number; s: number; l: number; a: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
    }
    h = Math.round(((h * 60 + 360) % 360) * 100) / 100;

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return {
      h,
      s: Math.round(s * 100) / 100,
      l: Math.round(l * 100) / 100,
      a: this.a,
    };
  }

  toHSV(): { h: number; s: number; v: number; a: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
    }
    h = Math.round(((h * 60 + 360) % 360) * 100) / 100;

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return {
      h,
      s: Math.round(s * 100) / 100,
      v: Math.round(v * 100) / 100,
      a: this.a,
    };
  }

  // ---- 实例方法 ----

  setFromHex(hex: string): this {
    const c = Color.fromHex(hex);
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }

  setFromHSL(h: number, s: number, l: number, a: number = 1): this {
    const c = Color.fromHSL(h, s, l, a);
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }

  setFromHSV(h: number, s: number, v: number, a: number = 1): this {
    const c = Color.fromHSV(h, s, v, a);
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  equals(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
  }

  /**
   * 变亮：在 HSL 空间增加亮度（不改变色相和饱和度）。
   * @param amount 增加量 0-1（0.2 表示 L 提升 0.2）
   * @returns 新 Color 实例，不修改原对象
   */
  lighten(amount: number): Color {
    const { h, s, l, a } = this.toHSL();
    return Color.fromHSL(h, s, Math.min(1, l + amount), a);
  }

  /**
   * 变暗：在 HSL 空间降低亮度（不改变色相和饱和度）。
   * @param amount 降低量 0-1
   * @returns 新 Color 实例
   */
  darken(amount: number): Color {
    const { h, s, l, a } = this.toHSL();
    return Color.fromHSL(h, s, Math.max(0, l - amount), a);
  }

  /**
   * 颜色混合：按比例线性插值 this 与 other 的 rgba 各通道。
   * 使用预乘 alpha（premultiplied alpha）以保证与透明色混合时视觉更自然：
   * 先将 rgb 乘以各自 alpha 再插值，最后再除以结果 alpha 还原。
   * @param other 另一个颜色
   * @param amount other 所占比例 0-1（0=纯 this，1=纯 other）
   * @returns 新 Color 实例
   */
  mix(other: Color, amount: number): Color {
    const t = Math.max(0, Math.min(1, amount));
    const r1 = this.r * this.a;
    const g1 = this.g * this.a;
    const b1 = this.b * this.a;
    const r2 = other.r * other.a;
    const g2 = other.g * other.a;
    const b2 = other.b * other.a;
    const a = this.a + (other.a - this.a) * t;
    if (a === 0) return new Color(0, 0, 0, 0);
    const pr = r1 + (r2 - r1) * t;
    const pg = g1 + (g2 - g1) * t;
    const pb = b1 + (b2 - b1) * t;
    return new Color(pr / a, pg / a, pb / a, a);
  }

  /**
   * 颜色合成（W3C Compositing and Blending 规范）。
   *
   * 语义：把 `other`（source 上层）按 `mode` 合成到 `this`（backdrop 下层）之上。
   * 流程：
   * 1. 将 rgb 归一化到 [0,1]
   * 2. 应用 blend 函数 B(Cb, Cs) 得到中间色
   * 3. 通过 source-over compositing 公式合成：
   *    - Co = αs*(1-αb)*Cs + αs*αb*B(Cb,Cs)
   *    - αo = αs + αb*(1-αs)
   * 4. 若 αo=0 返回透明黑；否则 Co/αo 还原为非预乘 rgba（×255）
   *
   * @param other source 上层颜色
   * @param mode 合成模式，见 BlendMode
   * @returns 新 Color 实例
   */
  blend(other: Color, mode: BlendMode): Color {
    const ab = this.a;
    const as_ = other.a;
    const alphaO = as_ + ab * (1 - as_);
    if (alphaO === 0) return new Color(0, 0, 0, 0);

    // 归一化到 [0,1]
    const cbr = this.r / 255;
    const cbg = this.g / 255;
    const cbb = this.b / 255;
    const csr = other.r / 255;
    const csg = other.g / 255;
    const csb = other.b / 255;

    // B(Cb, Cs)
    const [br, bg, bb] = Color._blendChannel(mode, cbr, cbg, cbb, csr, csg, csb);

    // source-over compositing
    const co_r = as_ * (1 - ab) * csr + as_ * ab * br;
    const co_g = as_ * (1 - ab) * csg + as_ * ab * bg;
    const co_b = as_ * (1 - ab) * csb + as_ * ab * bb;

    // 还原非预乘 + 缩放到 0-255
    return new Color(
      (co_r / alphaO) * 255,
      (co_g / alphaO) * 255,
      (co_b / alphaO) * 255,
      alphaO
    );
  }

  /**
   * WebGL 风格的颜色合成函数（对应 gl.blendFunc / gl.blendEquation）。
   *
   * 公式：result = src * srcFactor <op> dst * dstFactor
   *
   * 与 blend() 的区别：
   * - blend() 是 W3C Compositing 规范，按模式名（multiply/screen/...）混合 + source-over
   * - blendFunc() 暴露底层控制：可自由指定 src/dst 因子和操作符
   *   - 因子对应 gl.ZERO / gl.ONE / gl.SRC_ALPHA / gl.ONE_MINUS_SRC_ALPHA 等
   *   - 操作符对应 gl.FUNC_ADD / gl.FUNC_SUBTRACT / gl.FUNC_REVERSE_SUBTRACT / gl.MIN / gl.MAX
   * - 不参与 alpha compositing：直接对 rgb 操作，alpha 默认相加（可关闭）
   *
   * 典型用法：
   * ```ts
   * // 默认半透明混合：src*α + dst*(1-α)
   * Color.blendFunc(src, dst, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA');
   * // 加色混合（如光源叠加）：src + dst
   * Color.blendFunc(src, dst, 'ONE', 'ONE');
   * // 乘法（如阴影叠加）：src * dst
   * Color.blendFunc(src, dst, 'DST_COLOR', 'ZERO');
   * ```
   *
   * @param src 源颜色（上层）
   * @param dst 目标颜色（下层）
   * @param srcFactor 源因子
   * @param dstFactor 目标因子
   * @param op 操作符，默认 'ADD'
   * @param blendAlpha 是否混合 alpha 通道（默认 true，alpha 按 src/dst 因子的 alpha 分量混合）
   */
  static blendFunc(
    src: Color,
    dst: Color,
    srcFactor: BlendFactor,
    dstFactor: BlendFactor,
    op: BlendEquation = 'ADD',
    blendAlpha: boolean = true
  ): Color {
    // 逐通道计算：result = src * sf <op> dst * df
    // 因子可能依赖该通道的 src/dst 分量（SRC_COLOR/DST_COLOR 等），故逐通道解析
    const r = Color._applyEquation(
      src.r * Color._resolveFactor(srcFactor, src.r, dst.r, src.a, dst.a),
      dst.r * Color._resolveFactor(dstFactor, src.r, dst.r, src.a, dst.a),
      op
    );
    const g = Color._applyEquation(
      src.g * Color._resolveFactor(srcFactor, src.g, dst.g, src.a, dst.a),
      dst.g * Color._resolveFactor(dstFactor, src.g, dst.g, src.a, dst.a),
      op
    );
    const b = Color._applyEquation(
      src.b * Color._resolveFactor(srcFactor, src.b, dst.b, src.a, dst.a),
      dst.b * Color._resolveFactor(dstFactor, src.b, dst.b, src.a, dst.a),
      op
    );
    const a = blendAlpha
      ? Color._applyEquation(
          src.a * Color._resolveFactor(srcFactor, src.a, dst.a, src.a, dst.a),
          dst.a * Color._resolveFactor(dstFactor, src.a, dst.a, src.a, dst.a),
          op
        )
      : src.a; // 不混合 alpha 时保留 src alpha

    return new Color(r, g, b, a);
  }

  /** 应用方程：根据操作符组合两个分量 */
  private static _applyEquation(srcTerm: number, dstTerm: number, op: BlendEquation): number {
    switch (op) {
      case 'ADD':              return srcTerm + dstTerm;
      case 'SUBTRACT':         return srcTerm - dstTerm;
      case 'REVERSE_SUBTRACT': return dstTerm - srcTerm;
      case 'MIN':              return Math.min(srcTerm, dstTerm);
      case 'MAX':              return Math.max(srcTerm, dstTerm);
      default:                 return srcTerm + dstTerm;
    }
  }

  /**
   * 解析因子（参考 WebGL 常量语义）。
   * @param factor 因子类型
   * @param srcComp 当前通道的 src 分量（用于 SRC_COLOR / ONE_MINUS_SRC_COLOR）
   * @param dstComp 当前通道的 dst 分量（用于 DST_COLOR / ONE_MINUS_DST_COLOR）
   * @param srcAlpha src 的 alpha
   * @param dstAlpha dst 的 alpha
   */
  private static _resolveFactor(
    factor: BlendFactor,
    srcComp: number,
    dstComp: number,
    srcAlpha: number,
    dstAlpha: number
  ): number {
    switch (factor) {
      case 'ZERO':                return 0;
      case 'ONE':                 return 1;
      case 'SRC_COLOR':           return srcComp;
      case 'ONE_MINUS_SRC_COLOR': return 1 - srcComp;
      case 'SRC_ALPHA':           return srcAlpha;
      case 'ONE_MINUS_SRC_ALPHA': return 1 - srcAlpha;
      case 'DST_ALPHA':           return dstAlpha;
      case 'ONE_MINUS_DST_ALPHA': return 1 - dstAlpha;
      case 'DST_COLOR':           return dstComp;
      case 'ONE_MINUS_DST_COLOR': return 1 - dstComp;
      case 'SRC_ALPHA_SATURATE':  return Math.min(srcAlpha, 1 - dstAlpha);
      default:                    return 1;
    }
  }

  // ---- blend 函数实现（W3C spec）----

  /** 单通道分发：separable 模式逐通道独立；non-separable 模式需整体处理 */
  private static _blendChannel(
    mode: BlendMode,
    cbr: number, cbg: number, cbb: number,
    csr: number, csg: number, csb: number
  ): [number, number, number] {
    switch (mode) {
      // separable（可分离：每通道独立）
      case 'normal':      return [csr, csg, csb];
      case 'multiply':    return [cbr * csr, cbg * csg, cbb * csb];
      case 'screen':      return [cbr + csr - cbr * csr, cbg + csg - cbg * csg, cbb + csb - cbb * csb];
      case 'overlay':     return Color._overlay(cbr, cbg, cbb, csr, csg, csb);
      case 'darken':      return [Math.min(cbr, csr), Math.min(cbg, csg), Math.min(cbb, csb)];
      case 'lighten':     return [Math.max(cbr, csr), Math.max(cbg, csg), Math.max(cbb, csb)];
      case 'color-dodge': return [Color._colorDodge(cbr, csr), Color._colorDodge(cbg, csg), Color._colorDodge(cbb, csb)];
      case 'color-burn':  return [Color._colorBurn(cbr, csr), Color._colorBurn(cbg, csg), Color._colorBurn(cbb, csb)];
      case 'hard-light':  return [Color._hardLight(cbr, csr), Color._hardLight(cbg, csg), Color._hardLight(cbb, csb)];
      case 'soft-light':  return [Color._softLight(cbr, csr), Color._softLight(cbg, csg), Color._softLight(cbb, csb)];
      case 'difference':  return [Math.abs(cbr - csr), Math.abs(cbg - csg), Math.abs(cbb - csb)];
      case 'exclusion':   return [cbr + csr - 2 * cbr * csr, cbg + csg - 2 * cbg * csg, cbb + csb - 2 * cbb * csb];
      // non-separable（不可分离：需 HSL 联合处理）
      case 'hue':         return Color._hue(cbr, cbg, cbb, csr, csg, csb);
      case 'saturation':  return Color._saturation(cbr, cbg, cbb, csr, csg, csb);
      case 'color':       return Color._color(cbr, cbg, cbb, csr, csg, csb);
      case 'luminosity':  return Color._luminosity(cbr, cbg, cbb, csr, csg, csb);
      default:            return [csr, csg, csb];
    }
  }

  /** overlay = HardLight(Cb, Cs) —— 注意 W3C 把 overlay 定义为对调参数的 hard-light */
  private static _overlay(cbr: number, cbg: number, cbb: number, csr: number, csg: number, csb: number): [number, number, number] {
    return [
      Color._hardLight(csr, cbr),
      Color._hardLight(csg, cbg),
      Color._hardLight(csb, cbb),
    ];
  }

  /** color-dodge 单通道 */
  private static _colorDodge(cb: number, cs: number): number {
    if (cb === 0) return 0;
    if (cs === 1) return 1;
    return Math.min(1, cb / (1 - cs));
  }

  /** color-burn 单通道 */
  private static _colorBurn(cb: number, cs: number): number {
    if (cb === 1) return 1;
    if (cs === 0) return 0;
    return 1 - Math.min(1, (1 - cb) / cs);
  }

  /** hard-light 单通道 */
  private static _hardLight(cb: number, cs: number): number {
    return cs <= 0.5
      ? cb * 2 * cs
      : cb + 2 * cs - 1 - cb * (2 * cs - 1);
  }

  /** soft-light 单通道 */
  private static _softLight(cb: number, cs: number): number {
    if (cs <= 0.5) {
      return cb - (1 - 2 * cs) * cb * (1 - cb);
    }
    // D(cb)：soft-light 的非线性函数
    const d = cb <= 0.25
      ? ((16 * cb - 12) * cb + 4) * cb
      : Math.sqrt(cb);
    return cb + (2 * cs - 1) * (d - cb);
  }

  // ---- non-separable 辅助：基于 W3C Lum/Sat/SetLum/SetSat ----

  /** 亮度（W3C Rec. 601 luma） */
  private static _lum(r: number, g: number, b: number): number {
    return 0.3 * r + 0.59 * g + 0.11 * b;
  }

  /** ClipColor：把颜色裁剪到 [0,1] 并保持亮度 */
  private static _clipColor(r: number, g: number, b: number): [number, number, number] {
    const l = Color._lum(r, g, b);
    const n = Math.min(r, g, b);
    const x = Math.max(r, g, b);
    if (n < 0) {
      r = l + ((r - l) * l) / (l - n);
      g = l + ((g - l) * l) / (l - n);
      b = l + ((b - l) * l) / (l - n);
    }
    if (x > 1) {
      r = l + ((r - l) * (1 - l)) / (x - l);
      g = l + ((g - l) * (1 - l)) / (x - l);
      b = l + ((b - l) * (1 - l)) / (x - l);
    }
    return [r, g, b];
  }

  /** SetLum：把颜色调整为指定亮度 */
  private static _setLum(r: number, g: number, b: number, l: number): [number, number, number] {
    const cur = Color._lum(r, g, b);
    const d = l - cur;
    return Color._clipColor(r + d, g + d, b + d);
  }

  /** Sat：饱和度 = max - min */
  private static _sat(r: number, g: number, b: number): number {
    return Math.max(r, g, b) - Math.min(r, g, b);
  }

  /** SetSat：把颜色调整为指定饱和度（保持通道顺序） */
  private static _setSat(r: number, g: number, b: number, s: number): [number, number, number] {
    let arr: [number, number, number] = [r, g, b];
    // 找出最小、中间、最大通道的索引
    let min = 0, mid = 1, max = 2;
    if (arr[0] > arr[1]) { [min, mid] = [mid, min]; }
    if (arr[mid] > arr[2]) { [mid, max] = [max, mid]; }
    if (arr[min] > arr[mid]) { [min, mid] = [mid, min]; }

    if (arr[max] > arr[min]) {
      arr[mid] = ((arr[mid] - arr[min]) * s) / (arr[max] - arr[min]);
      arr[max] = s;
    } else {
      arr[mid] = 0;
      arr[max] = 0;
    }
    arr[min] = 0;
    return arr;
  }

  /** hue 模式：取 source 的色相 + backdrop 的饱和度与亮度 */
  private static _hue(cbr: number, cbg: number, cbb: number, csr: number, csg: number, csb: number): [number, number, number] {
    const [r, g, b] = Color._setLum(csr, csg, csb, Color._lum(cbr, cbg, cbb));
    const [sr, sg, sb] = Color._setSat(r, g, b, Color._sat(cbr, cbg, cbb));
    return Color._setLum(sr, sg, sb, Color._lum(cbr, cbg, cbb));
  }

  /** saturation 模式：取 source 的饱和度 + backdrop 的色相与亮度 */
  private static _saturation(cbr: number, cbg: number, cbb: number, csr: number, csg: number, csb: number): [number, number, number] {
    const [r, g, b] = Color._setSat(cbr, cbg, cbb, Color._sat(csr, csg, csb));
    return Color._setLum(r, g, b, Color._lum(cbr, cbg, cbb));
  }

  /** color 模式：取 source 的色相与饱和度 + backdrop 的亮度 */
  private static _color(cbr: number, cbg: number, cbb: number, csr: number, csg: number, csb: number): [number, number, number] {
    return Color._setLum(csr, csg, csb, Color._lum(cbr, cbg, cbb));
  }

  /** luminosity 模式：取 source 的亮度 + backdrop 的色相与饱和度 */
  private static _luminosity(cbr: number, cbg: number, cbb: number, csr: number, csg: number, csb: number): [number, number, number] {
    return Color._setLum(cbr, cbg, cbb, Color._lum(csr, csg, csb));
  }

  toArray(out: number[] = []): number[] {
    out[0] = this.r;
    out[1] = this.g;
    out[2] = this.b;
    out[3] = this.a;
    return out;
  }
  toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
