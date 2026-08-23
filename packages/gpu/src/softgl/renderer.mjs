/**
 * renderer.mjs —— SimGL 主上下文对象
 * ============================================================================
 * 这是软件光栅化器的对外"显卡"：一个模拟 WebGL2 渲染上下文的对象，用法与
 * 真实 gl 上下文几乎一致：
 *
 *   const gl = createSimGL(800, 600);
 *   gl.clearColor(0.1, 0.2, 0.3, 1);
 *   gl.clear(gl.COLOR_BUFFER_BIT);
 *
 * 内部职责：
 *   - 持有全部渲染状态（RenderState）与默认帧缓冲（离屏画布）
 *   - 管理着色器 / 程序 / 缓冲 / 纹理 / 帧缓冲等资源的生命周期
 *   - 在 drawArrays / drawElements 时编排完整渲染管线：
 *       vertex fetch(取属性) → 顶点着色器 → 图元装配 → 裁剪
 *       → 透视除法 → 视口变换 → 光栅化 → 片段着色器 → 逐片段操作
 * ============================================================================
 */

import { defineConstants } from './constants.mjs';
import { RenderState } from './state.mjs';
import { Shader as GLShader, Program as GLProgram } from './glsl.mjs';
import { BufferObject, AttribPointer, toBytes, fetchVertexAttrib, readIndex, createDefaultVAO } from './buffer.mjs';
import { TextureObject, uploadPixels } from './texture.mjs';
import { RenderbufferObject, FramebufferObject, createDefaultFramebuffer, resizeDefaultFramebuffer, resolveAttachment, checkFramebuffer } from './framebuffer.mjs';
import { rasterize } from './rasterizer.mjs';
import { mk, compCount } from './glsl.mjs';

export class SimGL {
  constructor(width, height) {
    this._idCounter = 0;
    this._errors = []; // 错误队列（getError 逐条弹出）

    // 默认帧缓冲 = 模拟的"屏幕画布"（颜色/深度/模板三个 JS 数组）
    this._defaultFramebuffer = createDefaultFramebuffer(width, height);
    this._drawTarget = this._defaultFramebuffer; // 当前绘制目标

    this.state = new RenderState();
    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.state.scissor.width = width;
    this.state.scissor.height = height;

    // 默认 VAO（WebGL 中所有上下文自带 default VAO）
    this.MAX_VERTEX_ATTRIBS = 16;
    this._defaultVAO = createDefaultVAO(this.MAX_VERTEX_ATTRIBS);
    this.state.vertexArray = this._defaultVAO;

    // 纹理单元
    for (let i = 0; i < 16; i++) this.state.textureUnits.push(null);

    // 挂载全部常量（模拟 gl.ARRAY_BUFFER 等常量访问）
    defineConstants(this);
  }

  /* ============================ 资源 ID ============================ */

  _nextId() { return ++this._idCounter; }

  /* ============================ 错误处理 ============================ */

  _setError(code) { this._errors.push(code); }

  /** 对应 gl.getError()：弹出并返回错误队列中最早的错误 */
  getError() { return this._errors.length ? this._errors.shift() : this.NO_ERROR; }

  /** 扩展查询：模拟器不支持任何扩展 */
  getExtension() { return null; }
  getSupportedExtensions() { return []; }

  /* ============================ 着色器与程序 ============================ */

  /** 对应 gl.createShader(type)：创建空着色器对象 */
  createShader(type) {
    return {
      id: this._nextId(),
      type, // VERTEX_SHADER / FRAGMENT_SHADER
      source: '',
      compileStatus: false,
      log: '',
      _shader: null,
    };
  }

  /** 对应 gl.shaderSource(shader, source) */
  shaderSource(shader, source) { shader.source = source; }

  /** 对应 gl.compileShader(shader)：调用 GLSL 子集编译器（词法+语法分析） */
  compileShader(shader) {
    const s = new GLShader(shader.type === this.VERTEX_SHADER ? 'vertex' : 'fragment', shader.source);
    shader.compileStatus = s.compile();
    shader.log = s.log;
    shader._shader = s;
  }

