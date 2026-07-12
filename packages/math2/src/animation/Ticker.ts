// ============================================================
// Ticker — 全局 RAF 时钟驱动
// 单例模式（默认），也支持通过 Ticker.create() 自定义帧调度器。
// 借鉴 GSAP 的核心 ticker 设计。
// ============================================================

export type TickerCallback = (delta: number, elapsed: number) => void

/** 帧调度器接口 */
export interface FrameScheduler {
    /** 请求下一帧，返回句柄 */
    request(callback: () => void): number
    /** 取消已请求的帧 */
    cancel(id: number): void
}

/** 默认帧调度器：基于浏览器的 requestAnimationFrame */
const defaultScheduler: FrameScheduler = typeof requestAnimationFrame !== 'undefined' ? {
    request: (cb) => requestAnimationFrame(cb),
    cancel: (id) => cancelAnimationFrame(id),
} : {
    // 兜底：setTimeout 16ms
    request: (cb) => window.setTimeout(cb, 16),
    cancel: (id) => clearTimeout(id),
}

/** 获取当前时间戳（毫秒），优先使用 performance.now */
const now = (): number =>
    typeof performance !== 'undefined' ? performance.now() : Date.now()

export class Ticker {
    private static _instance: Ticker | null = null

    /** 获取使用默认 rAF 的全局单例 */
    static get shared(): Ticker {
        if (!Ticker._instance) {
            Ticker._instance = new Ticker(defaultScheduler)
        }
        return Ticker._instance
    }

    /**
     * 创建自定义 Ticker 实例
     * @param scheduler - 自定义帧调度器，不传则使用 requestAnimationFrame
     *
     * @example
     *   // Node.js 测试环境
     *   const ticker = Ticker.create({
     *     request: (cb) => setTimeout(cb, 16),
     *     cancel: (id) => clearTimeout(id),
     *   })
     *
     *   // Worker 环境
     *   const ticker = Ticker.create({
     *     request: (cb) => setTimeout(cb, 16),
     *     cancel: (id) => clearTimeout(id),
     *   })
     */
    static create(scheduler: FrameScheduler = defaultScheduler): Ticker {
        return new Ticker(scheduler)
    }

    /** 帧率上限（0 = 不限制），默认 60 */
    static targetFPS: number = 60

    private _listeners: TickerCallback[] = []
    private _frameId: number = 0
    private _running: boolean = false
    private _lastTime: number = 0
    private _elapsed: number = 0
    private _minInterval: number = 0
    private _scheduler: FrameScheduler

    constructor(scheduler: FrameScheduler) {
        this._scheduler = scheduler
    }

    get running(): boolean { return this._running }
    get elapsed(): number { return this._elapsed }

    /** 添加帧回调 */
    add(fn: TickerCallback): this {
        if (!this._listeners.includes(fn)) {
            this._listeners.push(fn)
        }
        return this
    }

    /** 移除帧回调 */
    remove(fn: TickerCallback): this {
        const idx = this._listeners.indexOf(fn)
        if (idx >= 0) this._listeners.splice(idx, 1)
        return this
    }

    /** 启动时钟 */
    start(): this {
        if (this._running) return this
        this._running = true
        this._lastTime = now()
        this._elapsed = 0
        this._minInterval = Ticker.targetFPS > 0 ? 1000 / Ticker.targetFPS : 0
        this._frameId = this._scheduler.request(this._tick)
        return this
    }

    /** 停止时钟 */
    stop(): this {
        this._running = false
        if (this._frameId) {
            this._scheduler.cancel(this._frameId)
            this._frameId = 0
        }
        return this
    }

    private _tick = (): void => {
        if (!this._running) return

        this._frameId = this._scheduler.request(this._tick)

        const current = now()
        let delta = current - this._lastTime

        // 帧率限制
        if (delta < this._minInterval) return

        // 防止大帧跳跃（如切到后台）
        if (delta > 500) delta = 500

        this._lastTime = current - (delta % this._minInterval || 0)
        this._elapsed += delta

        // 通知所有监听器
        const listeners = this._listeners
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](delta, this._elapsed)
        }
    }
}
