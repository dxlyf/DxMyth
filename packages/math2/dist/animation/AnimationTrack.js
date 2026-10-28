import { buildKeyframes, findKeyframeInterval } from "./Keyframe.js";
import { interpolateValue } from "./Interpolation.js";
class AnimationTrack {
  /** 属性名 */
  property;
  /** 目标对象 */
  target;
  /** 初始值（动画开始前快照） */
  _startValue;
  /** 关键帧运行时数据 */
  _keyframes = [];
  /** 是否已准备（已调用 prepare） */
  _prepared = false;
  constructor(config) {
    this.property = config.property;
    this.target = config.target;
    this._startValue = config.target[config.property];
    if (config.keyframes.length > 0) {
      const kfs = [...config.keyframes];
      if (kfs[0].time > 0) {
        kfs.unshift({ time: 0, value: this._startValue });
      }
      this._keyframes = buildKeyframes(
        kfs,
        kfs[kfs.length - 1].time
      );
    }
  }
  /** 是否有关键帧 */
  get hasKeyframes() {
    return this._keyframes.length > 0;
  }
  /** 最后一个关键帧的时间（毫秒） */
  get endTime() {
    return this._keyframes.length > 0 ? this._keyframes[this._keyframes.length - 1].time : 0;
  }
  /**
   * 根据归一化进度计算并写入属性值
   * @param percent - 总动画进度 [0, 1]
   */
  tick(percent) {
    const kfs = this._keyframes;
    if (kfs.length === 0) return;
    const [from, to, w] = findKeyframeInterval(kfs, percent);
    const value = interpolateValue(from.value, to.value, w);
    this.target[this.property] = value;
  }
  /** 获取指定进度的值（不写入 target） */
  getValueAt(percent) {
    const kfs = this._keyframes;
    if (kfs.length === 0) return this._startValue;
    const [from, to, w] = findKeyframeInterval(kfs, percent);
    return interpolateValue(from.value, to.value, w);
  }
  /** 重置到初始值 */
  reset() {
    this.target[this.property] = this._startValue;
  }
}
export {
  AnimationTrack
};