  /** 对应 gl.getShaderParameter(shader, pname) */
  getShaderParameter(shader, pname) {
    if (pname === this.COMPILE_STATUS) return shader.compileStatus;
    if (pname === this.DELETE_STATUS) return shader._deleted || false;
    return false;
  }

  getShaderInfoLog(shader) { return shader.log; }

  deleteShader(shader) { shader._deleted = true; }

  /** 对应 gl.createProgram() */
  createProgram() {
    return {
      id: this._nextId(),
      shaders: [],
      _program: null, // 链接后为 GLSL Program 对象
      linkStatus: false,
      log: '',
    };
  }

  attachShader(program, shader) {
    if (!program.shaders.includes(shader)) program.shaders.push(shader);
  }

  /**
   * 对应 gl.linkProgram(program)：链接阶段把顶点/片段着色器合并为一个可执行程序，
   * 匹配 varying、分配 attribute/uniform location、汇总函数表。
   */
  linkProgram(program) {
    const p = new GLProgram(this);
    for (const s of program.shaders) p.attach(s._shader);
    program.linkStatus = p.link();
    program.log = p.log;
    program._program = p;
  }

  getProgramParameter(program, pname) {
    if (pname === this.LINK_STATUS) return program.linkStatus;
    if (pname === this.DELETE_STATUS) return program._deleted || false;
    return false;
  }

  getProgramInfoLog(program) { return program.log; }

  /** 对应 gl.useProgram(program)：把程序设为当前着色程序 */
  useProgram(program) { this.state.program = program ? program._program : null; }

  deleteProgram(program) { program._deleted = true; }

  /** 对应 gl.getAttribLocation(program, name) */
  getAttribLocation(program, name) {
    if (!program._program) return -1;
    return program._program.getAttribLocation(name);
  }

  /** 对应 gl.getUniformLocation(program, name)：返回 WebGLUniformLocation 模拟对象 */
  getUniformLocation(program, name) {
    if (!program._program) return null;
    const loc = program._program.getUniformLocation(name);
    return loc ? { program, name, location: loc.location } : null;
  }

  /**
   * 内部工具：把 uniform 设置写入程序（按 uniform 的声明类型转换数据）。
   * 对应 gl.uniform* 系列。
   */
  _setUniform(loc, value) {
    if (!loc) return;
    loc.program._program.uniformValues.set(loc.name, value);
  }

