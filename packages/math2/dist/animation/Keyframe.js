import { resolveEasing } from "./easing.js";
function buildKeyframes(keyframes, totalDuration) {
  if (keyframes.length === 0) return [];
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  if (sorted[0].time > 0) {
    sorted.unshift({ time: 0, value: sorted[0].value, easing: sorted[0].easing });
  }
  const result = sorted.map((kf) => ({
    time: kf.time,
    percent: totalDuration > 0 ? Math.min(kf.time / totalDuration, 1) : 0,
    value: kf.value,
    easingFunc: resolveEasing(kf.easing ?? "linear")
  }));
  return result;
}
function findKeyframeInterval(keyframes, percent) {
  const len = keyframes.length;
  if (len === 0) throw new Error("No keyframes");
  if (len === 1) return [keyframes[0], keyframes[0], 1];
  if (percent <= keyframes[0].percent) {
    return [keyframes[0], keyframes[0], 0];
  }
  if (percent >= keyframes[len - 1].percent) {
    return [keyframes[len - 1], keyframes[len - 1], 1];
  }
  let lo = 0, hi = len - 1;
  while (lo < hi - 1) {
    const mid = lo + hi >> 1;
    if (keyframes[mid].percent <= percent) lo = mid;
    else hi = mid;
  }
  const from = keyframes[lo];
  const to = keyframes[hi];
  const range = to.percent - from.percent;
  const w = range > 0 ? (percent - from.percent) / range : 0;
  const easedW = to.easingFunc(Math.min(Math.max(w, 0), 1));
  return [from, to, easedW];
}
export {
  buildKeyframes,
  findKeyframeInterval
};
