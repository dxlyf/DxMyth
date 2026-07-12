import { Animation, AnimationConfig, AnimationState } from './Animation';
/** Timeline 配置 */
export interface TimelineConfig {
    /** 重复次数（-1 = 无限），默认 0 */
    repeat?: number;
    /** 是否 yoyo */
    yoyo?: boolean;
    /** 默认动画时长（毫秒），子动画未指定 duration 时使用 */
    defaults?: Partial<Pick<AnimationConfig, 'duration' | 'easing'>>;
    /** 事件回调 */
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
}
export declare class Timeline {
    private _children;
    private _labels;
    private _defaults;
    private _repeat;
    private _yoyo;
    private _repeatCount;
    private _state;
    private _startTime;
    private _pauseTime;
    private _pausedElapsed;
    /**
     * 总时长（毫秒），由所有子动画的最晚结束时间决定
     */
    get duration(): number;
    get state(): AnimationState;
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
    constructor(config?: TimelineConfig);
    /**
     * 添加一个动画到 Timeline
     * @param animation - 动画实例
     * @param position - 时间位置（毫秒，绝对时间）或偏移字符串（如 "+200" / "-100" / "labelName"）
     */
    add(animation: Animation, position?: number | string): this;
    /**
     * 快捷方法：创建动画并添加到 Timeline
     */
    to(config: AnimationConfig, position?: number | string): this;
    /**
     * 快捷方法：从当前值动画到指定值
     */
    fromTo(target: Record<string, any>, fromVars: Record<string, unknown>, toVars: Record<string, unknown>, duration?: number, position?: number | string): this;
    /** 添加一个标签标记 */
    addLabel(name: string, position: number): this;
    play(): this;
    pause(): this;
    resume(): this;
    stop(): this;
    /** 跳转到指定进度 */
    seek(progress: number): this;
    /** 清除所有子动画 */
    clear(): this;
    private _resolvePosition;
    private _tick;
    private _seekTime;
}
