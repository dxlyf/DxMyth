import { Animation, AnimationConfig } from './Animation';
import { Timeline, TimelineConfig } from './Timeline';
export declare class AnimationSystem {
    private _animations;
    private _timelines;
    private _enabled;
    /** 是否已启用（注册到 Ticker） */
    get enabled(): boolean;
    /** 活跃动画数量 */
    get activeCount(): number;
    /**
     * 创建动画
     * @example
     *   system.animate({
     *     target: rect,
     *     tracks: [
     *       { property: 'x', keyframes: [{ time: 1000, value: 200 }] }
     *     ],
     *     duration: 1000,
     *     easing: 'cubicOut',
     *   })
     */
    animate(config: AnimationConfig): Animation;
    /**
     * 创建时间线
     * @example
     *   const tl = system.timeline()
     *     .to({ target: rect, tracks: [...] })
     *     .to({ target: circle, tracks: [...] }, '+=200')
     *     .play()
     */
    timeline(config?: TimelineConfig): Timeline;
    /**
     * 停止所有动画
     */
    stopAll(): void;
    /** 暂停所有 */
    pauseAll(): void;
    /** 恢复所有 */
    resumeAll(): void;
    private _start;
    private _stop;
}
