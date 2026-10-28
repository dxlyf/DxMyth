const defaultScheduler = typeof requestAnimationFrame !== "undefined" ? {
  request: (cb) => requestAnimationFrame(cb),
  cancel: (id) => cancelAnimationFrame(id)
} : {
  // 兜底：setTimeout 16ms
  request: (cb) => window.setTimeout(cb, 16),
  cancel: (id) => clearTimeout(id)
};
const now = () => typeof performance !== "undefined" ? performance.now() : Date.now();
class Ticker {
  static _instance = null;
  /** 获取使用默认 rAF 的全局单例 */
  static get shared() {
    if (!Ticker._instance) {
      Ticker._instance = new Ticker(defaultScheduler);
    }
    return Ticker._instance;
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
  static create(scheduler = defaultScheduler) {
    return new Ticker(scheduler);
  }
  /** 帧率上限（0 = 不限制），默认 60 */
  static targetFPS = 60;
  _listeners = [];
  _frameId = 0;
  _running = false;
  _lastTime = 0;
  _elapsed = 0;
  _minInterval = 0;
  _scheduler;
  constructor(scheduler) {
    this._scheduler = scheduler;
  }
  get running() {
    return this._running;
  }
  get elapsed() {
    return this._elapsed;
  }
  /** 添加帧回调 */
  add(fn) {
    if (!this._listeners.includes(fn)) {
      this._listeners.push(fn);
    }
    return this;
  }
  /** 移除帧回调 */
  remove(fn) {
    const idx = this._listeners.indexOf(fn);
    if (idx >= 0) this._listeners.splice(idx, 1);
    return this;
  }
  /** 启动时钟 */
  start() {
    if (this._running) return this;
    this._running = true;
    this._lastTime = now();
    this._elapsed = 0;
    this._minInterval = Ticker.targetFPS > 0 ? 1e3 / Ticker.targetFPS : 0;
    this._frameId = this._scheduler.request(this._tick);
    return this;
  }
  /** 停止时钟 */
  stop() {
    this._running = false;
    if (this._frameId) {
      this._scheduler.cancel(this._frameId);
      this._frameId = 0;
    }
    return this;
  }
  _tick = () => {
    if (!this._running) return;
    this._frameId = this._scheduler.request(this._tick);
    const current = now();
    let delta = current - this._lastTime;
    if (delta < this._minInterval) return;
    if (delta > 500) delta = 500;
    this._lastTime = current - (delta % this._minInterval || 0);
    this._elapsed += delta;
    const listeners = this._listeners;
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i](delta, this._elapsed) === false) {
        listeners.splice(i, 1);
        i--;
      }
    }
  };
}
export {
  Ticker
};
