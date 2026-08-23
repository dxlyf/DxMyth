/**
 * rasterizer.mjs —— 图元装配、裁剪、光栅化与逐片段操作
 * ============================================================================
 * 这是软件光栅化器的"执行单元"，对应真实 GPU 中固定功能硬件（Fixed-Function
 * Pipeline）所完成的步骤：
 *
 *   1. 图元装配（Primitive Assembly）
 *      —— 按 POINTS/LINES/TRIANGLES 等模式，把顶点流组装成图元
 *   2. 裁剪（Clipping）
 *      —— 用 Sutherland–Hodgman 算法把图元对 6 个视锥平面逐面裁剪（裁剪空间）
 *   3. 透视除法（Perspective Divide）→ 归一化设备坐标 NDC
 *   4. 视口变换（Viewport Transform）→ 窗口坐标（含 Y 轴翻转映射到行缓冲）
 *   5. 光栅化（Rasterization）
 *      —— 三角形：重心坐标 + 左上角填充规则；线段：到线段距离；点：方形扩展
 *   6. 透视校正插值（Perspective-Correct Interpolation）
 *      —— varying 与深度都除以 w 后再插值，保证纹理在 3D 下不发生扭曲
 *   7. 逐片段操作（Per-Fragment Operations）
 *      —— 裁剪矩形测试 → 模板测试 → 深度测试 → 混合 → 写入颜色缓冲
 * ============================================================================
 */

import { mk } from './glsl.mjs';

/* ---------------------------- 图元装配 ---------------------------- */

/**
 * 把顶点流按 mode 组装成图元列表。返回数组，每个元素是顶点下标数组
 * （点 1 个、线段 2 个、三角形 3 个）。对应 GPU 的 Primitive Assembly 阶段。
 */
function assemble(mode, count) {
  const prims = [];
  switch (mode) {
    case 0x0000: // POINTS
      for (let i = 0; i < count; i++) prims.push([i]);
      break;
    case 0x0001: // LINES
      for (let i = 0; i + 1 < count; i += 2) prims.push([i, i + 1]);
      break;
    case 0x0002: // LINE_LOOP
      for (let i = 0; i + 1 < count; i++) prims.push([i, i + 1]);
      if (count > 1) prims.push([count - 1, 0]);
      break;
    case 0x0003: // LINE_STRIP
      for (let i = 0; i + 1 < count; i++) prims.push([i, i + 1]);
      break;
    case 0x0004: // TRIANGLES
      for (let i = 0; i + 2 < count; i += 3) prims.push([i, i + 1, i + 2]);
      break;
    case 0x0005: // TRIANGLE_STRIP（每相邻 3 顶点一个三角形，奇数位交换顶点以保持绕序）
      for (let i = 0; i + 2 < count; i++) {
        prims.push(i % 2 === 0 ? [i, i + 1, i + 2] : [i + 1, i, i + 2]);
      }
      break;
    case 0x0006: // TRIANGLE_FAN（第一个顶点固定为共享顶点）
      for (let i = 1; i + 1 < count; i++) prims.push([0, i, i + 1]);
      break;
  }
  return prims;
}

/* ---------------------------- 值插值工具 ---------------------------- */

/** 单个 GLSL 值的线性插值（标量 / 向量 / 数组） */
function valueLerp(a, b, t) {
  if (!a || !b) return a || b;
  if (typeof a.v === 'number' && typeof b.v === 'number') {
    return mk(a.t, a.v + (b.v - a.v) * t);
  }
  if (a.v instanceof Float32Array && b.v instanceof Float32Array) {
    const out = new Float32Array(a.v.length);
    for (let i = 0; i < out.length; i++) out[i] = a.v[i] + (b.v[i] - a.v[i]) * t;
    return mk(a.t, out);
  }
  if (Array.isArray(a.v) && Array.isArray(b.v)) {
    return mk('array', a.v.map((x, i) => valueLerp(x, b.v[i], t)));
  }
  return a;
}

/** 两个 varying 集合的线性插值 */
function lerpVaryings(va, vb, t) {
  const out = new Map();
  for (const [k, v] of va) {
    const other = vb.get(k);
    out.set(k, other ? valueLerp(v, other, t) : v);
  }
  return out;
}