  uniform1f(loc, x) { this._setUniform(loc, mk('float', x)); }
  uniform2f(loc, x, y) { this._setUniform(loc, mk('vec2', new Float32Array([x, y]))); }
  uniform3f(loc, x, y, z) { this._setUniform(loc, mk('vec3', new Float32Array([x, y, z]))); }
  uniform4f(loc, x, y, z, w) { this._setUniform(loc, mk('vec4', new Float32Array([x, y, z, w]))); }
  uniform1i(loc, x) {
    // sampler 类型时 x 是纹理单元号；int 类型时直接存整数
    const name = loc && loc.name;
    const prog = loc && loc.program && loc.program._program;
    if (prog) {
      const u = prog.uniforms.find((u) => u.name === name);
      if (u && u.type === 'sampler2D') {
        this._setUniform(loc, mk('sampler2D', { unit: x, texture: null }));
        return;
      }
    }
    this._setUniform(loc, mk('int', x));
  }
  uniform2i(loc, x, y) { this._setUniform(loc, mk('ivec2', new Float32Array([x, y]))); }
  uniform3i(loc, x, y, z) { this._setUniform(loc, mk('ivec3', new Float32Array([x, y, z]))); }
  uniform4i(loc, x, y, z, w) { this._setUniform(loc, mk('ivec4', new Float32Array([x, y, z, w]))); }
  uniform1fv(loc, v) { this._setUniform(loc, mk('float', v[0])); }
  uniform2fv(loc, v) { this._setUniform(loc, mk('vec2', Float32Array.from(v.slice(0, 2)))); }
  uniform3fv(loc, v) { this._setUniform(loc, mk('vec3', Float32Array.from(v.slice(0, 3)))); }
  uniform4fv(loc, v) { this._setUniform(loc, mk('vec4', Float32Array.from(v.slice(0, 4)))); }
  uniform1iv(loc, v) { this.uniform1i(loc, v[0]); }
  uniform2iv(loc, v) { this._setUniform(loc, mk('ivec2', Float32Array.from(v.slice(0, 2)))); }
  uniform3iv(loc, v) { this._setUniform(loc, mk('ivec3', Float32Array.from(v.slice(0, 3)))); }
  uniform4iv(loc, v) { this._setUniform(loc, mk('ivec4', Float32Array.from(v.slice(0, 4)))); }
  uniformMatrix2fv(loc, transpose, v) {
    const m = transpose ? transposeMat(v, 2) : Float32Array.from(v.slice(0, 4));
    this._setUniform(loc, mk('mat2', m));
  }
  uniformMatrix3fv(loc, transpose, v) {
    const m = transpose ? transposeMat(v, 3) : Float32Array.from(v.slice(0, 9));
    this._setUniform(loc, mk('mat3', m));
  }
  uniformMatrix4fv(loc, transpose, v) {
    const m = transpose ? transposeMat(v, 4) : Float32Array.from(v.slice(0, 16));
    this._setUniform(loc, mk('mat4', m));
  }

  /* ============================ 缓冲区 ============================ */

  /** 对应 gl.createBuffer() */
  createBuffer() { return new BufferObject(this._nextId()); }

  /** 对应 gl.bindBuffer(target, buffer)：ARRAY_BUFFER 绑定是全局的，ELEMENT 属于 VAO */
  bindBuffer(target, buffer) {
    if (target === this.ELEMENT_ARRAY_BUFFER) {
      this.state.vertexArray.elementBuffer = buffer;
    } else {
      this.state.boundBuffers[target] = buffer;
    }
  }

  /** 按 target 查找"当前绑定的缓冲"：ELEMENT 在 VAO 里，其余在全局绑定槽里 */
  _boundBuffer(target) {
    if (target === this.ELEMENT_ARRAY_BUFFER) return this.state.vertexArray.elementBuffer;
    return this.state.boundBuffers[target];
  }

  /**
   * 对应 gl.bufferData(target, data, usage)：把 CPU 数据"上传到显存"。
   * 本模拟器就是拷贝到 BufferObject.data（Uint8Array）。
   */
  bufferData(target, data, usage) {
    const buf = this._boundBuffer(target);
    if (!buf) { this._setError(this.INVALID_OPERATION); return; }
    const bytes = toBytes(data);
    buf.data = bytes;
    buf.size = bytes.length;
    buf.usage = usage;
    buf.target = target;
  }

  /** 对应 gl.bufferSubData(target, offset, data)：局部更新 */
  bufferSubData(target, offset, data) {
    const buf = this._boundBuffer(target);
    if (!buf || !buf.data) { this._setError(this.INVALID_OPERATION); return; }
    const bytes = toBytes(data);
    for (let i = 0; i < bytes.length; i++) buf.data[offset + i] = bytes[i];
  }

  deleteBuffer(buffer) { buffer._deleted = true; }

  /* ---------------- VAO 与顶点属性 ---------------- */

  /** 对应 gl.createVertexArray() */
  createVertexArray() {
    const vao = createDefaultVAO(this.MAX_VERTEX_ATTRIBS);
    vao.id = this._nextId();
    return vao;
  }

  /** 对应 gl.bindVertexArray(vao)：切换当前顶点属性布局（null 回到默认 VAO） */
  bindVertexArray(vao) {
    this.state.vertexArray = vao || this._defaultVAO;
  }

