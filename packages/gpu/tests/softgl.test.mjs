/**
 * softgl.test.mjs —— SoftGL 软件光栅化系统验证测试（Node 运行）
 * ============================================================================
 * 本测试在 Node 环境下直接驱动整套软光栅化管线，验证以下子系统：
 *   1. clear + 三角形光栅化（顶点着色器 / 片段着色器 / 颜色缓冲写入）
 *   2. 深度测试（逐片段深度比较 + 深度写入）
 *   3. 混合（blendFunc SRC_ALPHA / ONE_MINUS_SRC_ALPHA）
 *   4. drawElements 索引缓冲绘制（IBO）
 *   5. FBO 离屏渲染 + framebufferTexture2D 附件
 *   6. 透视投影 MVP + varying 透视校正插值（3D 路径）
 *
 * 运行方式：
 *   node packages/gpu/tests/softgl.test.mjs
 * ============================================================================
 */

import assert from 'node:assert/strict';
import { createSimGL } from '../src/softgl/index.mjs';
import { TextureObject, uploadPixels, sampleTexture } from '../src/softgl/texture.mjs';

let passed = 0;
const failed = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    failed.push({ name, err: e });
    console.log(`  FAIL  ${name}`);
    console.log(`        ${e.message}`);
  }
}

/** 读取单个像素 [r,g,b,a]（readPixels 路径，验证 Y 翻转正确性） */
function pixel(gl, x, y) {
  const out = new Uint8Array(4);
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, out);
  return [out[0], out[1], out[2], out[3]];
}

/** NDC → 像素坐标（与光栅化器内部一致的换算，用于断言定位） */
function ndcToPx(ndcX, ndcY, W, H) {
  return [Math.round((ndcX * 0.5 + 0.5) * W), H - Math.round((ndcY * 0.5 + 0.5) * H)];
}

/** 构建并编译链接一个程序 */
function buildProgram(gl, vsSrc, fsSrc) {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);
  assert.equal(gl.getShaderParameter(vs, gl.COMPILE_STATUS), true, '顶点着色器编译失败: ' + gl.getShaderInfoLog(vs));

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);
  assert.equal(gl.getShaderParameter(fs, gl.COMPILE_STATUS), true, '片段着色器编译失败: ' + gl.getShaderInfoLog(fs));

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  assert.equal(gl.getProgramParameter(prog, gl.LINK_STATUS), true, '程序链接失败: ' + gl.getProgramInfoLog(prog));
  return prog;
}

/* ============================ 1. 基础三角形 ============================ */

test('1. clear + 三角形光栅化（含色 vs 清屏色）', () => {
  const gl = createSimGL(256, 256);

  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `);
  gl.useProgram(prog);

  // 顶点缓冲：一个覆盖大半屏幕的三角形（NDC）
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.9, -0.9,
     0.9, -0.9,
     0.0,  0.9,
  ]), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, 'a_pos');
  assert.equal(loc, 0);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // 清屏为蓝色
  gl.clearColor(0, 0, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 角落应该是蓝色
  let c = pixel(gl, 2, 254);
  assert.deepEqual(c, [0, 0, 255, 255], '清屏色应为蓝色');

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 三角形中心是红色
  c = pixel(gl, 128, 192); // NDC(0, 0.5) 在三角形内部
  assert.deepEqual(c, [255, 0, 0, 255], '三角形内部应为红色，实际 ' + JSON.stringify(c));

  // 三角形外部（左上角）仍是蓝色
  c = pixel(gl, 20, 40);
  assert.deepEqual(c, [0, 0, 255, 255], '三角形外部应为蓝色');
});

/* ============================ 2. 深度测试 ============================ */

test('2. 深度测试：远三角形被近三角形遮挡', () => {
  const gl = createSimGL(256, 256);
  const W = 256, H = 256;

  // 两个全屏三角形：近 z=-0.9（红）、远 z=+0.9（蓝）
  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    attribute float a_z;
    void main() {
      gl_Position = vec4(a_pos, a_z, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `);
  const progBlue = buildProgram(gl, `
    attribute vec2 a_pos;
    attribute float a_z;
    void main() {
      gl_Position = vec4(a_pos, a_z, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
  `);

  // 共享顶点缓冲：两个大三角形的顶点
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // 近三角形 z=-0.9
    -1.2, -1.2, -0.9,
     1.2, -1.2, -0.9,
     0.0,  1.2, -0.9,
    // 远三角形 z=+0.9
    -1.2, -1.2,  0.9,
     1.2, -1.2,  0.9,
     0.0,  1.2,  0.9,
  ]), gl.STATIC_DRAW);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 先画远三角形（蓝），再画近三角形（红）
  gl.useProgram(progBlue);
  const posLoc = gl.getAttribLocation(progBlue, 'a_pos');
  const zLoc = gl.getAttribLocation(progBlue, 'a_z');
  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(zLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 12, 0);
  gl.vertexAttribPointer(zLoc, 1, gl.FLOAT, false, 12, 8);
  gl.drawArrays(gl.TRIANGLES, 3, 3);

  gl.useProgram(prog);
  const posLocR = gl.getAttribLocation(prog, 'a_pos');
  const zLocR = gl.getAttribLocation(prog, 'a_z');
  gl.enableVertexAttribArray(posLocR);
  gl.enableVertexAttribArray(zLocR);
  gl.vertexAttribPointer(posLocR, 2, gl.FLOAT, false, 12, 0);
  gl.vertexAttribPointer(zLocR, 1, gl.FLOAT, false, 12, 8);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 中心像素：近三角形（红）应通过深度测试覆盖远三角形（蓝）
  const c = pixel(gl, W >> 1, H >> 1);
  assert.deepEqual(c, [255, 0, 0, 255], '深度测试后中心应为红色，实际 ' + JSON.stringify(c));
});

