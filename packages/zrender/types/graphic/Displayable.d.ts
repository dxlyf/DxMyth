import { default as Element, ElementProps, ElementStatePropNames, ElementAnimateConfig, ElementCommonState } from '../Element';
import { default as BoundingRect } from '../core/BoundingRect';
import { PropType, Dictionary, MapToType } from '../core/types';
import { default as Path } from './Path';
import { default as Animator } from '../animation/Animator';
export interface CommonStyleProps {
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowColor?: string;
    opacity?: number;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
     */
    blend?: string;
}
export declare const DEFAULT_COMMON_STYLE: CommonStyleProps;
export declare const DEFAULT_COMMON_ANIMATION_PROPS: MapToType<DisplayableProps, boolean>;
export interface DisplayableProps extends ElementProps {
    style?: Dictionary<any>;
    zlevel?: number;
    z?: number;
    z2?: number;
    culling?: boolean;
    cursor?: string;
    rectHover?: boolean;
    progressive?: boolean;
    incremental?: boolean;
    ignoreCoarsePointer?: boolean;
    batch?: boolean;
    invisible?: boolean;
}
type DisplayableKey = keyof DisplayableProps;
type DisplayablePropertyType = PropType<DisplayableProps, DisplayableKey>;
export type DisplayableStatePropNames = ElementStatePropNames | 'style' | 'z' | 'z2' | 'invisible';
export type DisplayableState = Pick<DisplayableProps, DisplayableStatePropNames> & ElementCommonState;
interface Displayable<Props extends DisplayableProps = DisplayableProps> {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    getState(stateName: string): DisplayableState;
    ensureState(stateName: string): DisplayableState;
    states: Dictionary<DisplayableState>;
    stateProxy: (stateName: string) => DisplayableState;
}
declare class Displayable<Props extends DisplayableProps = DisplayableProps> extends Element<Props> {
    /**
     * Whether the displayable object is visible. when it is true, the displayable object
     * is not drawn, but the mouse event can still trigger the object.
     */
    invisible: boolean;
    z: number;
    z2: number;
    /**
     * The z level determines the displayable object can be drawn in which layer canvas.
     */
    zlevel: number;
    /**
     * If enable culling
     */
    culling: boolean;
    /**
     * Mouse cursor when hovered
     */
    cursor: string;
    /**
     * If hover area is bounding rect
     */
    rectHover: boolean;
    /**
     * For increamental rendering
     */
    incremental: boolean;
    /**
     * Never increase to target size
     */
    ignoreCoarsePointer?: boolean;
    style: Dictionary<any>;
    protected _normalState: DisplayableState;
    protected _rect: BoundingRect;
    protected _paintRect: BoundingRect;
    protected _prevPaintRect: BoundingRect;
    dirtyRectTolerance: number;
    /************* Properties will be inejected in other modules. *******************/
    useHoverLayer?: boolean;
    __hoverStyle?: CommonStyleProps;
    __clipPaths?: Path[];
    __canvasFillGradient: CanvasGradient;
    __canvasStrokeGradient: CanvasGradient;
    __canvasFillPattern: CanvasPattern;
    __canvasStrokePattern: CanvasPattern;
    __svgEl: SVGElement;
    constructor(props?: Props);
    protected _init(props?: Props): void;
    beforeBrush(): void;
    afterBrush(): void;
    innerBeforeBrush(): void;
    innerAfterBrush(): void;
    shouldBePainted(viewWidth: number, viewHeight: number, considerClipPath: boolean, considerAncestors: boolean): boolean;
    /**
     * If displayable element contain coord x, y
     */
    contain(x: number, y: number): boolean;
    traverse<Context>(cb: (this: Context, el: this) => void, context?: Context): void;
    /**
     * If bounding rect of element contain coord x, y
     */
    rectContain(x: number, y: number): boolean;
    getPaintRect(): BoundingRect;
    setPrevPaintRect(paintRect: BoundingRect): void;
    getPrevPaintRect(): BoundingRect;
    /**
     * Alias for animate('style')
     * @param loop
     */
    animateStyle(loop: boolean): Animator<this["style"]>;
    updateDuringAnimation(targetKey: string): void;
    attrKV(key: DisplayableKey, value: DisplayablePropertyType): void;
    setStyle(obj: Props['style']): this;
    setStyle<T extends keyof Props['style']>(obj: T, value: Props['style'][T]): this;
    dirtyStyle(notRedraw?: boolean): void;
    dirty(): void;
    /**
     * Is style changed. Used with dirtyStyle.
     */
    styleChanged(): boolean;
    /**
     * Mark style updated. Only useful when style is used for caching. Like in the text.
     */
    styleUpdated(): void;
    /**
     * Create a style object with default values in it's prototype.
     */
    createStyle(obj?: Props['style']): Props["style"];
    /**
     * Replace style property.
     * It will create a new style if given obj is not a valid style object.
     */
    useStyle(obj: Props['style']): void;
    /**
     * Determine if an object is a valid style object.
     * Which means it is created by `createStyle.`
     *
     * A valid style object will have all default values in it's prototype.
     * To avoid get null/undefined values.
     */
    isStyleObject(obj: Props['style']): any;
    protected _innerSaveToNormal(toState: DisplayableState): void;
    protected _applyStateObj(stateName: string, state: DisplayableState, normalState: DisplayableState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    protected _mergeStates(states: DisplayableState[]): DisplayableState;
    protected _mergeStyle(targetStyle: CommonStyleProps, sourceStyle: CommonStyleProps): CommonStyleProps;
    getAnimationStyleProps(): MapToType<DisplayableProps, boolean>;
    /**
     * The string value of `textPosition` needs to be calculated to a real postion.
     * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
     * by default. See `contain/text.js#calculateTextPosition` for more details.
     * But some coutom shapes like "pin", "flag" have center that is not exactly
     * `[width/2, height/2]`. So we provide this hook to customize the calculation
     * for those shapes. It will be called if the `style.textPosition` is a string.
     * @param out Prepared out object. If not provided, this method should
     *        be responsible for creating one.
     * @param style
     * @param rect {x, y, width, height}
     * @return out The same as the input out.
     *         {
     *             x: number. mandatory.
     *             y: number. mandatory.
     *             textAlign: string. optional. use style.textAlign by default.
     *             textVerticalAlign: string. optional. use style.textVerticalAlign by default.
     *         }
     */
    protected static initDefaultProps: void;
}
export default Displayable;