  deleteVertexArray(vao) { vao._deleted = true; }

  /** 对应 gl.enableVertexAttribArray(loc) */
  enableVertexAttribArray(loc) {
    this.state.vertexArray.attribs[loc].enabled = true;
  }

  /** 对应 gl.disableVertexAttribArray(loc) */
  disableVertexAttribArray(loc) {
    this.state.vertexArray.attribs[loc].enabled = false;
  }

  /**
   * 对应 gl.vertexAttribPointer(loc, size, type, normalized, stride, offset)：
   * 把当前 ARRAY_BUFFER 上的数据格式与 attribute 关联。
   */
  vertexAttribPointer(loc, size, type, normalized, stride, offset) {
    const ap = this.state.vertexArray.attribs[loc];
    ap.buffer = this.state.boundBuffers[this.ARRAY_BUFFER];
    ap.size = size;
    ap.type = type || this.FLOAT;
    ap.normalized = !!normalized;
    ap.stride = stride || 0;
    ap.offset = offset || 0;
  }

  /** 常量属性：attribute 未启用时的取值（对应 gl.vertexAttrib1f~4f） */
  vertexAttrib1f(loc, x) { this.state.vertexArray.attribs[loc].constant = [x, 0, 0, 1]; }
  vertexAttrib2f(loc, x, y) { this.state.vertexArray.attribs[loc].constant = [x, y, 0, 1]; }
  vertexAttrib3f(loc, x, y, z) { this.state.vertexArray.attribs[loc].constant = [x, y, z, 1]; }
  vertexAttrib4f(loc, x, y, z, w) { this.state.vertexArray.attribs[loc].constant = [x, y, z, w]; }

  /* ============================ 纹理 ============================ */

  createTexture() { return new TextureObject(this._nextId()); }

  /** 对应 gl.bindTexture(target, texture)：绑定到当前活动纹理单元 */
  bindTexture(target, texture) {
    if (!texture) { this.state.textureUnits[this.state.activeTextureUnit] = null; return; }
    texture.target = target;
    this.state.textureUnits[this.state.activeTextureUnit] = texture;
  }

  deleteTexture(texture) { texture._deleted = true; }

  /** 对应 gl.activeTexture(TEXTURE0 + n)：选择后续操作作用的纹理单元 */
  activeTexture(unit) {
    this.state.activeTextureUnit = unit - this.TEXTURE0;
  }

  /**
   * 对应 gl.texImage2D：上传像素数据到纹理。
   * 支持两种签名（与 WebGL 一致）：
   *   texImage2D(target, level, internalformat, width, height, border, format, type, pixels)
   *   texImage2D(target, level, internalformat, format, type, pixels)  // pixels 含尺寸
   */
  texImage2D(target, level, internalformat, ...rest) {
    const tex = this.state.textureUnits[this.state.activeTextureUnit];
    if (!tex) { this._setError(this.INVALID_OPERATION); return; }
    let width, height, border, format, type, pixels;
    if (typeof rest[0] === 'number' && typeof rest[1] === 'number') {
      // 完整签名
      [width, height, border, format, type, pixels] = rest;
    } else {
      // 简写签名：pixels 提供尺寸
      [format, type, pixels] = rest;
      width = pixels.width;
      height = pixels.height;
      border = 0;
    }
    tex.internalFormat = internalformat;
    tex.format = format;
    tex.type = type;
    if (pixels) {
      uploadPixels(tex, pixels, width, height, format);
    } else {
      // 仅分配空间（可后续用 framebufferTexture2D 作为渲染目标）
      tex.width = width;
      tex.height = height;
      tex.pixels = new Uint8ClampedArray(width * height * 4);
    }
  }

