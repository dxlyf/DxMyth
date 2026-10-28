import { PathBuilder } from "./PathBuilder.js";
function normalizeDash(dash) {
  if (dash == null) return null;
  const raw = dash.intervals;
  if (raw.length === 0) return null;
  for (const v of raw) {
    if (!Number.isFinite(v) || v < 0) {
      throw new RangeError(`DashStyle: 虚线段长度必须是非负有限数 (${v})`);
    }
  }
  const intervals = raw.length % 2 === 1 ? raw.concat(raw) : raw.slice();
  let total = 0;
  for (const v of intervals) total += v;
  if (!(total > 0)) return null;
  let phase = (dash.phase ?? 0) % total;
  if (phase < 0) phase += total;
  if (!Number.isFinite(phase)) phase = 0;
  return { intervals, total, phase };
}
function dashContours(contours, dash, resetPhasePerContour = true) {
  const nd = normalizeDash(dash);
  if (nd === null) {
    return contours.map((c) => ({ points: c.points.slice(), closed: c.closed }));
  }
  const intervals = nd.intervals;
  const count = intervals.length;
  let idx = 0;
  let remaining = 0;
  let on = true;
  const resetPhase = () => {
    let acc = 0;
    let i = 0;
    while (i < count - 1 && acc + (intervals[i] ?? 0) <= nd.phase) {
      acc += intervals[i] ?? 0;
      i++;
    }
    idx = i;
    remaining = (intervals[i] ?? 0) - (nd.phase - acc);
    on = i % 2 === 0;
  };
  resetPhase();
  const out = [];
  for (const contour of contours) {
    if (!resetPhasePerContour) ;
    else {
      resetPhase();
    }
    const pts = contour.points;
    const n = pts.length;
    if (n < 2) {
      if (on && n === 1) out.push({ points: pts.slice(), closed: contour.closed });
      continue;
    }
    const segCount = contour.closed ? n : n - 1;
    let cur = [];
    let anyOff = false;
    let startedAtLoopStart = false;
    const pushPoint = (x, y) => {
      const m = cur.length;
      if (m >= 1 && cur[m - 1].x === x && cur[m - 1].y === y) return;
      cur.push({ x, y });
    };
    for (let s = 0; s < segCount; s++) {
      const ax = pts[s].x;
      const ay = pts[s].y;
      const j = (s + 1) % n;
      const bx = pts[j].x;
      const by = pts[j].y;
      const segLen = Math.hypot(bx - ax, by - ay);
      if (segLen === 0) continue;
      let travelled = 0;
      while (travelled < segLen) {
        const step = Math.min(remaining, segLen - travelled);
        const t0 = travelled / segLen;
        const t1 = (travelled + step) / segLen;
        if (on) {
          if (cur.length === 0) {
            pushPoint(ax + (bx - ax) * t0, ay + (by - ay) * t0);
            if (s === 0 && t0 === 0) startedAtLoopStart = true;
          }
          pushPoint(ax + (bx - ax) * t1, ay + (by - ay) * t1);
        }
        travelled += step;
        remaining -= step;
        if (remaining <= 1e-12) {
          idx = (idx + 1) % count;
          remaining = intervals[idx] ?? 0;
          on = idx % 2 === 0;
          if (!on) {
            anyOff = true;
            if (cur.length >= 4) {
              out.push({ points: cur, closed: false });
              cur = [];
              startedAtLoopStart = false;
            }
          }
        }
      }
    }
    if (cur.length >= 4) {
      const full = contour.closed && !anyOff && startedAtLoopStart;
      out.push({ points: cur, closed: full });
    }
  }
  return out;
}
function dashPath(path, dash, options = {}) {
  const contourFlattenOptions = {
    tolerance: options.tolerance ?? 0.25,
    autoClose: options.autoClose ?? false,
    skipDegenerate: options.skipDegenerate ?? false
  };
  const contours = path.getSubPaths(contourFlattenOptions);
  const fragments = dashContours(contours, dash, options.resetPhasePerContour ?? true);
  const out = new PathBuilder();
  for (const frag of fragments) {
    const n = frag.points.length >> 1;
    if (n === 0) continue;
    out.moveTo(frag.points[0].x, frag.points[0].y);
    for (let i = 1; i < n; i++) {
      out.lineTo(frag.points[i].x, frag.points[i].y);
    }
    if (frag.closed) out.closePath();
  }
  return out;
}
export {
  dashContours,
  dashPath,
  normalizeDash
};
