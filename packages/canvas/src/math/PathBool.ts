import { PathBuilder,PathVerb } from './PathBuilder'

// ── 类型定义 ─────────────────────────────────────────────

/** 二维点 */
type Pt = { x: number; y: number }

/**
 * 轮廓上的曲线边。布尔运算保留曲线段（quad/cubic），不展平为折线，
 * 以保证结果路径质量与原路径一致。
 */
type CurveEdge =
  | { type: 'line'; p0: Pt; p1: Pt }
  | { type: 'quad'; p0: Pt; cp: Pt; p1: Pt }
  | { type: 'cubic'; p0: Pt; cp1: Pt; cp2: Pt; p1: Pt }

/** 一条闭合轮廓 = 有序的曲线边数组 */
type Contour = CurveEdge[]

/** 两条曲线的交点信息 */
interface Intersection {
  /** ptA 与 ptB 的中点，用于交点去重 */
  point: Pt
  /** subject 曲线在 tA 处的真实点（与分裂后的顶点一致） */
  ptA: Pt
  /** clip 曲线在 tB 处的真实点（与分裂后的顶点一致） */
  ptB: Pt
  /** subject 边上的参数 t */
  tA: number
  /** clip 边上的参数 t */
  tB: number
  /** subject 轮廓索引（多轮廓/孔洞场景） */
  contourIdxA: number
  /** clip 轮廓索引 */
  contourIdxB: number
  /** subject 轮廓中边的索引 */
  edgeIdxA: number
  /** clip 轮廓中边的索引 */
  edgeIdxB: number
}

/** 布尔运算类型 */
export enum BoolOp {
  Union = 'union',         // 并集 A ∪ B
  Intersect = 'intersect', // 交集 A ∩ B
  Difference = 'difference', // 差集 A - B
  Xor = 'xor',             // 对称差 A ⊕ B
}

const EPS = 1e-10             // 通用浮点容差
const FLAT_THRESHOLD = 0.25   // 曲线"足够平坦"的阈值（控制点到弦距离）
const MAX_SUBDIV_DEPTH = 20   // 曲线-曲线相交递归细分最大深度

// ── 点的基本运算 ──────────────────────────────────────────

const pt = (x: number, y: number): Pt => ({ x, y })
const add = (a: Pt, b: Pt): Pt => pt(a.x + b.x, a.y + b.y)
const sub = (a: Pt, b: Pt): Pt => pt(a.x - b.x, a.y - b.y)
const scale = (a: Pt, s: number): Pt => pt(a.x * s, a.y * s)
const lerpPt = (a: Pt, b: Pt, t: number): Pt => pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
// 二维叉积：|a||b|sinθ，正值表示 b 在 a 的逆时针方向
const cross2 = (a: Pt, b: Pt): number => a.x * b.y - a.y * b.x
const pointEq = (a: Pt, b: Pt, eps = EPS): boolean => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps

// ── 曲线辅助函数 ─────────────────────────────────────────

/** 在参数 t 处计算曲线上的点 */
function evalCurve(e: CurveEdge, t: number): Pt {
  switch (e.type) {
    case 'line': return lerpPt(e.p0, e.p1, t)
    case 'quad': {
      const u = 1 - t
      return pt(u * u * e.p0.x + 2 * u * t * e.cp.x + t * t * e.p1.x,
               u * u * e.p0.y + 2 * u * t * e.cp.y + t * t * e.p1.y)
    }
    case 'cubic': {
      const u = 1 - t
      return pt(
        u * u * u * e.p0.x + 3 * u * u * t * e.cp1.x + 3 * u * t * t * e.cp2.x + t * t * t * e.p1.x,
        u * u * u * e.p0.y + 3 * u * u * t * e.cp1.y + 3 * u * t * t * e.cp2.y + t * t * t * e.p1.y,
      )
    }
  }
}

/** 计算曲线中点（t=0.5），用于边分类时的"代表性"内部点 */
function curveMidpoint(e: CurveEdge): Pt { return evalCurve(e, 0.5) }

