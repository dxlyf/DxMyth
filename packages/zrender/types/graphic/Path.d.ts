import { default as Displayable, DisplayableProps, CommonStyleProps, DisplayableStatePropNames } from './Displayable';
import { default as Element, ElementAnimateConfig } from '../Element';
import { default as PathProxy } from '../core/PathProxy';
import { PatternObject } from './Pattern';
import { Dictionary, PropType, MapToType } from '../core/types';
import { default as BoundingRect } from '../core/BoundingRect';
import { LinearGradientObject } from './LinearGradient';
import { RadialGradientObject } from './RadialGradient';
import { default as Animator } from '../animation/Animator';
export interface PathStyleProps extends CommonStyleProps {
    fill?: string | PatternObject | LinearGradientObject | RadialGradientObject;
    stroke?: string | PatternObject | LinearGradientObject | RadialGradientObject;
    decal?: PatternObject;
    /**
     * Still experimental, not works weel on arc with edge cases(large angle).
     */
    strokePercent?: number;
    strokeNoScale?: boolean;
    fillOpacity?: number;
    strokeOpacity?: number;
    /**
     * `true` is not supported.
     * `false`/`null`/`undefined` are the same.
     * `false` is used to remove lineDash in some
     * case that `null`/`undefined` can not be set.
     * (e.g., emphasis.lineStyle in echarts)
     */
    lineDash?: false | number[] | 'solid' | 'dashed' | 'dotted';
    lineDashOffset?: number;
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    miterLimit?: number;
    /**
     * Paint order, if do stroke first. Similar to SVG paint-order
     * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/paint-order
     */
    strokeFirst?: boolean;
}
export declare const DEFAULT_PATH_STYLE: PathStyleProps;
export declare const DEFAULT_PATH_ANIMATION_PROPS: MapToType<PathProps, boolean>;
export interface PathProps extends DisplayableProps {
    strokeContainThreshold?: number;
    segmentIgnoreThreshold?: number;
    subPixelOptimize?: boolean;
    style?: PathStyleProps;
    shape?: Dictionary<any>;
    autoBatch?: boolean;
    __value?: (string | number)[] | (string | number);
    buildPath?: (ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBatch?: boolean) => void;
}
type PathKey = keyof PathProps;
type PathPropertyType = PropType<PathProps, PathKey>;
interface Path<Props extends PathProps = PathProps> {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    animate(key: 'shape', loop?: boolean): Animator<this['shape']>;
    getState(stateName: string): PathState;
    ensureState(stateName: string): PathState;
    states: Dictionary<PathState>;
    stateProxy: (stateName: string) => PathState;
}
export type PathStatePropNames = DisplayableStatePropNames | 'shape';
export type PathState = Pick<PathProps, PathStatePropNames> & {
    hoverLayer?: boolean;
};
declare class Path<Props extends PathProps = PathProps> extends Displayable<Props> {
    path: PathProxy;
    strokeContainThreshold: number;
    segmentIgnoreThreshold: number;
    subPixelOptimize: boolean;
    style: PathStyleProps;
    /**
     * If element can be batched automatically
     */
    autoBatch: boolean;
    private _rectStroke;
    protected _normalState: PathState;
    protected _decalEl: Path;
    shape: Dictionary<any>;
    constructor(opts?: Props);
    update(): void;
    getDecalElement(): Path<PathProps>;
    protected _init(props?: Props): void;
    protected getDefaultStyle(): Props['style'];
    protected getDefaultShape(): {};
    protected canBeInsideText(): boolean;
    protected getInsideTextFill(): "#333" | "#ccc" | "#eee";
    protected getInsideTextStroke(textFill?: string): string;
    buildPath(ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBatch?: boolean): void;
    pathUpdated(): void;
    getUpdatedPathProxy(inBatch?: boolean): PathProxy;
    createPathProxy(): void;
    hasStroke(): boolean;
    hasFill(): boolean;
    getBoundingRect(): BoundingRect;
    contain(x: number, y: number): boolean;
    /**
     * Shape changed
     */
    dirtyShape(): void;
    dirty(): void;
    /**
     * Alias for animate('shape')
     * @param {boolean} loop
     */
    animateShape(loop: boolean): Animator<this["shape"]>;
    updateDuringAnimation(targetKey: string): void;
    attrKV(key: PathKey, value: PathPropertyType): void;
    setShape(obj: Props['shape']): this;
    setShape<T extends keyof Props['shape']>(obj: T, value: Props['shape'][T]): this;
    /**
     * If shape changed. used with dirtyShape
     */
    shapeChanged(): boolean;
    /**
     * Create a path style object with default values in it's prototype.
     * @override
     */
    createStyle(obj?: Props['style']): Props["style"];
    protected _innerSaveToNormal(toState: PathState): void;
    protected _applyStateObj(stateName: string, state: PathState, normalState: PathState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    protected _mergeStates(states: PathState[]): PathState;
    getAnimationStyleProps(): MapToType<PathProps, boolean>;
    /**
     * If path shape is zero area
     */
    isZeroArea(): boolean;
    /**
     * 扩展一个 Path element, 比如星形，圆等。
     * Extend a path element
     * @DEPRECATED Use class extends
     * @param props
     * @param props.type Path type
     * @param props.init Initialize
     * @param props.buildPath Overwrite buildPath method
     * @param props.style Extended default style config
     * @param props.shape Extended default shape config
     */
    static extend<Shape extends Dictionary<any>>(defaultProps: {
        type?: string;
        shape?: Shape;
        style?: PathStyleProps;
        beforeBrush?: Displayable['beforeBrush'];
        afterBrush?: Displayable['afterBrush'];
        getBoundingRect?: Displayable['getBoundingRect'];
        calculateTextPosition?: Element['calculateTextPosition'];
        buildPath(this: Path, ctx: CanvasRenderingContext2D | PathProxy, shape: Shape, inBatch?: boolean): void;
        init?(this: Path, opts: PathProps): void;
    }): {
        new (opts?: PathProps & {
            shape: Shape;
        }): Path;
    };
    protected static initDefaultProps: void;
}
export default Path;
