export type TickerCallback = (delta: number, elapsed: number) => void;
/** 帧调度器接口 */
export interface FrameScheduler {
    /** 请求下一帧，返回句柄 */
    request(callback: () => void): number;
    /** 取消已请求的帧 */
    cancel(id: number): void;
}
export declare class Ticker {
    private static _instance;
    /** 获取使用默认 rAF 的全局单例 */
    static get shared(): Ticker;
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
    static create(scheduler?: FrameScheduler): Ticker;
    /** 帧率上限（0 = 不限制），默认 60 */
    static targetFPS: number;
    private _listeners;
    private _frameId;
    private _running;
    private _lastTime;
    private _elapsed;
    private _minInterval;
    private _scheduler;
    constructor(scheduler: FrameScheduler);
    get running(): boolean;
    get elapsed(): number;
    /** 添加帧回调 */
    add(fn: TickerCallback): this;
    /** 移除帧回调 */
    remove(fn: TickerCallback): this;
    /** 启动时钟 */
    start(): this;
    /** 停止时钟 */
    stop(): this;
    private _tick;
}
