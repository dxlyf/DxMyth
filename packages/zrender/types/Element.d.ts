import { default as Transformable, TransformProp } from './core/Transformable';
import { AnimationEasing } from './animation/easing';
import { default as Animator } from './animation/Animator';
import { ZRenderType } from './zrender';
import { Dictionary, ElementEventName, ZRRawEvent, BuiltinTextPosition, MapToType } from './core/types';
import { default as Path } from './graphic/Path';
import { default as BoundingRect, RectLike } from './core/BoundingRect';
import { default as Eventful } from './core/Eventful';
import { default as ZRText } from './graphic/Text';
import { TextPositionCalculationResult } from './contain/text';
import { default as Polyline } from './graphic/shape/Polyline';
import { default as Group } from './graphic/Group';
import { default as Point } from './core/Point';
export interface ElementAnimateConfig {
    duration?: number;
    delay?: number;
    easing?: AnimationEasing;
    during?: (percent: number) => void;
    done?: Function;
    aborted?: Function;
    scope?: string;
    /**
     * If force animate
     * Prevent stop animation and callback
     * immediently when target values are the same as current values.
     */
    force?: boolean;
    /**
     * If use additive animation.
     */
    additive?: boolean;
    /**
     * If set to final state before animation started.
     * It can be useful if something you want to calcuate depends on the final state of element.
     * Like bounding rect for text layouting.
     *
     * Only available in animateTo
     */
    setToFinal?: boolean;
}
export interface ElementTextConfig {
    /**
     * Position relative to the element bounding rect
     * @default 'inside'
     */
    position?: BuiltinTextPosition | (number | string)[];
    /**
     * Rotation of the label.
     */
    rotation?: number;
    /**
     * Rect that text will be positioned.
     * Default to be the boundingRect of the host element.
     * The coords of `layoutRect` is based on the target element, but not global.
     *
     * [NOTICE]: boundingRect includes `lineWidth`, which is inconsistent with
     *  the general element placement principle, where `lineWidth` is not counted.
     */
    layoutRect?: RectLike;
    /**
     * Offset of the label.
     * The difference of offset and position is that it will be applied
     * in the rotation
     */
    offset?: number[];
    /**
     * Origin or rotation. Which is relative to the bounding box of the attached element.
     * Can be percent value. Relative to the bounding box.
     * If specified center. It will be center of the bounding box.
     *
     * Only available when position and rotation are both set.
     */
    origin?: (number | string)[] | 'center';
    /**
     * Distance to the rect
     * @default 5
     */
    distance?: number;
    /**
     * If use local user space. Which will apply host's transform
     *
     * [NOTICE]: If the host element may rotate to non-parallel to screen x/y,
     *  need to use `local:true`, otherwise the transformed layout rect may not be expected.
     *
     * @default false
     */
    local?: boolean;
    /**
     * `insideFill` is a color string or left empty.
     * If a `textContent` is "inside", its final `fill` will be picked by this priority:
     * `textContent.style.fill` > `textConfig.insideFill` > "auto-calculated-fill"
     * In most cases, "auto-calculated-fill" is white.
     */
    insideFill?: string;
    /**
     * `insideStroke` is a color string or left empty.
     * If a `textContent` is "inside", its final `stroke` will be picked by this priority:
     * `textContent.style.stroke` > `textConfig.insideStroke` > "auto-calculated-stroke"
     *
     * The rule of getting "auto-calculated-stroke":
     * If (A) the `fill` is specified in style (either in `textContent.style` or `textContent.style.rich`)
     * or (B) needed to draw text background (either defined in `textContent.style` or `textContent.style.rich`)
     * "auto-calculated-stroke" will be null.
     * Otherwise, "auto-calculated-stroke" will be the same as `fill` of this element if possible, or null.
     *
     * The reason of (A) is not decisive:
     * 1. If users specify `fill` in style and still use "auto-calculated-stroke", the effect
     * is not good and unexpected in some cases. It not easy and seams uncessary to auto calculate
     * a proper `stroke` for the given `fill`, since they can specify `stroke` themselve.
     * 2. Backward compat.
     */
    insideStroke?: string;
    /**
     * `outsideFill` is a color string or left empty.
     * If a `textContent` is "inside", its final `fill` will be picked by this priority:
     * `textContent.style.fill` > `textConfig.outsideFill` > #000
     */
    outsideFill?: string;
    /**
     * `outsideStroke` is a color string or left empth.
     * If a `textContent` is not "inside", its final `stroke` will be picked by this priority:
     * `textContent.style.stroke` > `textConfig.outsideStroke` > "auto-calculated-stroke"
     *
     * The rule of getting "auto-calculated-stroke":
     * If (A) the `fill` is specified in style (either in `textContent.style` or `textContent.style.rich`)
     * or (B) needed to draw text background (either defined in `textContent.style` or `textContent.style.rich`)
     * "auto-calculated-stroke" will be null.
     * Otherwise, "auto-calculated-stroke" will be a neer white color to distinguish "front end"
     * label with messy background (like other text label, line or other graphic).
     */
    outsideStroke?: string;
    /**
     * Tell zrender I can sure this text is inside or not.
     * In case position is not using builtin `inside` hints.
     */
    inside?: boolean;
    /**
     * Auto calculate overflow area by `textConfig.layoutRect` (if any) or `host.boundingRect`.
     * It makes sense only if label is inside. It ensure the text does not overflow the host.
     * Useful in `text.style.overflow` and `text.style.lineOverflow`.
     *
     * If `textConfig.rotation` or `text.rotation exists`, it works correctly only when the rotated text is parallel
     * to its host (i.e. 0, PI/2, PI, PI*3/2, 2*PI, ...). Do not supported other cases until a real scenario arises.
     */
    autoOverflowArea?: boolean;
}
export interface ElementTextGuideLineConfig {
    /**
     * Anchor for text guide line.
     * Notice: Won't work
     */
    anchor?: Point;
    /**
     * If above the target element.
     */
    showAbove?: boolean;
    /**
     * Candidates of connectors. Used when autoCalculate is true and anchor is not specified.
     */
    candidates?: ('left' | 'top' | 'right' | 'bottom')[];
}
export interface ElementEvent {
    type: ElementEventName;
    event: ZRRawEvent;
    target: Element;
    topTarget: Element;
    cancelBubble: boolean;
    offsetX: number;
    offsetY: number;
    gestureEvent: string;
    pinchX: number;
    pinchY: number;
    pinchScale: number;
    wheelDelta: number;
    zrByTouch: boolean;
    which: number;
    stop: (this: ElementEvent) => void;
}
export type ElementEventCallback<Ctx, Impl> = (this: CbThis<Ctx, Impl>, e: ElementEvent) => boolean | void;
type CbThis<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
interface ElementEventHandlerProps {
    onclick: ElementEventCallback<unknown, unknown>;
    ondblclick: ElementEventCallback<unknown, unknown>;
    onmouseover: ElementEventCallback<unknown, unknown>;
    onmouseout: ElementEventCallback<unknown, unknown>;
    onmousemove: ElementEventCallback<unknown, unknown>;
    onmousewheel: ElementEventCallback<unknown, unknown>;
    onmousedown: ElementEventCallback<unknown, unknown>;
    onmouseup: ElementEventCallback<unknown, unknown>;
    oncontextmenu: ElementEventCallback<unknown, unknown>;
    ondrag: ElementEventCallback<unknown, unknown>;
    ondragstart: ElementEventCallback<unknown, unknown>;
    ondragend: ElementEventCallback<unknown, unknown>;
    ondragenter: ElementEventCallback<unknown, unknown>;
    ondragleave: ElementEventCallback<unknown, unknown>;
    ondragover: ElementEventCallback<unknown, unknown>;
    ondrop: ElementEventCallback<unknown, unknown>;
}
export interface ElementProps extends Partial<ElementEventHandlerProps>, Partial<Pick<Transformable, TransformProp>> {
    name?: string;
    ignore?: boolean;
    isGroup?: boolean;
    draggable?: boolean | 'horizontal' | 'vertical';
    silent?: boolean;
    ignoreHostSilent?: boolean;
    ignoreClip?: boolean;
    globalScaleRatio?: number;
    textConfig?: ElementTextConfig;
    textContent?: ZRText;
    clipPath?: Path;
    drift?: Element['drift'];
    extra?: Dictionary<unknown>;
    anid?: string;
}
export declare const PRESERVED_NORMAL_STATE = "__zr_normal__";
declare const PRIMARY_STATES_KEYS: [TransformProp, "ignore"];
export type ElementStatePropNames = (typeof PRIMARY_STATES_KEYS)[number] | 'textConfig';
export type ElementState = Pick<ElementProps, ElementStatePropNames> & ElementCommonState;
export type ElementCommonState = {
    hoverLayer?: boolean;
};
export type ElementCalculateTextPosition = (out: TextPositionCalculationResult, style: ElementTextConfig, rect: RectLike) => TextPositionCalculationResult;
interface Element<Props extends ElementProps = ElementProps> extends Transformable, Eventful<{
    [key in ElementEventName]: (e: ElementEvent) => void | boolean;
} & {
    [key in string]: (...args: any) => void | boolean;
}>, ElementEventHandlerProps {
}
declare class Element<Props extends ElementProps = ElementProps> {
    id: number;
    /**
     * Element type
     */
    type: string;
    /**
     * Element name
     */
    name: string;
    /**
     * If ignore drawing and events of the element object
     */
    ignore: boolean;
    /**
     * Whether to respond to mouse events.
     */
    silent: boolean;
    /**
     * When this element has `__hostTarget` (e.g., this is a `textContent`), whether
     * its silent is controlled by that host silent. They may need separate silent
     * settings. e.g., the host do not have `fill` but only `stroke`, or their mouse
     * events serve for different features.
     */
    ignoreHostSilent: boolean;
    /**
     * 是否是 Group
     */
    isGroup: boolean;
    /**
     * Whether it can be dragged.
     */
    draggable: boolean | 'horizontal' | 'vertical';
    /**
     * Whether is it dragging.
     */
    dragging: boolean;
    parent: Group;
    animators: Animator<any>[];
    /**
     * If ignore clip from it's parent or hosts.
     * Applied on itself and all it's children.
     *
     * NOTE: It won't affect the clipPath set on the children.
     */
    ignoreClip: boolean;
    /**
     * If element is used as a component of other element.
     */
    __hostTarget: Element;
    /**
     * ZRender instance will be assigned when element is associated with zrender
     */
    __zr: ZRenderType;
    /**
     * Dirty bits.
     * From which painter will determine if this displayable object needs brush.
     */
    __dirty: number;
    /**
     * If element was painted on the screen
     */
    __isRendered: boolean;
    /**
     * If element has been moved to the hover layer.
     *
     * If so, dirty will only trigger the zrender refresh hover layer
     */
    __inHover: boolean;
    __clipPaths?: Path[];
    /**
     * path to clip the elements and its children, if it is a group.
     * @see http://www.w3.org/TR/2dcontext/#clipping-region
     */
    private _clipPath?;
    /**
     * Attached text element.
     * `position`, `style.textAlign`, `style.textVerticalAlign`
     * of element will be ignored if textContent.position is set
     */
    private _textContent?;
    /**
     * Text guide line.
     */
    private _textGuide?;
    /**
     * Config of textContent. Inlcuding layout, color, ...etc.
     */
    textConfig?: ElementTextConfig;
    /**
     * Config for guide line calculating.
     *
     * NOTE: This is just a property signature. READ and WRITE are all done in echarts.
     */
    textGuideLineConfig?: ElementTextGuideLineConfig;
    /**
     * Id for mapping animation
     */
    anid: string;
    extra: Dictionary<unknown>;
    currentStates?: string[];
    prevStates?: string[];
    /**
     * Store of element state.
     * '__normal__' key is preserved for default properties.
     */
    states: Dictionary<ElementState>;
    /**
     * Animation config applied on state switching.
     */
    stateTransition: ElementAnimateConfig;
    /**
     * Proxy function for getting state with given stateName.
     * ZRender will first try to get with stateProxy. Then find from states if stateProxy returns nothing
     *
     * targetStates will be given in useStates
     */
    stateProxy?: (stateName: string, targetStates?: string[]) => ElementState;
    protected _normalState: ElementState;
    private _innerTextDefaultStyle;
    constructor(props?: Props);
    protected _init(props?: Props): void;
    /**
     * Drift element
     * @param {number} dx dx on the global space
     * @param {number} dy dy on the global space
     */
    drift(dx: number, dy: number, e?: ElementEvent): void;
    /**
     * Hook before update
     */
    beforeUpdate(): void;
    /**
     * Hook after update
     */
    afterUpdate(): void;
    /**
     * Update each frame
     */
    update(): void;
    updateInnerText(forceUpdate?: boolean): void;
    protected canBeInsideText(): boolean;
    protected getInsideTextFill(): string | undefined;
    protected getInsideTextStroke(textFill: string): string | undefined;
    protected getOutsideFill(): string | undefined;
    protected getOutsideStroke(textFill: string): string;
    traverse<Context>(cb: (this: Context, el: Element<Props>) => void, context?: Context): void;
    protected attrKV(key: string, value: unknown): void;
    /**
     * Hide the element
     */
    hide(): void;
    /**
     * Show the element
     */
    show(): void;
    attr(keyOrObj: Props): this;
    attr<T extends keyof Props>(keyOrObj: T, value: Props[T]): this;
    saveCurrentToNormalState(toState: ElementState): void;
    protected _innerSaveToNormal(toState: ElementState): void;
    protected _savePrimaryToNormal(toState: Dictionary<any>, normalState: Dictionary<any>, primaryKeys: readonly string[]): void;
    /**
     * If has any state.
     */
    hasState(): boolean;
    /**
     * Get state object
     */
    getState(name: string): ElementState;
    /**
     * Ensure state exists. If not, will create one and return.
     */
    ensureState(name: string): ElementState;
    /**
     * Clear all states.
     */
    clearStates(noAnimation?: boolean): void;
    /**
     * Use state. State is a collection of properties.
     * Will return current state object if state exists and stateName has been changed.
     *
     * @param stateName State name to be switched to
     * @param keepCurrentState If keep current states.
     *      If not, it will inherit from the normal state.
     */
    useState(stateName: string, keepCurrentStates?: boolean, noAnimation?: boolean, forceUseHoverLayer?: boolean): any;
    /**
     * Apply multiple states.
     * @param states States list.
     */
    useStates(states: string[], noAnimation?: boolean, forceUseHoverLayer?: boolean): void;
    /**
     * Return if el.silent or any ancestor element has silent true.
     */
    isSilent(): boolean;
    /**
     * Update animation targets when reference is changed.
     */
    private _updateAnimationTargets;
    /**
     * Remove state
     * @param state State to remove
     */
    removeState(state: string): void;
    /**
     * Replace exists state.
     * @param oldState
     * @param newState
     * @param forceAdd If still add when even if replaced target not exists.
     */
    replaceState(oldState: string, newState: string, forceAdd: boolean): void;
    /**
     * Toogle state.
     */
    toggleState(state: string, enable: boolean): void;
    protected _mergeStates(states: ElementState[]): ElementState;
    protected _applyStateObj(stateName: string, state: ElementState, normalState: ElementState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    /**
     * Component is some elements attached on this element for specific purpose.
     * Like clipPath, textContent
     */
    private _attachComponent;
    private _detachComponent;
    /**
     * Get clip path
     */
    getClipPath(): Path<import('./graphic/Path').PathProps>;
    /**
     * Set clip path
     *
     * clipPath can't be shared between two elements.
     */
    setClipPath(clipPath: Path): void;
    /**
     * Remove clip path
     */
    removeClipPath(): void;
    /**
     * Get attached text content.
     */
    getTextContent(): ZRText;
    /**
     * Attach text on element
     */
    setTextContent(textEl: ZRText): void;
    /**
     * Set layout of attached text. Will merge with the previous.
     */
    setTextConfig(cfg: ElementTextConfig): void;
    /**
     * Remove text config
     */
    removeTextConfig(): void;
    /**
     * Remove attached text element.
     */
    removeTextContent(): void;
    getTextGuideLine(): Polyline;
    setTextGuideLine(guideLine: Polyline): void;
    removeTextGuideLine(): void;
    /**
     * Mark element needs to be repainted
     */
    markRedraw(): void;
    /**
     * Besides marking elements to be refreshed.
     * It will also invalid all cache and doing recalculate next frame.
     */
    dirty(): void;
    private _toggleHoverLayerFlag;
    /**
     * Add self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     */
    addSelfToZr(zr: ZRenderType): void;
    /**
     * Remove self from zrender instance.
     * Not recursively because it will be invoked when element added to storage.
     */
    removeSelfFromZr(zr: ZRenderType): void;
    /**
     * 动画
     *
     * @param path The key to fetch value from object. Mostly style or shape.
     * @param loop Whether to loop animation.
     * @param allowDiscreteAnimation Whether to allow discrete animation
     * @example:
     *     el.animate('style', false)
     *         .when(1000, {x: 10} )
     *         .done(function(){ // Animation done })
     *         .start()
     */
    animate(key?: string, loop?: boolean, allowDiscreteAnimation?: boolean): Animator<any>;
    addAnimator(animator: Animator<any>, key: string): void;
    updateDuringAnimation(key: string): void;
    /**
     * 停止动画
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stopAnimation(scope?: string, forwardToLast?: boolean): this;
    /**
     * @param animationProps A map to specify which property to animate. If not specified, will animate all.
     * @example
     *  // Animate position
     *  el.animateTo({
     *      position: [10, 10]
     *  }, { done: () => { // done } })
     *
     *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
     *  el.animateTo({
     *      shape: {
     *          width: 500
     *      },
     *      style: {
     *          fill: 'red'
     *      }
     *      position: [10, 10]
     *  }, {
     *      duration: 100,
     *      delay: 100,
     *      easing: 'cubicOut',
     *      done: () => { // done }
     *  })
     */
    animateTo(target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
    /**
     * Animate from the target state to current state.
     * The params and the value are the same as `this.animateTo`.
     */
    animateFrom(target: Props, cfg: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
    protected _transitionState(stateName: string, target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
    /**
     * Interface of getting the minimum bounding box.
     */
    getBoundingRect(): BoundingRect;
    getPaintRect(): BoundingRect;
    /**
     * The string value of `textPosition` needs to be calculated to a real postion.
     * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
     * by default. See `contain/text.js#calculateTextPosition` for more details.
     * But some coutom shapes like "pin", "flag" have center that is not exactly
     * `[width/2, height/2]`. So we provide this hook to customize the calculation
     * for those shapes. It will be called if the `style.textPosition` is a string.
     * @param {Obejct} [out] Prepared out object. If not provided, this method should
     *        be responsible for creating one.
     * @param {module:zrender/graphic/Style} style
     * @param {Object} rect {x, y, width, height}
     * @return {Obejct} out The same as the input out.
     *         {
     *             x: number. mandatory.
     *             y: number. mandatory.
     *             align: string. optional. use style.textAlign by default.
     *             verticalAlign: string. optional. use style.textVerticalAlign by default.
     *         }
     */
    calculateTextPosition: ElementCalculateTextPosition;
    protected static initDefaultProps: void;
}
export default Element;