  /** 对应 gl.texParameteri：设置采样参数（环绕/过滤） */
  texParameteri(target, pname, param) {
    const tex = this.state.textureUnits[this.state.activeTextureUnit];
    if (!tex) { this._setError(this.INVALID_OPERATION); return; }
    if (pname === this.TEXTURE_WRAP_S) tex.params.wrapS = param;
    else if (pname === this.TEXTURE_WRAP_T) tex.params.wrapT = param;
    else if (pname === this.TEXTURE_MIN_FILTER) tex.params.minFilter = param;
    else if (pname === this.TEXTURE_MAG_FILTER) tex.params.magFilter = param;
  }

  /** 对应 gl.generateMipmap：本模拟器不使用 mipmap，仅保留接口 */
  generateMipmap() { /* no-op：软件光栅化始终按 0 级纹理采样 */ }

  /* ============================ 帧缓冲 / 渲染缓冲 ============================ */

  createFramebuffer() { return new FramebufferObject(this._nextId()); }

  /** 对应 gl.bindFramebuffer(FRAMEBUFFER, fb)：null 表示绑定默认帧缓冲（屏幕） */
  bindFramebuffer(target, fb) { this.state.boundFramebuffer = fb; }

  deleteFramebuffer(fb) { fb._deleted = true; }

  /** 对应 gl.framebufferTexture2D：把纹理作为帧缓冲附件 */
  framebufferTexture2D(target, attachment, textarget, texture, level) {
    const fb = this.state.boundFramebuffer;
    if (!fb) { this._setError(this.INVALID_OPERATION); return; }
    const entry = texture ? { kind: 'texture', obj: texture } : null;
    if (attachment === this.COLOR_ATTACHMENT0) fb.colorAttachment = entry;
    else if (attachment === this.DEPTH_ATTACHMENT) fb.depthAttachment = entry;
    else if (attachment === this.STENCIL_ATTACHMENT) fb.stencilAttachment = entry;
    else if (attachment === this.DEPTH_STENCIL_ATTACHMENT) {
      fb.depthAttachment = entry;
      fb.stencilAttachment = entry;
    }
  }

  /** 对应 gl.framebufferRenderbuffer：把渲染缓冲作为帧缓冲附件 */
  framebufferRenderbuffer(target, attachment, rbtarget, rb) {
    const fb = this.state.boundFramebuffer;
    if (!fb) { this._setError(this.INVALID_OPERATION); return; }
    const entry = rb ? { kind: 'renderbuffer', obj: rb } : null;
    if (attachment === this.COLOR_ATTACHMENT0) fb.colorAttachment = entry;
    else if (attachment === this.DEPTH_ATTACHMENT) fb.depthAttachment = entry;
    else if (attachment === this.STENCIL_ATTACHMENT) fb.stencilAttachment = entry;
    else if (attachment === this.DEPTH_STENCIL_ATTACHMENT) {
      fb.depthAttachment = entry;
      fb.stencilAttachment = entry;
    }
  }

  /** 对应 gl.checkFramebufferStatus：检查当前绑定帧缓冲是否可渲染 */
  checkFramebufferStatus(target) {
    const fb = this.state.boundFramebuffer;
    if (!fb) return this.FRAMEBUFFER_COMPLETE; // 默认帧缓冲总是完整
    return checkFramebuffer(this, fb);
  }

  createRenderbuffer() { return new RenderbufferObject(this._nextId()); }

  bindRenderbuffer(target, rb) { this.state.boundRenderbuffer = rb; }

  deleteRenderbuffer(rb) { rb._deleted = true; }

