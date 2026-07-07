// ============================================================
// AnimationSystem - 动画调度管理器
//
// 职责：
//   - 维护单个 rAF 循环
//   - 每帧推进所有活跃 Animation
//   - 自动移除已完成的 Animation
//   - 支持时间缩放（timeScale）
//   - 支持暂停/恢复
//
// 性能要点：
//   - 单 rAF 循环驱动，避免多个 rAF 并存
//   - 时间用 performance.now()，单调递增
//   - 完成的动画立即移除，避免无效遍历
//   - 待移除队列避免遍历中修改数组
// ============================================================

import { EventEmitter } from 'src/event/EventEmitter'
import { Animation } from './Animation'
import type { TrackConfig } from './AnimationTrack'
import type { EasingFn } from './Easing'
import type { Interpolator } from './Interpolator'

/** 动画系统事件映射 */
export type AnimationSystemEvents = {
    tick: [number, number]   // dt, now
}

/**
 * 动画调度管理器
 */
export class AnimationSystem extends EventEmitter<AnimationSystemEvents> {
    /** 已注册的动画列表 */
    private _animations: Animation[] = []
    /** 时间缩放系数 */
    timeScale: number = 1
    /** 是否暂停 */
    paused: boolean = false
    /** rAF ID */
    private _rafId: number = 0
    /** 上一帧时间戳 */
    private _lastTime: number = 0
    /** 帧时间间隔 */
    public delta: number = 0
    /** 是否已启动 */
    private _started: boolean = false
    /** 待移除队列（避免遍历中修改数组） */
    private _toRemove: Animation[] = []

    /** 添加动画并自动启动 */
    add(animation: Animation, autoStart: boolean = true): Animation {
        this._animations.push(animation)
        if (autoStart) animation.start()
        this._ensureRunning()
        return animation
    }

    /** 移除动画（不触发 complete） */
    remove(animation: Animation): void {
        const i = this._animations.indexOf(animation)
        if (i >= 0) {
            animation.stop()
            this._animations.splice(i, 1)
        }
    }

    /** 启动调度器 */
    start(): void {
        if (this._started) return
        this._started = true
        this.paused = false
        this._lastTime = performance.now()
        this._tick = this._tick.bind(this)
        this._rafId = requestAnimationFrame(this._tick)
    }

    /** 暂停调度器（所有动画冻结） */
    pause(): void {
        this.paused = true
    }

    /** 恢复调度器 */
    resume(): void {
        if (!this._started || !this.paused) return
        this.paused = false
        this._lastTime = performance.now()
    }

    /** 停止调度器（不再推进，但动画状态保留） */
    stop(): void {
        if (!this._started) return
        cancelAnimationFrame(this._rafId)
        this._rafId = 0
        this._started = false
    }

    /** 清空所有动画 */
    clear(): void {
        for (let i = 0; i < this._animations.length; i++) {
            this._animations[i].stop()
        }
        this._animations.length = 0
        this._toRemove.length = 0
    }

    /** 当前活跃动画数量 */
    get count(): number {
        return this._animations.length
    }

    /** 帧循环 */
    private _tick(now: number): void {
        if (!this._started) return
        const dt = (now - this._lastTime) * this.timeScale
        this.delta=dt
        this._lastTime = now
        if (!this.paused && dt > 0) {
            const animations = this._animations
            for (let i = 0; i < animations.length; i++) {
                const anim = animations[i]
                const stillRunning = anim.update(dt)
                if (!stillRunning && !anim.running) {
                    this._toRemove.push(anim)
                }
            }
            // 移除已完成的
            if (this._toRemove.length > 0) {
                for (let i = 0; i < this._toRemove.length; i++) {
                    const r = this._toRemove[i]
                    const idx = animations.indexOf(r)
                    if (idx >= 0) animations.splice(idx, 1)
                }
                this._toRemove.length = 0
            }
            this.emit('tick', dt, now)
        }
        this._rafId = requestAnimationFrame(this._tick)
    }

    private _ensureRunning(): void {
        if (!this._started) this.start()
    }

    // ============ 便捷工厂 ============

    /**
     * 创建一个属性动画
     * @param target 目标对象
     * @param prop 属性名
     * @param to 目标值
     * @param duration 持续时长（毫秒）
     */
    to<T extends object, K extends keyof T>(
        target: T,
        prop: K,
        to: T[K],
        duration: number,
        options?: {
            from?: T[K]
            easing?: EasingFn
            delay?: number
            interpolator?: Interpolator<T[K]>
            iterations?: number
            alternate?: boolean
        }
    ): Animation {
        const track: TrackConfig = {
            target: {
                get: () => target[prop],
                set: (v: any) => { target[prop] = v as T[K] },
            },
            from: options?.from,
            to,
            duration,
            easing: options?.easing,
            delay: options?.delay,
            interpolator: options?.interpolator,
        }
        const anim = new Animation(track, {
            iterations: options?.iterations,
            alternate: options?.alternate,
            delay: 0,
        })
        return this.add(anim)
    }

    /**
     * 等待若干毫秒后执行回调（基于系统时钟）
     */
    delay(ms: number, callback: () => void): Animation {
        let elapsed = 0
        const anim = new Animation({
            target: {
                get: () => elapsed,
                set: (v: number) => { elapsed = v },
            },
            from: 0,
            to: ms,
            duration: ms,
        })
        anim.on('complete', callback)
        return this.add(anim)
    }
}
