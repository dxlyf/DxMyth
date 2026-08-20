// ============================================================
// Color — 基于 Float32Array 的 RGBA 颜色
// 内存布局: [0]=r, [1]=g, [2]=b, [3]=a  (均归一化 0-1)
// 直接继承 Float32Array，与 WebGL / CanvasKit 底层格式兼容
// ============================================================

/** 颜色元素索引常量 */
export const enum ColorIndex {
    R = 0,
    G = 1,
    B = 2,
    A = 3,
}

export type ColorLike = number[] | Float32Array
export type ColorValue = number[]|string|number
/**
 * 基于 Float32Array 的 RGBA 颜色。
 * 直接继承 Float32Array，可直接传入 WebGL uniform4fv / gl.clearColor 等方法。
 */
export class Color extends Float32Array {
    // ---- 静态工厂 ----
    static toCSS_RGBA(color:ColorLike){
        return `rgba(${color[0]*255},${color[1]*255},${color[2]*255},${color[3]})`
    }
    static fromRGBA(r: number, g: number, b: number, a: number = 1): Color {
        return new Color(r, g, b, a)
    }

    /** 从 0-255 字节值创建（自动归一化） */
    static fromBytes(r: number, g: number, b: number, a: number = 255): Color {
        return new Color(r / 255, g / 255, b / 255, a / 255)
    }

    /** 从 ColorValue 创建 */
    static fromColorValue(v: ColorLike): Color {
        return new Color(v[0], v[1], v[2], v[3] ?? 1)
    }

    /**
     * 从多种格式字符串、数值或数组解析颜色。
     *
     * 支持格式:
     *   - 0xRRGGBB / 0xRRGGBBAA  (十六进制数值)
     *   - "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA"  (hex 字符串)
     *   - "rgb(r, g, b)" / "rgba(r, g, b, a)"
     *   - "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)"
     *   - "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)"
     *   - [r, g, b, a?]  (归一化 0-1 数值数组，a 可选，默认 1)
     *   - 关键词 "transparent" → rgba(0,0,0,0)
     */
    static fromInput(input: string | number | number[]): Color {
        if (typeof input === 'number') {
            return Color._fromHexNumber(input)
        }
        if (Array.isArray(input)) {
            return new Color(input[0], input[1], input[2], input[3] ?? 1)
        }
        const s = input.trim()
        if (s === 'transparent') {
            return new Color(0, 0, 0, 0)
        }
        if (s.startsWith('#')) {
            return Color._fromHexString(s)
        }
        const lower = s.toLowerCase()
        if (lower.startsWith('rgba(') || lower.startsWith('rgb(')) {
            return Color._fromRGBString(lower)
        }
        if (lower.startsWith('hsla(') || lower.startsWith('hsl(')) {
            return Color._fromHSLString(lower)
        }
        if (lower.startsWith('hsva(') || lower.startsWith('hsv(')) {
            return Color._fromHSVString(lower)
        }
        // fallback: 尝试作为 hex 字符串
        if (/^[0-9a-fA-F]{3,8}$/.test(s)) {
            return Color._fromHexString('#' + s)
        }
        return new Color(0, 0, 0, 1)
    }

    // ---- 内部解析 ----

    /** "0xRRGGBB" 或 "0xRRGGBBAA" 十六进制整数 */
    private static _fromHexNumber(n: number): Color {
        const hasAlpha = n > 0xffffff
        if (hasAlpha) {
            return new Color(
                ((n >>> 24) & 0xff) / 255,
                ((n >>> 16) & 0xff) / 255,
                ((n >>> 8) & 0xff) / 255,
                (n & 0xff) / 255,
            )
        }
        return new Color(
            ((n >>> 16) & 0xff) / 255,
            ((n >>> 8) & 0xff) / 255,
            (n & 0xff) / 255,
            1,
        )
    }

