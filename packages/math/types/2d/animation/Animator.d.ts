import { default as Clip } from './Clip';
import { ArrayLike, Dictionary } from '../core/types';
import { AnimationEasing } from './easing';
import { default as Animation } from './Animation';
type NumberArray = ArrayLike<number>;
type InterpolatableType = string | number | NumberArray | NumberArray[];
export declare function cloneValue(value: InterpolatableType): number | any[];
type ValueType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Keyframe = {
    time: number;
    value: unknown;
    percent: number;
    rawValue: unknown;
    easing?: AnimationEasing;
    easingFunc?: (percent: number) => number;
    additiveValue?: unknown;
};
declare class Track {
    keyframes: Keyframe[];
    propName: string;
    valType: ValueType;
    discrete: boolean;
    _invalid: boolean;
    private _finished;
    private _needsSort;
    private _additiveTrack;
    private _additiveValue;
    /**
     * Last frame
     */
    private _lastFr;
    /**
     * Percent of last frame.
     */
    private _lastFrP;
    constructor(propName: string);
    isFinished(): boolean;
    setFinished(): void;
    needsAnimate(): boolean;
    getAdditiveTrack(): Track;
    addKeyframe(time: number, rawValue: unknown, easing?: AnimationEasing): Keyframe;
    prepare(maxTime: number, additiveTrack?: Track): void;
    step(target: any, percent: number): void;
    private _addToTarget;
}
type DoneCallback = () => void;
type AbortCallback = () => void;
export type OnframeCallback<T> = (target: T, percent: number) => void;
export type AnimationPropGetter<T> = (target: T, key: string) => InterpolatableType;
export type AnimationPropSetter<T> = (target: T, key: string, value: InterpolatableType) => void;
export default class Animator<T> {
    animation?: Animation;
    targetName?: string;
    scope?: string;
    __fromStateTransition?: string;
    private _tracks;
    private _trackKeys;
    private _target;
    private _loop;
    private _delay;
    private _maxTime;
    /**
     * If force run regardless of empty tracks when duration is set.
     */
    private _force;
    /**
     * If animator is paused
     * @default false
     */
    private _paused;
    private _started;
    /**
     * If allow discrete animation
     * @default false
     */
    private _allowDiscrete;
    private _additiveAnimators;
    private _doneCbs;
    private _onframeCbs;
    private _abortedCbs;
    private _clip;
    constructor(target: T, loop: boolean, allowDiscreteAnimation?: boolean, // If doing discrete animation on the values can't be interpolated
    additiveTo?: Animator<any>[]);
    getMaxTime(): number;
    getDelay(): number;
    getLoop(): boolean;
    getTarget(): T;
    /**
     * Target can be changed during animation
     * For example if style is changed during state change.
     * We need to change target to the new style object.
     */
    changeTarget(target: T): void;
    /**
     * Set Animation keyframe
     * @param time time of keyframe in ms
     * @param props key-value props of keyframe.
     * @param easing
     */
    when(time: number, props: Dictionary<any>, easing?: AnimationEasing): this;
    whenWithKeys(time: number, props: Dictionary<any>, propNames: string[], easing?: AnimationEasing): this;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    /**
     * Set duration of animator.
     * Will run this duration regardless the track max time or if trackes exits.
     * @param duration
     * @returns
     */
    duration(duration: number): this;
    private _doneCallback;
    private _abortedCallback;
    private _setTracksFinished;
    private _getAdditiveTrack;
    /**
     * Start the animation
     * @param easing
     * @return
     */
    start(easing?: AnimationEasing): this;
    /**
     * Stop animation
     * @param {boolean} forwardToLast If move to last frame before stop
     */
    stop(forwardToLast?: boolean): void;
    /**
     * Set when animation delay starts
     * @param time 单位ms
     */
    delay(time: number): this;
    /**
     * 添加动画每一帧的回调函数
     * @param callback
     */
    during(cb: OnframeCallback<T>): this;
    /**
     * Add callback for animation end
     * @param cb
     */
    done(cb: DoneCallback): this;
    aborted(cb: AbortCallback): this;
    getClip(): Clip;
    getTrack(propName: string): Track;
    getTracks(): Track[];
    /**
     * Return true if animator is not available anymore.
     */
    stopTracks(propNames: string[], forwardToLast?: boolean): boolean;
    /**
     * Save values of final state to target.
     * It is mainly used in state mangement. When state is switching during animation.
     * We need to save final state of animation to the normal state. Not interpolated value.
     *
     * @param target
     * @param trackKeys
     * @param firstOrLast If save first frame or last frame
     */
    saveTo(target: T, trackKeys?: readonly string[], firstOrLast?: boolean): void;
    __changeFinalValue(finalProps: Dictionary<any>, trackKeys?: readonly string[]): void;
}
export type AnimatorTrack = Track;
export {};