/** 曲线包围盒（取控制点的极值，比真实包围盒略大，作为粗筛用） */
function curveBbox(e: CurveEdge): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const pts = e.type === 'line' ? [e.p0, e.p1] :
              e.type === 'quad' ? [e.p0, e.cp, e.p1] :
              [e.p0, e.cp1, e.cp2, e.p1]
  for (const p of pts) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y
  }
  return { minX, minY, maxX, maxY }
}

function bboxOverlap(a: ReturnType<typeof curveBbox>, b: ReturnType<typeof curveBbox>, pad = EPS): boolean {
  return a.maxX + pad >= b.minX && b.maxX + pad >= a.minX &&
         a.maxY + pad >= b.minY && b.maxY + pad >= a.minY
}

/** Point-to-line distance */
function ptToLineDist(p: Pt, a: Pt, b: Pt): number {
  const ab = sub(b, a)
  const len2 = ab.x * ab.x + ab.y * ab.y
  if (len2 < 1e-14) return Math.hypot(p.x - a.x, p.y - a.y)
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / len2))
  const proj = add(a, scale(ab, t))
  return Math.hypot(p.x - proj.x, p.y - proj.y)
}

/** Check if a curve is approximately flat */
function isFlat(e: CurveEdge): boolean {
  switch (e.type) {
    case 'line': return true
    case 'quad': return ptToLineDist(e.cp, e.p0, e.p1) <= FLAT_THRESHOLD
    case 'cubic':
      return ptToLineDist(e.cp1, e.p0, e.p1) <= FLAT_THRESHOLD &&
             ptToLineDist(e.cp2, e.p0, e.p1) <= FLAT_THRESHOLD
  }
}

/** Split a curve at parameter t using de Casteljau.
 *  Returns [left, right] sub-curves. */
function splitCurve(e: CurveEdge, t: number): [CurveEdge, CurveEdge] {
  switch (e.type) {
    case 'line': {
      const mid = lerpPt(e.p0, e.p1, t)
      return [
        { type: 'line', p0: e.p0, p1: mid },
        { type: 'line', p0: mid, p1: e.p1 },
      ]
    }
    case 'quad': {
      const q0 = lerpPt(e.p0, e.cp, t)
      const q1 = lerpPt(e.cp, e.p1, t)
      const mid = lerpPt(q0, q1, t)
      return [
        { type: 'quad', p0: e.p0, cp: q0, p1: mid },
        { type: 'quad', p0: mid, cp: q1, p1: e.p1 },
      ]
    }
    case 'cubic': {
      const q0 = lerpPt(e.p0, e.cp1, t)
      const q1 = lerpPt(e.cp1, e.cp2, t)
      const q2 = lerpPt(e.cp2, e.p1, t)
      const r0 = lerpPt(q0, q1, t)
      const r1 = lerpPt(q1, q2, t)
      const mid = lerpPt(r0, r1, t)
      return [
        { type: 'cubic', p0: e.p0, cp1: q0, cp2: r0, p1: mid },
        { type: 'cubic', p0: mid, cp1: r1, cp2: q2, p1: e.p1 },
      ]
    }
  }
}

function curveStartPt(e: CurveEdge): Pt {
  return e.type === 'line' ? e.p0 : e.p0
}
function curveEndPt(e: CurveEdge): Pt {
  return e.type === 'line' ? e.p1 : e.p1
}

// ── Line-line intersection ───────────────────────────────

function segIntersect(a0: Pt, a1: Pt, b0: Pt, b1: Pt): { t: number; u: number; point: Pt } | null {
  const d0 = sub(a1, a0), d1 = sub(b1, b0)
  const den = cross2(d0, d1)
  if (Math.abs(den) < 1e-12) return null
  const t = cross2(sub(b0, a0), d1) / den
  const u = cross2(sub(b0, a0), d0) / den
  if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null
  return {
    t: Math.max(0, Math.min(1, t)),
    u: Math.max(0, Math.min(1, u)),
    point: add(a0, scale(d0, t)),
  }
}

// ── Curve-curve intersection via recursive subdivision ───

interface SubCurve {
  edge: CurveEdge
  t0: number  // global parameter start in the original edge
  t1: number  // global parameter end in the original edge
}

/** Map a local t on a sub-curve to the global parameter on the original edge */
function localToGlobal(localT: number, t0: number, t1: number): number {
  return t0 + localT * (t1 - t0)
}

/**
 * Recursive curve-curve intersection using bounding-box culling and subdivision.
 */