  /**
   * 对应 gl.renderbufferStorage：分配渲染缓冲的存储空间。
   * 深度→Float32Array，模板→Uint8Array，颜色→Uint8ClampedArray。
   */
  renderbufferStorage(target, internalformat, width, height) {
    const rb = this.state.boundRenderbuffer;
    if (!rb) { this._setError(this.INVALID_OPERATION); return; }
    rb.internalFormat = internalformat;
    rb.width = width;
    rb.height = height;
    if (internalformat === this.DEPTH_COMPONENT16 || internalformat === this.DEPTH_COMPONENT24 ||
        internalformat === this.DEPTH_COMPONENT32F || internalformat === this.DEPTH_COMPONENT) {
      rb.data = new Float32Array(width * height);
    } else if (internalformat === this.STENCIL_INDEX8) {
      rb.data = new Uint8Array(width * height);
    } else if (internalformat === this.DEPTH_STENCIL || internalformat === this.DEPTH24_STENCIL8) {
      rb.data = { depth: new Float32Array(width * height), stencil: new Uint8Array(width * height) };
    } else {
      // 颜色渲染缓冲
      rb.data = new Uint8ClampedArray(width * height * 4);
    }
  }

  /* ============================ 渲染状态 ============================ */

  viewport(x, y, width, height) {
    this.state.viewport = { x, y, width, height };
  }

  enable(cap) { this.state.enabled.add(cap); }
  disable(cap) { this.state.enabled.delete(cap); }
  isEnabled(cap) { return this.state.enabled.has(cap); }

  clearColor(r, g, b, a) { this.state.clearColor = [r, g, b, a]; }
  clearDepth(d) { this.state.clearDepth = d; }
  clearStencil(s) { this.state.clearStencil = s; }

  /**
   * 对应 gl.clear(mask)：用清除值填充当前绘制目标（受写入掩码控制）。
   * 对应 GPU 的"清屏"硬件操作。
   */
  clear(mask) {
    this._prepareDrawTarget();
    const t = this._drawTarget;
    if (!t) return;
    const st = this.state;
    if ((mask & this.COLOR_BUFFER_BIT) && t.color) {
      const [r, g, b, a] = st.clearColor.map((v) => Math.round(Math.min(Math.max(v, 0), 1) * 255));
      const m = st.colorMask;
      for (let i = 0; i < t.color.length; i += 4) {
        if (m[0]) t.color[i] = r;
        if (m[1]) t.color[i + 1] = g;
        if (m[2]) t.color[i + 2] = b;
        if (m[3]) t.color[i + 3] = a;
      }
    }
    if ((mask & this.DEPTH_BUFFER_BIT) && t.depth && st.depthMask) {
      t.depth.fill(st.clearDepth);
    }
    if ((mask & this.STENCIL_BUFFER_BIT) && t.stencil && st.stencilMask !== 0) {
      t.stencil.fill(st.clearStencil & st.stencilMask);
    }
  }

  colorMask(r, g, b, a) { this.state.colorMask = [r, g, b, a]; }
  depthMask(flag) { this.state.depthMask = flag; }
  stencilMask(mask) {
    this.state.stencilMask = mask;
    this.state.stencilMaskBack = mask;
  }
  stencilMaskSeparate(face, mask) {
    if (face === this.FRONT) this.state.stencilMask = mask;
    else this.state.stencilMaskBack = mask;
  }

  depthFunc(f) { this.state.depthFunc = f; }
  depthRange(near, far) { this.state.depthRange = { near, far }; }

  blendFunc(sf, df) {
    this.state.blendSrcRGB = sf; this.state.blendDstRGB = df;
    this.state.blendSrcAlpha = sf; this.state.blendDstAlpha = df;
  }
  blendFuncSeparate(srgb, drgb, sa, da) {
    this.state.blendSrcRGB = srgb; this.state.blendDstRGB = drgb;
    this.state.blendSrcAlpha = sa; this.state.blendDstAlpha = da;
  }
  blendEquation(eq) { this.state.blendEquationRGB = eq; this.state.blendEquationAlpha = eq; }
  blendEquationSeparate(eqRGB, eqAlpha) {
    this.state.blendEquationRGB = eqRGB;
    this.state.blendEquationAlpha = eqAlpha;
  }
  blendColor(r, g, b, a) { this.state.blendColor = [r, g, b, a]; }

