/** 颜色元素索引常量 */
export declare const enum ColorIndex {
    R = 0,
    G = 1,
    B = 2,
    A = 3
}
export type ColorValue = number[] | Float32Array;
export type ColorInput = number[] | string | number | Float32Array;
export declare const colorMap: {
    readonly aliceblue: Float32Array<ArrayBuffer>;
    readonly antiquewhite: Float32Array<ArrayBuffer>;
    readonly aqua: Float32Array<ArrayBuffer>;
    readonly aquamarine: Float32Array<ArrayBuffer>;
    readonly azure: Float32Array<ArrayBuffer>;
    readonly beige: Float32Array<ArrayBuffer>;
    readonly bisque: Float32Array<ArrayBuffer>;
    readonly black: Float32Array<ArrayBuffer>;
    readonly blanchedalmond: Float32Array<ArrayBuffer>;
    readonly blue: Float32Array<ArrayBuffer>;
    readonly blueviolet: Float32Array<ArrayBuffer>;
    readonly brown: Float32Array<ArrayBuffer>;
    readonly burlywood: Float32Array<ArrayBuffer>;
    readonly cadetblue: Float32Array<ArrayBuffer>;
    readonly chartreuse: Float32Array<ArrayBuffer>;
    readonly chocolate: Float32Array<ArrayBuffer>;
    readonly coral: Float32Array<ArrayBuffer>;
    readonly cornflowerblue: Float32Array<ArrayBuffer>;
    readonly cornsilk: Float32Array<ArrayBuffer>;
    readonly crimson: Float32Array<ArrayBuffer>;
    readonly cyan: Float32Array<ArrayBuffer>;
    readonly darkblue: Float32Array<ArrayBuffer>;
    readonly darkcyan: Float32Array<ArrayBuffer>;
    readonly darkgoldenrod: Float32Array<ArrayBuffer>;
    readonly darkgray: Float32Array<ArrayBuffer>;
    readonly darkgreen: Float32Array<ArrayBuffer>;
    readonly darkgrey: Float32Array<ArrayBuffer>;
    readonly darkkhaki: Float32Array<ArrayBuffer>;
    readonly darkmagenta: Float32Array<ArrayBuffer>;
    readonly darkolivegreen: Float32Array<ArrayBuffer>;
    readonly darkorange: Float32Array<ArrayBuffer>;
    readonly darkorchid: Float32Array<ArrayBuffer>;
    readonly darkred: Float32Array<ArrayBuffer>;
    readonly darksalmon: Float32Array<ArrayBuffer>;
    readonly darkseagreen: Float32Array<ArrayBuffer>;
    readonly darkslateblue: Float32Array<ArrayBuffer>;
    readonly darkslategray: Float32Array<ArrayBuffer>;
    readonly darkslategrey: Float32Array<ArrayBuffer>;
    readonly darkturquoise: Float32Array<ArrayBuffer>;
    readonly darkviolet: Float32Array<ArrayBuffer>;
    readonly deeppink: Float32Array<ArrayBuffer>;
    readonly deepskyblue: Float32Array<ArrayBuffer>;
    readonly dimgray: Float32Array<ArrayBuffer>;
    readonly dimgrey: Float32Array<ArrayBuffer>;
    readonly dodgerblue: Float32Array<ArrayBuffer>;
    readonly firebrick: Float32Array<ArrayBuffer>;
    readonly floralwhite: Float32Array<ArrayBuffer>;
    readonly forestgreen: Float32Array<ArrayBuffer>;
    readonly fuchsia: Float32Array<ArrayBuffer>;
    readonly gainsboro: Float32Array<ArrayBuffer>;
    readonly ghostwhite: Float32Array<ArrayBuffer>;
    readonly gold: Float32Array<ArrayBuffer>;
    readonly goldenrod: Float32Array<ArrayBuffer>;
    readonly gray: Float32Array<ArrayBuffer>;
    readonly green: Float32Array<ArrayBuffer>;
    readonly greenyellow: Float32Array<ArrayBuffer>;
    readonly grey: Float32Array<ArrayBuffer>;
    readonly honeydew: Float32Array<ArrayBuffer>;
    readonly hotpink: Float32Array<ArrayBuffer>;
    readonly indianred: Float32Array<ArrayBuffer>;
    readonly indigo: Float32Array<ArrayBuffer>;
    readonly ivory: Float32Array<ArrayBuffer>;
    readonly khaki: Float32Array<ArrayBuffer>;
    readonly lavender: Float32Array<ArrayBuffer>;
    readonly lavenderblush: Float32Array<ArrayBuffer>;
    readonly lawngreen: Float32Array<ArrayBuffer>;
    readonly lemonchiffon: Float32Array<ArrayBuffer>;
    readonly lightblue: Float32Array<ArrayBuffer>;
    readonly lightcoral: Float32Array<ArrayBuffer>;
    readonly lightcyan: Float32Array<ArrayBuffer>;
    readonly lightgoldenrodyellow: Float32Array<ArrayBuffer>;
    readonly lightgray: Float32Array<ArrayBuffer>;
    readonly lightgreen: Float32Array<ArrayBuffer>;
    readonly lightgrey: Float32Array<ArrayBuffer>;
    readonly lightpink: Float32Array<ArrayBuffer>;
    readonly lightsalmon: Float32Array<ArrayBuffer>;
    readonly lightseagreen: Float32Array<ArrayBuffer>;
    readonly lightskyblue: Float32Array<ArrayBuffer>;
    readonly lightslategray: Float32Array<ArrayBuffer>;
    readonly lightslategrey: Float32Array<ArrayBuffer>;
    readonly lightsteelblue: Float32Array<ArrayBuffer>;
    readonly lightyellow: Float32Array<ArrayBuffer>;
    readonly lime: Float32Array<ArrayBuffer>;
    readonly limegreen: Float32Array<ArrayBuffer>;
    readonly linen: Float32Array<ArrayBuffer>;
    readonly magenta: Float32Array<ArrayBuffer>;
    readonly maroon: Float32Array<ArrayBuffer>;
    readonly mediumaquamarine: Float32Array<ArrayBuffer>;
    readonly mediumblue: Float32Array<ArrayBuffer>;
    readonly mediumorchid: Float32Array<ArrayBuffer>;
    readonly mediumpurple: Float32Array<ArrayBuffer>;
    readonly mediumseagreen: Float32Array<ArrayBuffer>;
    readonly mediumslateblue: Float32Array<ArrayBuffer>;
    readonly mediumspringgreen: Float32Array<ArrayBuffer>;
    readonly mediumturquoise: Float32Array<ArrayBuffer>;
    readonly mediumvioletred: Float32Array<ArrayBuffer>;
    readonly midnightblue: Float32Array<ArrayBuffer>;
    readonly mintcream: Float32Array<ArrayBuffer>;
    readonly mistyrose: Float32Array<ArrayBuffer>;
    readonly moccasin: Float32Array<ArrayBuffer>;
    readonly navajowhite: Float32Array<ArrayBuffer>;
    readonly navy: Float32Array<ArrayBuffer>;
    readonly oldlace: Float32Array<ArrayBuffer>;
    readonly olive: Float32Array<ArrayBuffer>;
    readonly olivedrab: Float32Array<ArrayBuffer>;
    readonly orange: Float32Array<ArrayBuffer>;
    readonly orangered: Float32Array<ArrayBuffer>;
    readonly orchid: Float32Array<ArrayBuffer>;
    readonly palegoldenrod: Float32Array<ArrayBuffer>;
    readonly palegreen: Float32Array<ArrayBuffer>;
    readonly paleturquoise: Float32Array<ArrayBuffer>;
    readonly palevioletred: Float32Array<ArrayBuffer>;
    readonly papayawhip: Float32Array<ArrayBuffer>;
    readonly peachpuff: Float32Array<ArrayBuffer>;
    readonly peru: Float32Array<ArrayBuffer>;
    readonly pink: Float32Array<ArrayBuffer>;
    readonly plum: Float32Array<ArrayBuffer>;
    readonly powderblue: Float32Array<ArrayBuffer>;
    readonly purple: Float32Array<ArrayBuffer>;
    readonly rebeccapurple: Float32Array<ArrayBuffer>;
    readonly red: Float32Array<ArrayBuffer>;
    readonly rosybrown: Float32Array<ArrayBuffer>;
    readonly royalblue: Float32Array<ArrayBuffer>;
    readonly saddlebrown: Float32Array<ArrayBuffer>;
    readonly salmon: Float32Array<ArrayBuffer>;
    readonly sandybrown: Float32Array<ArrayBuffer>;
    readonly seagreen: Float32Array<ArrayBuffer>;
    readonly seashell: Float32Array<ArrayBuffer>;
    readonly sienna: Float32Array<ArrayBuffer>;
    readonly silver: Float32Array<ArrayBuffer>;
    readonly skyblue: Float32Array<ArrayBuffer>;
    readonly slateblue: Float32Array<ArrayBuffer>;
    readonly slategray: Float32Array<ArrayBuffer>;
    readonly slategrey: Float32Array<ArrayBuffer>;
    readonly snow: Float32Array<ArrayBuffer>;
    readonly springgreen: Float32Array<ArrayBuffer>;
    readonly steelblue: Float32Array<ArrayBuffer>;
    readonly tan: Float32Array<ArrayBuffer>;
    readonly teal: Float32Array<ArrayBuffer>;
    readonly thistle: Float32Array<ArrayBuffer>;
    readonly tomato: Float32Array<ArrayBuffer>;
    readonly transparent: Float32Array<ArrayBuffer>;
    readonly turquoise: Float32Array<ArrayBuffer>;
    readonly violet: Float32Array<ArrayBuffer>;
    readonly wheat: Float32Array<ArrayBuffer>;
    readonly white: Float32Array<ArrayBuffer>;
    readonly whitesmoke: Float32Array<ArrayBuffer>;
    readonly yellow: Float32Array<ArrayBuffer>;
    readonly yellowgreen: Float32Array<ArrayBuffer>;
};
/**
 * 基于 Float32Array 的 RGBA 颜色。
 * 直接继承 Float32Array，可直接传入 WebGL uniform4fv / gl.clearColor 等方法。
 */