function curveCurveIntersect(
  a: SubCurve, b: SubCurve, depth: number, out: { tA: number; tB: number; point: Pt }[]
): void {
  if (depth >= MAX_SUBDIV_DEPTH) {
    // Fallback: treat both as lines
    const hit = segIntersect(a.edge.p0, curveEndPt(a.edge), b.edge.p0, curveEndPt(b.edge))
    if (hit) {
      out.push({
        tA: localToGlobal(hit.t, a.t0, a.t1),
        tB: localToGlobal(hit.u, b.t0, b.t1),
        point: hit.point,
      })
    }
    return
  }

  const ba = curveBbox(a.edge)
  const bb = curveBbox(b.edge)
  if (!bboxOverlap(ba, bb)) return

  // If both are flat enough, treat as lines
  if (isFlat(a.edge) && isFlat(b.edge)) {
    const hit = segIntersect(a.edge.p0, curveEndPt(a.edge), b.edge.p0, curveEndPt(b.edge))
    if (hit) {
      out.push({
        tA: localToGlobal(hit.t, a.t0, a.t1),
        tB: localToGlobal(hit.u, b.t0, b.t1),
        point: hit.point,
      })
    }
    return
  }

  // Subdivide whichever curve has the larger bbox diagonal
  const diagA = Math.hypot(ba.maxX - ba.minX, ba.maxY - ba.minY)
  const diagB = Math.hypot(bb.maxX - bb.minX, bb.maxY - bb.minY)

  if (diagA >= diagB) {
    const mid = (a.t0 + a.t1) / 2
    const [left, right] = splitCurve(a.edge, 0.5)
    curveCurveIntersect({ edge: left, t0: a.t0, t1: mid }, b, depth + 1, out)
    curveCurveIntersect({ edge: right, t0: mid, t1: a.t1 }, b, depth + 1, out)
  } else {
    const mid = (b.t0 + b.t1) / 2
    const [left, right] = splitCurve(b.edge, 0.5)
    curveCurveIntersect(a, { edge: left, t0: b.t0, t1: mid }, depth + 1, out)
    curveCurveIntersect(a, { edge: right, t0: mid, t1: b.t1 }, depth + 1, out)
  }
}

// ── Contour extraction (curves preserved) ────────────────

function extractContours(path: PathBuilder): Contour[] {
  const contours: Contour[] = []
  let current: CurveEdge[] = []
  let movePt: Pt = { x: 0, y: 0 }
  let lastPt: Pt = { x: 0, y: 0 }
  let hasPendingMove = false

  // Implicitly close an open contour by adding a line from its end back to
  // the subpath start, matching Canvas `fill()` semantics. Boolean operations
  // require closed contours; leaving them open breaks the cyclic vertex
  // linking in buildVertexCycle.
  const closeContour = (contour: CurveEdge[]): void => {
    if (contour.length === 0) return
    const end = curveEndPt(contour[contour.length - 1])
    if (!pointEq(end, movePt)) {
      contour.push({ type: 'line', p0: end, p1: movePt })
    }
  }

  path.visit({
    moveTo: (p) => {
      if (hasPendingMove && current.length > 0) {
        closeContour(current)
        contours.push(current)
      }
      current = []
      movePt = { x: p.x, y: p.y }
      lastPt = { x: p.x, y: p.y }
      hasPendingMove = true
    },
    lineTo: (start, end) => {
      current.push({ type: 'line', p0: { ...lastPt }, p1: { x: end.x, y: end.y } })
      lastPt = { x: end.x, y: end.y }
    },
    quadraticCurveTo: (p0, p1, p2) => {
      current.push({
        type: 'quad',
        p0: { ...lastPt },
        cp: { x: p1.x, y: p1.y },
        p1: { x: p2.x, y: p2.y },
      })
      lastPt = { x: p2.x, y: p2.y }
    },
    cubicCurveTo: (p0, p1, p2, p3) => {
      current.push({
        type: 'cubic',
        p0: { ...lastPt },
        cp1: { x: p1.x, y: p1.y },
        cp2: { x: p2.x, y: p2.y },
        p1: { x: p3.x, y: p3.y },
      })
      lastPt = { x: p3.x, y: p3.y }
    },
    close: (lastPoint, movePoint) => {
      if (current.length > 0) {
        const end = curveEndPt(current[current.length - 1])
        if (!pointEq(end, movePt)) {
          current.push({ type: 'line', p0: end, p1: movePt })
        }
      }
      lastPt = movePt
    },
  })
  if (hasPendingMove && current.length > 0) {
    closeContour(current)
    contours.push(current)
  }
  return contours
}

