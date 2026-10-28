import { AnimationState, Animation } from "./Animation.js";
import { Ticker } from "./Ticker.js";
class Timeline {
  _children = [];
  _labels = /* @__PURE__ */ new Map();
  _defaults;
  _repeat;
  _yoyo;
  _repeatCount = 0;
  _state = AnimationState.Idle;
  _startTime = 0;
  _pauseTime = 0;
  _pausedElapsed = 0;
  /**
   * 总时长（毫秒），由所有子动画的最晚结束时间决定
   */
  get duration() {
    let max = 0;
    for (const child of this._children) {
      const end = child.startTime + child.animation.duration;
      if (end > max) max = end;
    }
    return max;
  }
  get state() {
    return this._state;
  }
  onStart;
  onUpdate;
  onComplete;
  constructor(config = {}) {
    this._repeat = config.repeat ?? 0;
    this._yoyo = config.yoyo ?? false;
    this._defaults = config.defaults ?? {};
    this.onStart = config.onStart;
    this.onUpdate = config.onUpdate;
    this.onComplete = config.onComplete;
  }
  // ---- 添加动画 ----
  /**
   * 添加一个动画到 Timeline
   * @param animation - 动画实例
   * @param position - 时间位置（毫秒，绝对时间）或偏移字符串（如 "+200" / "-100" / "labelName"）
   */
  add(animation, position = 0) {
    const resolvedTime = this._resolvePosition(position);
    this._children.push({
      animation,
      startTime: resolvedTime
    });
    return this;
  }
  /**
   * 快捷方法：创建动画并添加到 Timeline
   */
  to(config, position) {
    const fullConfig = {
      ...this._defaults,
      ...config
    };
    const anim = new Animation(fullConfig);
    return this.add(anim, position);
  }
  /**
   * 快捷方法：从当前值动画到指定值
   */
  fromTo(target, fromVars, toVars, duration, position) {
    const tracks = [];
    for (const key of Object.keys(toVars)) {
      tracks.push({
        property: key,
        keyframes: [
          { time: 0, value: fromVars[key] },
          { time: duration ?? this._defaults.duration ?? 1e3, value: toVars[key] }
        ]
      });
    }
    return this.to({ target, tracks, duration }, position);
  }
  /** 添加一个标签标记 */
  addLabel(name, position) {
    this._labels.set(name, position);
    return this;
  }
  // ---- 播放控制 ----
  play() {
    if (this._state === AnimationState.Playing) return this;
    this._state = AnimationState.Playing;
    this._startTime = Ticker.shared.elapsed;
    this._pausedElapsed = 0;
    this._repeatCount = 0;
    Ticker.shared.add(this._tick);
    this.onStart?.();
    return this;
  }
  pause() {
    if (this._state !== AnimationState.Playing) return this;
    this._state = AnimationState.Paused;
    this._pauseTime = Ticker.shared.elapsed;
    Ticker.shared.remove(this._tick);
    return this;
  }
  resume() {
    if (this._state !== AnimationState.Paused) return this;
    this._state = AnimationState.Playing;
    this._pausedElapsed += Ticker.shared.elapsed - this._pauseTime;
    Ticker.shared.add(this._tick);
    return this;
  }
  stop() {
    Ticker.shared.remove(this._tick);
    for (const child of this._children) {
      child.animation.stop();
    }
    this._state = AnimationState.Idle;
    return this;
  }
  /** 跳转到指定进度 */
  seek(progress) {
    const p = Math.max(0, Math.min(1, progress));
    const time = p * this.duration;
    this._seekTime(time);
    return this;
  }
  /** 清除所有子动画 */
  clear() {
    this.stop();
    this._children = [];
    this._labels.clear();
    return this;
  }
  // ---- 内部 ----
  _resolvePosition(position) {
    if (typeof position === "number") return position;
    if (position.startsWith("+") || position.startsWith("-")) {
      const offset = parseFloat(position);
      if (this._children.length === 0) return Math.max(0, offset);
      const last = this._children[this._children.length - 1];
      return Math.max(0, last.startTime + last.animation.duration + offset);
    }
    const labelTime = this._labels.get(position);
    if (labelTime !== void 0) return labelTime;
    return 0;
  }
  _tick = (_delta, _elapsed) => {
    if (this._state !== AnimationState.Playing) return;
    const elapsed = _elapsed - this._startTime - this._pausedElapsed;
    const total = this.duration;
    if (total <= 0) return;
    let rawPercent = elapsed / total;
    if (this._repeat < 0) {
      rawPercent = rawPercent % 1;
    } else if (rawPercent > 1) {
      this._repeatCount = Math.floor(rawPercent);
      if (this._repeatCount > this._repeat) {
        rawPercent = 1;
      } else {
        rawPercent -= this._repeatCount;
      }
    }
    if (this._yoyo) {
      const cycle = Math.floor(elapsed / total);
      if (cycle % 2 === 1) {
        rawPercent = 1 - rawPercent;
      }
    }
    const time = Math.min(rawPercent, 1) * total;
    this._seekTime(time);
    this.onUpdate?.(Math.min(rawPercent, 1));
    if (rawPercent >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat) {
      this._state = AnimationState.Completed;
      Ticker.shared.remove(this._tick);
      this.onComplete?.();
    }
  };
  _seekTime(time) {
    this.duration;
    for (const child of this._children) {
      const { animation, startTime } = child;
      const endTime = startTime + animation.duration;
      if (time < startTime) {
        animation.seek(0);
      } else if (time >= endTime) {
        animation.seek(1);
      } else if (animation.duration > 0) {
        const childProgress = (time - startTime) / animation.duration;
        animation.seek(childProgress);
      }
    }
  }
}
export {
  Timeline
};
