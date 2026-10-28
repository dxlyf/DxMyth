import { Color } from "../math/Color.js";
import { Matrix2D } from "../math/Matrix2D.js";
import { isEmptyMesh } from "./geometry.js";
import { isPatternPaint } from "./Paint.js";
import { GPU2DRenderer, resolveGradient, MAX_GRADIENT_STOPS, resolveBlend } from "./GPU2DRenderer.js";
import { imageSize } from "./CanvasRenderer.js";
const BUFFER_USAGE_COPY_DST = 8;
const BUFFER_USAGE_INDEX = 16;
const BUFFER_USAGE_VERTEX = 32;
const BUFFER_USAGE_UNIFORM = 64;
const TEXTURE_USAGE_COPY_DST = 2;
const TEXTURE_USAGE_TEXTURE_BINDING = 4;
const TEXTURE_USAGE_RENDER_ATTACHMENT = 16;
const SHADER_STAGE_VERTEX = 1;
const SHADER_STAGE_FRAGMENT = 2;
const COLOR_WRITE_ALL = 15;
const DEPTH_STENCIL_FORMAT = "depth24plus-stencil8";
const TEXTURE_FORMAT = "rgba8unorm";
const UNIFORM_SIZE = 272;
const UNIFORM_FLOATS = UNIFORM_SIZE / 4;
const QUAD_INDICES = new Uint32Array([0, 1, 2, 0, 2, 3]);
const IDENTITY = Matrix2D.identity();
const SHAPE_WGSL = `
struct Uniforms {
    resolution: vec2f,
    opacity: f32,
    kind: i32,
    params0: vec4f,
    params1: vec4f,
    stopColors: array<vec4f, 8>,
    stopA: vec4f,
    stopB: vec4f,
    pattern: mat3x3f,
    texSize: vec2f,
    repeatMode: i32,
    stopCount: i32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var u_texture: texture_2d<f32>;
@group(0) @binding(2) var u_sampler: sampler;

struct VSOut {
    @builtin(position) position: vec4f,
    @location(0) local: vec2f,
};

@vertex
fn vs_main(@location(0) a_position: vec2f, @location(1) a_local: vec2f) -> VSOut {
    var result: VSOut;
    let clip = a_position / u.resolution * 2.0 - vec2f(1.0);
    result.position = vec4f(clip.x, -clip.y, 0.0, 1.0);
    result.local = a_local;
    return result;
}

fn stopOffset(i: i32) -> f32 {
    if (i < 4) {
        return u.stopA[i];
    }
    return u.stopB[i - 4];
}

fn sampleStops(t: f32) -> vec4f {
    if (u.stopCount <= 0) {
        return vec4f(0.0);
    }
    var prevColor = u.stopColors[0];
    var prevOffset = stopOffset(0);
    if (u.stopCount == 1) {
        return prevColor;
    }
    for (var i: i32 = 1; i < 8; i = i + 1) {
        if (i >= u.stopCount) {
            break;
        }
        let offset = stopOffset(i);
        let color = u.stopColors[i];
        if (t <= offset) {
            let span = max(offset - prevOffset, 1e-6);
            return mix(prevColor, color, clamp((t - prevOffset) / span, 0.0, 1.0));
        }
        prevColor = color;
        prevOffset = offset;
    }
    return prevColor;
}

fn linearGradient(p: vec2f) -> vec4f {
    let start = u.params0.xy;
    let d = u.params0.zw - start;
    let len2 = dot(d, d);
    var t = 0.0;
    if (len2 > 1e-6) {
        t = dot(p - start, d) / len2;
    }
    return sampleStops(t);
}

fn radialGradient(p: vec2f) -> vec4f {
    let c0 = u.params0.xy;
    let r0 = u.params0.z;
    let c1 = u.params1.xy;
    let r1 = u.params1.z;
    let d = c1 - c0;
    let dr = r1 - r0;
    let pc = p - c0;
    let a = dot(d, d) - dr * dr;
    let b = -2.0 * (dot(pc, d) + r0 * dr);
    let c = dot(pc, pc) - r0 * r0;
    var t = 0.0;
    if (abs(a) < 1e-6) {
        if (abs(b) > 1e-6) {
            t = -c / b;
        }
    } else {
        let disc = b * b - 4.0 * a * c;
        if (disc >= 0.0) {
            let sq = sqrt(disc);
            let t0 = (-b + sq) / (2.0 * a);
            let t1 = (-b - sq) / (2.0 * a);
            if (min(t0, t1) >= 0.0) {
                t = min(t0, t1);
            } else {
                t = max(t0, t1);
            }
        }
    }
    return sampleStops(t);
}

fn conicGradient(p: vec2f) -> vec4f {
    let d = p - u.params0.xy;
    let angle = atan2(d.y, d.x);
    return sampleStops(fract((angle - u.params0.z) / 6.283185307179586));
}

fn patternColor(p: vec2f) -> vec4f {
    let mapped = u.pattern * vec3f(p, 1.0);
    var uv = mapped.xy / max(u.texSize, vec2f(1.0));
    if (u.repeatMode == 0) {
        uv = fract(uv);
    } else if (u.repeatMode == 1) {
        uv = vec2f(fract(uv.x), clamp(uv.y, 0.0, 1.0));
    } else if (u.repeatMode == 2) {
        uv = vec2f(clamp(uv.x, 0.0, 1.0), fract(uv.y));
    } else if (any(uv < vec2f(0.0)) || any(uv > vec2f(1.0))) {
        discard;
    }
    return textureSample(u_texture, u_sampler, uv);
}

@fragment
fn fs_main(in: VSOut) -> @location(0) vec4f {
    var color = u.params0;
    if (u.kind == 1) {
        color = linearGradient(in.local);
    } else if (u.kind == 2) {
        color = radialGradient(in.local);
    } else if (u.kind == 3) {
        color = conicGradient(in.local);
    } else if (u.kind == 4) {
        color = patternColor(in.local);
    }
    let alpha = color.a * u.opacity;
    if (alpha <= 0.0) {
        discard;
    }
    // 画布按预乘 alpha 合成
    return vec4f(color.rgb * alpha, alpha);
}`;
const IMAGE_WGSL = `
struct Uniforms {
    resolution: vec2f,
    opacity: f32,
    pad: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var u_texture: texture_2d<f32>;
@group(0) @binding(2) var u_sampler: sampler;

struct VSOut {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
};

@vertex
fn vs_main(@location(0) a_position: vec2f, @location(1) a_uv: vec2f) -> VSOut {
    var result: VSOut;
    let clip = a_position / u.resolution * 2.0 - vec2f(1.0);
    result.position = vec4f(clip.x, -clip.y, 0.0, 1.0);
    result.uv = a_uv;
    return result;
}

@fragment
fn fs_main(in: VSOut) -> @location(0) vec4f {
    let texel = textureSample(u_texture, u_sampler, in.uv);
    let alpha = texel.a * u.opacity;
    if (alpha <= 0.0) {
        discard;
    }
    return vec4f(texel.rgb * alpha, alpha);
}`;
class WebGPURenderer extends GPU2DRenderer {
  /** 请求 adapter / device 后创建实例，避免把异步初始化塞进构造函数 */
  static async create(canvas, options = {}) {
    if (options.device) return new WebGPURenderer(canvas, options);
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error("WebGPURenderer: 当前环境不支持 WebGPU");
    const adapter = await gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPURenderer: 没有可用的 GPU adapter");
    const device = await adapter.requestDevice();
    return new WebGPURenderer(canvas, {
      ...options,
      device,
      format: options.format ?? gpu.getPreferredCanvasFormat()
    });
  }
  _device;
  _context;
  _format;
  _alphaMode;
  _label;
  _shapeModule;
  _imageModule;
  _bindGroupLayout;
  _pipelineLayout;
  _pipelines = /* @__PURE__ */ new Map();
  _uniformBuffer;
  _uniformData = new Float32Array(UNIFORM_FLOATS);
  _uniformInts = new Int32Array(this._uniformData.buffer);
  _samplerLinear;
  _samplerNearest;
  _vertexBuffer = null;
  _vertexCapacity = 0;
  _indexBuffer = null;
  _indexCapacity = 0;
  _depthTexture = null;
  _depthView = null;
  _quadPositions = new Float32Array(8);
  _pass = null;
  _encoder = null;
  _textures = /* @__PURE__ */ new WeakMap();
  _textureSet = /* @__PURE__ */ new Set();
  _whiteTexture;
  constructor(canvas, options = {}) {
    super(canvas, options);
    const device = options.device;
    if (!device) throw new Error("WebGPURenderer: 缺少 GPUDevice（可用 WebGPURenderer.create()）");
    this._device = device;
    this._label = options.label ?? "webgpu2d";
    this._alphaMode = options.alphaMode ?? "premultiplied";
    const context = this.canvas.getContext("webgpu");
    if (!context) throw new Error("WebGPURenderer: 无法获取 webgpu 上下文");
    this._context = context;
    this._format = options.format ?? "bgra8unorm";
    this._shapeModule = device.createShaderModule({ code: SHAPE_WGSL, label: `${this._label}-shape` });
    this._imageModule = device.createShaderModule({ code: IMAGE_WGSL, label: `${this._label}-image` });
    this._bindGroupLayout = device.createBindGroupLayout({
      label: `${this._label}-bind-group`,
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_VERTEX | SHADER_STAGE_FRAGMENT,
          buffer: { type: "uniform" }
        },
        { binding: 1, visibility: SHADER_STAGE_FRAGMENT, texture: { sampleType: "float" } },
        { binding: 2, visibility: SHADER_STAGE_FRAGMENT, sampler: { type: "filtering" } }
      ]
    });
    this._pipelineLayout = device.createPipelineLayout({
      label: `${this._label}-pipeline-layout`,
      bindGroupLayouts: [this._bindGroupLayout]
    });
    this._uniformBuffer = device.createBuffer({
      label: `${this._label}-uniforms`,
      size: UNIFORM_SIZE,
      usage: BUFFER_USAGE_UNIFORM | BUFFER_USAGE_COPY_DST
    });
    this._samplerLinear = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge"
    });
    this._samplerNearest = device.createSampler({
      magFilter: "nearest",
      minFilter: "nearest",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge"
    });
    this._whiteTexture = this._createWhiteTexture();
    this.initialize();
  }
  get device() {
    return this._device;
  }
  get format() {
    return this._format;
  }
  // ============================================================
  // 后端挂钩
  // ============================================================
  onResize() {
    this._endPass();
    const width = Math.max(1, this.canvas.width);
    const height = Math.max(1, this.canvas.height);
    this._context.configure({ device: this._device, format: this._format, alphaMode: this._alphaMode });
    this._depthTexture?.destroy();
    this._depthTexture = this._device.createTexture({
      label: `${this._label}-depth`,
      size: { width, height },
      format: DEPTH_STENCIL_FORMAT,
      usage: TEXTURE_USAGE_RENDER_ATTACHMENT
    });
    this._depthView = this._depthTexture.createView();
    this._quadPositions = new Float32Array([0, 0, width, 0, width, height, 0, height]);
  }
  onClear(color) {
    this._endPass();
    const rgba = color == null ? [0, 0, 0, 0] : toRGBA(color);
    const view = this._context.getCurrentTexture().createView();
    const encoder = this._device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: this._depthView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "discard",
        stencilClearValue: 0,
        stencilLoadOp: "clear",
        stencilStoreOp: "store"
      }
    });
    pass.end();
    this._device.queue.submit([encoder.finish()]);
    this._clipDepth = 0;
  }
  onClearRectDevice(x, y, width, height) {
    if (width <= 0 || height <= 0) return;
    const mesh = {
      positions: new Float32Array([x, y, x + width, y, x + width, y + height, x, y + height]),
      indices: QUAD_INDICES
    };
    this._drawShape(mesh, IDENTITY, "clear", 0, null);
  }
  submitMesh(mesh, matrix, source, opacity, blend) {
    if (isEmptyMesh(mesh)) return;
    if (isPatternPaint(source)) {
      this._drawShape(mesh, matrix, blend, opacity, source);
      return;
    }
    this._drawShape(mesh, matrix, blend, opacity, null, source);
  }
  submitImage(image, matrix, dst, uv, opacity, blend, smoothing) {
    const entry = this._texture(image);
    if (!entry) return;
    this._writeCommonUniforms(opacity);
    this._ensurePass();
    const group = this._bindGroup(entry, smoothing ? "linear" : "nearest");
    const pipeline = this._pipeline("image", blend, this._clipDepth > 0 ? "test" : "none");
    this._draw(this.imageVertices(dst, uv, matrix), QUAD_INDICES, pipeline, group, this._clipDepth);
    this._endPass();
  }
  beginClip(mesh, matrix, level) {
    if (isEmptyMesh(mesh)) return;
    this._drawShape(mesh, matrix, "clear", 1, null, null, "write", level - 1);
  }
  endClip(from, to) {
    if (from <= to) return;
    const quad = { positions: this._quadPositions, indices: QUAD_INDICES };
    for (let level = from; level > to; level--) {
      this._drawShape(quad, IDENTITY, "clear", 1, null, null, "erase", level);
    }
  }
  onFlush() {
    this._endPass();
  }
  onDispose() {
    this._endPass();
    this._vertexBuffer?.destroy();
    this._indexBuffer?.destroy();
    this._uniformBuffer.destroy();
    this._depthTexture?.destroy();
    for (const texture of this._textureSet) texture.destroy();
    this._textureSet.clear();
    this._whiteTexture.texture.destroy();
    this._context.unconfigure();
  }
  // ============================================================
  // 绘制流程
  // ============================================================
  _drawShape(mesh, matrix, blend, opacity, pattern, source, stencil = this._clipDepth > 0 ? "test" : "none", stencilReference) {
    let entry = this._whiteTexture;
    if (pattern) {
      const texture = this._texture(pattern.image);
      if (!texture) return;
      entry = texture;
    }
    const gradient = pattern ? null : resolveGradient(source ?? "transparent");
    if (!pattern && !gradient) return;
    this._writeShapeUniforms(opacity, pattern, gradient, entry);
    this._ensurePass();
    const group = this._bindGroup(entry, "linear");
    const pipeline = this._pipeline("shape", blend, stencil);
    this._draw(
      this.shapeVertices(mesh, matrix),
      mesh.indices,
      pipeline,
      group,
      stencilReference ?? this._clipDepth
    );
    this._endPass();
  }
  _draw(vertices, indices, pipeline, group, stencilReference) {
    const pass = this._pass;
    this._uploadVertices(vertices);
    this._uploadIndices(indices);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    pass.setStencilReference(stencilReference);
    pass.setVertexBuffer(0, this._vertexBuffer);
    pass.setIndexBuffer(this._indexBuffer, "uint32");
    pass.drawIndexed(indices.length);
  }
  _ensurePass() {
    if (this._pass) return this._pass;
    const view = this._context.getCurrentTexture().createView();
    const encoder = this._device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{ view, loadOp: "load", storeOp: "store" }],
      depthStencilAttachment: {
        view: this._depthView,
        depthLoadOp: "load",
        depthStoreOp: "discard",
        stencilLoadOp: "load",
        stencilStoreOp: "store"
      }
    });
    this._encoder = encoder;
    this._pass = pass;
    return pass;
  }
  _endPass() {
    if (!this._pass) return;
    const pass = this._pass;
    const encoder = this._encoder;
    this._pass = null;
    this._encoder = null;
    pass.end();
    if (encoder) this._device.queue.submit([encoder.finish()]);
  }
  // ============================================================
  // 资源
  // ============================================================
  _uploadVertices(vertices) {
    const bytes = vertices.byteLength;
    if (!this._vertexBuffer || this._vertexCapacity < bytes) {
      const size = Math.max(256, ceilTo4(bytes * 1.5));
      this._vertexBuffer?.destroy();
      this._vertexBuffer = this._device.createBuffer({
        label: `${this._label}-vertices`,
        size,
        usage: BUFFER_USAGE_VERTEX | BUFFER_USAGE_COPY_DST
      });
      this._vertexCapacity = size;
    }
    this._device.queue.writeBuffer(this._vertexBuffer, 0, vertices);
  }
  _uploadIndices(indices) {
    const bytes = indices.byteLength;
    if (!this._indexBuffer || this._indexCapacity < bytes) {
      const size = Math.max(256, ceilTo4(bytes * 1.5));
      this._indexBuffer?.destroy();
      this._indexBuffer = this._device.createBuffer({
        label: `${this._label}-indices`,
        size,
        usage: BUFFER_USAGE_INDEX | BUFFER_USAGE_COPY_DST
      });
      this._indexCapacity = size;
    }
    this._device.queue.writeBuffer(this._indexBuffer, 0, indices);
  }
  _bindGroup(entry, key) {
    let group = entry.groups.get(key);
    if (!group) {
      group = this._device.createBindGroup({
        layout: this._bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: this._uniformBuffer } },
          { binding: 1, resource: entry.view },
          { binding: 2, resource: key === "nearest" ? this._samplerNearest : this._samplerLinear }
        ]
      });
      entry.groups.set(key, group);
    }
    return group;
  }
  _createWhiteTexture() {
    const texture = this._device.createTexture({
      label: `${this._label}-white`,
      size: { width: 1, height: 1 },
      format: TEXTURE_FORMAT,
      usage: TEXTURE_USAGE_COPY_DST | TEXTURE_USAGE_TEXTURE_BINDING
    });
    this._device.queue.writeTexture(
      { texture },
      new Uint8Array([255, 255, 255, 255]),
      { bytesPerRow: 4, rowsPerImage: 1 },
      { width: 1, height: 1 }
    );
    return { texture, view: texture.createView(), width: 1, height: 1, groups: /* @__PURE__ */ new Map() };
  }
  _texture(source) {
    const cached = this._textures.get(source);
    if (cached !== void 0) return cached;
    const size = imageSize(source);
    if (!size.width || !size.height) return null;
    const width = Math.max(1, Math.round(size.width));
    const height = Math.max(1, Math.round(size.height));
    const texture = this._device.createTexture({
      label: `${this._label}-image`,
      size: { width, height },
      format: TEXTURE_FORMAT,
      usage: TEXTURE_USAGE_COPY_DST | TEXTURE_USAGE_TEXTURE_BINDING
    });
    try {
      this._device.queue.copyExternalImageToTexture({ source }, { texture }, { width, height });
    } catch {
      texture.destroy();
      this._textures.set(source, null);
      return null;
    }
    const entry = {
      texture,
      view: texture.createView(),
      width,
      height,
      groups: /* @__PURE__ */ new Map()
    };
    this._textures.set(source, entry);
    this._textureSet.add(texture);
    return entry;
  }
  // ============================================================
  // uniform
  // ============================================================
  /** 只写 resolution / opacity，供 image 管线复用同一块 uniform 缓冲 */
  _writeCommonUniforms(opacity) {
    const data = this._uniformData;
    data[0] = this.canvas.width;
    data[1] = this.canvas.height;
    data[2] = clamp01(opacity);
    data[3] = 0;
    this._device.queue.writeBuffer(this._uniformBuffer, 0, data);
  }
  /**
   * shape uniform 布局（float 偏移）：
   *   0  resolution  | 2 opacity | 3 kind
   *   4  params0     | 8 params1
   *  12  stopColors[8]
   *  44  stopA       | 48 stopB
   *  52  pattern（三列 vec3，每列补 16 字节）
   *  64  texSize     | 66 repeatMode | 67 stopCount
   */
  _writeShapeUniforms(opacity, pattern, gradient, entry) {
    const data = this._uniformData;
    const ints = this._uniformInts;
    data[0] = this.canvas.width;
    data[1] = this.canvas.height;
    data[2] = clamp01(opacity);
    ints[3] = pattern ? 4 : gradient ? gradient.kind : 0;
    if (gradient) {
      data.set(gradient.params0, 4);
      data.set(gradient.params1, 8);
      const count = Math.min(MAX_GRADIENT_STOPS, gradient.count);
      data.set(gradient.colors.subarray(0, count * 4), 12);
      for (let i = 0; i < count; i++) {
        data[44 + i] = gradient.offsets[i];
      }
      ints[67] = count;
    } else {
      data.fill(0, 4, 4 + 4);
      data.fill(0, 8, 8 + 4);
      ints[67] = 0;
    }
    if (pattern) {
      const m = pattern.transform ? Matrix2D.from(pattern.transform).invert() : IDENTITY;
      data[52] = m[0];
      data[53] = m[1];
      data[54] = 0;
      data[55] = 0;
      data[56] = m[2];
      data[57] = m[3];
      data[58] = 0;
      data[59] = 0;
      data[60] = m[4];
      data[61] = m[5];
      data[62] = 1;
      data[63] = 0;
      data[64] = entry.width;
      data[65] = entry.height;
      ints[66] = repeatCode(pattern.repetition);
    } else {
      data[64] = 1;
      data[65] = 1;
      ints[66] = 3;
    }
    this._device.queue.writeBuffer(this._uniformBuffer, 0, data);
  }
  // ============================================================
  // 管线
  // ============================================================
  _pipeline(program, blend, stencil) {
    const key = `${program}|${blend}|${stencil}`;
    const hit = this._pipelines.get(key);
    if (hit) return hit;
    const module = program === "shape" ? this._shapeModule : this._imageModule;
    const hidesColor = stencil === "write" || stencil === "erase";
    const pipeline = this._device.createRenderPipeline({
      label: `${this._label}-${key}`,
      layout: this._pipelineLayout,
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 16,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x2" },
              { shaderLocation: 1, offset: 8, format: "float32x2" }
            ]
          }
        ]
      },
      fragment: {
        module,
        entryPoint: "fs_main",
        targets: [
          {
            format: this._format,
            blend: this._blendDescriptor(blend),
            writeMask: hidesColor ? 0 : COLOR_WRITE_ALL
          }
        ]
      },
      primitive: { topology: "triangle-list", cullMode: "none" },
      depthStencil: this._depthStencil(stencil)
    });
    this._pipelines.set(key, pipeline);
    return pipeline;
  }
  _depthStencil(mode) {
    const base = {
      format: DEPTH_STENCIL_FORMAT,
      depthWriteEnabled: false,
      depthCompare: "always",
      stencilReadMask: 255
    };
    if (mode === "none") {
      return {
        ...base,
        stencilWriteMask: 0,
        stencilFront: { compare: "always", failOp: "keep", depthFailOp: "keep", passOp: "keep" },
        stencilBack: { compare: "always", failOp: "keep", depthFailOp: "keep", passOp: "keep" }
      };
    }
    if (mode === "test") {
      return {
        ...base,
        stencilWriteMask: 0,
        stencilFront: { compare: "equal", failOp: "keep", depthFailOp: "keep", passOp: "keep" },
        stencilBack: { compare: "equal", failOp: "keep", depthFailOp: "keep", passOp: "keep" }
      };
    }
    const passOp = mode === "write" ? "increment-wrap" : "decrement-wrap";
    return {
      ...base,
      stencilWriteMask: 255,
      stencilFront: { compare: "equal", failOp: "keep", depthFailOp: "keep", passOp },
      stencilBack: { compare: "equal", failOp: "keep", depthFailOp: "keep", passOp }
    };
  }
  _blendDescriptor(blend) {
    if (blend === "clear") {
      const zero = { operation: "add", srcFactor: "zero", dstFactor: "zero" };
      return { color: zero, alpha: zero };
    }
    const state = resolveBlend(blend);
    const fallback = state.equation !== "add";
    const src = fallback ? "one" : this._premultiplySource(state.src);
    const dst = fallback ? "one-minus-src-alpha" : this._factor(state.dst);
    return {
      color: { operation: "add", srcFactor: src, dstFactor: dst },
      alpha: {
        operation: "add",
        srcFactor: this._premultiplySource(state.srcAlpha),
        dstFactor: this._factor(state.dstAlpha)
      }
    };
  }
  /** 画布按预乘 alpha 合成，shader 输出的源色已乘过 alpha，源因子里的 alpha 项换成 one */
  _premultiplySource(token) {
    if (token === "src-alpha") return "one";
    if (token === "src-color") return "src";
    return this._factor(token);
  }
  _factor(token) {
    switch (token) {
      case "zero":
        return "zero";
      case "one":
        return "one";
      case "src-color":
        return "src";
      case "one-minus-src-color":
        return "one-minus-src";
      case "src-alpha":
        return "src-alpha";
      case "one-minus-src-alpha":
        return "one-minus-src-alpha";
      case "dst-color":
        return "dst";
      case "one-minus-dst-color":
        return "one-minus-dst";
      case "dst-alpha":
        return "dst-alpha";
      case "one-minus-dst-alpha":
        return "one-minus-dst-alpha";
      default:
        return "one";
    }
  }
}
function ceilTo4(value) {
  return Math.ceil(value / 4) * 4;
}
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
function repeatCode(repetition) {
  switch (repetition) {
    case "repeat":
      return 0;
    case "repeat-x":
      return 1;
    case "repeat-y":
      return 2;
    case "no-repeat":
      return 3;
    default:
      return 0;
  }
}
function toRGBA(color) {
  if (typeof color === "string") {
    const parsed = Color.fromInput(color);
    return [parsed[0], parsed[1], parsed[2], parsed[3] ?? 1];
  }
  return [color[0], color[1], color[2], color[3] ?? 1];
}
export {
  WebGPURenderer
};