// ── Contours back to PathBuilder ─────────────────────────

function contoursToPathBuilder(contours: Contour[]): PathBuilder {
  const pb = new PathBuilder()
  for (const contour of contours) {
    if (contour.length < 1) continue
    const first = curveStartPt(contour[0])
    pb.moveTo(first.x, first.y)

    let prevEnd = first
    for (const e of contour) {
      const start = curveStartPt(e)
      // If there's a gap, add a line to bridge (shouldn't normally happen)
      if (!pointEq(prevEnd, start, 1e-8)) {
        pb.lineTo(start.x, start.y)
      }
      const end = curveEndPt(e)
      switch (e.type) {
        case 'line':
          pb.lineTo(end.x, end.y)
          break
        case 'quad':
          pb.quadraticCurveTo(e.cp.x, e.cp.y, end.x, end.y)
          break
        case 'cubic':
          pb.bezierCurveTo(e.cp1.x, e.cp1.y, e.cp2.x, e.cp2.y, end.x, end.y)
          break
      }
      prevEnd = end
    }
    pb.closePath()
  }
  return pb
}

// ── Winding number / inside test via flattening ───────────

/** Flatten a contour to points for winding-number test */
function contourToPoly(contour: Contour, tolerance = 0.5): Pt[] {
  const out: Pt[] = []
  for (const e of contour) {
    const isCurve = e.type === 'quad' || e.type === 'cubic'
    if (!isCurve) {
      out.push(curveStartPt(e))
      continue
    }
    // Adaptive subdivision for point-in-poly test
    const steps = Math.max(2, Math.ceil(
      Math.hypot(
        (e.type === 'quad' ? Math.hypot(e.cp.x - e.p0.x, e.cp.y - e.p0.y) + Math.hypot(e.p1.x - e.cp.x, e.p1.y - e.cp.y) :
         Math.hypot(e.cp1.x - e.p0.x, e.cp1.y - e.p0.y) + Math.hypot(e.cp2.x - e.cp1.x, e.cp2.y - e.cp1.y) + Math.hypot(e.p1.x - e.cp2.x, e.p1.y - e.cp2.y))
      ) / tolerance
    ))
    for (let i = 0; i <= steps; i++) out.push(evalCurve(e, i / steps))
  }
  return out
}

function windingNumber(p: Pt, poly: Pt[]): number {
  let wind = 0
  const n = poly.length
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    if (a.y <= p.y) {
      if (b.y > p.y && cross2(sub(b, a), sub(p, a)) > 0) wind++
    } else {
      if (b.y <= p.y && cross2(sub(b, a), sub(p, a)) < 0) wind--
    }
  }
  return wind
}

/**
 * 多轮廓 nonzero 包含测试：有符号 winding number 之和 ≠ 0 即在路径内部。
 * 前提：轮廓方向已归一化（外环 CW，孔洞 CCW）。
 * 孔洞内的点：外环 +1、孔洞 -1，合计 0 = 外部，正确形成孔洞。
 */
function isInsidePath(p: Pt, contours: Contour[]): boolean {
  let wind = 0
  for (const c of contours) {
    wind += windingNumber(p, contourToPoly(c))
  }
  return wind !== 0
}

// ── Area & orientation ────────────────────────────────────

function contourArea(contour: Contour): number {
  let a = 0
  for (const e of contour) {
    const p0 = curveStartPt(e), p1 = curveEndPt(e)
    a += p0.x * p1.y - p1.x * p0.y
  }
  return a / 2
}

function toClockwise(contour: Contour): Contour {
  if (contourArea(contour) <= 0) return contour
  return reverseContour(contour)
}

function toCounterClockwise(contour: Contour): Contour {
  if (contourArea(contour) >= 0) return contour
  return reverseContour(contour)
}

