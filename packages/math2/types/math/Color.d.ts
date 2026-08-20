/** 颜色元素索引常量 */
export declare const enum ColorIndex {
    R = 0,
    G = 1,
    B = 2,
    A = 3
}
export type ColorLike = number[] | Float32Array;
export type ColorValue = number[] | string | number;
/**
 * 基于 Float32Array 的 RGBA 颜色。
 * 直接继承 Float32Array，可直接传入 WebGL uniform4fv / gl.clearColor 等方法。
 */
export declare class Color extends Float32Array {
    static toCSS_RGBA(color: ColorLike): string;
    static fromRGBA(r: number, g: number, b: number, a?: number): Color;
    /** 从 0-255 字节值创建（自动归一化） */
    static fromBytes(r: number, g: number, b: number, a?: number): Color;
    /** 从 ColorValue 创建 */
    static fromColorValue(v: ColorLike): Color;
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
    static fromInput(input: string | number | number[]): Color;
    /** "0xRRGGBB" 或 "0xRRGGBBAA" 十六进制整数 */
    private static _fromHexNumber;
    /** "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA" */
    private static _fromHexString;
    /** "rgb(r, g, b)" / "rgba(r, g, b, a)" */
    private static _fromRGBString;
    /** "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)" */
    private static _fromHSLString;
    /** "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)" */
    private static _fromHSVString;
    private static _hslToRgba;
    private static _hsvToRgba;
    constructor(r?: number, g?: number, b?: number, a?: number);
    get r(): number;
    set r(v: number);
    get g(): number;
    set g(v: number);
    get b(): number;
    set b(v: number);
    get a(): number;
    set a(v: number);
    fromValues(r: number, g: number, b: number, a?: number): this;
    copy(c: Color): this;
    /** 转为 CSS rgba() 字符串 */
    toRGBAString(): string;
    /** 转为 CSS hex 字符串 */
    toHexString(): string;
    clone(): Color;
    toString(): string;
    /** 获取 HSL 表示 { h:0-360, s:0-1, l:0-1 } */
    toHSL(): {
        h: number;
        s: number;
        l: number;
    };
    /** 从 HSL 设置颜色值 */
    fromHSL(h: number, s: number, l: number, a?: number): this;
    /** 获取 HSV 表示 { h:0-360, s:0-1, v:0-1 } */
    toHSV(): {
        h: number;
        s: number;
        v: number;
    };
    /** 相对亮度（ITU-R BT.709，用于 WCAG 对比度计算） */
    luminance(): number;
    /** WCAG 对比度比率 */
    contrastRatio(other: Color): number;
    /** 感知亮度（加权灰度值） */
    get brightness(): number;
    /** 变亮 */
    brighten(amount: number): this;
    /** 变暗 */
    darken(amount: number): this;
    /** 增加饱和度 */
    saturate(amount: number): this;
    /** 降低饱和度 */
    desaturate(amount: number): this;
    /** 完全去饱和转为灰度 */
    grayscale(): this;
    /** 反转颜色 */
    invert(): this;
    /** 色调旋转（角度制） */
    rotateHue(angle: number): this;
    /** 设置不透明度 */
    setAlpha(a: number): this;
    /** 叠加混合（Porter-Duff over） */
    blendOver(src: Color): this;
    /** 与另一个颜色混合 */
    mix(other: Color, t: number): this;
    /** 获取互补色（返回新实例） */
    complementary(): Color;
    /** 返回前乘以 alpha（预乘 alpha） */
    premultiply(): this;
    /** RGB 空间线性插值 */
    static lerp(a: ColorLike, b: ColorLike, t: number, out?: ColorLike): ColorLike;
    /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
    static lerpHSL(a: Color, b: Color, t: number, out?: Color): ColorLike;
    /** LAB 空间插值（感知均匀），色带过渡最自然 */
    static lerpLAB(a: Color, b: Color, t: number, out?: Color): Color;
    /** 生成随机颜色 */
    static random(alpha?: number): Color;
    /** 生成随机鲜艳颜色（高饱和度 HSL） */
    static randomVibrant(alpha?: number): Color;
    private static _rgbToLAB;
    private static _labToRGB;
}