/* ============================ 3. 混合 ============================ */

test('3. 混合：半透明红叠加白底', () => {
  const gl = createSimGL(64, 64);

  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
    }
  `);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.9, -0.9, 0.9, -0.9, 0.0, 0.9,
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // 白底
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 开混合：src*alpha + dst*(1-alpha)
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 理论值：R=255, G=0*0.5+255*0.5=127.5→127, B=127, A=127*0.5+255*0.5=191
  const c = pixel(gl, 32, 32);
  assert.equal(c[0], 255, `R 应为 255，实际 ${c[0]}`);
  assert.ok(Math.abs(c[1] - 127) <= 2, `G 应≈127，实际 ${c[1]}`);
  assert.ok(Math.abs(c[2] - 127) <= 2, `B 应≈127，实际 ${c[2]}`);
});

/* ============================ 4. 索引缓冲绘制 ============================ */

test('4. drawElements：索引缓冲画正方形', () => {
  const gl = createSimGL(128, 128);

  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
  `);
  gl.useProgram(prog);

  // 顶点：正方形的 4 个角（逆时针）
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.8, -0.8,
     0.8, -0.8,
     0.8,  0.8,
    -0.8,  0.8,
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // 索引：两个三角形（IBO）
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  // 正方形中心（NDC(0,0)）应为绿色
  const c = pixel(gl, 64, 64);
  assert.deepEqual(c, [0, 255, 0, 255], '正方形中心应为绿色，实际 ' + JSON.stringify(c));

  // 正方形外（NDC(0.95,0.95) 左上角像素）应为黑色
  const [ox, oy] = ndcToPx(0.95, 0.95, 128, 128);
  const o = pixel(gl, ox, oy);
  assert.deepEqual(o, [0, 0, 0, 255], '正方形外应为黑色');
});

/* ============================ 5. FBO 离屏渲染 ============================ */