  stencilFunc(func, ref, mask) {
    this.state.stencilFunc = func; this.state.stencilRef = ref; this.state.stencilMaskTest = mask;
    this.state.stencilFuncBack = func; this.state.stencilRefBack = ref; this.state.stencilMaskBackTest = mask;
  }
  stencilFuncSeparate(face, func, ref, mask) {
    if (face === this.FRONT) {
      this.state.stencilFunc = func; this.state.stencilRef = ref; this.state.stencilMaskTest = mask;
    } else {
      this.state.stencilFuncBack = func; this.state.stencilRefBack = ref; this.state.stencilMaskBackTest = mask;
    }
  }
  stencilOp(fail, zfail, zpass) {
    this.state.stencilOpFail = fail; this.state.stencilOpZFail = zfail; this.state.stencilOpZPass = zpass;
    this.state.stencilOpFailBack = fail; this.state.stencilOpZFailBack = zfail; this.state.stencilOpZPassBack = zpass;
  }
  stencilOpSeparate(face, fail, zfail, zpass) {
    if (face === this.FRONT) {
      this.state.stencilOpFail = fail; this.state.stencilOpZFail = zfail; this.state.stencilOpZPass = zpass;
    } else {
      this.state.stencilOpFailBack = fail; this.state.stencilOpZFailBack = zfail; this.state.stencilOpZPassBack = zpass;
    }
  }

  cullFace(mode) { this.state.cullFace = mode; }
  frontFace(mode) { this.state.frontFace = mode; }
  lineWidth(w) { this.state.lineWidth = w; }
  scissor(x, y, width, height) { this.state.scissor = { x, y, width, height }; }

  /** 对应 gl.getParameter：返回少量常用参数 */
  getParameter(pname) {
    switch (pname) {
      case this.VIEWPORT: return [this.state.viewport.x, this.state.viewport.y, this.state.viewport.width, this.state.viewport.height];
      case this.SCISSOR_BOX: return [this.state.scissor.x, this.state.scissor.y, this.state.scissor.width, this.state.scissor.height];
      case this.MAX_TEXTURE_SIZE: return 8192;
      case this.MAX_VERTEX_ATTRIBS: return this.MAX_VERTEX_ATTRIBS;
      case this.MAX_TEXTURE_IMAGE_UNITS: return 16;
      case this.MAX_RENDERBUFFER_SIZE: return 8192;
      case this.MAX_DRAW_BUFFERS: return 1;
      case this.BLEND_COLOR: return this.state.blendColor;
      case this.VERSION: return 'WebGL 2.0 (SimGL 软件模拟)';
      case this.SHADING_LANGUAGE_VERSION: return 'GLSL ES 3.00 (SimGL)';
      case this.DEPTH_WRITEMASK: return this.state.depthMask;
      default: return null;
    }
  }

  /* ============================ 绘制 ============================ */

  /** 准备当前绘制目标：默认帧缓冲或绑定的 FBO 附件数组 */
  _prepareDrawTarget() {
    const fb = this.state.boundFramebuffer;
    if (!fb) {
      this._drawTarget = this._defaultFramebuffer;
      return;
    }
    const status = checkFramebuffer(this, fb);
    if (status !== this.FRAMEBUFFER_COMPLETE) {
      this._drawTarget = null;
      return;
    }
    this._drawTarget = {
      width: fb.width,
      height: fb.height,
      color: resolveAttachment(fb, 'color'),
      depth: resolveAttachment(fb, 'depth'),
      stencil: resolveAttachment(fb, 'stencil'),
    };
  }

