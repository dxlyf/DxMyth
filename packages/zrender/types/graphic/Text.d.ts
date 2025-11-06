import { TextAlign, TextVerticalAlign, ImageLike, Dictionary, MapToType, FontWeight, FontStyle, NullUndefined } from '../core/types';
import { default as TSpan } from './TSpan';
import { default as ZRImage } from './Image';
import { default as Rect } from './shape/Rect';
import { default as BoundingRect } from '../core/BoundingRect';
import { MatrixArray } from '../core/matrix';
import { default as Displayable, DisplayableStatePropNames, DisplayableProps } from './Displayable';
import { ZRenderType } from '../zrender';
import { default as Animator } from '../animation/Animator';
import { default as Transformable } from '../core/Transformable';
import { ElementCommonState } from '../Element';
import { GroupLike } from './Group';
export interface TextStylePropsPart {
    text?: string;
    fill?: string;
    stroke?: string;
    strokeNoScale?: boolean;
    opacity?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    /**
     * textStroke may be set as some color as a default
     * value in upper application, where the default value
     * of lineWidth should be 0 to make sure that
     * user can choose to do not use text stroke.
     */
    lineWidth?: number;
    lineDash?: false | number[];
    lineDashOffset?: number;
    borderDash?: false | number[];
    borderDashOffset?: number;
    /**
     * If `fontSize` or `fontFamily` exists, `font` will be reset by
     * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
     * So do not visit it directly in upper application (like echarts),
     * but use `contain/text#makeFont` instead.
     */
    font?: string;
    /**
     * The same as font. Use font please.
     * @deprecated
     */
    textFont?: string;
    /**
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontStyle?: FontStyle;
    /**
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontWeight?: FontWeight;
    /**
     * It helps merging respectively, rather than parsing an entire font string.
     */
    fontFamily?: string;
    /**
     * It helps merging respectively, rather than parsing an entire font string.
     * Should be 12 but not '12px'.
     */
    fontSize?: number | string;
    align?: TextAlign;
    verticalAlign?: TextVerticalAlign;
    /**
     * Line height. Default to be text height of '国'
     */
    lineHeight?: number;
    /**
     * Width of text block. Not include padding
     * Used for background, truncate, wrap
     * If string - be 'auto'.
     */
    width?: number | string;
    /**
     * Height of text block. Not include padding
     * Used for background, truncate
     */
    height?: number;
    /**
     * Reserved for special functionality, like 'hr'.
     */
    tag?: string;
    textShadowColor?: string;
    textShadowBlur?: number;
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    backgroundColor?: string | {
        image: ImageLike | string;
    };
    /**
     * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
     */
    padding?: number | number[];
    /**
     * Margin of label. Used when layouting the label.
     */
    margin?: number | number[];
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number | number[];
    /**
     * Shadow color for background box.
     */
    shadowColor?: string;
    /**
     * Shadow blur for background box.
     */
    shadowBlur?: number;
    /**
     * Shadow offset x for background box.
     */
    shadowOffsetX?: number;
    /**
     * Shadow offset y for background box.
     */
    shadowOffsetY?: number;
}
export interface TextStyleProps extends TextStylePropsPart {
    text?: string;
    /**
     * The outer rect (including padding) is placed based on x/y.
     * By default 0.
     */
    x?: number;
    y?: number;
    /**
     * Only support number in the top block.
     */
    width?: number;
    /**
     * Text styles for rich text.
     */
    rich?: Dictionary<TextStylePropsPart>;
    /**
     * Strategy when calculated text width exceeds textWidth.
     * break: break by word
     * break: will break inside the word
     * truncate: truncate the text and show ellipsis
     * Do nothing if not set
     */
    overflow?: 'break' | 'breakAll' | 'truncate' | 'none';
    /**
     * Strategy when text lines exceeds textHeight.
     * Do nothing if not set
     */
    lineOverflow?: 'truncate';
    /**
     * Epllipsis used if text is truncated
     */
    ellipsis?: string;
    /**
     * Placeholder used if text is truncated to empty
     */
    placeholder?: string;
    /**
     * Min characters for truncating
     */
    truncateMinChar?: number;
}
export interface TextProps extends DisplayableProps {
    style?: TextStyleProps;
    zlevel?: number;
    z?: number;
    z2?: number;
    culling?: boolean;
    cursor?: string;
}
export type TextState = Pick<TextProps, DisplayableStatePropNames> & ElementCommonState;
export type DefaultTextStyle = Pick<TextStyleProps, 'fill' | 'stroke' | 'align' | 'verticalAlign'> & {
    autoStroke?: boolean;
    overflowRect?: BoundingRect | NullUndefined;
};
export declare const DEFAULT_TEXT_ANIMATION_PROPS: MapToType<TextProps, boolean>;
interface ZRText {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    getState(stateName: string): TextState;
    ensureState(stateName: string): TextState;
    states: Dictionary<TextState>;
    stateProxy: (stateName: string) => TextState;
}
declare class ZRText extends Displayable<TextProps> implements GroupLike {
    type: string;
    style: TextStyleProps;
    /**
     * How to handling label overlap
     *
     * hidden:
     */
    overlap: 'hidden' | 'show' | 'blur';
    /**
     * Will use this to calculate transform matrix
     * instead of Element itself if it's give.
     * Not exposed to developers
     */
    innerTransformable: Transformable;
    isTruncated: boolean;
    private _children;
    private _childCursor;
    private _defaultStyle;
    constructor(opts?: TextProps);
    childrenRef(): (ZRImage | Rect | TSpan)[];
    update(): void;
    updateTransform(): void;
    getLocalTransform(m?: MatrixArray): MatrixArray;
    getComputedTransform(): MatrixArray;
    private _updateSubTexts;
    addSelfToZr(zr: ZRenderType): void;
    removeSelfFromZr(zr: ZRenderType): void;
    getBoundingRect(): BoundingRect;
    setDefaultTextStyle(defaultTextStyle: DefaultTextStyle): void;
    setTextContent(textContent: never): void;
    protected _mergeStyle(targetStyle: TextStyleProps, sourceStyle: TextStyleProps): TextStyleProps;
    private _mergeRich;
    getAnimationStyleProps(): MapToType<TextProps, boolean>;
    private _getOrCreateChild;
    private _updatePlainTexts;
    private _updateRichTexts;
    private _placeToken;
    private _renderBackground;
    static makeFont(style: TextStylePropsPart): string;
}
export declare function parseFontSize(fontSize: number | string): string;
export declare function hasSeparateFont(style: Pick<TextStylePropsPart, 'fontSize' | 'fontFamily' | 'fontWeight'>): string | number | true;
export declare function normalizeTextStyle(style: TextStyleProps): TextStyleProps;
export default ZRText;