test('5. FBO：离屏渲染到颜色纹理附件并回读', () => {
  const gl = createSimGL(128, 128);

  // 建纹理作为 FBO 颜色附件
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  assert.equal(gl.checkFramebufferStatus(gl.FRAMEBUFFER), gl.FRAMEBUFFER_COMPLETE);

  // 在 64x64 的 FBO 里画一个青色三角形
  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
  `);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.9, -0.9, 0.9, -0.9, 0.0, 0.9,
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, 64, 64);
  gl.clearColor(1, 0, 0, 1); // 清屏红色
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 回读 FBO 颜色附件
  const out = new Uint8Array(64 * 64 * 4);
  gl.readPixels(0, 0, 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, out);

  // 中心像素（NDC(0,0) 三角形内）应为青色
  const ci = ((32 * 64) + 32) * 4;
  assert.deepEqual([out[ci], out[ci + 1], out[ci + 2], out[ci + 3]], [0, 255, 255, 255], 'FBO 中心应为青色');

  // 右上角（窗口坐标 (60,60)，NDC(0.875,0.875) 在三角形外）应为红色清屏色
  const oi = ((60 * 64) + 60) * 4;
  assert.deepEqual([out[oi], out[oi + 1], out[oi + 2], out[oi + 3]], [255, 0, 0, 255], 'FBO 角落应为红色');

  // 恢复默认帧缓冲，检查默认缓冲未受影响
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  const d = pixel(gl, 10, 10);
  assert.deepEqual(d, [0, 0, 0, 0], '默认帧缓冲应保持透明黑（FBO 隔离）');
});

/* ============================ 6. 透视投影 + 透视校正插值 ============================ */

test('6. 透视投影 MVP + varying 透视校正插值', () => {
  const gl = createSimGL(256, 256);
  const W = 256, H = 256;

  // 透视矩阵（列主序，与 gl-matrix mat4.perspective 一致）
  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0,
    ]);
  }

  // 带 uv 的四边面（位于 z=-2，透视投影后占满大部分屏幕）
  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    attribute vec2 a_uv;
    uniform mat4 u_mvp;
    varying vec2 v_uv;
    void main() {
      v_uv = a_uv;
      gl_Position = u_mvp * vec4(a_pos, -2.0, 1.0);
    }
  `, `
    precision mediump float;
    varying vec2 v_uv;
    void main() {
      gl_FragColor = vec4(v_uv, 0.5, 1.0);
    }
  `);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // 正方形（xy 平面），带 uv
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.8, -0.8, 0, 0,
     0.8, -0.8, 1, 0,
     0.8,  0.8, 1, 1,
    -0.8, -0.8, 0, 0,
     0.8,  0.8, 1, 1,
    -0.8,  0.8, 0, 1,
  ]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'a_pos');
  const uvLoc = gl.getAttribLocation(prog, 'a_uv');
  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

  const mvpLoc = gl.getUniformLocation(prog, 'u_mvp');
  assert.ok(mvpLoc, 'u_mvp uniform 位置应存在');
  gl.uniformMatrix4fv(mvpLoc, false, perspective(Math.PI / 3, 1, 0.1, 10));

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // 屏幕中心：uv 插值应≈(0.5, 0.5) → 颜色 (127,127,127,255)
  const c = pixel(gl, W >> 1, H >> 1);
  assert.ok(Math.abs(c[0] - 127) <= 3, `中心 R 应≈127，实际 ${c[0]}`);
  assert.ok(Math.abs(c[1] - 127) <= 3, `中心 G 应≈127，实际 ${c[1]}`);
  assert.equal(c[3], 255, '中心 A 应为 255');

  // 四边面左上区域 uv≈(0.215, 0.215) → 颜色 (55, 55, 127, 255)
  const [px, py] = ndcToPx(-0.4, 0.4, W, H);
  const q = pixel(gl, px, py);
  assert.ok(q[0] >= 50 && q[0] <= 60, `左上 R(≈55) 实际 ${q[0]}`);
  assert.ok(q[1] >= 50 && q[1] <= 60, `左上 G(≈55) 实际 ${q[1]}`);
  assert.ok(Math.abs(q[2] - 127) <= 3, `左上 B(≈127) 实际 ${q[2]}`);
});

/* ============================ 7. 纹理采样 ============================ */