  /**
   * 对一批顶点索引执行顶点着色器，返回顶点流（每个顶点含裁剪坐标与 varying）。
   * 对应 GPU 的 vertex fetch + vertex shader 两个阶段。
   */
  _processVertexStream(indexList) {
    const vao = this.state.vertexArray;
    const program = this.state.program;
    const stream = [];
    for (const vi of indexList) {
      const attribValues = new Map();
      for (const a of program.vertexInputs) {
        const pointer = vao.attribs[a.location];
        if (!pointer) continue;
        const vals = fetchVertexAttrib(pointer, vi);
        const n = compCount(a.type);
        if (n > 0) {
          attribValues.set(a.name, mk(a.type, Float32Array.from(vals.slice(0, n))));
        } else {
          attribValues.set(a.name, mk(a.type, vals[0]));
        }
      }
      // runVertex 返回 {position, pointSize, varyings}；光栅化器要求 {clip, ...}
      const out = program.runVertex(attribValues);
      stream.push({ clip: out.position, pointSize: out.pointSize, varyings: out.varyings });
    }
    return stream;
  }

  /** 对应 gl.drawArrays(mode, first, count)：按顶点序号绘制 */
  drawArrays(mode, first, count) {
    if (!this.state.program || count <= 0) return;
    this._prepareDrawTarget();
    if (!this._drawTarget || !this._drawTarget.color) return;
    const indices = [];
    for (let i = 0; i < count; i++) indices.push(first + i);
    const stream = this._processVertexStream(indices);
    rasterize(this, mode, stream);
  }

  /** 对应 gl.drawElements(mode, count, type, offset)：按索引缓冲绘制 */
  drawElements(mode, count, type, offset) {
    if (!this.state.program || count <= 0) return;
    const indexBuffer = this.state.vertexArray.elementBuffer;
    if (!indexBuffer || !indexBuffer.data) { this._setError(this.INVALID_OPERATION); return; }
    this._prepareDrawTarget();
    if (!this._drawTarget || !this._drawTarget.color) return;
    const indices = [];
    const byteSize = type === this.UNSIGNED_INT ? 4 : type === this.UNSIGNED_SHORT ? 2 : 1;
    for (let i = 0; i < count; i++) {
      indices.push(readIndex(indexBuffer, offset + i * byteSize, type));
    }
    const stream = this._processVertexStream(indices);
    rasterize(this, mode, stream);
  }

  /**
   * 对应 gl.readPixels：从当前绘制目标读取像素（Y 轴翻转，与 GL 一致）。
   * 实现：先把数据拷贝到数组，再调用 readPixels 的回调写法（ES5 风格）以兼容两种用法。
   */
  readPixels(x, y, width, height, format, type, dst) {
    this._prepareDrawTarget();
    const t = this._drawTarget;
    if (!t || !t.color) return;
    const fbW = t.width;
    const fbH = t.height;
    for (let r = 0; r < height; r++) {
      // GL readPixels 原点在左下角：源行 = fbH-1-(y+r)，目标行 = r
      const srcRow = fbH - 1 - (y + r);
      if (srcRow < 0 || srcRow >= fbH) continue;
      for (let c = 0; c < width; c++) {
        const sx = x + c;
        if (sx < 0 || sx >= fbW) continue;
        const si = (srcRow * fbW + sx) * 4;
        const di = (r * width + c) * 4;
        dst[di] = t.color[si];
        dst[di + 1] = t.color[si + 1];
        dst[di + 2] = t.color[si + 2];
        dst[di + 3] = t.color[si + 3];
      }
    }
  }

  /** 便利方法：把当前颜色缓冲输出为 ImageData 结构（{width, height, data}） */
  toImageData() {
    const t = this._defaultFramebuffer;
    return { width: t.width, height: t.height, data: t.color.slice() };
  }

  /** 调整画布尺寸（模拟 canvas resize） */
  resize(width, height) {
    resizeDefaultFramebuffer(this._defaultFramebuffer, width, height);
    if (this.state.viewport.width === width - 1) { /* no-op */ }
  }
}

/** 矩阵转置（uniformMatrix*fv 的 transpose 参数为 true 时） */
function transposeMat(v, n) {
  const out = new Float32Array(n * n);
  for (let c = 0; c < n; c++) {
    for (let r = 0; r < n; r++) out[c * n + r] = v[r * n + c];
  }
  return out;
}