/** 多顶点按权重插值（透视校正后的权重） */
function interpValues(vals, weights) {
  const first = vals[0];
  if (typeof first.v === 'number') {
    let s = 0;
    for (let i = 0; i < vals.length; i++) s += vals[i].v * weights[i];
    return mk(first.t, s);
  }
  if (first.v instanceof Float32Array) {
    const out = new Float32Array(first.v.length);
    for (let i = 0; i < vals.length; i++) {
      const w = weights[i];
      if (w === 0) continue;
      for (let j = 0; j < out.length; j++) out[j] += vals[i].v[j] * w;
    }
    return mk(first.t, out);
  }
  return vals[0];
}

/** 按顶点集合 + 权重插值整个 varying 集合 */
function interpVaryings(vs, weights) {
  const out = new Map();
  const first = vs[0];
  for (const [k, v] of first.varyings) {
    const vals = vs.map((vv) => vv.varyings.get(k));
    out.set(k, vals.every(Boolean) ? interpValues(vals, weights) : v);
  }
  return out;
}

/* ---------------------------- 裁剪（视锥体） ---------------------------- */

/**
 * 6 个视锥平面的判定函数 L(c) >= 0 表示"在视锥内"（裁剪空间）：
 *   -w <= x <= w   →  L1 = x + w,  L2 = w - x
 *   -w <= y <= w   →  L3 = y + w,  L4 = w - y
 *   -w <= z <= w   →  L5 = z + w,  L6 = w - z
 * 注意：Sutherland–Hodgman 要求所有顶点 w > 0，裁剪后由各平面保证。
 */
const CLIP_PLANES = [
  (c) => c[0] + c[3],
  (c) => c[3] - c[0],
  (c) => c[1] + c[3],
  (c) => c[3] - c[1],
  (c) => c[2] + c[3],
  (c) => c[3] - c[2],
];

/**
 * 用一个平面裁剪多边形（Sutherland–Hodgman）。
 * 对每条边 (A,B)：根据 A、B 相对平面的内外状态输出顶点，并在跨越边界时
 * 用线性插值求出交点（位置与 varying 都要插值，保证裁剪不破坏着色器数据）。
 */
function clipPolygonOnPlane(verts, plane) {
  const out = [];
  const n = verts.length;
  for (let i = 0; i < n; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % n];
    const la = plane(a.clip);
    const lb = plane(b.clip);
    const aIn = la >= 0;
    const bIn = lb >= 0;

    if (aIn && bIn) {
      out.push(b);
    } else if (aIn && !bIn) {
      // A 在内、B 在外：输出交点
      out.push(intersectClip(a, b, la, lb));
    } else if (!aIn && bIn) {
      // A 在外、B 在内：输出交点 + B
      out.push(intersectClip(a, b, la, lb));
      out.push(b);
    }
    // 都在外：无输出
  }
  return out;
}

/** 计算边 (a,b) 与平面的交点（t = la / (la - lb)） */
function intersectClip(a, b, la, lb) {
  const t = la / (la - lb);
  const clip = new Float32Array(4);
  for (let i = 0; i < 4; i++) clip[i] = a.clip[i] + (b.clip[i] - a.clip[i]) * t;
  return {
    clip,
    pointSize: a.pointSize + (b.pointSize - a.pointSize) * t,
    varyings: lerpVaryings(a.varyings, b.varyings, t),
  };
}

/** 对整个图元执行 6 平面裁剪，返回裁剪后的顶点列表（空 = 完全不可见） */
function clipPrimitive(verts) {
  let cur = verts;
  for (const plane of CLIP_PLANES) {
    cur = clipPolygonOnPlane(cur, plane);
    if (cur.length === 0) return [];
  }
  return cur;
}

/** 点的裁剪：全部 6 平面都在内才保留 */
function clipPoint(v) {
  for (const plane of CLIP_PLANES) {
    if (plane(v.clip) < 0) return false;
  }
  return true;
}

/* ---------------------------- 坐标变换 ---------------------------- */

/**
 * 透视除法 + 视口变换，把裁剪坐标变换为窗口坐标（Y 轴向上，原点左下）。
 * 返回 null 表示该顶点无效（w <= 0，裁剪后理论不会发生，防御性处理）。
 */
