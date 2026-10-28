import { Ticker } from "./Ticker.js";
import { AnimationTrack } from "./AnimationTrack.js";
import { resolveEasing } from "./easing.js";
var AnimationDirection = /* @__PURE__ */ ((AnimationDirection2) => {
  AnimationDirection2[AnimationDirection2["Forward"] = 1] = "Forward";
  AnimationDirection2[AnimationDirection2["Backward"] = -1] = "Backward";
  return AnimationDirection2;
})(AnimationDirection || {});
var AnimationState = /* @__PURE__ */ ((AnimationState2) => {
  AnimationState2["Idle"] = "idle";
  AnimationState2["Playing"] = "playing";
  AnimationState2["Paused"] = "paused";
  AnimationState2["Completed"] = "completed";
  return AnimationState2;
})(AnimationState || {});
class Animation {
  /** 目标对象 */
  target;
  // 配置
  _duration;
  _delay;
  _repeat;
  _yoyo;
  _easingFunc;
  // 轨道
  _tracks = [];
  // 状态
  _state = "idle";
  _direction = 1;
  _repeatCount = 0;
  // 时间
  _startTime = 0;
  _pauseTime = 0;
  _pausedElapsed = 0;
  _progress = 0;
  // 回调
  onStart;
  onUpdate;
  onRepeat;
  onComplete;
  constructor(config) {
    this.target = config.target;
    this._duration = config.duration ?? 1e3;
    this._delay = config.delay ?? 0;
    if (config.loop) {
      this._repeat = -1;
    } else {
      this._repeat = config.repeat ?? 0;
    }
    this._yoyo = config.yoyo ?? false;
    this._easingFunc = resolveEasing(config.easing ?? "linear");
    this.onStart = config.onStart;
    this.onUpdate = config.onUpdate;
    this.onRepeat = config.onRepeat;
    this.onComplete = config.onComplete;
    for (const trk of config.tracks) {
      this._tracks.push(new AnimationTrack({
        property: trk.property,
        keyframes: trk.keyframes,
        target: config.target
      }));
    }
  }
  // ---- 属性 ----
  get state() {
    return this._state;
  }
  get duration() {
    return this._duration;
  }
  get progress() {
    return this._progress;
  }
  get repeat() {
    return this._repeat;
  }
  get yoyo() {
    return this._yoyo;
  }
  /** 当前播放方向 */
  get direction() {
    return this._direction;
  }
  set direction(v) {
    this._direction = v;
  }
  // ---- 播放控制 ----
  /** 开始播放 */
  play() {
    if (this._state === "playing") return this;
    if (this._state === "completed") this._reset();
    this._state = "playing";
    this._direction = 1;
    this._startTime = Ticker.shared.elapsed;
    this._pausedElapsed = 0;
    Ticker.shared.add(this._tick);
    this.onStart?.();
    return this;
  }
  /** 暂停 */
  pause() {
    if (this._state !== "playing") return this;
    this._state = "paused";
    this._pauseTime = Ticker.shared.elapsed;
    Ticker.shared.remove(this._tick);
    return this;
  }
  /** 恢复 */
  resume() {
    if (this._state !== "paused") return this;
    this._state = "playing";
    this._pausedElapsed += Ticker.shared.elapsed - this._pauseTime;
    Ticker.shared.add(this._tick);
    return this;
  }
  /** 停止并重置 */
  stop() {
    Ticker.shared.remove(this._tick);
    this._reset();
    this._state = "idle";
    return this;
  }
  /** 跳到指定进度并立即更新 */
  seek(progress) {
    const p = Math.max(0, Math.min(1, progress));
    this._applyProgress(p);
    return this;
  }
  /** 立即完成 */
  complete() {
    this._applyProgress(1);
    this._finish();
    return this;
  }
  // ---- 内部 ----
  _reset() {
    this._progress = 0;
    this._repeatCount = 0;
    this._direction = 1;
    for (const track of this._tracks) {
      track.reset();
    }
  }
  _tick = (_delta, _elapsed) => {
    if (this._state !== "playing") return;
    const elapsed = _elapsed - this._startTime - this._pausedElapsed;
    if (elapsed < this._delay) return;
    const activeTime = elapsed - this._delay;
    const total = this._duration;
    if (total <= 0) {
      this._applyProgress(1);
      this._finish();
      return;
    }
    let rawPercent = activeTime / total;
    if (rawPercent > 1) {
      const cycles = Math.floor(rawPercent);
      rawPercent -= cycles;
      if (this._repeat < 0) {
        this.onRepeat?.();
        this._repeatCount++;
      } else {
        this._repeatCount += cycles;
        if (this._repeatCount > this._repeat) {
          rawPercent = 1;
        }
      }
    }
    let effectivePercent = rawPercent;
    if (this._yoyo) {
      const cycle = Math.floor(activeTime / total);
      if (cycle % 2 === 1) {
        this._direction = -1;
        effectivePercent = 1 - rawPercent;
      } else {
        this._direction = 1;
      }
    }
    const eased = this._easingFunc(Math.min(effectivePercent, 1));
    this._applyProgress(eased);
    if (effectivePercent >= 1 && this._repeat >= 0 && this._repeatCount >= this._repeat) {
      this._finish();
    }
  };
  _applyProgress(progress) {
    this._progress = progress;
    for (const track of this._tracks) {
      track.tick(progress);
    }
    this.onUpdate?.(progress);
  }
  _finish() {
    this._state = "completed";
    Ticker.shared.remove(this._tick);
    this.onComplete?.();
  }
}
export {
  Animation,
  AnimationDirection,
  AnimationState
};