/**
 * 多轮廓方向归一化：外环强制 outerCW 方向，孔洞强制 !outerCW 方向。
 *
 * 用 even-odd 判断每条轮廓的嵌套深度：偶数 = 外环，奇数 = 孔洞。
 * 归一化后 nonzero 规则才能正确区分内部/外部（孔洞反向抵消外环 winding）。
 *
 * Difference 运算时传 outerCW=false，使 clip 整体反向，便于交点处切换遍历。
 */
function normalizeContourDirections(contours: Contour[], outerCW: boolean): Contour[] {
  return contours.map((c, idx) => {
    const sample = curveMidpoint(c[0])
    let depth = 0
    for (let j = 0; j < contours.length; j++) {
      if (j === idx) continue
      if (Math.abs(windingNumber(sample, contourToPoly(contours[j]))) % 2 === 1) depth++
    }
    const isHole = depth % 2 === 1
    const wantCW = isHole ? !outerCW : outerCW
    return wantCW ? toClockwise(c) : toCounterClockwise(c)
  })
}

function reverseContour(contour: Contour): Contour {
  const rev: CurveEdge[] = []
  for (let i = contour.length - 1; i >= 0; i--) {
    rev.push(reverseEdge(contour[i]))
  }
  return rev
}

function reverseEdge(e: CurveEdge): CurveEdge {
  switch (e.type) {
    case 'line': return { type: 'line', p0: e.p1, p1: e.p0 }
    case 'quad': return { type: 'quad', p0: e.p1, cp: e.cp, p1: e.p0 }
    case 'cubic': return { type: 'cubic', p0: e.p1, cp1: e.cp2, cp2: e.cp1, p1: e.p0 }
  }
}

// ── Edge splitting ────────────────────────────────────────

/** Split a single edge at a sorted list of t-parameters, returning sub-edges */
function splitEdgeAt(e: CurveEdge, ts: number[]): CurveEdge[] {
  if (ts.length === 0) return [e]
  const result: CurveEdge[] = []
  let remaining = e
  let prevT = 0
  for (const t of ts) {
    if (t <= prevT + EPS || t >= 1 - EPS) continue
    const localT = (t - prevT) / (1 - prevT)
    const [left, right] = splitCurve(remaining, localT)
    result.push(left)
    remaining = right
    prevT = t
  }
  result.push(remaining)
  return result
}

// ── Link-node graph for traversal ─────────────────────────

interface Vertex {
  pt: Pt
  next: Vertex | null
  prev: Vertex | null
  edgeToNext: CurveEdge | null
  isIntersection: boolean
  neighbor: Vertex | null  // corresponding vertex on the other contour
  visited: boolean
  fromSubject: boolean
}

function buildVertexCycle(edges: CurveEdge[], fromSubject: boolean): Vertex[] {
  const vertices: Vertex[] = []
  for (const e of edges) {
    const v: Vertex = {
      pt: curveStartPt(e),
      next: null, prev: null,
      edgeToNext: e,
      isIntersection: false,
      neighbor: null,
      visited: false,
      fromSubject,
    }
    vertices.push(v)
  }
  // Link cyclically
  for (let i = 0; i < vertices.length; i++) {
    vertices[i].next = vertices[(i + 1) % vertices.length]
    vertices[i].prev = vertices[(i + vertices.length - 1) % vertices.length]
  }
  return vertices
}

// ── 布尔运算引擎（多轮廓，支持孔洞） ──────────────────────

/**
 * 无交点时的包含关系处理。
 *
 * 当 subject 与 clip 没有任何边相交时，结果由谁包含谁决定。
 * 用 nonzero 规则（isInsidePath）判断每个轮廓是否在"另一条路径"内部，
 * 前提是轮廓方向已归一化（外环 CW、孔洞 CCW）。
 */
