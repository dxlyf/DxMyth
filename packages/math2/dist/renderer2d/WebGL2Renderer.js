import { Color } from "../math/Color.js";
import { Matrix2D } from "../math/Matrix2D.js";
import { isEmptyMesh } from "./geometry.js";
import { isPatternPaint } from "./Paint.js";
import { GPU2DRenderer, resolveGradient, resolveBlend } from "./GPU2DRenderer.js";
import { imageSize } from "./CanvasRenderer.js";
const QUAD_INDICES = new Uint32Array([0, 1, 2, 0, 2, 3]);
const IDENTITY = Matrix2D.identity();
const SHAPE_VS = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_local;
uniform vec2 u_resolution;
out vec2 v_local;
void main() {
    vec2 clip = a_position / u_resolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_local = a_local;
}`;
const SHAPE_FS = `#version 300 es
precision highp float;

in vec2 v_local;

uniform int u_kind;
uniform vec4 u_params0;
uniform vec4 u_params1;
uniform int u_stopCount;
uniform vec4 u_stopColors[8];
uniform float u_stopOffsets[8];
uniform float u_opacity;
uniform sampler2D u_texture;
uniform mat3 u_patternMatrix;
uniform vec2 u_texSize;
uniform int u_repeat;

out vec4 outColor;

vec4 sampleStops(float t) {
    if (u_stopCount <= 0) return vec4(0.0);
    vec4 prevColor = u_stopColors[0];
    float prevOffset = u_stopOffsets[0];
    if (u_stopCount == 1) return prevColor;
    for (int i = 1; i < 8; i++) {
        if (i >= u_stopCount) break;
        float offset = u_stopOffsets[i];
        vec4 color = u_stopColors[i];
        if (t <= offset) {
            float span = max(offset - prevOffset, 1e-6);
            return mix(prevColor, color, clamp((t - prevOffset) / span, 0.0, 1.0));
        }
        prevColor = color;
        prevOffset = offset;
    }
    return prevColor;
}

vec4 linearGradient() {
    vec2 p0 = u_params0.xy;
    vec2 d = u_params0.zw - p0;
    float len2 = dot(d, d);
    float t = len2 > 1e-6 ? dot(v_local - p0, d) / len2 : 0.0;
    return sampleStops(t);
}

vec4 radialGradient() {
    vec2 c0 = u_params0.xy;
    float r0 = u_params0.z;
    vec2 c1 = u_params1.xy;
    float r1 = u_params1.z;
    vec2 d = c1 - c0;
    float dr = r1 - r0;
    vec2 pc = v_local - c0;
    float a = dot(d, d) - dr * dr;
    float b = -2.0 * (dot(pc, d) + r0 * dr);
    float c = dot(pc, pc) - r0 * r0;
    float t = 0.0;
    if (abs(a) < 1e-6) {
        t = abs(b) > 1e-6 ? -c / b : 0.0;
    } else {
        float disc = b * b - 4.0 * a * c;
        if (disc >= 0.0) {
            float sq = sqrt(disc);
            float t0 = (-b + sq) / (2.0 * a);
            float t1 = (-b - sq) / (2.0 * a);
            float lo = min(t0, t1);
            float hi = max(t0, t1);
            t = lo >= 0.0 ? lo : hi;
        }
    }
    return sampleStops(t);
}

vec4 conicGradient() {
    vec2 d = v_local - u_params0.xy;
    float angle = atan(d.y, d.x);
    return sampleStops(fract((angle - u_params0.z) / 6.283185307179586));
}

vec4 patternColor() {
    vec3 p = u_patternMatrix * vec3(v_local, 1.0);
    vec2 uv = p.xy / max(u_texSize, vec2(1.0));
    if (u_repeat == 0) {
        uv = fract(uv);
    } else if (u_repeat == 1) {
        uv = vec2(fract(uv.x), clamp(uv.y, 0.0, 1.0));
    } else if (u_repeat == 2) {
        uv = vec2(clamp(uv.x, 0.0, 1.0), fract(uv.y));
    } else if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
        discard;
    }
    return texture(u_texture, uv);
}

