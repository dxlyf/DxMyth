// ============================================================
// AnimationSystem — 引擎级动画管理器
//
// 职责：
//   1. 管理所有活跃的 Animation 和 Timeline 实例
//   2. 与引擎渲染循环集成（每帧自动更新）
//   3. 提供工厂方法快速创建动画
// ============================================================

import { Ticker } from './Ticker'
import { Animation, type AnimationConfig, AnimationState } from './Animation'
import { Timeline, type TimelineConfig } from './Timeline'

export class AnimationSystem {
    private _animations: Set<Animation> = new Set()
    private _timelines: Set<Timeline> = new Set()
    private _enabled: boolean = false

    /** 是否已启用（注册到 Ticker） */
    get enabled(): boolean { return this._enabled }

    /** 活跃动画数量 */
    get activeCount(): number { return this._animations.size + this._timelines.size }

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
    animate(config: AnimationConfig): Animation {
        const anim = new Animation(config)
        this._animations.add(anim)

        // 自动启动 ticker
        if (!this._enabled) this._start()

        anim.play()

        // 自动清理完成的动画
        const onComplete = anim.onComplete
        anim.onComplete = () => {
            onComplete?.()
            this._animations.delete(anim)
            if (this.activeCount === 0) this._stop()
        }

        return anim
    }

    /**
     * 创建时间线
     * @example
     *   const tl = system.timeline()
     *     .to({ target: rect, tracks: [...] })
     *     .to({ target: circle, tracks: [...] }, '+=200')
     *     .play()
     */
    timeline(config?: TimelineConfig): Timeline {
        const tl = new Timeline(config)
        const origPlay = tl.play.bind(tl)
        tl.play = () => {
            this._timelines.add(tl)
            if (!this._enabled) this._start()
            return origPlay()
        }

        // 自动清理
        const origComplete = tl.onComplete
        tl.onComplete = () => {
            origComplete?.()
            this._timelines.delete(tl)
            if (this.activeCount === 0) this._stop()
        }

        return tl
    }

    /**
     * 停止所有动画
     */
    stopAll(): void {
        for (const anim of this._animations) anim.stop()
        this._animations.clear()
        for (const tl of this._timelines) tl.stop()
        this._timelines.clear()
        this._stop()
    }

    /** 暂停所有 */
    pauseAll(): void {
        for (const anim of this._animations) anim.pause()
        for (const tl of this._timelines) tl.pause()
    }

    /** 恢复所有 */
    resumeAll(): void {
        for (const anim of this._animations) anim.resume()
        for (const tl of this._timelines) tl.resume()
    }

    private _start(): void {
        this._enabled = true
        // 确保 Ticker 启动（共享单例，多次 start 无副作用）
        Ticker.shared.start()
    }

    private _stop(): void {
        this._enabled = false
        // 不停止全局 Ticker，因为可能还有其他使用者
    }
}
