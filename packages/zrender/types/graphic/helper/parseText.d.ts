import { TextAlign, TextVerticalAlign, NullUndefined } from '../../core/types';
import { DefaultTextStyle, TextStyleProps } from '../Text';
import { TSpanStyleProps } from '../TSpan';
import { default as BoundingRect } from '../../core/BoundingRect';
interface InnerTruncateOption {
    maxIteration?: number;
    minChar?: number;
    placeholder?: string;
    maxIterations?: number;
}
/**
 * Show ellipsis if overflow.
 */
export declare function truncateText(text: string, containerWidth: number, font: string, ellipsis?: string, options?: InnerTruncateOption): string;
export interface PlainTextContentBlock {
    lineHeight: number;
    calculatedLineHeight: number;
    contentWidth: number;
    contentHeight: number;
    width: number;
    height: number;
    outerWidth: number;
    outerHeight: number;
    lines: string[];
    isTruncated: boolean;
}
export declare function parsePlainText(rawText: unknown, style: Omit<TextStyleProps, 'align' | 'verticalAlign'>, // Exclude props in DefaultTextStyle
defaultOuterWidth: number | NullUndefined, defaultOuterHeight: number | NullUndefined): PlainTextContentBlock;
declare class RichTextToken {
    styleName: string;
    text: string;
    width: number;
    height: number;
    innerHeight: number;
    contentHeight: number;
    contentWidth: number;
    lineHeight: number;
    font: string;
    align: TextAlign;
    verticalAlign: TextVerticalAlign;
    textPadding: number[];
    percentWidth?: string;
    isLineHolder: boolean;
}
declare class RichTextLine {
    lineHeight: number;
    width: number;
    tokens: RichTextToken[];
    constructor(tokens?: RichTextToken[]);
}
export declare class RichTextContentBlock {
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
    outerWidth: number;
    outerHeight: number;
    lines: RichTextLine[];
    isTruncated: boolean;
}
/**
 * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
 * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
 * If styleName is undefined, it is plain text.
 */
export declare function parseRichText(rawText: unknown, style: Omit<TextStyleProps, 'align' | 'verticalAlign'>, // Exclude props in DefaultTextStyle
defaultOuterWidth: number | NullUndefined, defaultOuterHeight: number | NullUndefined, topTextAlign: TextAlign): RichTextContentBlock;
/**
 * @see {ElementTextConfig['autoOverflowArea']}
 */
export declare function calcInnerTextOverflowArea(out: CalcInnerTextOverflowAreaOut, overflowRect: DefaultTextStyle['overflowRect'], baseX: number, baseY: number, textAlign: TextAlign, textVerticalAlign: TextVerticalAlign): void;
export type CalcInnerTextOverflowAreaOut = {
    baseX: number;
    baseY: number;
    outerWidth: number | NullUndefined;
    outerHeight: number | NullUndefined;
};
export declare function tSpanCreateBoundingRect(style: Pick<TSpanStyleProps, 'text' | 'font' | 'x' | 'y' | 'textAlign' | 'textBaseline' | 'lineWidth'>): BoundingRect;
export declare function tSpanCreateBoundingRect2(style: Pick<TSpanStyleProps, 'x' | 'y' | 'textAlign' | 'textBaseline' | 'lineWidth'>, contentWidth: number, contentHeight: number, forceLineWidth: number | NullUndefined): BoundingRect;
export declare function tSpanHasStroke(style: TSpanStyleProps): boolean;
export {};
