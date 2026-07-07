// ============================================================
// Animation - 动画任务
//
// 统一时间轴：管理多条 AnimationTrack，共享开始时间和总时长
//
// 特性：
//   - 支持循环（iterations）和往返（alternate）
//   - 支持全局延迟
//   - 完整生命周期事件：start/update/complete/stop/reset
//   - progress / time / running / finished 状态查询
// ============================================================

import { EventEmitter } from 'src/event/EventEmitter'
import { AnimationTrack, type TrackConfig } from './AnimationTrack'
import type { EasingFn } from './Easing'
import type { Interpolator } from './Interpolator'

/** 动画事件映射 */
export type AnimationEvents = {
    start: [Animation]
    update: [Animation, number]
    complete: [Animation]
    stop: [Animation]
    reset: [Animation]
}

/** 动画选项 */
export type AnimationOptions = {
    /** 循环次数，Infinity=无限循环，默认 1 */
    iterations?: number
    /** 是否往返（奇数次正向、偶数次反向） */
    alternate?: boolean
    /** 全局延迟（毫秒） */
    delay?: number
}

/**
 * 动画任务 - 统一时间轴
 * 管理多条 Track，共享开始时间和总时长
 */
export class Animation extends EventEmitter<AnimationEvents> {
    tracks: AnimationTrack[]
    /** 全局延迟 */
    delay: number
    /** 循环次数 */
    iterations: number
    /** 是否往返 */
    alternate: boolean
    /** 已完成的迭代次数 */
    private _iterCount: number = 0
    /** 动画本地时间（毫秒，从 0 开始累加） */
    private _time: number = 0
    /** 总时长（取所有 track 的 delay+duration 最大值） */
    private _totalDuration: number = 0
    /** 是否在运行 */
    private _running: boolean = false
    /** 是否已完成（所有迭代结束） */
    private _finished: boolean = false

    constructor(tracks: TrackConfig[] | TrackConfig, options?: AnimationOptions) {
        super()
        const arr = Array.isArray(tracks) ? tracks : [tracks]
        this.tracks = arr.map(c => new AnimationTrack(c))
        this.delay = options?.delay || 0
        this.iterations = options?.iterations ?? 1
        this.alternate = options?.alternate ?? false
        // 计算总时长
        for (let i = 0; i < this.tracks.length; i++) {
            const t = this.tracks[i]
            const end = t.delay + t.duration
            if (end > this._totalDuration) this._totalDuration = end
        }
    }

    get time(): number {
        return this._time
    }

    get progress(): number {
        if (this._totalDuration <= 0) return 1
        return Math.min(1, this._time / this._totalDuration)
    }

    get running(): boolean {
        return this._running
    }

    get finished(): boolean {
        return this._finished
    }

    get totalDuration(): number {
        return this._totalDuration * this.iterations
    }

    /**
     * 推进一帧
     * @param dt 毫秒数
     * @returns 是否仍在运行
     */
    update(dt: number): boolean {
        if (!this._running || this._finished) return false
        this._time += dt
        // 全局延迟未到
        if (this._time < this.delay) {
            return true
        }
        const localTime = this._time - this.delay
        // 判断当前迭代是否完成
        let iterIndex = Math.floor(localTime / this._totalDuration)
        if (iterIndex >= this.iterations) {
            // 全部完成
            this._finishIteration(this.iterations - 1)
            this._finished = true
            this._running = false
            // 最终确保所有 track 赋值为 to（最后一次迭代结束时）
            this.emit('complete', this)
            return false
        }
        // 当前迭代内的本地时间
        const timeInIter = localTime - iterIndex * this._totalDuration
        // 是否反向（alternate 且奇数次迭代）
        const reversed = this.alternate && (iterIndex & 1) === 1
        const effectiveTime = reversed ? (this._totalDuration - timeInIter) : timeInIter
        // 迭代切换
        if (iterIndex !== this._iterCount) {
            this._finishIteration(this._iterCount)
            this._iterCount = iterIndex
            this._startIteration(effectiveTime)
        }
        // 更新所有 track
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].update(effectiveTime)
        }
        this.emit('update', this, effectiveTime)
        return true
    }

    private _startIteration(_startTime: number): void {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].reset()
        }
    }

    private _finishIteration(_iter: number): void {
        // 一个迭代完成，track 已被 update 推到末尾
    }

    /** 启动动画 */
    start(): this {
        if (this._running) return this
        this._running = true
        this._finished = false
        this._time = 0
        this._iterCount = 0
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].reset()
        }
        this.emit('start', this)
        return this
    }

    /** 停止动画（保留当前值） */
    stop(): this {
        if (!this._running) return this
        this._running = false
        this.emit('stop', this)
        return this
    }

    /** 重置到初始状态 */
    reset(): this {
        this._running = false
        this._finished = false
        this._time = 0
        this._iterCount = 0
        for (let i = 0; i < this.tracks.length; i++) {
            const t = this.tracks[i]
            t.reset()
            t.target.set(t.from)
        }
        this.emit('reset', this)
        return this
    }
}