function toWindow(gl, v) {
  const w = v.clip[3];
  if (!isFinite(w) || w <= 1e-12) return null;
  const vp = gl.state.viewport;
  const ndcX = v.clip[0] / w;
  const ndcY = v.clip[1] / w;
  const ndcZ = v.clip[2] / w;
  // 深度映射到 [depthRange.near, depthRange.far]
  const dn = gl.state.depthRange.near;
  const df = gl.state.depthRange.far;
  return {
    x: vp.x + (ndcX * 0.5 + 0.5) * vp.width, // 窗口 X
    y: vp.y + (ndcY * 0.5 + 0.5) * vp.height, // 窗口 Y（向上）
    z: dn + (ndcZ * 0.5 + 0.5) * (df - dn), // 窗口深度 [near, far]
    invW: 1 / w, // 用于透视校正插值
    pointSize: v.pointSize,
    varyings: v.varyings,
  };
}

/* ---------------------------- 渲染状态辅助 ---------------------------- */

function depthCompare(func, z, ref) {
  switch (func) {
    case 0x0200: return false; // NEVER
    case 0x0201: return z < ref; // LESS
    case 0x0202: return z === ref; // EQUAL
    case 0x0203: return z <= ref; // LEQUAL
    case 0x0204: return z > ref; // GREATER
    case 0x0205: return z !== ref; // NOTEQUAL
    case 0x0206: return z >= ref; // GEQUAL
    default: return true; // ALWAYS
  }
}

/** 根据正面/背面选择模板测试参数（对应 stencilFuncSeparate / stencilOpSeparate） */
function stencilState(gl, front) {
  const st = gl.state;
  if (front) {
    return {
      func: st.stencilFunc,
      ref: st.stencilRef,
      testMask: st.stencilMaskTest,
      writeMask: st.stencilMask,
      opFail: st.stencilOpFail,
      opZFail: st.stencilOpZFail,
      opZPass: st.stencilOpZPass,
    };
  }
  return {
    func: st.stencilFuncBack,
    ref: st.stencilRefBack,
    testMask: st.stencilMaskBackTest,
    writeMask: st.stencilMaskBack,
    opFail: st.stencilOpFailBack,
    opZFail: st.stencilOpZFailBack,
    opZPass: st.stencilOpZPassBack,
  };
}

/** 应用一次模板操作（对应 gl.stencilOp 的三个动作之一） */
function applyStencilOp(op, value, ref, mask) {
  switch (op) {
    case 0x1e00: return value; // KEEP
    case 0x1e01: return ref & mask; // REPLACE
    case 0x1e02: return Math.min(value + 1, 255); // INCR（饱和）
    case 0x1e03: return Math.max(value - 1, 0); // DECR（饱和）
    case 0x150a: return (~value) & mask; // INVERT
    case 0x8507: return (value + 1) & 0xff; // INCR_WRAP
    case 0x8508: return (value - 1) & 0xff; // DECR_WRAP
    default: return value;
  }
}

/** 混合因子计算（对应 gl.blendFunc / blendFuncSeparate） */
function blendFactor(factor, src, dst, constant) {
  switch (factor) {
    case 0: return 0; // ZERO
    case 1: return 1; // ONE
    case 0x0300: return src; // SRC_COLOR
    case 0x0301: return 1 - src; // ONE_MINUS_SRC_COLOR
    case 0x0306: return dst; // DST_COLOR
    case 0x0307: return 1 - dst; // ONE_MINUS_DST_COLOR
    case 0x0302: return src[3]; // SRC_ALPHA
    case 0x0303: return 1 - src[3]; // ONE_MINUS_SRC_ALPHA
    case 0x0304: return dst[3]; // DST_ALPHA
    case 0x0305: return 1 - dst[3]; // ONE_MINUS_DST_ALPHA
    case 0x8001: return constant; // CONSTANT_COLOR
    case 0x8002: return 1 - constant; // ONE_MINUS_CONSTANT_COLOR
    case 0x8003: return constant[3]; // CONSTANT_ALPHA
    case 0x8004: return 1 - constant[3]; // ONE_MINUS_CONSTANT_ALPHA
    case 0x0308: return Math.min(src[3], 1 - dst[3]); // SRC_ALPHA_SATURATE
    default: return 0;
  }
}