export declare class Color extends Float32Array {
    static Transparent: Color;
    static Black: Color;
    static White: Color;
    static toCSS_RGBA(color: ColorValue): string;
    static toHex(color: ColorValue): string;
    static fromRGBA(r: number, g: number, b: number, a?: number): Color;
    /** 从 0-255 字节值创建（自动归一化） */
    static fromBytes(r: number, g: number, b: number, a?: number): Color;
    /** 从 ColorValue 创建 */
    static fromColorValue(v: ColorValue): Color;
    static isColor(input: ColorInput): boolean;
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
    static fromInput(input: ColorInput): ColorValue;
    static tryFromInput(input: ColorInput): ColorValue;
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
    static lerp(a: ColorValue, b: ColorValue, t: number, out?: ColorValue): ColorValue;
    /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
    static lerpHSL(a: Color, b: Color, t: number, out?: Color): ColorValue;
    /** LAB 空间插值（感知均匀），色带过渡最自然 */
    static lerpLAB(a: Color, b: Color, t: number, out?: Color): Color;
    /** 生成随机颜色 */
    static random(alpha?: number): Color;
    /** 生成随机鲜艳颜色（高饱和度 HSL） */
    static randomVibrant(alpha?: number): Color;
    private static _rgbToLAB;
    private static _labToRGB;
}