function handleContainmentMulti(
  subjectContours: Contour[], clipContours: Contour[], op: BoolOp,
): Contour[] {
  const result: Contour[] = []
  // subject 各轮廓：判断其是否整体位于 clip 路径内部
  for (const s of subjectContours) {
    const insideC = isInsidePath(curveMidpoint(s[0]), clipContours)
    if (op === BoolOp.Union && !insideC) result.push(s)
    else if (op === BoolOp.Intersect && insideC) result.push(s)
    else if (op === BoolOp.Difference && !insideC) result.push(s)
  }
  // clip 各轮廓：判断其是否整体位于 subject 路径内部
  for (const c of clipContours) {
    const insideS = isInsidePath(curveMidpoint(c[0]), subjectContours)
    if (op === BoolOp.Union && !insideS) result.push(c)
    else if (op === BoolOp.Intersect && insideS) result.push(c)
    // Difference：clip 在 subject 内部 → 作为孔洞加入。
    // 注意 cContours 在 Difference 时已强制 CCW（与 CW 的 subject 反向），
    // 正好满足 nonzero 填充规则下孔洞需反向的要求，无需再 reverse。
    else if (op === BoolOp.Difference && insideS) result.push(c)
  }
  return result
}

/**
 * 多轮廓 Greiner-Hormann 布尔运算。
 *
 * 与单轮廓版本的区别：
 * - subject / clip 各自可包含多条轮廓（外环 + 孔洞）；
 * - 交点检测遍历 subject×clip 所有轮廓对的所有边对；
 * - 边的 inside 判定使用 isInsidePath（nonzero，对另一条路径的全部轮廓）；
 * - 顶点图按轮廓分别成环（buildVertexCycle 每条轮廓一组），环间不相连，
 *   遍历依靠交点的 neighbor 在两条路径间切换。
 *
 * 单轮廓场景是多轮廓的特例（各只有一条轮廓），行为与原 ghBooleanOp 一致。
 */