/* ---------------------------- 逐片段操作 ---------------------------- */

/**
 * 对单个片段执行完整的逐片段流水线：
 * 裁剪矩形 → 片段着色器 → 模板测试 → 深度测试 → 深度写入 → 混合 → 颜色写入。
 */
function shadeFragment(gl, x, y, z, invW, varyings, frontFacing) {
  const st = gl.state;
  const target = gl._drawTarget;
  const idx = y * target.width + x;
  const col4 = idx * 4;

  // 1. 裁剪矩形测试（对应 gl.SCISSOR_TEST）
  if (st.enabled.has(gl.SCISSOR_TEST)) {
    const sc = st.scissor;
    if (x < sc.x || y < sc.y || x >= sc.x + sc.width || y >= sc.y + sc.height) return;
  }

  // 2. 执行片段着色器（discard 时返回 null）
  const outputs = st.program.runFragment(varyings, { x: x + 0.5, y: y + 0.5, z, w: 1 / invW }, frontFacing);
  if (!outputs) return;
  const colorVal = outputs.values().next().value;
  if (!colorVal) return;
  const src = [
    colorVal.v[0] !== undefined ? colorVal.v[0] : 0,
    colorVal.v[1] !== undefined ? colorVal.v[1] : 0,
    colorVal.v[2] !== undefined ? colorVal.v[2] : 0,
    colorVal.v[3] !== undefined ? colorVal.v[3] : 1,
  ];

  // 3. 模板测试 + 更新
  const ss = stencilState(gl, frontFacing);
  let stencilPassed = true;
  if (st.enabled.has(gl.STENCIL_TEST)) {
    const cur = target.stencil ? target.stencil[idx] : 0;
    let ok;
    const masked = cur & ss.testMask;
    const ref = ss.ref & ss.testMask;
    switch (ss.func) {
      case 0x0200: ok = false; break;
      case 0x0201: ok = ref < masked; break;
      case 0x0202: ok = ref === masked; break;
      case 0x0203: ok = ref <= masked; break;
      case 0x0204: ok = ref > masked; break;
      case 0x0205: ok = ref !== masked; break;
      case 0x0206: ok = ref >= masked; break;
      default: ok = true; break; // ALWAYS
    }
    stencilPassed = ok;
    if (!ok) {
      if (target.stencil) {
        const v = applyStencilOp(ss.opFail, cur, ss.ref, ss.writeMask);
        target.stencil[idx] = v;
      }
      return;
    }
  }

  // 4. 深度测试 + 深度写入
  const hasDepth = target.depth != null;
  if (st.enabled.has(gl.DEPTH_TEST) && hasDepth) {
    const curDepth = target.depth[idx];
    if (!depthCompare(st.depthFunc, z, curDepth)) {
      // 深度测试失败：执行 ZFail 模板操作
      if (target.stencil) {
        const cur = target.stencil[idx];
        target.stencil[idx] = applyStencilOp(ss.opZFail, cur, ss.ref, ss.writeMask);
      }
      return;
    }
  }
  // 模板 ZPass 操作
  if (st.enabled.has(gl.STENCIL_TEST) && target.stencil && stencilPassed) {
    const cur = target.stencil[idx];
    target.stencil[idx] = applyStencilOp(ss.opZPass, cur, ss.ref, ss.writeMask);
  }
  // 写入深度
  if (st.depthMask && hasDepth && st.enabled.has(gl.DEPTH_TEST)) {
    target.depth[idx] = z;
  }

  // 5. 混合
  let out = src;
  if (st.enabled.has(gl.BLEND)) {
    const dst = [
      target.color[col4] / 255,
      target.color[col4 + 1] / 255,
      target.color[col4 + 2] / 255,
      target.color[col4 + 3] / 255,
    ];
    const constC = st.blendColor;
    const apply = (eq, s, d) => {
      switch (eq) {
        case 0x800a: return s - d; // FUNC_SUBTRACT
        case 0x800b: return d - s; // FUNC_REVERSE_SUBTRACT
        default: return s + d; // FUNC_ADD
      }
    };
    out = new Array(4);
    for (let i = 0; i < 3; i++) {
      const sf = blendFactor(st.blendSrcRGB, src, dst, constC);
      const df = blendFactor(st.blendDstRGB, src, dst, constC);
      out[i] = apply(st.blendEquationRGB, src[i] * sf, dst[i] * df);
    }
    const sfa = blendFactor(st.blendSrcAlpha, src, dst, constC);
    const dfa = blendFactor(st.blendDstAlpha, src, dst, constC);
    out[3] = apply(st.blendEquationAlpha, src[3] * sfa, dst[3] * dfa);
  }

  // 6. 颜色写入（受 colorMask 控制）
  const mask = st.colorMask;
  if (target.color) {
    if (mask[0]) target.color[col4] = Math.round(Math.min(Math.max(out[0], 0), 1) * 255);
    if (mask[1]) target.color[col4 + 1] = Math.round(Math.min(Math.max(out[1], 0), 1) * 255);
    if (mask[2]) target.color[col4 + 2] = Math.round(Math.min(Math.max(out[2], 0), 1) * 255);
    if (mask[3]) target.color[col4 + 3] = Math.round(Math.min(Math.max(out[3], 0), 1) * 255);
  }
}