test('7. texture2D 采样（NEAREST/LINEAR/CLAMP）', () => {
  // ---- 单元级：直接验证 sampleTexture 的纹素定位公式 ----
  const unit = new TextureObject(1);
  const px = new Uint8Array(4 * 4 * 4);
  const set = (x, y, r, g, b) => { const i = (y * 4 + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255; };
  // 2x2 色块（数组坐标）：左上红、右上蓝、左下绿、右下白
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    if (x < 2 && y < 2) set(x, y, 255, 0, 0);
    else if (x >= 2 && y < 2) set(x, y, 0, 0, 255);
    else if (x < 2 && y >= 2) set(x, y, 0, 255, 0);
    else set(x, y, 255, 255, 255);
  }
  uploadPixels(unit, px, 4, 4, 0x1908); // RGBA
  unit.params.wrapS = 0x812f; // CLAMP_TO_EDGE
  unit.params.wrapT = 0x812f;
  unit.params.minFilter = 0x2600; // NEAREST
  unit.params.magFilter = 0x2600;

  const rgb = (u, v) => sampleTexture(unit, u, v).slice(0, 3).map((x) => Math.round(x * 255));
  assert.deepEqual(rgb(0.5, 0.5), [0, 0, 255], 'uv(0.5,0.5) 应为蓝');   // 中心
  assert.deepEqual(rgb(0.25, 0.25), [0, 255, 0], 'uv(0.25,0.25) 应为绿');
  assert.deepEqual(rgb(0.25, 0.5), [255, 0, 0], 'uv(0.25,0.5) 应为红');
  assert.deepEqual(rgb(0.5, 0.25), [255, 255, 255], 'uv(0.5,0.25) 应为白');

  // LINEAR：uv(0.5,0.5) 周围 4 纹素（红/蓝/绿/白）取平均 → (128,128,128)
  unit.params.minFilter = 0x2601; // LINEAR
  unit.params.magFilter = 0x2601;
  const lin = rgb(0.5, 0.5);
  assert.ok(Math.abs(lin[0] - 127) <= 3 && Math.abs(lin[1] - 127) <= 3 && Math.abs(lin[2] - 127) <= 3,
    `LINEAR 中心应≈(127,127,127)，实际 ${JSON.stringify(lin)}`);

  // CLAMP_TO_EDGE：uv(1.4, 0.5) 越界 → 钳到 u=1 → 蓝色；若 REPEAT 则会环绕回红
  unit.params.minFilter = 0x2600;
  unit.params.magFilter = 0x2600;
  assert.deepEqual(rgb(1.4, 0.5), [0, 0, 255], 'CLAMP 越界应钳到边缘（蓝）');
  unit.params.wrapS = 0x2901; // REPEAT
  assert.deepEqual(rgb(1.4, 0.5), [255, 0, 0], 'REPEAT 越界应环绕（红）');

  // ---- 集成级：全屏四边形 + texture2D 采样 ----
  const gl = createSimGL(128, 128);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main() { v_uv = a_uv; gl_Position = vec4(a_pos, 0.0, 1.0); }
  `, `
    precision mediump float;
    uniform sampler2D u_tex;
    varying vec2 v_uv;
    void main() { gl_FragColor = texture2D(u_tex, v_uv); }
  `);
  gl.useProgram(prog);
  gl.uniform1i(gl.getUniformLocation(prog, 'u_tex'), 0);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 0, 0,   1, -1, 1, 0,   1, 1, 1, 1,
    -1, -1, 0, 0,   1, 1, 1, 1,   -1, 1, 0, 1,
  ]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'a_pos');
  const uvLoc = gl.getAttribLocation(prog, 'a_uv');
  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // 屏幕中心 uv(0.5,0.5) → 蓝
  const c = pixel(gl, 64, 64);
  assert.deepEqual(c, [0, 0, 255, 255], '中心采样应为蓝，实际 ' + JSON.stringify(c));
  // 屏幕中心上方附近（窗口 y=32 → uv.y≈0.75 → 蓝）
  const q = pixel(gl, 64, 96);
  assert.deepEqual(q, [0, 0, 255, 255], '上方应为蓝（y>0.5 上蓝），实际 ' + JSON.stringify(q));
});

/* ============================ 8. 面剔除 + gl_FrontFacing ============================ */

test('8. 面剔除（BACK）与 gl_FrontFacing', () => {
  const gl = createSimGL(128, 128);

  const prog = buildProgram(gl, `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `, `
    precision mediump float;
    void main() {
      if (!gl_FrontFacing) gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      else gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
  `);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // 正面三角形（CCW，y 向上窗口坐标 → 屏幕 CCW）
    -0.9, -0.9,  0.9, -0.9,  0.0, 0.9,
    // 背面三角形（CW）
     0.9, -0.9, -0.9, -0.9,  0.0, 0.9,
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 画正面三角形 → 应显示蓝色（gl_FrontFacing = true）
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  const f = pixel(gl, 64, 64);
  assert.deepEqual(f, [0, 0, 255, 255], '正面应为蓝色，实际 ' + JSON.stringify(f));

  // 画背面三角形（无剔除时应显示红色），开启剔除后整个被丢弃
  gl.drawArrays(gl.TRIANGLES, 3, 3);
  const b = pixel(gl, 64, 64);
  assert.deepEqual(b, [0, 0, 255, 255], '背面被剔除，中心应保持蓝色，实际 ' + JSON.stringify(b));
});

/* ============================ 汇总 ============================ */

console.log('');
console.log(`结果: ${passed} 通过, ${failed.length} 失败`);
if (failed.length) {
  for (const f of failed) {
    console.log(`\n--- ${f.name} ---`);
    console.log(f.err.stack);
  }
  process.exit(1);
}
