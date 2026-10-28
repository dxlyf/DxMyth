import { Ticker } from "./Ticker.js";
import { Animation } from "./Animation.js";
import { Timeline } from "./Timeline.js";
class AnimationSystem {
  _animations = /* @__PURE__ */ new Set();
  _timelines = /* @__PURE__ */ new Set();
  _enabled = false;
  /** 是否已启用（注册到 Ticker） */
  get enabled() {
    return this._enabled;
  }
  /** 活跃动画数量 */
  get activeCount() {
    return this._animations.size + this._timelines.size;
  }
  /**
   * 创建动画
   * @example
   *   system.animate({
   *     target: rect,
   *     tracks: [
   *       { property: 'x', keyframes: [{ time: 1000, value: 200 }] }
   *     ],
   *     duration: 1000,
   *     easing: 'cubicOut',
   *   })
   */
  animate(config) {
    const anim = new Animation(config);
    this._animations.add(anim);
    if (!this._enabled) this._start();
    anim.play();
    const onComplete = anim.onComplete;
    anim.onComplete = () => {
      onComplete?.();
      this._animations.delete(anim);
      if (this.activeCount === 0) this._stop();
    };
    return anim;
  }
  /**
   * 创建时间线
   * @example
   *   const tl = system.timeline()
   *     .to({ target: rect, tracks: [...] })
   *     .to({ target: circle, tracks: [...] }, '+=200')
   *     .play()
   */
  timeline(config) {
    const tl = new Timeline(config);
    const origPlay = tl.play.bind(tl);
    tl.play = () => {
      this._timelines.add(tl);
      if (!this._enabled) this._start();
      return origPlay();
    };
    const origComplete = tl.onComplete;
    tl.onComplete = () => {
      origComplete?.();
      this._timelines.delete(tl);
      if (this.activeCount === 0) this._stop();
    };
    return tl;
  }
  /**
   * 停止所有动画
   */
  stopAll() {
    for (const anim of this._animations) anim.stop();
    this._animations.clear();
    for (const tl of this._timelines) tl.stop();
    this._timelines.clear();
    this._stop();
  }
  /** 暂停所有 */
  pauseAll() {
    for (const anim of this._animations) anim.pause();
    for (const tl of this._timelines) tl.pause();
  }
  /** 恢复所有 */
  resumeAll() {
    for (const anim of this._animations) anim.resume();
    for (const tl of this._timelines) tl.resume();
  }
  _start() {
    this._enabled = true;
    Ticker.shared.start();
  }
  _stop() {
    this._enabled = false;
  }
}
export {
  AnimationSystem
};