function ghBooleanOpMulti(
  subjectContours: Contour[], clipContours: Contour[], op: BoolOp,
): Contour[] {
  // XOR = (A - B) ∪ (B - A)
  if (op === BoolOp.Xor) {
    return [
      ...ghBooleanOpMulti(subjectContours, clipContours, BoolOp.Difference),
      ...ghBooleanOpMulti(clipContours, subjectContours, BoolOp.Difference),
    ]
  }

  // 方向归一化：subject 外环 CW、孔洞 CCW；
  // Difference 时 clip 整体反向（外环 CCW、孔洞 CW），便于交点处切换遍历。
  const sContours = normalizeContourDirections(subjectContours, true)
  const cContours = op === BoolOp.Difference
    ? normalizeContourDirections(clipContours, false)
    : normalizeContourDirections(clipContours, true)

  // ── 1. 收集所有 subject×clip 边对的交点 ──
  const isects: Intersection[] = []
  for (let si = 0; si < sContours.length; si++) {
    const s = sContours[si]
    for (let ci = 0; ci < cContours.length; ci++) {
      const c = cContours[ci]
      for (let ei = 0; ei < s.length; ei++) {
        for (let ej = 0; ej < c.length; ej++) {
          // 包围盒粗筛
          if (!bboxOverlap(curveBbox(s[ei]), curveBbox(c[ej]), 1)) continue
          const raw: { tA: number; tB: number; point: Pt }[] = []
          curveCurveIntersect(
            { edge: s[ei], t0: 0, t1: 1 },
            { edge: c[ej], t0: 0, t1: 1 },
            0, raw,
          )
          for (const hit of raw) {
            // 用真实曲线点（而非平均点）作为 ptA/ptB，保证与分裂后顶点一致
            const ptA = evalCurve(s[ei], hit.tA)
            const ptB = evalCurve(c[ej], hit.tB)
            isects.push({
              point: { x: (ptA.x + ptB.x) / 2, y: (ptA.y + ptB.y) / 2 },
              ptA, ptB,
              tA: hit.tA, tB: hit.tB,
              contourIdxA: si, contourIdxB: ci,
              edgeIdxA: ei, edgeIdxB: ej,
            })
          }
        }
      }
    }
  }

  // ── 2. 按点去重交点 ──
  const dedupIsects: Intersection[] = []
  for (const isec of isects) {
    if (!dedupIsects.find(d => pointEq(d.point, isec.point, 0.01))) {
      dedupIsects.push(isec)
    }
  }

  // ── 3. 无交点：走包含关系分支 ──
  if (dedupIsects.length === 0) {
    return handleContainmentMulti(sContours, cContours, op)
  }

  // ── 4. 按交点参数分裂每条轮廓的每条边 ──
  const splitSByContour: CurveEdge[][] = []
  for (let si = 0; si < sContours.length; si++) {
    const contour = sContours[si]
    const split: CurveEdge[] = []
    for (let ei = 0; ei < contour.length; ei++) {
      const ts = dedupIsects
        .filter(i => i.contourIdxA === si && i.edgeIdxA === ei)
        .map(i => i.tA)
        .sort((a, b) => a - b)
      split.push(...splitEdgeAt(contour[ei], ts))
    }
    splitSByContour.push(split)
  }
  const splitCByContour: CurveEdge[][] = []
  for (let ci = 0; ci < cContours.length; ci++) {
    const contour = cContours[ci]
    const split: CurveEdge[] = []
    for (let ej = 0; ej < contour.length; ej++) {
      const ts = dedupIsects
        .filter(i => i.contourIdxB === ci && i.edgeIdxB === ej)
        .map(i => i.tB)
        .sort((a, b) => a - b)
      split.push(...splitEdgeAt(contour[ej], ts))
    }
    splitCByContour.push(split)
  }

  // ── 5. 每条轮廓独立成环（环内顶点 .next/.prev 闭环） ──
  // 同时记录每条轮廓的顶点范围，用于后续判断"孤立轮廓"（无交点，需单独处理）。
  const sContourVerts: Vertex[][] = splitSByContour.map(sc => buildVertexCycle(sc, true))
  const cContourVerts: Vertex[][] = splitCByContour.map(cc => buildVertexCycle(cc, false))
  const sVerts: Vertex[] = sContourVerts.flat()
  const cVerts: Vertex[] = cContourVerts.flat()
  // 每条轮廓是否产生了交点（孔洞内环通常没有交点 → 孤立 → 需保留）
  const sHasIsect = new Array(sContours.length).fill(false)
  const cHasIsect = new Array(cContours.length).fill(false)

  // 标记交点顶点并连接 neighbor（另一条路径上的对应顶点）。
  // 用 ptA/ptB（真实曲线点）而非平均 point 匹配：分裂后 subject 顶点在 ptA，
  // clip 顶点在 ptB，展平误差可能让两者偏离 > 2× 容差。
  for (const isec of dedupIsects) {
    for (let si = 0; si < sContourVerts.length; si++) {
      const sv = sContourVerts[si].find(v => !v.isIntersection && pointEq(v.pt, isec.ptA, 0.01))
      if (!sv) continue
      for (let ci = 0; ci < cContourVerts.length; ci++) {
        const cv = cContourVerts[ci].find(v => !v.isIntersection && pointEq(v.pt, isec.ptB, 0.01))
        if (!cv) continue
        sv.isIntersection = true
        cv.isIntersection = true
        sv.neighbor = cv
        cv.neighbor = sv
        sHasIsect[si] = true
        cHasIsect[ci] = true
      }
    }
  }

  // ── 6. 用 nonzero（对另一条路径的全部轮廓）分类每条边 ──
  const classify = (verts: Vertex[], otherContours: Contour[]) => {
    for (const v of verts) {
      if (!v.edgeToNext) continue
      ;(v as any).insideOther = isInsidePath(curveMidpoint(v.edgeToNext), otherContours)
    }
  }
  classify(sVerts, cContours)
  classify(cVerts, sContours)

  // ── 7. 遍历生成结果 ──
  const result: Contour[] = []
  const allVerts = [...sVerts, ...cVerts]

  // 按运算类型决定是否保留某条边
  const shouldKeepEdge = (v: Vertex, op: BoolOp): boolean => {
    const inside = (v as any).insideOther as boolean
    switch (op) {
      case BoolOp.Union: return !inside
      case BoolOp.Intersect: return inside
      case BoolOp.Difference: return v.fromSubject ? !inside : inside
    }
    return true
  }

  const follow = (start: Vertex): Contour | null => {
    const edges: CurveEdge[] = []
    let v = start
    let iter = 0
    const maxIter = allVerts.length * 3

    while (iter < maxIter) {
      iter++
      if (v.visited && v === start && edges.length > 0) break
      v.visited = true

      const next = v.next!
      if (v.isIntersection && v.neighbor) {
        const keep = shouldKeepEdge(v, op)
        if (!keep) {
          // 切换到另一条路径，不加进入另一形状的那条边
          v = v.neighbor
        } else {
          if (v.edgeToNext) edges.push(v.edgeToNext)
          v = next
        }
      } else {
        if (v.edgeToNext) edges.push(v.edgeToNext)
        v = next
      }
    }

    if (edges.length < 2) return null
    return edges
  }

  // 从所有交点顶点开始遍历（subject + clip 都考虑）。
  // 关键：起始边 shouldKeepEdge=false 时不能直接 continue，
  // 否则会跳过整对配对交点，导致 neighbor 一侧的轮廓整体丢失。
  // 典型场景：Union 下 donut 与 rect 仅边一点相切，donut 外环交点
  // keep=true 已生成 donut 轮廓，但 rect 顶点（在 cVerts）从未被
  // follow 到 → rect 整圈消失。修复：起始边不该保留时切到 neighbor
  // （另一条路径的对应顶点）继续，由 neighbor 决定是否保留。
  const allIntVerts = allVerts.filter(v => v.isIntersection)
  for (let start of allIntVerts) {
    if (start.visited) continue
    if (!shouldKeepEdge(start, op) && start.neighbor && !start.neighbor.visited) {
      start = start.neighbor
    }
    if (start.visited) continue
    const c = follow(start)
    if (c) result.push(c)
  }

  // ── 8. 处理"孤立轮廓"：与另一条路径无任何交点的轮廓 ──
  // 典型场景：donut 的孔洞内环不与 clip 相交，遍历不会触及它，
  // 若不单独处理会被丢弃 → 孔洞被填满。这里用包含逻辑决定是否保留。
  // 完全孤立（无任何交点）时已由 handleContainmentMulti 提前返回，不会走到这；
  // 走到这里说明至少有一条轮廓有交点，但孔洞等部分轮廓没有交点，需补全。
  const handleIsolated = (contour: Contour, fromSubject: boolean) => {
    const mid = curveMidpoint(contour[0])
    const otherContours = fromSubject ? cContours : sContours
    const inside = isInsidePath(mid, otherContours)
    let keep = false
    switch (op) {
      case BoolOp.Union: keep = !inside; break
      case BoolOp.Intersect: keep = inside; break
      case BoolOp.Difference:
        // subject 轮廓：不在 clip 内则保留；clip 轮廓：在 subject 内则作孔洞保留
        keep = fromSubject ? !inside : inside
        break
    }
    if (keep) result.push(contour)
  }
  for (let i = 0; i < sContours.length; i++) {
    if (!sHasIsect[i]) handleIsolated(sContours[i], true)
  }
  for (let i = 0; i < cContours.length; i++) {
    if (!cHasIsect[i]) handleIsolated(cContours[i], false)
  }

  // 仍为空（相切等退化情形）：非交集时返回 subject
  if (result.length === 0 && op !== BoolOp.Intersect) {
    return sContours
  }

  return result
}