/* ---------------------------- 三角形光栅化 ---------------------------- */

/**
 * 三角形光栅化：重心坐标 + 左上角填充规则 + 透视校正插值。
 * 输入为 3 个窗口坐标顶点（Y 向上），内部转换到帧缓冲像素坐标（Y 向下）。
 */
function rasterizeTriangle(gl, v0, v1, v2, frontFacing) {
  const fbW = gl._drawTarget.width;
  const fbH = gl._drawTarget.height;

  // 窗口坐标（y 向上）→ 帧缓冲像素坐标（y 向下，第 0 行在顶部）
  // 像素中心为 (c+0.5, r+0.5)
  const pts = [v0, v1, v2].map((v) => ({ x: v.x, y: fbH - v.y, z: v.z, invW: v.invW, varyings: v.varyings }));

  // 计算有向面积（y 向下坐标系）
  const area = (pts[1].x - pts[0].x) * (pts[2].y - pts[0].y) - (pts[1].y - pts[0].y) * (pts[2].x - pts[0].x);
  if (Math.abs(area) < 1e-9) return; // 退化三角形
  // 统一为逆时针（y 向下）方向，保证内部判定 e>=0 一致
  if (area < 0) { const t = pts[0]; pts[0] = pts[2]; pts[2] = t; }

  const [p0, p1, p2] = pts;

  // 边界框（钳制到帧缓冲范围）
  const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
  const maxX = Math.min(fbW - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
  const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));
  const maxY = Math.min(fbH - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));

  // 边的方向向量（用于左上角规则）
  const edges = [
    { sx: p0.x, sy: p0.y, ex: p1.x, ey: p1.y },
    { sx: p1.x, sy: p1.y, ex: p2.x, ey: p2.y },
    { sx: p2.x, sy: p2.y, ex: p0.x, ey: p0.y },
  ];
  const isTopLeft = edges.map((e) => {
    const dx = e.ex - e.sx;
    const dy = e.ey - e.sy;
    // 左上角填充规则（y 向下坐标系）：边向上（dy<0）或水平向右（dy==0 && dx>0）时
    // 边界像素归本三角形。与 GL 的 top-left 规则一致，可保证共享边"恰好一次覆盖"，
    // 避免相邻三角形在公共边上出现缝隙或重复混合。
    return (dy < 0) || (dy === 0 && dx > 0);
  });

  // 边函数系数：e(P) = cross(边方向, P - 起点) = A*x + B*y + C
  const ef = edges.map((e) => {
    const A = e.sy - e.ey; // -(ey - sy)
    const B = e.ex - e.sx; // (ex - sx)
    const C = -(A * e.sx + B * e.sy); // 使得 e(起点) = 0
    return { A, B, C };
  });

  const total = ef.reduce((s, e) => s + e.A * p2.x + e.B * p2.y + e.C, 0); // 应等于 ±2*area，取正值用

  for (let r = minY; r <= maxY; r++) {
    for (let c = minX; c <= maxX; c++) {
      const px = c + 0.5, py = r + 0.5;
      const e0 = ef[0].A * px + ef[0].B * py + ef[0].C;
      const e1 = ef[1].A * px + ef[1].B * py + ef[1].C;
      const e2 = ef[2].A * px + ef[2].B * py + ef[2].C;
      // 内部判定：e >= 0，边界（e==0）按左上角规则
      const ins0 = e0 > 0 || (e0 === 0 && isTopLeft[0]);
      const ins1 = e1 > 0 || (e1 === 0 && isTopLeft[1]);
      const ins2 = e2 > 0 || (e2 === 0 && isTopLeft[2]);
      if (!(ins0 && ins1 && ins2)) continue;

      // 重心坐标：注意边函数与对角顶点的对应关系！
  //   e0 是边 (p0→p1) 的边函数 → 它的对角顶点是 p2
  //   e1 是边 (p1→p2) 的边函数 → 它的对角顶点是 p0
  //   e2 是边 (p2→p0) 的边函数 → 它的对角顶点是 p1
  // 因此 λ(p0) ∝ e1，λ(p1) ∝ e2，λ(p2) ∝ e0。
  // 对统一为逆时针（y 向下）的三角形，三个对角点上的边函数值
  // e1(p0) == e2(p1) == e0(p2) == 2*area，故可用同一个 total 归一化。
  const inv = 1 / total;
  const l0 = e1 * inv; // 顶点 p0 的权重
  const l1 = e2 * inv; // 顶点 p1 的权重
  const l2 = e0 * inv; // 顶点 p2 的权重

      // 透视校正：先插值 1/w，再计算校正后的重心权重
      const iw = l0 * p0.invW + l1 * p1.invW + l2 * p2.invW;
      if (!(iw > 0)) continue;
      const w0 = (l0 * p0.invW) / iw;
      const w1 = (l1 * p1.invW) / iw;
      const w2 = (l2 * p2.invW) / iw;

      // 透视校正深度
      const z = p0.z * w0 + p1.z * w1 + p2.z * w2;
      // 插值 varying
      const varyings = interpVaryings([p0, p1, p2], [w0, w1, w2]);

      shadeFragment(gl, c, r, z, iw, varyings, frontFacing);
    }
  }
}