void main() {
    vec4 color;
    if (u_kind == 1) {
        color = linearGradient();
    } else if (u_kind == 2) {
        color = radialGradient();
    } else if (u_kind == 3) {
        color = conicGradient();
    } else if (u_kind == 4) {
        color = patternColor();
    } else {
        color = u_params0;
    }
    color.a *= u_opacity;
    if (color.a <= 0.0) discard;
    outColor = color;
}`;
const IMAGE_VS = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_uv;
uniform vec2 u_resolution;
out vec2 v_uv;
void main() {
    vec2 clip = a_position / u_resolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_uv = a_uv;
}`;
const IMAGE_FS = `#version 300 es
precision mediump float;

in vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_opacity;
out vec4 outColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    color.a *= u_opacity;
    if (color.a <= 0.0) discard;
    outColor = color;
}`;
class WebGL2Renderer extends GPU2DRenderer {
  _gl;
  _shapeProgram;
  _imageProgram;
  _vao;
  _vbo;
  _ibo;
  _shapeLoc = /* @__PURE__ */ new Map();
  _imageLoc = /* @__PURE__ */ new Map();
  _textures = /* @__PURE__ */ new WeakMap();
  _textureSet = /* @__PURE__ */ new Set();
  _patternMatrix = new Float32Array(9);
  _blendKey = "";
  _quadMesh = { positions: new Float32Array(8), indices: QUAD_INDICES };
  constructor(canvas, options = {}) {
    super(canvas, options);
    const attributes = {
      alpha: true,
      antialias: options.antialias ?? true,
      depth: false,
      stencil: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
      powerPreference: options.powerPreference ?? "default",
      ...options.contextAttributes
    };
    const gl = this.canvas.getContext(
      "webgl2",
      attributes
    );
    if (!gl) throw new Error("WebGL2Renderer: 当前环境不支持 WebGL2");
    this._gl = gl;
    this._initResources();
    this.initialize();
  }
  get gl() {
    return this._gl;
  }
  // ============================================================
  // 资源初始化
  // ============================================================
  _initResources() {
    const gl = this._gl;
    this._shapeProgram = this._link(SHAPE_VS, SHAPE_FS);
    this._imageProgram = this._link(IMAGE_VS, IMAGE_FS);
    for (const name of [
      "u_resolution",
      "u_kind",
      "u_params0",
      "u_params1",
      "u_stopCount",
      "u_stopColors[0]",
      "u_stopOffsets[0]",
      "u_opacity",
      "u_texture",
      "u_patternMatrix",
      "u_texSize",
      "u_repeat"
    ]) {
      this._shapeLoc.set(name, gl.getUniformLocation(this._shapeProgram, name));
    }
    for (const name of ["u_resolution", "u_texture", "u_opacity"]) {
      this._imageLoc.set(name, gl.getUniformLocation(this._imageProgram, name));
    }
    this._vbo = gl.createBuffer();
    this._ibo = gl.createBuffer();
    this._vao = gl.createVertexArray();
    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
    gl.bindVertexArray(null);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.SCISSOR_TEST);
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    this._applyBlend("source-over");
  }
  _link(vertexSource, fragmentSource) {
    const gl = this._gl;
    const program = gl.createProgram();
    const vertex = this._compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = this._compile(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`WebGL2Renderer: shader 链接失败
${log ?? ""}`);
    }
    return program;
  }
  _compile(type, source) {
    const gl = this._gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`WebGL2Renderer: shader 编译失败
${log ?? ""}`);
    }
    return shader;
  }
  // ============================================================
  // 后端挂钩
  // ============================================================
  onResize() {
    const gl = this._gl;
    const width = this.canvas.width;
    const height = this.canvas.height;
    gl.viewport(0, 0, width, height);
    this._quadMesh = {
      positions: new Float32Array([0, 0, width, 0, width, height, 0, height]),
      indices: QUAD_INDICES
    };
  }
  onClear(color) {
    const gl = this._gl;
    if (color == null) gl.clearColor(0, 0, 0, 0);
    else {
      const rgba = toRGBA(color);
      gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    }
    gl.disable(gl.SCISSOR_TEST);
    gl.colorMask(true, true, true, true);
    gl.stencilMask(255);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    this._clipDepth = 0;
    this._applyClipState();
  }
  onClearRectDevice(x, y, width, height) {
    if (width <= 0 || height <= 0) return;
    const gl = this._gl;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(Math.floor(x), this.canvas.height - Math.ceil(y) - Math.ceil(height), Math.ceil(width), Math.ceil(height));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
  }
  submitMesh(mesh, matrix, source, opacity, blend) {
    if (isEmptyMesh(mesh)) return;
    const gl = this._gl;
    this._applyClipState();
    this._applyBlend(blend);
    this._prepareShape(opacity);
    if (isPatternPaint(source)) {
      const texture = this._texture(source.image);
      if (!texture) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      this._setPatternMatrix(source);
      gl.uniform1i(this._loc(this._shapeLoc, "u_kind"), 4);
      gl.uniform1i(this._loc(this._shapeLoc, "u_texture"), 0);
      gl.uniform2f(this._loc(this._shapeLoc, "u_texSize"), texture.width, texture.height);
      gl.uniform1i(this._loc(this._shapeLoc, "u_repeat"), repeatCode(source.repetition));
      gl.uniformMatrix3fv(this._loc(this._shapeLoc, "u_patternMatrix"), false, this._patternMatrix);
      this._drawMesh(mesh, matrix);
      return;
    }
    const gradient = resolveGradient(source);
    if (!gradient) return;
    gl.uniform1i(this._loc(this._shapeLoc, "u_kind"), gradient.kind);
    gl.uniform4fv(this._loc(this._shapeLoc, "u_params0"), gradient.params0);
    gl.uniform4fv(this._loc(this._shapeLoc, "u_params1"), gradient.params1);
    gl.uniform1i(this._loc(this._shapeLoc, "u_stopCount"), gradient.count);
    if (gradient.count > 0) {
      gl.uniform4fv(this._loc(this._shapeLoc, "u_stopColors[0]"), gradient.colors);
      gl.uniform1fv(this._loc(this._shapeLoc, "u_stopOffsets[0]"), gradient.offsets);
    }
    this._drawMesh(mesh, matrix);
  }
  submitImage(image, matrix, dst, uv, opacity, blend, smoothing) {
    const texture = this._texture(image);
    if (!texture) return;
    const gl = this._gl;
    this._applyClipState();
    this._applyBlend(blend);
    gl.useProgram(this._imageProgram);
    gl.uniform2f(this._loc(this._imageLoc, "u_resolution"), this.canvas.width, this.canvas.height);
    gl.uniform1f(this._loc(this._imageLoc, "u_opacity"), clamp01(opacity));
    gl.uniform1i(this._loc(this._imageLoc, "u_texture"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
    const filter = smoothing ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    this._upload(this.imageVertices(dst, uv, matrix), QUAD_INDICES);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
  }
  beginClip(mesh, matrix, level) {
    if (isEmptyMesh(mesh)) {
      this._applyClipState();
      return;
    }
    const gl = this._gl;
    gl.enable(gl.STENCIL_TEST);
    gl.stencilMask(255);
    gl.stencilFunc(gl.EQUAL, level - 1, 255);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR_WRAP);
    gl.colorMask(false, false, false, false);
    this._prepareShape(1);
    gl.uniform1i(this._loc(this._shapeLoc, "u_kind"), 0);
    gl.uniform4f(this._loc(this._shapeLoc, "u_params0"), 0, 0, 0, 1);
    gl.uniform1i(this._loc(this._shapeLoc, "u_stopCount"), 0);
    this._drawMesh(mesh, matrix);
    gl.colorMask(true, true, true, true);
    this._applyClipState();
  }
  endClip(from, to) {
    const gl = this._gl;
    if (from > to) {
      gl.enable(gl.STENCIL_TEST);
      gl.stencilMask(255);
      gl.colorMask(false, false, false, false);
      this._prepareShape(1);
      gl.uniform1i(this._loc(this._shapeLoc, "u_kind"), 0);
      gl.uniform4f(this._loc(this._shapeLoc, "u_params0"), 0, 0, 0, 1);
      gl.uniform1i(this._loc(this._shapeLoc, "u_stopCount"), 0);
      for (let level = from; level > to; level--) {
        gl.stencilFunc(gl.EQUAL, level, 255);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR_WRAP);
        this._drawMesh(this._quadMesh, IDENTITY);
      }
      gl.colorMask(true, true, true, true);
    }
    this._applyClipState();
  }
  onFlush() {
    this._gl.flush();
  }
  onDispose() {
    const gl = this._gl;
    gl.useProgram(null);
    gl.deleteProgram(this._shapeProgram);
    gl.deleteProgram(this._imageProgram);
    gl.bindVertexArray(null);
    gl.deleteVertexArray(this._vao);
    gl.deleteBuffer(this._vbo);
    gl.deleteBuffer(this._ibo);
    for (const texture of this._textureSet) gl.deleteTexture(texture);
    this._textureSet.clear();
  }
  // ============================================================
  // 内部工具
  // ============================================================
  _loc(map, name) {
    return map.get(name) ?? null;
  }
  _prepareShape(opacity) {
    const gl = this._gl;
    gl.useProgram(this._shapeProgram);
    gl.uniform2f(this._loc(this._shapeLoc, "u_resolution"), this.canvas.width, this.canvas.height);
    gl.uniform1f(this._loc(this._shapeLoc, "u_opacity"), clamp01(opacity));
  }
  _drawMesh(mesh, matrix) {
    const gl = this._gl;
    this._upload(this.shapeVertices(mesh, matrix), mesh.indices);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
  }
  _upload(vertices, indices) {
    const gl = this._gl;
    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
  }
  _applyBlend(blend) {
    const gl = this._gl;
    const state = resolveBlend(blend);
    const key = `${state.equation}|${state.src}|${state.dst}|${state.srcAlpha}|${state.dstAlpha}`;
    if (key === this._blendKey) return;
    this._blendKey = key;
    gl.blendEquation(
      state.equation === "min" ? gl.MIN : state.equation === "max" ? gl.MAX : gl.FUNC_ADD
    );
    gl.blendFuncSeparate(
      this._factor(state.src),
      this._factor(state.dst),
      this._factor(state.srcAlpha),
      this._factor(state.dstAlpha)
    );
  }
  _factor(token) {
    const gl = this._gl;
    switch (token) {
      case "zero":
        return gl.ZERO;
      case "one":
        return gl.ONE;
      case "src-color":
        return gl.SRC_COLOR;
      case "one-minus-src-color":
        return gl.ONE_MINUS_SRC_COLOR;
      case "src-alpha":
        return gl.SRC_ALPHA;
      case "one-minus-src-alpha":
        return gl.ONE_MINUS_SRC_ALPHA;
      case "dst-color":
        return gl.DST_COLOR;
      case "one-minus-dst-color":
        return gl.ONE_MINUS_DST_COLOR;
      case "dst-alpha":
        return gl.DST_ALPHA;
      case "one-minus-dst-alpha":
        return gl.ONE_MINUS_DST_ALPHA;
      default:
        return gl.ONE;
    }
  }
  _applyClipState() {
    const gl = this._gl;
    if (this._clipDepth > 0) {
      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.EQUAL, this._clipDepth, 255);
      gl.stencilMask(0);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    } else {
      gl.disable(gl.STENCIL_TEST);
      gl.stencilMask(255);
    }
  }
  _setPatternMatrix(pattern) {
    const source = pattern.transform;
    if (!source) {
      this._patternMatrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
      return;
    }
    const m = Matrix2D.from(source).invert();
    this._patternMatrix[0] = m[0];
    this._patternMatrix[1] = m[1];
    this._patternMatrix[2] = 0;
    this._patternMatrix[3] = m[2];
    this._patternMatrix[4] = m[3];
    this._patternMatrix[5] = 0;
    this._patternMatrix[6] = m[4];
    this._patternMatrix[7] = m[5];
    this._patternMatrix[8] = 1;
  }
  _texture(source) {
    const cached = this._textures.get(source);
    if (cached !== void 0) return cached;
    const size = imageSize(source);
    if (!size.width || !size.height) return null;
    const gl = this._gl;
    const texture = gl.createTexture();
    if (!texture) return null;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
      );
    } catch {
      gl.deleteTexture(texture);
      this._textures.set(source, null);
      return null;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const entry = { texture, width: size.width, height: size.height };
    this._textures.set(source, entry);
    this._textureSet.add(texture);
    return entry;
  }
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
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
export {
  WebGL2Renderer
};
