import { LineJoin, LineCap } from "./PathStroke.js";
import { Vector2 } from "./Vector2.js";
const TAU = Math.PI * 2;
function wrapAngle(a) {
  a %= TAU;
  if (a > Math.PI) a -= TAU;
  else if (a <= -Math.PI) a += TAU;
  return a;
}
function generateOutline(contours, options = {}) {
  const {
    lineWidth = 1,
    lineJoin = LineJoin.Miter,
    lineCap = LineCap.Butt,
    miterLimit = 10,
    scale = 1,
    alignment = 0.5
  } = options;
  const dLeft = lineWidth * 0.5;
  const dRight = lineWidth * 0.5;
  const halfWidth = lineWidth * 0.5;
  const eps = 1e-6 * (scale || 1);
  if (alignment !== 0.5) {
    contours = offsetContoursForAlignment(contours, (alignment - 0.5) * lineWidth);
  }
  const polygons = [];
  const pt = (x, y) => ({ x, y });
  const emit = (points) => {
    if (points.length >= 3) {
      polygons.push({ points, closed: true });
    }
  };
  const unitTangent = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len <= eps) return null;
    return pt(dx / len, dy / len);
  };
  const normalOf = (t) => pt(t.y, -t.x);
  const emitArc = (cx, cy, radius, ang0, sweep, includeCenter) => {
    const segs = (15 * Math.abs(sweep) * Math.sqrt(radius) / Math.PI >> 0) + 1;
    const poly = includeCenter ? [pt(cx, cy)] : [];
    for (let k = 0; k <= segs; k++) {
      const ang = ang0 + sweep * k / segs;
      poly.push(pt(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius));
    }
    emit(poly);
  };
  const emitCap = (p, nn, out) => {
    const left = pt(p.x + nn.x * dLeft, p.y + nn.y * dLeft);
    const right = pt(p.x - nn.x * dRight, p.y - nn.y * dRight);
    if (lineCap === LineCap.Square) {
      emit([
        left,
        right,
        pt(right.x + out.x * halfWidth, right.y + out.y * halfWidth),
        pt(left.x + out.x * halfWidth, left.y + out.y * halfWidth)
      ]);
    } else if (lineCap === LineCap.Round) {
      const cx = p.x + nn.x * ((dLeft - dRight) * 0.5);
      const cy = p.y + nn.y * ((dLeft - dRight) * 0.5);
      const ang0 = Math.atan2(nn.y, nn.x);
      const sweep = (nn.x * out.y - nn.y * out.x > 0 ? 1 : -1) * Math.PI;
      emitArc(cx, cy, halfWidth, ang0, sweep, false);
    }
  };
  for (const contour of contours) {
    if (!contour || contour.points.length === 0) continue;
    const pts = [];
    for (const p of contour.points) {
      const last = pts[pts.length - 1];
      if (last && Math.abs(last.x - p.x) <= eps && Math.abs(last.y - p.y) <= eps) continue;
      pts.push(pt(p.x, p.y));
    }
    if (contour.closed && pts.length > 1) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      if (Math.abs(first.x - last.x) <= eps && Math.abs(first.y - last.y) <= eps) {
        pts.pop();
      }
    }
    const n = pts.length;
    if (n < 2) continue;
    const closed = contour.closed;
    const segCount = closed ? n : n - 1;
    const nextIndex = (i) => (i + 1) % n;
    const normals = [];
    for (let i = 0; i < segCount; i++) {
      const a = pts[i];
      const b = pts[nextIndex(i)];
      const t = unitTangent(a, b);
      if (!t) {
        normals.push(null);
        continue;
      }
      const nn = normalOf(t);
      normals.push(nn);
      const lx = nn.x * dLeft;
      const ly = nn.y * dLeft;
      const rx = -nn.x * dRight;
      const ry = -nn.y * dRight;
      emit([
        pt(a.x + lx, a.y + ly),
        pt(b.x + lx, b.y + ly),
        pt(b.x + rx, b.y + ry),
        pt(a.x + rx, a.y + ry)
      ]);
    }
    const firstJoin = closed ? 0 : 1;
    const lastJoin = closed ? n - 1 : n - 2;
    for (let v = firstJoin; v <= lastJoin; v++) {
      const n0 = normals[(v - 1 + segCount) % segCount];
      const n1 = normals[v % segCount];
      if (!n0 || !n1) continue;
      const p = pts[v];
      const turn = n0.x * n1.y - n0.y * n1.x;
      if (Math.abs(turn) <= eps) continue;
      const s = turn > 0 ? 1 : -1;
      const radius = s > 0 ? dLeft : dRight;
      const a0 = pt(s * n0.x, s * n0.y);
      const a1 = pt(s * n1.x, s * n1.y);
      const e0 = pt(p.x + a0.x * radius, p.y + a0.y * radius);
      const e1 = pt(p.x + a1.x * radius, p.y + a1.y * radius);
      if (lineJoin === LineJoin.Round) {
        const ang0 = Math.atan2(a0.y, a0.x);
        const sweep = wrapAngle(Math.atan2(a1.y, a1.x) - ang0);
        emitArc(p.x, p.y, radius, ang0, sweep, true);
      } else if (lineJoin === LineJoin.Bevel) {
        emit([pt(p.x, p.y), e0, e1]);
      } else {
        const bx = a0.x + a1.x;
        const by = a0.y + a1.y;
        const blen = Math.hypot(bx, by);
        const cosHalf = blen <= eps ? 0 : (a0.x * bx + a0.y * by) / blen;
        if (cosHalf <= eps || 1 / cosHalf > miterLimit) {
          emit([pt(p.x, p.y), e0, e1]);
        } else {
          const miterLen = radius / cosHalf;
          const m = pt(p.x + bx / blen * miterLen, p.y + by / blen * miterLen);
          emit([pt(p.x, p.y), e0, m, e1]);
        }
      }
    }
    if (!closed && lineCap !== LineCap.Butt) {
      const startNormal = normals[0];
      if (startNormal) {
        const t0 = unitTangent(pts[0], pts[1]);
        if (t0) emitCap(pts[0], startNormal, pt(-t0.x, -t0.y));
      }
      const endNormal = normals[segCount - 1];
      if (endNormal) {
        const t1 = unitTangent(pts[n - 2], pts[n - 1]);
        if (t1) emitCap(pts[n - 1], endNormal, t1);
      }
    }
  }
  return polygons;
}
function offsetOutlineForAlignment(contour, shift) {
  const pts = contour.points.slice();
  if (contour.closed && Vector2.equalsEpsilon(pts[pts.length - 1], pts[0])) {
    pts.pop();
  }
  const n = pts.length;
  if (n < 2 || Math.abs(shift) < 1e-9) return pts.map((p) => ({ x: p.x, y: p.y }));
  const closed = contour.closed;
  const segCount = closed ? n : n - 1;
  const normals = [];
  for (let i = 0; i < segCount; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    normals.push({ x: dy / len, y: -dx / len });
  }
  return pts.map((p, i) => {
    let vx, vy;
    if (!closed && i === 0) {
      vx = normals[0].x * shift;
      vy = normals[0].y * shift;
    } else if (!closed && i === n - 1) {
      const nm = normals[segCount - 1];
      vx = nm.x * shift;
      vy = nm.y * shift;
    } else {
      const pn = normals[(i - 1 + segCount) % segCount];
      const nn = normals[i % segCount];
      const denom = 1 + (pn.x * nn.x + pn.y * nn.y);
      if (Math.abs(denom) < 1e-9) {
        vx = pn.x * shift;
        vy = pn.y * shift;
      } else {
        vx = (pn.x + nn.x) * shift / denom;
        vy = (pn.y + nn.y) * shift / denom;
      }
    }
    return { x: p.x + vx, y: p.y + vy };
  });
}
function offsetContoursForAlignment(contours, shift) {
  return contours.map((contour) => ({ points: offsetOutlineForAlignment(contour, shift), closed: contour.closed }));
}
export {
  generateOutline,
  offsetContoursForAlignment,
  offsetOutlineForAlignment
};