// ── Public API ────────────────────────────────────────────

/**
 * Perform a boolean operation on two paths (union, intersect, difference, xor).
 *
 * Curves (quadratic/cubic beziers) are preserved in the output.
 * The algorithm uses recursive subdivision for curve-curve intersection detection
 * and Greiner-Hormann style polygon clipping for the boolean logic.
 *
 * @param subject - The subject (first) path
 * @param clip - The clip (second) path
 * @param op - The boolean operation
 * @returns A new PathBuilder containing the result with curve segments preserved
 */
export function pathBooleanOp(subject: PathBuilder, clip: PathBuilder, op: BoolOp): PathBuilder {
  const subjectContours = extractContours(subject)
  const clipContours = extractContours(clip)

  if (subjectContours.length === 0 || clipContours.length === 0) {
    if (op === BoolOp.Union || op === BoolOp.Xor) {
      return contoursToPathBuilder([...subjectContours, ...clipContours])
    }
    if (op === BoolOp.Difference) {
      return contoursToPathBuilder(subjectContours)
    }
    return new PathBuilder()
  }

  // 直接对全部轮廓一次运算：交点检测覆盖所有轮廓对，
  // nonzero 分类天然支持外环 + 孔洞结构，无需逐对配对。
  const result = ghBooleanOpMulti(subjectContours, clipContours, op)
  return contoursToPathBuilder(result)
}
