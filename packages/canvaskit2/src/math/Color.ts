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
}
