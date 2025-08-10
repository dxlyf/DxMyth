import { default as BoundingRect, RectLike } from '../core/BoundingRect';
import { TextAlign, TextVerticalAlign, BuiltinTextPosition } from '../core/types';
import { default as LRU } from '../core/LRU';
/**
 * @deprecated But keep for possible outside usage.
 *  Use `ensureFontMeasureInfo` + `measureWidth` instead.
 */
export declare function getWidth(text: string, font: string): number;
export interface FontMeasureInfo {
    font: string;
    strWidthCache: LRU<number>;
    asciiWidthMap: number[] | null | undefined;
    asciiWidthMapTried: boolean;
    stWideCharWidth: number;
    asciiCharWidth: number;
}
export declare function ensureFontMeasureInfo(font: string): FontMeasureInfo;
/**
 * Hot path, performance sensitive.
 */
export declare function measureCharWidth(fontMeasureInfo: FontMeasureInfo, charCode: number): number;
export declare function measureWidth(fontMeasureInfo: FontMeasureInfo, text: string): number;
/**
 * @deprecated See `getBoundingRect`.
 * Get bounding rect for inner usage(TSpan)
 * Which not include text newline.
 */
export declare function innerGetBoundingRect(text: string, font: string, textAlign?: TextAlign, textBaseline?: TextVerticalAlign): BoundingRect;
/**
 * @deprecated Use `(new Text(...)).getBoundingRect()` or `(new TSpan(...)).getBoundingRect()` instead.
 *  This method behaves differently from `Text#getBoundingRect()` - e.g., it does not support the overflow
 *  strategy, and only has single line height even if multiple lines.
 *
 * Get bounding rect for outer usage. Compatitable with old implementation
 * Which includes text newline.
 */
export declare function getBoundingRect(text: string, font: string, textAlign?: TextAlign, textBaseline?: TextVerticalAlign): BoundingRect;
export declare function adjustTextX(x: number, width: number, textAlign: TextAlign, inverse?: boolean): number;
export declare function adjustTextY(y: number, height: number, verticalAlign: TextVerticalAlign, inverse?: boolean): number;
export declare function getLineHeight(font?: string): number;
export declare function measureText(text: string, font?: string): {
    width: number;
};
export declare function parsePercent(value: number | string, maxValue: number): number;
export interface TextPositionCalculationResult {
    x: number;
    y: number;
    align: TextAlign;
    verticalAlign: TextVerticalAlign;
}
/**
 * Follow same interface to `Displayable.prototype.calculateTextPosition`.
 * @public
 * @param out Prepared out object. If not input, auto created in the method.
 * @param style where `textPosition` and `textDistance` are visited.
 * @param rect {x, y, width, height} Rect of the host elment, according to which the text positioned.
 * @return The input `out`. Set: {x, y, textAlign, textVerticalAlign}
 */
export declare function calculateTextPosition(out: TextPositionCalculationResult, opts: {
    position?: BuiltinTextPosition | (number | string)[];
    distance?: number;
    global?: boolean;
}, rect: RectLike): TextPositionCalculationResult;
