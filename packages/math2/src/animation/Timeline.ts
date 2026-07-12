// ============================================================
// Timeline — 时间线编排
//
// 借鉴 GSAP Timeline / Motion One 风格：
//   - 多个 Animation 顺序/并行编排
//   - 通过 add() 链式调用追加动画
//   - 支持绝对时间 / 相对时间 / 标签标记
//   - 自身也是"可播放"的，可以嵌套
// ============================================================

import { Animation, type AnimationConfig, AnimationState } from './Animation'
import { Ticker } from './Ticker'

/** Timeline 子节点 */
interface TimelineChild {
    animation: Animation
    /** 在 Timeline 上的起始时间（毫秒） */
    startTime: number
}

/** Timeline 配置 */
export interface TimelineConfig {
    /** 重复次数（-1 = 无限），默认 0 */
    repeat?: number
    /** 是否 yoyo */
    yoyo?: boolean
    /** 默认动画时长（毫秒），子动画未指定 duration 时使用 */
    defaults?: Partial<Pick<AnimationConfig, 'duration' | 'easing'>>
    /** 事件回调 */
    onStart?: () => void
    onUpdate?: (progress: number) => void
    onComplete?: () => void
}

export class Timeline {
    private _children: TimelineChild[] = []
    private _labels: Map<string, number> = new Map()
    private _defaults: Partial<Pick<AnimationConfig, 'duration' | 'easing'>>

    private _repeat: number
    private _yoyo: boolean
    private _repeatCount: number = 0

    private _state: AnimationState = AnimationState.Idle
    private _startTime: number = 0
    private _pauseTime: number = 0
    private _pausedElapsed: number = 0

    /**
     * 总时长（毫秒），由所有子动画的最晚结束时间决定
     */
    get duration(): number {
        let max = 0
        for (const child of this._children) {
            const end = child.startTime + child.animation.duration
            if (end > max) max = end
        }
        return max
    }

    get state(): AnimationState { return this._state }

    onStart?: () => void
    onUpdate?: (progress: number) => void
    onComplete?: () => void

    constructor(config: TimelineConfig = {}) {
        this._repeat = config.repeat ?? 0
        this._yoyo = config.yoyo ?? false
        this._defaults = config.defaults ?? {}
        this.onStart = config.onStart
        this.onUpdate = config.onUpdate
        this.onComplete = config.onComplete
    }

    // ---- 添加动画 ----

    /**
     * 添加一个动画到 Timeline
     * @param animation - 动画实例
     * @param position - 时间位置（毫秒，绝对时间）或偏移字符串（如 "+200" / "-100" / "labelName"）
     */
    add(animation: Animation, position: number | string = 0): this {
        const resolvedTime = this._resolvePosition(position)

        this._children.push({
            animation,
            startTime: resolvedTime,
        })

        return this
    }

    /**
     * 快捷方法：创建动画并添加到 Timeline
     */
    to(config: AnimationConfig, position?: number | string): this {
        // 应用默认配置
        const fullConfig: AnimationConfig = {
            ...this._defaults,
            ...config,
        }
        const anim = new Animation(fullConfig)
        return this.add(anim, position)
    }

    /**
     * 快捷方法：从当前值动画到指定值
     */
    fromTo(
        target: Record<string, any>,
        fromVars: Record<string, unknown>,
        toVars: Record<string, unknown>,
        duration?: number,
        position?: number | string,
    ): this {
        const tracks: AnimationConfig['tracks'] = []
        for (const key of Object.keys(toVars)) {
            tracks.push({
                property: key,
                keyframes: [
                    { time: 0, value: fromVars[key] },
                    { time: duration ?? this._defaults.duration ?? 1000, value: toVars[key] },
                ],
            })
        }
        return this.to({ target, tracks, duration }, position)
    }

    /** 添加一个标签标记 */
    addLabel(name: string, position: number): this {
        this._labels.set(name, position)
        return this
    }

    // ---- 播放控制 ----

    play(): this {
        if (this._state === AnimationState.Playing) return this

        this._state = AnimationState.Playing
        this._startTime = Ticker.shared.elapsed
        this._pausedElapsed = 0
        this._repeatCount = 0

        Ticker.shared.add(this._tick)
        this.onStart?.()
        return this
    }

    pause(): this {
        if (this._state !== AnimationState.Playing) return this
        this._state = AnimationState.Paused
        this._pauseTime = Ticker.shared.elapsed
        Ticker.shared.remove(this._tick)
        return this
    }

    resume(): this {
        if (this._state !== AnimationState.Paused) return this
        this._state = AnimationState.Playing
        this._pausedElapsed += Ticker.shared.elapsed - this._pauseTime
        Ticker.shared.add(this._tick)
        return this
    }

    stop(): this {
        Ticker.shared.remove(this._tick)
        for (const child of this._children) {
            child.animation.stop()
        }
        this._state = AnimationState.Idle
        return this
    }

    /** 跳转到指定进度 */
    seek(progress: number): this {
        const p = Math.max(0, Math.min(1, progress))
        const time = p * this.duration
        this._seekTime(time)
        return this
    }

    /** 清除所有子动画 */
    clear(): this {
        this.stop()
        this._children = []
        this._labels.clear()
        return this
    }

    // ---- 内部 ----

    private _resolvePosition(position: number | string): number {
        if (typeof position === 'number') return position

        // 字符串解析
        if (position.startsWith('+') || position.startsWith('-')) {
            // 相对偏移：基于最后一个子动画的结束时间
            const offset = parseFloat(position)
            if (this._children.length === 0) return Math.max(0, offset)
            const last = this._children[this._children.length - 1]
            return Math.max(0, last.startTime + last.animation.duration + offset)
        }

        // 标签查找
        const labelTime = this._labels.get(position)
        if (labelTime !== undefined) return labelTime

        return 0
    }

    private _tick = (_delta: number, _elapsed: number): void => {
        if (this._state !== AnimationState.Playing) return

        const elapsed = _elapsed - this._startTime - this._pausedElapsed
        const total = this.duration
        if (total <= 0) return

        let rawPercent = elapsed / total

        // 循环
        if (this._repeat < 0) {
            rawPercent = rawPercent % 1
        } else if (rawPercent > 1) {
            this._repeatCount = Math.floor(rawPercent)
            if (this._repeatCount > this._repeat) {
                rawPercent = 1
            } else {
                rawPercent -= this._repeatCount
            }
        }

        // yoyo
        if (this._yoyo) {
            const cycle = Math.floor(elapsed / total)
            if (cycle % 2 === 1) {
                rawPercent = 1 - rawPercent
            }
        }

        const time = Math.min(rawPercent, 1) * total
        this._seekTime(time)

        this.onUpdate?.(Math.min(rawPercent, 1))

        if (rawPercent >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat) {
            this._state = AnimationState.Completed
            Ticker.shared.remove(this._tick)
            this.onComplete?.()
        }
    }

    private _seekTime(time: number): void {
        const total = this.duration
        const progress = total > 0 ? time / total : 0

        for (const child of this._children) {
            const { animation, startTime } = child
            const endTime = startTime + animation.duration

            if (time < startTime) {
                // 还未到该动画，停在 0
                animation.seek(0)
            } else if (time >= endTime) {
                // 已过该动画，停在结束
                animation.seek(1)
            } else if (animation.duration > 0) {
                // 正在该动画区间内
                const childProgress = (time - startTime) / animation.duration
                animation.seek(childProgress)
            }
        }
    }
}
