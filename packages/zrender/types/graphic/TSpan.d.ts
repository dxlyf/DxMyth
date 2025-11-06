import { default as Displayable, DisplayableProps, DisplayableStatePropNames } from './Displayable';
import { default as BoundingRect } from '../core/BoundingRect';
import { PathStyleProps } from './Path';
import { FontStyle, FontWeight } from '../core/types';
export interface TSpanStyleProps extends PathStyleProps {
    x?: number;
    y?: number;
    text?: string;
    font?: string;
    fontSize?: number;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}
export declare const DEFAULT_TSPAN_STYLE: TSpanStyleProps;
export interface TSpanProps extends DisplayableProps {
    style?: TSpanStyleProps;
}
export type TSpanState = Pick<TSpanProps, DisplayableStatePropNames>;
declare class TSpan extends Displayable<TSpanProps> {
    style: TSpanStyleProps;
    hasStroke(): boolean;
    hasFill(): boolean;
    /**
     * Create an image style object with default values in it's prototype.
     * @override
     */
    createStyle(obj?: TSpanStyleProps): TSpanStyleProps;
    /**
     * Set bounding rect calculated from Text
     * For reducing time of calculating bounding rect.
     */
    setBoundingRect(rect: BoundingRect): void;
    getBoundingRect(): BoundingRect;
    protected static initDefaultProps: void;
}
export default TSpan;
