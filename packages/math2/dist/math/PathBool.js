import { PathBuilder } from "./PathBuilder.js";
var BoolOp = /* @__PURE__ */ ((BoolOp2) => {
  BoolOp2["Union"] = "union";
  BoolOp2["Intersect"] = "intersect";
  BoolOp2["Difference"] = "difference";
  BoolOp2["Xor"] = "xor";
  return BoolOp2;
})(BoolOp || {});
const EPS = 1e-10;
const FLAT_THRESHOLD = 0.25;
const MAX_SUBDIV_DEPTH = 20;
const pt = (x, y) => ({ x, y });
const add = (a, b) => pt(a.x + b.x, a.y + b.y);
const sub = (a, b) => pt(a.x - b.x, a.y - b.y);
const scale = (a, s) => pt(a.x * s, a.y * s);
const lerpPt = (a, b, t) => pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const cross2 = (a, b) => a.x * b.y - a.y * b.x;
const pointEq = (a, b, eps = EPS) => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;
function evalCurve(e, t) {
  switch (e.type) {
    case "line":
      return lerpPt(e.p0, e.p1, t);
    case "quad": {
      const u = 1 - t;
      return pt(
        u * u * e.p0.x + 2 * u * t * e.cp.x + t * t * e.p1.x,
        u * u * e.p0.y + 2 * u * t * e.cp.y + t * t * e.p1.y
      );
    }
    case "cubic": {
      const u = 1 - t;
      return pt(
        u * u * u * e.p0.x + 3 * u * u * t * e.cp1.x + 3 * u * t * t * e.cp2.x + t * t * t * e.p1.x,
        u * u * u * e.p0.y + 3 * u * u * t * e.cp1.y + 3 * u * t * t * e.cp2.y + t * t * t * e.p1.y
      );
    }
  }
}
function curveMidpoint(e) {
  return evalCurve(e, 0.5);
}
function curveBbox(e) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const pts = e.type === "line" ? [e.p0, e.p1] : e.type === "quad" ? [e.p0, e.cp, e.p1] : [e.p0, e.cp1, e.cp2, e.p1];
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}
function bboxOverlap(a, b, pad = EPS) {
  return a.maxX + pad >= b.minX && b.maxX + pad >= a.minX && a.maxY + pad >= b.minY && b.maxY + pad >= a.minY;
}
function ptToLineDist(p, a, b) {
  const ab = sub(b, a);
  const len2 = ab.x * ab.x + ab.y * ab.y;
  if (len2 < 1e-14) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / len2));
  const proj = add(a, scale(ab, t));
  return Math.hypot(p.x - proj.x, p.y - proj.y);
}
function isFlat(e) {
  switch (e.type) {
    case "line":
      return true;
    case "quad":
      return ptToLineDist(e.cp, e.p0, e.p1) <= FLAT_THRESHOLD;
    case "cubic":
      return ptToLineDist(e.cp1, e.p0, e.p1) <= FLAT_THRESHOLD && ptToLineDist(e.cp2, e.p0, e.p1) <= FLAT_THRESHOLD;
  }
}
function splitCurve(e, t) {
  switch (e.type) {
    case "line": {
      const mid = lerpPt(e.p0, e.p1, t);
      return [
        { type: "line", p0: e.p0, p1: mid },
        { type: "line", p0: mid, p1: e.p1 }
      ];
    }
    case "quad": {
      const q0 = lerpPt(e.p0, e.cp, t);
      const q1 = lerpPt(e.cp, e.p1, t);
      const mid = lerpPt(q0, q1, t);
      return [
        { type: "quad", p0: e.p0, cp: q0, p1: mid },
        { type: "quad", p0: mid, cp: q1, p1: e.p1 }
      ];
    }
    case "cubic": {
      const q0 = lerpPt(e.p0, e.cp1, t);
      const q1 = lerpPt(e.cp1, e.cp2, t);
      const q2 = lerpPt(e.cp2, e.p1, t);
      const r0 = lerpPt(q0, q1, t);
      const r1 = lerpPt(q1, q2, t);
      const mid = lerpPt(r0, r1, t);
      return [
        { type: "cubic", p0: e.p0, cp1: q0, cp2: r0, p1: mid },
        { type: "cubic", p0: mid, cp1: r1, cp2: q2, p1: e.p1 }
      ];
    }
  }
}
function curveStartPt(e) {
  return e.type === "line" ? e.p0 : e.p0;
}
function curveEndPt(e) {
  return e.type === "line" ? e.p1 : e.p1;
}
function segIntersect(a0, a1, b0, b1) {
  const d0 = sub(a1, a0), d1 = sub(b1, b0);
  const den = cross2(d0, d1);
  if (Math.abs(den) < 1e-12) return null;
  const t = cross2(sub(b0, a0), d1) / den;
  const u = cross2(sub(b0, a0), d0) / den;
  if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;
  return {
    t: Math.max(0, Math.min(1, t)),
    u: Math.max(0, Math.min(1, u)),
    point: add(a0, scale(d0, t))
  };
}
function localToGlobal(localT, t0, t1) {
  return t0 + localT * (t1 - t0);
}
function curveCurveIntersect(a, b, depth, out) {
  if (depth >= MAX_SUBDIV_DEPTH) {
    const hit = segIntersect(a.edge.p0, curveEndPt(a.edge), b.edge.p0, curveEndPt(b.edge));
    if (hit) {
      out.push({
        tA: localToGlobal(hit.t, a.t0, a.t1),
        tB: localToGlobal(hit.u, b.t0, b.t1),
        point: hit.point
      });
    }
    return;
  }
  const ba = curveBbox(a.edge);
  const bb = curveBbox(b.edge);
  if (!bboxOverlap(ba, bb)) return;
  if (isFlat(a.edge) && isFlat(b.edge)) {
    const hit = segIntersect(a.edge.p0, curveEndPt(a.edge), b.edge.p0, curveEndPt(b.edge));
    if (hit) {
      out.push({
        tA: localToGlobal(hit.t, a.t0, a.t1),
        tB: localToGlobal(hit.u, b.t0, b.t1),
        point: hit.point
      });
    }
    return;
  }
  const diagA = Math.hypot(ba.maxX - ba.minX, ba.maxY - ba.minY);
  const diagB = Math.hypot(bb.maxX - bb.minX, bb.maxY - bb.minY);
  if (diagA >= diagB) {
    const mid = (a.t0 + a.t1) / 2;
    const [left, right] = splitCurve(a.edge, 0.5);
    curveCurveIntersect({ edge: left, t0: a.t0, t1: mid }, b, depth + 1, out);
    curveCurveIntersect({ edge: right, t0: mid, t1: a.t1 }, b, depth + 1, out);
  } else {
    const mid = (b.t0 + b.t1) / 2;
    const [left, right] = splitCurve(b.edge, 0.5);
    curveCurveIntersect(a, { edge: left, t0: b.t0, t1: mid }, depth + 1, out);
    curveCurveIntersect(a, { edge: right, t0: mid, t1: b.t1 }, depth + 1, out);
  }
}
function extractContours(path) {
  const contours = [];
  let current = [];
  let movePt = { x: 0, y: 0 };
  let lastPt = { x: 0, y: 0 };
  let hasPendingMove = false;
  const closeContour = (contour) => {
    if (contour.length === 0) return;
    const end = curveEndPt(contour[contour.length - 1]);
    if (!pointEq(end, movePt)) {
      contour.push({ type: "line", p0: end, p1: movePt });
    }
  };
  path.visit({
    moveTo: (p) => {
      if (hasPendingMove && current.length > 0) {
        closeContour(current);
        contours.push(current);
      }
      current = [];
      movePt = { x: p.x, y: p.y };
      lastPt = { x: p.x, y: p.y };
      hasPendingMove = true;
    },
    lineTo: (start, end) => {
      current.push({ type: "line", p0: { ...lastPt }, p1: { x: end.x, y: end.y } });
      lastPt = { x: end.x, y: end.y };
    },
    quadraticCurveTo: (p0, p1, p2) => {
      current.push({
        type: "quad",
        p0: { ...lastPt },
        cp: { x: p1.x, y: p1.y },
        p1: { x: p2.x, y: p2.y }
      });
      lastPt = { x: p2.x, y: p2.y };
    },
    cubicCurveTo: (p0, p1, p2, p3) => {
      current.push({
        type: "cubic",
        p0: { ...lastPt },
        cp1: { x: p1.x, y: p1.y },
        cp2: { x: p2.x, y: p2.y },
        p1: { x: p3.x, y: p3.y }
      });
      lastPt = { x: p3.x, y: p3.y };
    },
    close: (lastPoint, movePoint) => {
      if (current.length > 0) {
        const end = curveEndPt(current[current.length - 1]);
        if (!pointEq(end, movePt)) {
          current.push({ type: "line", p0: end, p1: movePt });
        }
      }
      lastPt = movePt;
    }
  });
  if (hasPendingMove && current.length > 0) {
    closeContour(current);
    contours.push(current);
  }
  return contours;
}
function contoursToPathBuilder(contours) {
  const pb = new PathBuilder();
  for (const contour of contours) {
    if (contour.length < 1) continue;
    const first = curveStartPt(contour[0]);
    pb.moveTo(first.x, first.y);
    let prevEnd = first;
    for (const e of contour) {
      const start = curveStartPt(e);
      if (!pointEq(prevEnd, start, 1e-8)) {
        pb.lineTo(start.x, start.y);
      }
      const end = curveEndPt(e);
      switch (e.type) {
        case "line":
          pb.lineTo(end.x, end.y);
          break;
        case "quad":
          pb.quadraticCurveTo(e.cp.x, e.cp.y, end.x, end.y);
          break;
        case "cubic":
          pb.bezierCurveTo(e.cp1.x, e.cp1.y, e.cp2.x, e.cp2.y, end.x, end.y);
          break;
      }
      prevEnd = end;
    }
    pb.closePath();
  }
  return pb;
}
function contourToPoly(contour, tolerance = 0.5) {
  const out = [];
  for (const e of contour) {
    const isCurve = e.type === "quad" || e.type === "cubic";
    if (!isCurve) {
      out.push(curveStartPt(e));
      continue;
    }
    const steps = Math.max(2, Math.ceil(
      Math.hypot(
        e.type === "quad" ? Math.hypot(e.cp.x - e.p0.x, e.cp.y - e.p0.y) + Math.hypot(e.p1.x - e.cp.x, e.p1.y - e.cp.y) : Math.hypot(e.cp1.x - e.p0.x, e.cp1.y - e.p0.y) + Math.hypot(e.cp2.x - e.cp1.x, e.cp2.y - e.cp1.y) + Math.hypot(e.p1.x - e.cp2.x, e.p1.y - e.cp2.y)
      ) / tolerance
    ));
    for (let i = 0; i <= steps; i++) out.push(evalCurve(e, i / steps));
  }
  return out;
}
function windingNumber(p, poly) {
  let wind = 0;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    if (a.y <= p.y) {
      if (b.y > p.y && cross2(sub(b, a), sub(p, a)) > 0) wind++;
    } else {
      if (b.y <= p.y && cross2(sub(b, a), sub(p, a)) < 0) wind--;
    }
  }
  return wind;
}
function isInsidePath(p, contours) {
  let wind = 0;
  for (const c of contours) {
    wind += windingNumber(p, contourToPoly(c));
  }
  return wind !== 0;
}
function contourArea(contour) {
  let a = 0;
  for (const e of contour) {
    const p0 = curveStartPt(e), p1 = curveEndPt(e);
    a += p0.x * p1.y - p1.x * p0.y;
  }
  return a / 2;
}
function toClockwise(contour) {
  if (contourArea(contour) <= 0) return contour;
  return reverseContour(contour);
}
function toCounterClockwise(contour) {
  if (contourArea(contour) >= 0) return contour;
  return reverseContour(contour);
}
function normalizeContourDirections(contours, outerCW) {
  return contours.map((c, idx) => {
    const sample = curveMidpoint(c[0]);
    let depth = 0;
    for (let j = 0; j < contours.length; j++) {
      if (j === idx) continue;
      if (Math.abs(windingNumber(sample, contourToPoly(contours[j]))) % 2 === 1) depth++;
    }
    const isHole = depth % 2 === 1;
    const wantCW = isHole ? !outerCW : outerCW;
    return wantCW ? toClockwise(c) : toCounterClockwise(c);
  });
}
function reverseContour(contour) {
  const rev = [];
  for (let i = contour.length - 1; i >= 0; i--) {
    rev.push(reverseEdge(contour[i]));
  }
  return rev;
}
function reverseEdge(e) {
  switch (e.type) {
    case "line":
      return { type: "line", p0: e.p1, p1: e.p0 };
    case "quad":
      return { type: "quad", p0: e.p1, cp: e.cp, p1: e.p0 };
    case "cubic":
      return { type: "cubic", p0: e.p1, cp1: e.cp2, cp2: e.cp1, p1: e.p0 };
  }
}
function splitEdgeAt(e, ts) {
  if (ts.length === 0) return [e];
  const result = [];
  let remaining = e;
  let prevT = 0;
  for (const t of ts) {
    if (t <= prevT + EPS || t >= 1 - EPS) continue;
    const localT = (t - prevT) / (1 - prevT);
    const [left, right] = splitCurve(remaining, localT);
    result.push(left);
    remaining = right;
    prevT = t;
  }
  result.push(remaining);
  return result;
}
function buildVertexCycle(edges, fromSubject) {
  const vertices = [];
  for (const e of edges) {
    const v = {
      pt: curveStartPt(e),
      next: null,
      prev: null,
      edgeToNext: e,
      isIntersection: false,
      neighbor: null,
      visited: false,
      fromSubject
    };
    vertices.push(v);
  }
  for (let i = 0; i < vertices.length; i++) {
    vertices[i].next = vertices[(i + 1) % vertices.length];
    vertices[i].prev = vertices[(i + vertices.length - 1) % vertices.length];
  }
  return vertices;
}
function handleContainmentMulti(subjectContours, clipContours, op) {
  const result = [];
  for (const s of subjectContours) {
    const insideC = isInsidePath(curveMidpoint(s[0]), clipContours);
    if (op === "union" && !insideC) result.push(s);
    else if (op === "intersect" && insideC) result.push(s);
    else if (op === "difference" && !insideC) result.push(s);
  }
  for (const c of clipContours) {
    const insideS = isInsidePath(curveMidpoint(c[0]), subjectContours);
    if (op === "union" && !insideS) result.push(c);
    else if (op === "intersect" && insideS) result.push(c);
    else if (op === "difference" && insideS) result.push(c);
  }
  return result;
}
function ghBooleanOpMulti(subjectContours, clipContours, op) {
  if (op === "xor") {
    return [
      ...ghBooleanOpMulti(
        subjectContours,
        clipContours,
        "difference"
        /* Difference */
      ),
      ...ghBooleanOpMulti(
        clipContours,
        subjectContours,
        "difference"
        /* Difference */
      )
    ];
  }
  const sContours = normalizeContourDirections(subjectContours, true);
  const cContours = op === "difference" ? normalizeContourDirections(clipContours, false) : normalizeContourDirections(clipContours, true);
  const isects = [];
  for (let si = 0; si < sContours.length; si++) {
    const s = sContours[si];
    for (let ci = 0; ci < cContours.length; ci++) {
      const c = cContours[ci];
      for (let ei = 0; ei < s.length; ei++) {
        for (let ej = 0; ej < c.length; ej++) {
          if (!bboxOverlap(curveBbox(s[ei]), curveBbox(c[ej]), 1)) continue;
          const raw = [];
          curveCurveIntersect(
            { edge: s[ei], t0: 0, t1: 1 },
            { edge: c[ej], t0: 0, t1: 1 },
            0,
            raw
          );
          for (const hit of raw) {
            const ptA = evalCurve(s[ei], hit.tA);
            const ptB = evalCurve(c[ej], hit.tB);
            isects.push({
              point: { x: (ptA.x + ptB.x) / 2, y: (ptA.y + ptB.y) / 2 },
              ptA,
              ptB,
              tA: hit.tA,
              tB: hit.tB,
              contourIdxA: si,
              contourIdxB: ci,
              edgeIdxA: ei,
              edgeIdxB: ej
            });
          }
        }
      }
    }
  }
  const dedupIsects = [];
  for (const isec of isects) {
    if (!dedupIsects.find((d) => pointEq(d.point, isec.point, 0.01))) {
      dedupIsects.push(isec);
    }
  }
  if (dedupIsects.length === 0) {
    return handleContainmentMulti(sContours, cContours, op);
  }
  const splitSByContour = [];
  for (let si = 0; si < sContours.length; si++) {
    const contour = sContours[si];
    const split = [];
    for (let ei = 0; ei < contour.length; ei++) {
      const ts = dedupIsects.filter((i) => i.contourIdxA === si && i.edgeIdxA === ei).map((i) => i.tA).sort((a, b) => a - b);
      split.push(...splitEdgeAt(contour[ei], ts));
    }
    splitSByContour.push(split);
  }
  const splitCByContour = [];
  for (let ci = 0; ci < cContours.length; ci++) {
    const contour = cContours[ci];
    const split = [];
    for (let ej = 0; ej < contour.length; ej++) {
      const ts = dedupIsects.filter((i) => i.contourIdxB === ci && i.edgeIdxB === ej).map((i) => i.tB).sort((a, b) => a - b);
      split.push(...splitEdgeAt(contour[ej], ts));
    }
    splitCByContour.push(split);
  }
  const sContourVerts = splitSByContour.map((sc) => buildVertexCycle(sc, true));
  const cContourVerts = splitCByContour.map((cc) => buildVertexCycle(cc, false));
  const sVerts = sContourVerts.flat();
  const cVerts = cContourVerts.flat();
  const sHasIsect = new Array(sContours.length).fill(false);
  const cHasIsect = new Array(cContours.length).fill(false);
  for (const isec of dedupIsects) {
    for (let si = 0; si < sContourVerts.length; si++) {
      const sv = sContourVerts[si].find((v) => !v.isIntersection && pointEq(v.pt, isec.ptA, 0.01));
      if (!sv) continue;
      for (let ci = 0; ci < cContourVerts.length; ci++) {
        const cv = cContourVerts[ci].find((v) => !v.isIntersection && pointEq(v.pt, isec.ptB, 0.01));
        if (!cv) continue;
        sv.isIntersection = true;
        cv.isIntersection = true;
        sv.neighbor = cv;
        cv.neighbor = sv;
        sHasIsect[si] = true;
        cHasIsect[ci] = true;
      }
    }
  }
  const classify = (verts, otherContours) => {
    for (const v of verts) {
      if (!v.edgeToNext) continue;
      v.insideOther = isInsidePath(curveMidpoint(v.edgeToNext), otherContours);
    }
  };
  classify(sVerts, cContours);
  classify(cVerts, sContours);
  const result = [];
  const allVerts = [...sVerts, ...cVerts];
  const shouldKeepEdge = (v, op2) => {
    const inside = v.insideOther;
    switch (op2) {
      case "union":
        return !inside;
      case "intersect":
        return inside;
      case "difference":
        return v.fromSubject ? !inside : inside;
    }
    return true;
  };
  const follow = (start) => {
    const edges = [];
    let v = start;
    let iter = 0;
    const maxIter = allVerts.length * 3;
    while (iter < maxIter) {
      iter++;
      if (v.visited && v === start && edges.length > 0) break;
      v.visited = true;
      const next = v.next;
      if (v.isIntersection && v.neighbor) {
        const keep = shouldKeepEdge(v, op);
        if (!keep) {
          v = v.neighbor;
        } else {
          if (v.edgeToNext) edges.push(v.edgeToNext);
          v = next;
        }
      } else {
        if (v.edgeToNext) edges.push(v.edgeToNext);
        v = next;
      }
    }
    if (edges.length < 2) return null;
    return edges;
  };
  const allIntVerts = allVerts.filter((v) => v.isIntersection);
  for (let start of allIntVerts) {
    if (start.visited) continue;
    if (!shouldKeepEdge(start, op) && start.neighbor && !start.neighbor.visited) {
      start = start.neighbor;
    }
    if (start.visited) continue;
    const c = follow(start);
    if (c) result.push(c);
  }
  const handleIsolated = (contour, fromSubject) => {
    const mid = curveMidpoint(contour[0]);
    const otherContours = fromSubject ? cContours : sContours;
    const inside = isInsidePath(mid, otherContours);
    let keep = false;
    switch (op) {
      case "union":
        keep = !inside;
        break;
      case "intersect":
        keep = inside;
        break;
      case "difference":
        keep = fromSubject ? !inside : inside;
        break;
    }
    if (keep) result.push(contour);
  };
  for (let i = 0; i < sContours.length; i++) {
    if (!sHasIsect[i]) handleIsolated(sContours[i], true);
  }
  for (let i = 0; i < cContours.length; i++) {
    if (!cHasIsect[i]) handleIsolated(cContours[i], false);
  }
  if (result.length === 0 && op !== "intersect") {
    return sContours;
  }
  return result;
}
function pathBooleanOp(subject, clip, op) {
  const subjectContours = extractContours(subject);
  const clipContours = extractContours(clip);
  if (subjectContours.length === 0 || clipContours.length === 0) {
    if (op === "union" || op === "xor") {
      return contoursToPathBuilder([...subjectContours, ...clipContours]);
    }
    if (op === "difference") {
      return contoursToPathBuilder(subjectContours);
    }
    return new PathBuilder();
  }
  const result = ghBooleanOpMulti(subjectContours, clipContours, op);
  return contoursToPathBuilder(result);
}
export {
  BoolOp,
  pathBooleanOp
};
