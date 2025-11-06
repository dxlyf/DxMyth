import { GradientObject } from '../graphic/Gradient';
export declare function parseCssInt(val: string | number): number;
export declare function parseCssFloat(val: string | number): number;
export declare function parse(colorStr: string, rgbaArr?: number[]): number[];
export declare function lift(color: string, level: number): string;
export declare function toHex(color: string): string;
/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param normalizedValue A float between 0 and 1.
 * @param colors List of rgba color array
 * @param out Mapped gba color array
 * @return will be null/undefined if input illegal.
 */
export declare function fastLerp(normalizedValue: number, colors: number[][], out?: number[]): number[];
/**
 * @deprecated
 */
export declare const fastMapToColor: typeof fastLerp;
type LerpFullOutput = {
    color: string;
    leftIndex: number;
    rightIndex: number;
    value: number;
};
/**
 * @param normalizedValue A float between 0 and 1.
 * @param colors Color list.
 * @param fullOutput Default false.
 * @return Result color. If fullOutput,
            return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
 */
export declare function lerp(normalizedValue: number, colors: string[], fullOutput: boolean): LerpFullOutput;
export declare function lerp(normalizedValue: number, colors: string[]): string;
/**
 * @deprecated
 */
export declare const mapToColor: typeof lerp;
/**
 * @param color
 * @param h 0 ~ 360, ignore when null. If function, it takes hue as argument and returns a new hue.
 * @param s 0 ~ 1, ignore when null. If function, it takes saturation as argument and returns a new saturation.
 * @param l 0 ~ 1, ignore when null. If function, it takes lightness as argument and returns a new lightness.
 * @return Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
export declare function modifyHSL(color: string, h?: number | ((h: number) => number), s?: number | string | ((s: number) => number), l?: number | string | ((l: number) => number)): string;
/**
 * @param color
 * @param alpha 0 ~ 1
 * @return Color string in rgba format.
 * @memberOf module:zrender/util/color
 */
export declare function modifyAlpha(color: string, alpha?: number): string;
/**
 * @param arrColor like [12,33,44,0.4]
 * @param type 'rgba', 'hsva', ...
 * @return Result color. (If input illegal, return undefined).
 */
export declare function stringify(arrColor: number[], type: string): string;
/**
 * Calculate luminance. It will include alpha.
 */
export declare function lum(color: string, backgroundLum: number): number;
/**
 * Generate a random color
 */
export declare function random(): string;
export declare function liftColor(color: GradientObject): GradientObject;
export declare function liftColor(color: string): string;
export {};
