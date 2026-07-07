// ============================================================
// AnimationTrack - 动画轨道
//
// 单条动画轨道：对目标对象的某个属性做时间插值
// 由 Animation 统一驱动时间轴，每帧调用 update
// ============================================================

import { easeLinear, type EasingFn } from './Easing'
import { NumberInterpolator, type Interpolator } from './Interpolator'

/** 轨道目标：通过 get/set 访问属性 */
export interface AnimationTarget {
    get: () => any
    set: (v: any) => void
}

/** 单条轨道配置 */
export interface TrackConfig<T = any> {
    /** 目标取值/赋值 */
    target: AnimationTarget
    /** 起始值（不传则使用 target.get() 当前值） */
    from?: T
    /** 目标值 */
    to: T
    /** 插值器（默认 NumberInterpolator） */
    interpolator?: Interpolator<T>
    /** 缓动函数（默认 linear） */
    easing?: EasingFn
    /** 延迟启动（毫秒） */
    delay?: number
    /** 持续时长（毫秒） */
    duration: number
}

/**
 * 内部使用的轨道结构（拍平字段，避免每次访问闭包）
 *
 * 字段直接挂在实例上，update 时无需经过 config 对象，
 * 减少 property lookup 链长度。
 */
export class AnimationTrack {
    target: AnimationTarget
    from: any
    to: any
    interpolator: Interpolator<any>
    easing: EasingFn
    delay: number
    duration: number
    /** 该轨道本地时间（不含 delay，从 0 开始） */
    localTime: number = 0
    /** 是否已完成 */
    done: boolean = false

    constructor(config: TrackConfig) {
        this.target = config.target
        this.from = config.from !== undefined ? config.from : config.target.get()
        this.to = config.to
        this.interpolator = config.interpolator || (NumberInterpolator as Interpolator<any>)
        this.easing = config.easing || easeLinear
        this.delay = config.delay || 0
        this.duration = config.duration
    }

    /**
     * 推进时间
     * @param globalTime 当前动画的本地时间（毫秒）
     * @returns 是否仍在进行中
     */
    update(globalTime: number): boolean {
        if (this.done) return false
        // 计算本地时间（考虑 delay）
        const t = globalTime - this.delay
        if (t < 0) {
            // 尚未开始
            return true
        }
        if (t >= this.duration) {
            // 完成：赋值为 to
            this.target.set(this.to)
            this.done = true
            return false
        }
        // 插值
        const eased = this.easing(t / this.duration)
        const v = this.interpolator.interpolate(this.from, this.to, eased)
        this.target.set(v)
        return true
    }

    reset(): void {
        this.done = false
        this.localTime = 0
    }
}
