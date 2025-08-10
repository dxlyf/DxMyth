export type ColorValue = string | number | RGBColor | HSLColor;
export interface RGBColor {
    r: number;
    g: number;
    b: number;
}
export interface HSLColor {
    h: number;
    s: number;
    l: number;
}
export interface HSVColor {
    h: number;
    s: number;
    v: number;
}
export declare function rgbToHsl(r: number, g: number, b: number): HSLColor;
export declare function hslToRgb(h: number, s: number, l: number): RGBColor;
export declare function rgbToHsv(r: number, g: number, b: number): HSVColor;
export declare function hsvToRgb(h: number, s: number, v: number): RGBColor;
export declare function hslToHsv(h: number, s: number, l: number): HSVColor;
export declare function hsvToHsl(h: number, s: number, v: number): HSLColor;
export declare function hexToRgb(hex: string | number): RGBColor;
export declare function lerpColor(start: RGBColor, end: RGBColor, t: number): RGBColor;
export declare class Color {
    static Transparent: Color;
    static BLACK: Color;
    static WHITE: Color;
    static isColor(color: string | Color | number | unknown): boolean;
    static parse(color: string | Color | number | unknown): Color;
    static fromRGB(r: RGBColor): Color;
    static fromRGB(r: number, g: number, b: number): Color;
    static fromRGBA(r: RGBColor, a: number): Color;
    static fromRGBA(r: number, g: number, b: number, a: number): Color;
    static fromHSL(h: number, s: number, l: number): Color;
    static fromHSV(h: number, s: number, v: number): Color;
    private _r;
    private _g;
    private _b;
    private _a;
    constructor(r?: number, g?: number, b?: number, a?: number);
    copy(source: Color): this;
    clone(): Color;
    setRGB(r: number, g: number, b: number): this;
    normalize(): this;
    set r(r: number);
    get r(): number;
    set g(g: number);
    get g(): number;
    set b(b: number);
    get b(): number;
    get a(): number;
    set a(alpha: number);
    set alpha(alpha: number);
    get alpha(): number;
    equals(other: Color): boolean;
    setOpacity(opacity: number): this;
    mix(dst: Color, src: Color, t?: number): Color;
    setRBG(r: number, g: number, b: number): this;
    setRGBColor(rgb: RGBColor): this;
    brighten(amount: number): this;
    multiplyScalar(s: number): this;
    multiply(s: Color): this;
    add(s: Color): this;
    round(): this;
    floor(): this;
    clamp(min?: number, max?: number): this;
    toCssRGB(): string;
}