    /** "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA" */
    private static _fromHexString(hex: string): Color {
        let h = hex.slice(1)
        if (h.length === 3) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
        } else if (h.length === 4) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
        }
        return new Color(
            parseInt(h.slice(0, 2), 16) / 255,
            parseInt(h.slice(2, 4), 16) / 255,
            parseInt(h.slice(4, 6), 16) / 255,
            h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
        )
    }

    /** "rgb(r, g, b)" / "rgba(r, g, b, a)" */
    private static _fromRGBString(s: string): Color {
        const match = s.match(/[\d.]+/g)
        if (!match || match.length < 3) return new Color(0, 0, 0, 1)
        return new Color(
            Math.max(0, Math.min(1, parseFloat(match[0]) / 255)),
            Math.max(0, Math.min(1, parseFloat(match[1]) / 255)),
            Math.max(0, Math.min(1, parseFloat(match[2]) / 255)),
            Math.max(0, Math.min(1, match.length >= 4 ? parseFloat(match[3]) : 1)),
        )
    }

    /** "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)" */
    private static _fromHSLString(s: string): Color {
        const match = s.match(/[\d.]+/g)
        if (!match || match.length < 3) return new Color(0, 0, 0, 1)
        return Color._hslToRgba(
            parseFloat(match[0]) / 360,
            parseFloat(match[1]) / 100,
            parseFloat(match[2]) / 100,
            match.length >= 4 ? parseFloat(match[3]) : 1,
        )
    }

    /** "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)" */
    private static _fromHSVString(s: string): Color {
        const match = s.match(/[\d.]+/g)
        if (!match || match.length < 3) return new Color(0, 0, 0, 1)
        return Color._hsvToRgba(
            parseFloat(match[0]) / 360,
            parseFloat(match[1]) / 100,
            parseFloat(match[2]) / 100,
            match.length >= 4 ? parseFloat(match[3]) : 1,
        )
    }

    // ---- HSL / HSV → Color ----

    private static _hslToRgba(h: number, s: number, l: number, a: number): Color {
        if (s === 0) {
            return new Color(l, l, l, a)
        }
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        return new Color(
            hue2rgb(p, q, h + 1 / 3),
            hue2rgb(p, q, h),
            hue2rgb(p, q, h - 1 / 3),
            a,
        )
    }

    private static _hsvToRgba(h: number, s: number, v: number, a: number): Color {
        const i = Math.floor(h * 6)
        const f = h * 6 - i
        const p = v * (1 - s)
        const q = v * (1 - f * s)
        const t = v * (1 - (1 - f) * s)
        let r: number, g: number, b: number
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break
            case 1: r = q; g = v; b = p; break
            case 2: r = p; g = v; b = t; break
            case 3: r = p; g = q; b = v; break
            case 4: r = t; g = p; b = v; break
            default: r = v; g = p; b = q; break
        }
        return new Color(r, g, b, a)
    }

    // ==================== 实例 API ====================

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        super(4)
        this[0] = r
        this[1] = g
        this[2] = b
        this[3] = a
    }

    // ---- 命名属性访问器 ----

    get r(): number { return this[0] }
    set r(v: number) { this[0] = v }
    get g(): number { return this[1] }
    set g(v: number) { this[1] = v }
    get b(): number { return this[2] }
    set b(v: number) { this[2] = v }
    get a(): number { return this[3] }
    set a(v: number) { this[3] = v }

    // ---- 写入 ----

    fromValues(r: number, g: number, b: number, a: number = 1): this {
        this[0] = r; this[1] = g; this[2] = b; this[3] = a
        return this
    }

    copy(c: Color): this {
        this[0] = c[0]; this[1] = c[1]; this[2] = c[2]; this[3] = c[3]
        return this
    }

    // ---- 输出 ----

    /** 转为 CSS rgba() 字符串 */
    toRGBAString(): string {
        return `rgba(${Math.round(this[0] * 255)},${Math.round(this[1] * 255)},${Math.round(this[2] * 255)},${this[3]})`
    }

    /** 转为 CSS hex 字符串 */
    toHexString(): string {
        const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
        const hex = `#${toHex(this[0])}${toHex(this[1])}${toHex(this[2])}`
        return this[3] < 1 ? hex + toHex(this[3]) : hex
    }

    clone(): Color {
        return new Color(this[0], this[1], this[2], this[3])
    }

    toString(): string {
        return this.toRGBAString()
    }

    // ==================== 颜色空间转换 ====================

    /** 获取 HSL 表示 { h:0-360, s:0-1, l:0-1 } */
    toHSL(): { h: number; s: number; l: number } {
        const r = this[0], g = this[1], b = this[2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const l = (max + min) / 2

        if (max === min) return { h: 0, s: 0, l }

        const d = max - min
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        let h = 0
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }

        return { h: h * 360, s, l }
    }

    /** 从 HSL 设置颜色值 */
    fromHSL(h: number, s: number, l: number, a: number = this[3]): this {
        const c = Color._hslToRgba(h / 360, s, l, a)
        this[0] = c[0]; this[1] = c[1]; this[2] = c[2]; this[3] = c[3]
        return this
    }

    /** 获取 HSV 表示 { h:0-360, s:0-1, v:0-1 } */
    toHSV(): { h: number; s: number; v: number } {
        const r = this[0], g = this[1], b = this[2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const d = max - min
        const v = max
        const s = max === 0 ? 0 : d / max

        if (d === 0) return { h: 0, s, v }

        let h = 0
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
        return { h: h * 360, s, v }
    }

    // ---- 亮度 ----

    /** 相对亮度（ITU-R BT.709，用于 WCAG 对比度计算） */
    luminance(): number {
        const linearize = (c: number): number =>
            c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
        return 0.2126 * linearize(this[0]) + 0.7152 * linearize(this[1]) + 0.0722 * linearize(this[2])
    }

    /** WCAG 对比度比率 */
    contrastRatio(other: Color): number {
        const l1 = this.luminance() + 0.05
        const l2 = other.luminance() + 0.05
        return l1 > l2 ? l1 / l2 : l2 / l1
    }

    /** 感知亮度（加权灰度值） */
    get brightness(): number {
        return 0.299 * this[0] + 0.587 * this[1] + 0.114 * this[2]
    }

    // ---- 颜色变换（就地修改） ----

    /** 变亮 */
    brighten(amount: number): this {
        const hsl = this.toHSL()
        hsl.l = Math.min(1, hsl.l + amount)
        return this.fromHSL(hsl.h, hsl.s, hsl.l)
    }

    /** 变暗 */
    darken(amount: number): this {
        const hsl = this.toHSL()
        hsl.l = Math.max(0, hsl.l - amount)
        return this.fromHSL(hsl.h, hsl.s, hsl.l)
    }

    /** 增加饱和度 */
    saturate(amount: number): this {
        const hsl = this.toHSL()
        hsl.s = Math.min(1, hsl.s + amount)
        return this.fromHSL(hsl.h, hsl.s, hsl.l)
    }

    /** 降低饱和度 */
    desaturate(amount: number): this {
        const hsl = this.toHSL()
        hsl.s = Math.max(0, hsl.s - amount)
        return this.fromHSL(hsl.h, hsl.s, hsl.l)
    }

    /** 完全去饱和转为灰度 */
    grayscale(): this {
        const gray = this.brightness
        this[0] = gray; this[1] = gray; this[2] = gray
        return this
    }

    /** 反转颜色 */
    invert(): this {
        this[0] = 1 - this[0]
        this[1] = 1 - this[1]
        this[2] = 1 - this[2]
        return this
    }

    /** 色调旋转（角度制） */
    rotateHue(angle: number): this {
        const hsl = this.toHSL()
        hsl.h = (hsl.h + angle) % 360
        if (hsl.h < 0) hsl.h += 360
        return this.fromHSL(hsl.h, hsl.s, hsl.l)
    }

    /** 设置不透明度 */
    setAlpha(a: number): this {
        this[3] = Math.max(0, Math.min(1, a))
        return this
    }

    /** 叠加混合（Porter-Duff over） */
    blendOver(src: Color): this {
        const sa = src[3], da = this[3]
        const ao = sa + da * (1 - sa)
        if (ao === 0) { this[0] = this[1] = this[2] = this[3] = 0; return this }
        this[0] = (src[0] * sa + this[0] * da * (1 - sa)) / ao
        this[1] = (src[1] * sa + this[1] * da * (1 - sa)) / ao
        this[2] = (src[2] * sa + this[2] * da * (1 - sa)) / ao
        this[3] = ao
        return this
    }

    /** 与另一个颜色混合 */
    mix(other: Color, t: number): this {
        const mt = 1 - t
        this[0] = this[0] * mt + other[0] * t
        this[1] = this[1] * mt + other[1] * t
        this[2] = this[2] * mt + other[2] * t
        this[3] = this[3] * mt + other[3] * t
        return this
    }

    /** 获取互补色（返回新实例） */
    complementary(): Color {
        return this.clone().rotateHue(180)
    }

    /** 返回前乘以 alpha（预乘 alpha） */
    premultiply(): this {
        const a = this[3]
        this[0] *= a; this[1] *= a; this[2] *= a
        return this
    }

    // ==================== 静态插值器 ====================

    /** RGB 空间线性插值 */
    static lerp(a: ColorLike, b: ColorLike, t: number, out: ColorLike =[]): ColorLike {
        const mt = 1 - t
        out[0] = a[0] * mt + b[0] * t
        out[1] = a[1] * mt + b[1] * t
        out[2] = a[2] * mt + b[2] * t
        out[3] = a[3] * mt + b[3] * t
        return out
    }

    /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
    static lerpHSL(a: Color, b: Color, t: number, out: Color = new Color()): ColorLike {
        const ha = a.toHSL(), hb = b.toHSL()
        const mt = 1 - t

        let dh = hb.h - ha.h
        if (Math.abs(dh) > 180) {
            dh = dh > 0 ? dh - 360 : dh + 360
        }
        const h = ha.h + dh * t
        const s = ha.s * mt + hb.s * t
        const l = ha.l * mt + hb.l * t
        const alpha = a[3] * mt + b[3] * t

        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3]
        out.fromHSL(h < 0 ? h + 360 : (h >= 360 ? h - 360 : h), s, l, alpha)
        return out
    }

    /** LAB 空间插值（感知均匀），色带过渡最自然 */
    static lerpLAB(a: Color, b: Color, t: number, out: Color = new Color()): Color {
        const la = Color._rgbToLAB(a), lb = Color._rgbToLAB(b)
        const mt = 1 - t
        const lab = {
            l: la.l * mt + lb.l * t,
            a: la.a * mt + lb.a * t,
            b: la.b * mt + lb.b * t,
        }
        const alpha = a[3] * mt + b[3] * t
        Color._labToRGB(lab, out)
        out[3] = alpha
        return out
    }

    /** 生成随机颜色 */
    static random(alpha: number = 1): Color {
        return new Color(Math.random(), Math.random(), Math.random(), alpha)
    }

    /** 生成随机鲜艳颜色（高饱和度 HSL） */
    static randomVibrant(alpha: number = 1): Color {
        const h = Math.random() * 360
        return new Color().fromHSL(h, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.15, alpha)
    }

    // ---- LAB 内部转换 ----

    private static _rgbToLAB(c: Color): { l: number; a: number; b: number } {
        // RGB → XYZ
        const linearize = (v: number): number => {
            v = v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92
            return v * 100
        }
        const r = linearize(c[0]), g = linearize(c[1]), b = linearize(c[2])

        const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
        const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
        const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

        // XYZ → LAB（D65 参考白点）
        const f = (v: number): number => v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + 16 / 116
        const fx = f(x / 95.047), fy = f(y / 100.0), fz = f(z / 108.883)

        return {
            l: 116 * fy - 16,
            a: 500 * (fx - fy),
            b: 200 * (fy - fz),
        }
    }

    private static _labToRGB(lab: { l: number; a: number; b: number }, out: Color): void {
        // LAB → XYZ
        const fy = (lab.l + 16) / 116
        const fx = lab.a / 500 + fy
        const fz = fy - lab.b / 200

        const finv = (v: number): number => {
            const v3 = v * v * v
            return v3 > 0.008856 ? v3 : (v - 16 / 116) / 7.787
        }

        const x = finv(fx) * 95.047
        const y = finv(fy) * 100.0
        const z = finv(fz) * 108.883

        // XYZ → RGB
        const delinearize = (v: number): number => {
            v /= 100
            return v > 0.0031308 ? 1.055 * (v ** (1 / 2.4)) - 0.055 : 12.92 * v
        }

        out[0] = Math.max(0, Math.min(1, delinearize(x *  3.2404542 + y * -1.5371385 + z * -0.4985314)))
        out[1] = Math.max(0, Math.min(1, delinearize(x * -0.9692660 + y *  1.8760108 + z *  0.0415560)))
        out[2] = Math.max(0, Math.min(1, delinearize(x *  0.0556434 + y * -0.2040259 + z *  1.0572252)))
    }
}