/* ---------------------------- 线段光栅化 ---------------------------- */

/** 线段光栅化：对包围盒内每个像素，计算到线段的距离，距离 <= 线宽/2 则填充 */
function rasterizeLine(gl, a, b) {
  const fbW = gl._drawTarget.width;
  const fbH = gl._drawTarget.height;
  const width = Math.max(gl.state.lineWidth, 1);

  const ax = a.x, ay = fbH - a.y;
  const bx = b.x, by = fbH - b.y;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;

  const minX = Math.max(0, Math.floor(Math.min(ax, bx) - width / 2));
  const maxX = Math.min(fbW - 1, Math.ceil(Math.max(ax, bx) + width / 2));
  const minY = Math.max(0, Math.floor(Math.min(ay, by) - width / 2));
  const maxY = Math.min(fbH - 1, Math.ceil(Math.max(ay, by) + width / 2));

  for (let r = minY; r <= maxY; r++) {
    for (let c = minX; c <= maxX; c++) {
      const px = c + 0.5, py = r + 0.5;
      // 计算像素到线段的最短距离对应的参数 t（钳制到 [0,1] 得到方形端帽）
      let t = 0;
      if (len2 > 0) {
        t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = Math.min(Math.max(t, 0), 1);
      }
      const qx = ax + t * dx, qy = ay + t * dy;
      const dist2 = (px - qx) * (px - qx) + (py - qy) * (py - qy);
      const half = width / 2;
      if (dist2 > half * half) continue;

      // 透视校正 t：把参数 t 转成 1/w 加权后的插值
      const invW0 = a.invW, invW1 = b.invW;
      const iw = invW0 * (1 - t) + invW1 * t;
      const w0 = (invW0 * (1 - t)) / iw;
      const w1 = (invW1 * t) / iw;
      const z = a.z * w0 + b.z * w1;
      const varyings = interpVaryings([a, b], [w0, w1]);

      shadeFragment(gl, c, r, z, iw, varyings, 1);
    }
  }
}

