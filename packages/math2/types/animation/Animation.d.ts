import { AnimationTrackConfig } from './AnimationTrack';
import { EasingFunction, EasingName } from './easing';
/** 动画方向 */
export declare enum AnimationDirection {
    Forward = 1,
    Backward = -1
}
/** 动画播放状态 */
export declare enum AnimationState {
    Idle = "idle",
    Playing = "playing",
    Paused = "paused",
    Completed = "completed"
}
/** 动画配置 */
export interface AnimationConfig {
    /** 目标对象 */
    target: Record<string, any>;
    /** 属性轨道配置 */
    tracks: Omit<AnimationTrackConfig, 'target'>[];
    /** 时长（毫秒），默认 1000 */
    duration?: number;
    /** 延迟（毫秒），默认 0 */
    delay?: number;
    /** 全局缓动（可被关键帧级 easing 覆盖） */
    easing?: EasingFunction | EasingName | [number, number, number, number];
    /** 循环次数（-1 = 无限），默认 0 */
    repeat?: number;
    /** 是否 yoyo（来回播放），默认 false */
    yoyo?: boolean;
    /** 是否循环（loop = repeat = -1，语法糖），默认 false */
    loop?: boolean;
    /** 事件回调 */
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onRepeat?: () => void;
    onComplete?: () => void;
}
export declare class Animation {
    /** 目标对象 */
    readonly target: Record<string, any>;
    private _duration;
    private _delay;
    private _repeat;
    private _yoyo;
    private _easingFunc;
    private _tracks;
    private _state;
    private _direction;
    private _repeatCount;
    private _startTime;
    private _pauseTime;
    private _pausedElapsed;
    private _progress;
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onRepeat?: () => void;
    onComplete?: () => void;
    constructor(config: AnimationConfig);
    get state(): AnimationState;
    get duration(): number;
    get progress(): number;
    get repeat(): number;
    get yoyo(): boolean;
    /** 当前播放方向 */
    get direction(): AnimationDirection;
    set direction(v: AnimationDirection);
    /** 开始播放 */
    play(): this;
    /** 暂停 */
    pause(): this;
    /** 恢复 */
    resume(): this;
    /** 停止并重置 */
    stop(): this;
    /** 跳到指定进度并立即更新 */
    seek(progress: number): this;
    /** 立即完成 */
    complete(): this;
    private _reset;
    private _tick;
    private _applyProgress;
    private _finish;
}
