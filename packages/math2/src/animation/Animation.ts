// ============================================================
// Animation — 动画实例（单个目标上的多属性动画）
//
// 借鉴 GSAP Tween + ZRender Clip 设计：
//   - 支持 delay / duration / loop / yoyo / repeat
//   - 支持多轨道（track）并发
//   - 支持事件回调：onStart / onUpdate / onComplete / onRepeat
//   - 与全局 Ticker 集成
// ============================================================

import { Ticker } from './Ticker'
import { AnimationTrack, type AnimationTrackConfig } from './AnimationTrack'
import type { EasingFunction, EasingName } from './easing'
import { resolveEasing } from './easing'

/** 动画方向 */
export enum AnimationDirection {
    Forward = 1,
    Backward = -1,
}

/** 动画播放状态 */
export enum AnimationState {
    Idle = 'idle',
    Playing = 'playing',
    Paused = 'paused',
    Completed = 'completed',
}

/** 动画配置 */
export interface AnimationConfig {
    /** 目标对象 */
    target: Record<string, any>
    /** 属性轨道配置 */
    tracks: Omit<AnimationTrackConfig, 'target'>[]
    /** 时长（毫秒），默认 1000 */
    duration?: number
    /** 延迟（毫秒），默认 0 */
    delay?: number
    /** 全局缓动（可被关键帧级 easing 覆盖） */
    easing?: EasingFunction | EasingName | [number, number, number, number]
    /** 循环次数（-1 = 无限），默认 0 */
    repeat?: number
    /** 是否 yoyo（来回播放），默认 false */
    yoyo?: boolean
    /** 是否循环（loop = repeat = -1，语法糖），默认 false */
    loop?: boolean
    /** 事件回调 */
    onStart?: () => void
    onUpdate?: (progress: number) => void
    onRepeat?: () => void
    onComplete?: () => void
}

export class Animation {
    /** 目标对象 */
    readonly target: Record<string, any>

    // 配置
    private _duration: number
    private _delay: number
    private _repeat: number
    private _yoyo: boolean
    private _easingFunc: EasingFunction

    // 轨道
    private _tracks: AnimationTrack[] = []

    // 状态
    private _state: AnimationState = AnimationState.Idle
    private _direction: AnimationDirection = AnimationDirection.Forward
    private _repeatCount: number = 0

    // 时间
    private _startTime: number = 0
    private _pauseTime: number = 0
    private _pausedElapsed: number = 0
    private _progress: number = 0

    // 回调
    onStart?: () => void
    onUpdate?: (progress: number) => void
    onRepeat?: () => void
    onComplete?: () => void

    constructor(config: AnimationConfig) {
        this.target = config.target
        this._duration = config.duration ?? 1000
        this._delay = config.delay ?? 0

        // repeat/loop
        if (config.loop) {
            this._repeat = -1
        } else {
            this._repeat = config.repeat ?? 0
        }
        this._yoyo = config.yoyo ?? false

        this._easingFunc = resolveEasing(config.easing ?? 'linear')

        this.onStart = config.onStart
        this.onUpdate = config.onUpdate
        this.onRepeat = config.onRepeat
        this.onComplete = config.onComplete

        // 创建轨道
        for (const trk of config.tracks) {
            this._tracks.push(new AnimationTrack({
                property: trk.property,
                keyframes: trk.keyframes,
                target: config.target,
            }))
        }
    }

    // ---- 属性 ----

    get state(): AnimationState { return this._state }
    get duration(): number { return this._duration }
    get progress(): number { return this._progress }
    get repeat(): number { return this._repeat }
    get yoyo(): boolean { return this._yoyo }

    /** 当前播放方向 */
    get direction(): AnimationDirection { return this._direction }
    set direction(v: AnimationDirection) { this._direction = v }

    // ---- 播放控制 ----

    /** 开始播放 */
    play(): this {
        if (this._state === AnimationState.Playing) return this
        if (this._state === AnimationState.Completed) this._reset()

        this._state = AnimationState.Playing
        this._direction = AnimationDirection.Forward
        this._startTime = Ticker.shared.elapsed
        this._pausedElapsed = 0

        Ticker.shared.add(this._tick)
        this.onStart?.()
        return this
    }

    /** 暂停 */
    pause(): this {
        if (this._state !== AnimationState.Playing) return this
        this._state = AnimationState.Paused
        this._pauseTime = Ticker.shared.elapsed
        Ticker.shared.remove(this._tick)
        return this
    }

    /** 恢复 */
    resume(): this {
        if (this._state !== AnimationState.Paused) return this
        this._state = AnimationState.Playing
        this._pausedElapsed += Ticker.shared.elapsed - this._pauseTime
        Ticker.shared.add(this._tick)
        return this
    }

    /** 停止并重置 */
    stop(): this {
        Ticker.shared.remove(this._tick)
        this._reset()
        this._state = AnimationState.Idle
        return this
    }

    /** 跳到指定进度并立即更新 */
    seek(progress: number): this {
        const p = Math.max(0, Math.min(1, progress))
        this._applyProgress(p)
        return this
    }

    /** 立即完成 */
    complete(): this {
        this._applyProgress(1)
        this._finish()
        return this
    }

    // ---- 内部 ----

    private _reset(): void {
        this._progress = 0
        this._repeatCount = 0
        this._direction = AnimationDirection.Forward
        for (const track of this._tracks) {
            track.reset()
        }
    }

    private _tick = (_delta: number, _elapsed: number): void => {
        if (this._state !== AnimationState.Playing) return

        const elapsed = _elapsed - this._startTime - this._pausedElapsed

        // 延迟
        if (elapsed < this._delay) return

        const activeTime = elapsed - this._delay
        const total = this._duration

        if (total <= 0) {
            this._applyProgress(1)
            this._finish()
            return
        }

        // 计算原始进度
        let rawPercent = activeTime / total

        // 循环处理
        if (rawPercent > 1) {
            const cycles = Math.floor(rawPercent)
            rawPercent -= cycles

            if (this._repeat < 0) {
                // 无限循环
                this.onRepeat?.()
                this._repeatCount++
            } else {
                this._repeatCount += cycles
                if (this._repeatCount > this._repeat) {
                    rawPercent = 1
                }
            }
        }

        // yoyo 方向处理
        let effectivePercent = rawPercent
        if (this._yoyo) {
            const cycle = Math.floor(activeTime / total)
            if (cycle % 2 === 1) {
                this._direction = AnimationDirection.Backward
                effectivePercent = 1 - rawPercent
            } else {
                this._direction = AnimationDirection.Forward
            }
        }

        // 应用全局缓动
        const eased = this._easingFunc(Math.min(effectivePercent, 1))
        this._applyProgress(eased)

        // 检查是否完成
        if (effectivePercent >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat) {
            this._finish()
        }
    }

    private _applyProgress(progress: number): void {
        this._progress = progress
        for (const track of this._tracks) {
            track.tick(progress)
        }
        this.onUpdate?.(progress)
    }

    private _finish(): void {
        this._state = AnimationState.Completed
        Ticker.shared.remove(this._tick)
        this.onComplete?.()
    }
}