/* ---------------------------- 点光栅化 ---------------------------- */

/** 点光栅化：以顶点为中心的方形，大小为 gl_PointSize */
function rasterizePoint(gl, p) {
  const fbW = gl._drawTarget.width;
  const fbH = gl._drawTarget.height;
  const size = Math.max(p.pointSize, 1);
  const cx = p.x, cy = fbH - p.y; // 窗口 → 帧缓冲坐标
  const half = size / 2;

  const minX = Math.max(0, Math.floor(cx - half));
  const maxX = Math.min(fbW - 1, Math.ceil(cx + half));
  const minY = Math.max(0, Math.floor(cy - half));
  const maxY = Math.min(fbH - 1, Math.ceil(cy + half));

  for (let r = minY; r <= maxY; r++) {
    for (let c = minX; c <= maxX; c++) {
      // 像素中心在点方形内才填充
      if (Math.abs(c + 0.5 - cx) >= half) continue;
      if (Math.abs(r + 0.5 - cy) >= half) continue;
      shadeFragment(gl, c, r, p.z, p.invW, p.varyings, 1);
    }
  }
}

/* ---------------------------- 主入口 ---------------------------- */

/**
 * 渲染管线入口：对顶点流中的每个图元执行 裁剪 → 透视除法 → 视口变换 → 光栅化。
 * @param {object} gl   SimGL 上下文（含 state、_drawTarget）
 * @param {number} mode 图元模式
 * @param {Array}  stream 顶点流：[{ clip: Float32Array(4), pointSize, varyings: Map }]
 */
export function rasterize(gl, mode, stream) {
  const prims = assemble(mode, stream.length);
  const frontFaceCCW = gl.state.frontFace === gl.CCW;

  for (const prim of prims) {
    const vs = prim.map((i) => stream[i]);

    if (prim.length === 1) {
      // 点：裁剪后直接光栅化
      if (!clipPoint(vs[0])) continue;
      const wv = toWindow(gl, vs[0]);
      if (wv) rasterizePoint(gl, wv);
      continue;
    }

    if (prim.length === 2) {
      // 线段
      const clipped = clipPrimitive(vs);
      if (clipped.length < 2) continue;
      // 裁剪后的多边形可能是 2~6 个顶点；线段只需保留前两个交点即可（S-H 保序）
      const a = toWindow(gl, clipped[0]);
      const b = toWindow(gl, clipped[clipped.length - 1]);
      if (a && b) rasterizeLine(gl, a, b);
      continue;
    }

    // 三角形
    const clipped = clipPrimitive(vs);
    if (clipped.length < 3) continue;
    // 裁剪可能产生 3~7 个顶点，用扇形三角化（第 0 个顶点固定）
    // 先计算绕序（用 NDC 的 x、y 判断，y 向上坐标系）
    const area0 = (c) => {
      const x0 = c[0] / c[3], y0 = c[1] / c[3];
      const x1 = clipped[1].clip[0] / clipped[1].clip[3], y1 = clipped[1].clip[1] / clipped[1].clip[3];
      const x2 = clipped[2].clip[0] / clipped[2].clip[3], y2 = clipped[2].clip[1] / clipped[2].clip[3];
      return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
    };
    const signedArea = area0(clipped[0].clip);
    const front = frontFaceCCW ? signedArea > 0 : signedArea < 0;

    // 面剔除
    if (gl.state.enabled.has(gl.CULL_FACE)) {
      if (gl.state.cullFace === gl.FRONT_AND_BACK) continue;
      if (gl.state.cullFace === gl.FRONT && front) continue;
      if (gl.state.cullFace === gl.BACK && !front) continue;
    }

    for (let i = 1; i + 1 < clipped.length; i++) {
      const a = toWindow(gl, clipped[0]);
      const b = toWindow(gl, clipped[i]);
      const cc = toWindow(gl, clipped[i + 1]);
      if (a && b && cc) rasterizeTriangle(gl, a, b, cc, front ? 1 : 0);
    }
  }
}
