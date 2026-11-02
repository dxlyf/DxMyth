import { GLENUM, type GL, type GLBlendFactor, type GLBlendOp, type GLCompare, type GLCullMode, type GLFrontFace } from './enums.js';
import type { GLCapabilities } from './caps.js';
import type { GLStatsTracker } from './stats.js';
import {
  blendFactorToGL,
  blendOpToGL,
  compareToGL,
  cullModeToGL,
  frontFaceToGL,
} from './enums.js';

const UNKNOWN = Symbol('unknown');
type Maybe<T> = T | typeof UNKNOWN;

interface UnitState {
  texture: Maybe<WebGLTexture | null>;
  sampler: Maybe<WebGLSampler | null>;
}

export type GLVertexArrayHandle = WebGLVertexArrayObject | WebGLVertexArrayObjectOES;

interface BlendState {
  enabled: boolean;
  srcRGB: GLBlendFactor;
  dstRGB: GLBlendFactor;
  srcAlpha: GLBlendFactor;
  dstAlpha: GLBlendFactor;
  eqRGB: GLBlendOp;
  eqAlpha: GLBlendOp;
}

/**
 * Shadow copy of every piece of GL state this library mutates.
 *
 * Every setter short-circuits when the shadow value already matches, so
 * redundant native calls cannot happen as long as callers go through here.
 * Direct use of the raw context invalidates the shadow: call `invalidate()`.
 */
export class GLState {
  private readonly gl: GL;
  private readonly caps: GLCapabilities;
  private readonly stats: GLStatsTracker;
  private readonly version: 1 | 2;

  private program: Maybe<WebGLProgram | null> = UNKNOWN;
  private vao: Maybe<GLVertexArrayHandle | null> = UNKNOWN;
  private arrayBuffer: Maybe<WebGLBuffer | null> = UNKNOWN;
  private elementBuffer: Maybe<WebGLBuffer | null> = UNKNOWN;
  private framebuffer: Maybe<WebGLFramebuffer | null> = UNKNOWN;

  private activeUnit: number | undefined;
  private readonly units: UnitState[] = [];
  private readonly uniformBuffers: Array<
    { buffer: WebGLBuffer; offset: number; size: number } | undefined
  > = [];

  private capabilities = new Map<number, boolean>();

  private blend: Maybe<BlendState> = UNKNOWN;
  private blendColor: Maybe<readonly [number, number, number, number]> = UNKNOWN;

  private depthTest: Maybe<boolean> = UNKNOWN;
  private depthMask: Maybe<boolean> = UNKNOWN;
  private depthFunc: Maybe<GLCompare> = UNKNOWN;
  private depthRange: Maybe<readonly [number, number]> = UNKNOWN;

  private cullEnabled: Maybe<boolean> = UNKNOWN;
  private cullMode: Maybe<GLCullMode> = UNKNOWN;
  private frontFace: Maybe<GLFrontFace> = UNKNOWN;

  private viewport: Maybe<readonly [number, number, number, number]> = UNKNOWN;
  private scissor: Maybe<readonly [number, number, number, number] | null> = UNKNOWN;

  private colorMask: Maybe<readonly [boolean, boolean, boolean, boolean]> = UNKNOWN;
  private polygonOffset: Maybe<readonly [number, number]> = UNKNOWN;

  private unpackFlipY: Maybe<boolean> = UNKNOWN;
  private unpackPremultiply: Maybe<boolean> = UNKNOWN;
  private unpackAlignment: Maybe<number> = UNKNOWN;
  private packAlignment: Maybe<number> = UNKNOWN;

  constructor(gl: GL, version: 1 | 2, caps: GLCapabilities, stats: GLStatsTracker) {
    this.gl = gl;
    this.version = version;
    this.caps = caps;
    this.stats = stats;
  }

  get currentProgram(): WebGLProgram | null {
    return this.program === UNKNOWN ? null : this.program;
  }

  get currentFramebuffer(): WebGLFramebuffer | null {
    return this.framebuffer === UNKNOWN ? null : this.framebuffer;
  }

  get currentArrayBuffer(): WebGLBuffer | null {
    return this.arrayBuffer === UNKNOWN ? null : this.arrayBuffer;
  }

  get currentElementBuffer(): WebGLBuffer | null {
    return this.elementBuffer === UNKNOWN ? null : this.elementBuffer;
  }

  get currentVao(): GLVertexArrayHandle | null {
    return this.vao === UNKNOWN ? null : this.vao;
  }

  get glVersion(): 1 | 2 {
    return this.version;
  }

  private hit(): void {
    this.stats.stateChanges++;
  }

  private miss(): void {
    this.stats.redundantStateSkipped++;
  }

  useProgram(program: WebGLProgram | null): void {
    if (this.program === program) {
      this.miss();
      return;
    }
    this.gl.useProgram(program);
    this.program = program;
    this.stats.programSwitches++;
    this.hit();
  }

  bindVertexArray(vao: GLVertexArrayHandle | null): void {
    if (this.vao === vao) {
      this.miss();
      return;
    }
    if (this.version === 2) {
      (this.gl as WebGL2RenderingContext).bindVertexArray(vao as WebGLVertexArrayObject | null);
    } else {
      const ext = this.caps.extension<{ bindVertexArrayOES(v: WebGLVertexArrayObjectOES | null): void }>(
        'OES_vertex_array_object',
      );
      if (!ext) throw new Error('OES_vertex_array_object is missing');
      ext.bindVertexArrayOES(vao as WebGLVertexArrayObjectOES | null);
    }
    this.vao = vao;
    // The element array binding is part of VAO state.
    this.elementBuffer = UNKNOWN;
    this.hit();
  }

  bindArrayBuffer(buffer: WebGLBuffer | null): void {
    if (this.arrayBuffer === buffer) {
      this.miss();
      return;
    }
    this.gl.bindBuffer(GLENUM.ARRAY_BUFFER, buffer);
    this.arrayBuffer = buffer;
    this.hit();
  }

  bindElementBuffer(buffer: WebGLBuffer | null): void {
    if (this.elementBuffer === buffer) {
      this.miss();
      return;
    }
    this.gl.bindBuffer(GLENUM.ELEMENT_ARRAY_BUFFER, buffer);
    this.elementBuffer = buffer;
    this.hit();
  }

  bindFramebuffer(framebuffer: WebGLFramebuffer | null): void {
    if (this.framebuffer === framebuffer) {
      this.miss();
      return;
    }
    this.gl.bindFramebuffer(GLENUM.FRAMEBUFFER, framebuffer);
    this.framebuffer = framebuffer;
    this.hit();
  }

  activeTexture(unit: number): void {
    if (this.activeUnit === unit) return;
    this.gl.activeTexture(GLENUM.TEXTURE0 + unit);
    this.activeUnit = unit;
    this.hit();
  }

  private unit(index: number): UnitState {
    let state = this.units[index];
    if (!state) {
      state = { texture: UNKNOWN, sampler: UNKNOWN };
      this.units[index] = state;
    }
    return state;
  }

  bindTexture(unit: number, texture: WebGLTexture | null): void {
    const state = this.unit(unit);
    this.activeTexture(unit);
    if (state.texture === texture) {
      this.miss();
      return;
    }
    this.gl.bindTexture(GLENUM.TEXTURE_2D, texture);
    state.texture = texture;
    this.hit();
  }

  /** Deleting a texture re-binds null on every unit, so forget the cached values. */
  forgetTexture(texture: WebGLTexture): void {
    for (const unit of this.units) {
      if (unit.texture === texture) unit.texture = UNKNOWN;
    }
  }

  bindSampler(unit: number, sampler: WebGLSampler | null): void {
    if (this.version !== 2) return;
    const state = this.unit(unit);
    if (state.sampler === sampler) {
      this.miss();
      return;
    }
    (this.gl as WebGL2RenderingContext).bindSampler(unit, sampler);
    state.sampler = sampler;
    this.hit();
  }

  bindUniformBuffer(point: number, buffer: WebGLBuffer, offset: number, size: number): void {
    if (this.version !== 2) return;
    const current = this.uniformBuffers[point];
    if (
      current !== undefined &&
      current.buffer === buffer &&
      current.offset === offset &&
      current.size === size
    ) {
      this.miss();
      return;
    }
    (this.gl as WebGL2RenderingContext).bindBufferRange(GLENUM.UNIFORM_BUFFER, point, buffer, offset, size);
    this.uniformBuffers[point] = { buffer, offset, size };
    this.hit();
  }

  forgetUniformBuffer(buffer: WebGLBuffer): void {
    for (let i = 0; i < this.uniformBuffers.length; i++) {
      if (this.uniformBuffers[i]?.buffer === buffer) this.uniformBuffers[i] = undefined;
    }
  }

  private setCapability(cap: number, enabled: boolean): void {
    const current = this.capabilities.get(cap);
    if (current === enabled) {
      this.miss();
      return;
    }
    if (enabled) this.gl.enable(cap);
    else this.gl.disable(cap);
    this.capabilities.set(cap, enabled);
    this.hit();
  }

  setBlend(
    enabled: boolean,
    srcRGB: GLBlendFactor,
    dstRGB: GLBlendFactor,
    srcAlpha: GLBlendFactor,
    dstAlpha: GLBlendFactor,
    eqRGB: GLBlendOp,
    eqAlpha: GLBlendOp,
    color?: readonly [number, number, number, number],
  ): void {
    this.setCapability(GLENUM.BLEND, enabled);
    if (!enabled) return;

    const current = this.blend;
    let changed = false;
    if (
      current === UNKNOWN ||
      current.srcRGB !== srcRGB ||
      current.dstRGB !== dstRGB ||
      current.srcAlpha !== srcAlpha ||
      current.dstAlpha !== dstAlpha
    ) {
      this.gl.blendFuncSeparate(
        blendFactorToGL(srcRGB),
        blendFactorToGL(dstRGB),
        blendFactorToGL(srcAlpha),
        blendFactorToGL(dstAlpha),
      );
      this.hit();
      changed = true;
    }
    if (current === UNKNOWN || current.eqRGB !== eqRGB || current.eqAlpha !== eqAlpha) {
      this.gl.blendEquationSeparate(blendOpToGL(eqRGB), blendOpToGL(eqAlpha));
      this.hit();
      changed = true;
    }
    if (changed) {
      this.blend = { enabled: true, srcRGB, dstRGB, srcAlpha, dstAlpha, eqRGB, eqAlpha };
    } else {
      this.miss();
    }

    if (color) {
      const previous = this.blendColor;
      if (
        previous === UNKNOWN ||
        previous[0] !== color[0] ||
        previous[1] !== color[1] ||
        previous[2] !== color[2] ||
        previous[3] !== color[3]
      ) {
        this.gl.blendColor(color[0], color[1], color[2], color[3]);
        this.blendColor = color;
        this.hit();
      }
    }
  }

  disableBlend(): void {
    this.setCapability(GLENUM.BLEND, false);
    this.blend = { enabled: false, srcRGB: 'one', dstRGB: 'zero', srcAlpha: 'one', dstAlpha: 'zero', eqRGB: 'add', eqAlpha: 'add' };
  }

  setDepthTest(enabled: boolean): void {
    if (this.depthTest === enabled) {
      this.miss();
      return;
    }
    this.setCapability(GLENUM.DEPTH_TEST, enabled);
    this.depthTest = enabled;
  }

  setDepthMask(write: boolean): void {
    if (this.depthMask === write) {
      this.miss();
      return;
    }
    this.gl.depthMask(write);
    this.depthMask = write;
    this.hit();
  }

  setDepthFunc(compare: GLCompare): void {
    if (this.depthFunc === compare) {
      this.miss();
      return;
    }
    this.gl.depthFunc(compareToGL(compare));
    this.depthFunc = compare;
    this.hit();
  }

  setDepthRange(near: number, far: number): void {
    const current = this.depthRange;
    if (current !== UNKNOWN && current[0] === near && current[1] === far) {
      this.miss();
      return;
    }
    this.gl.depthRange(near, far);
    this.depthRange = [near, far];
    this.hit();
  }

  setCull(mode: GLCullMode): void {
    const enabled = mode !== 'none';
    this.setCapability(GLENUM.CULL_FACE, enabled);
    if (!enabled) return;
    if (this.cullMode === mode) {
      this.miss();
      return;
    }
    this.gl.cullFace(cullModeToGL(mode));
    this.cullMode = mode;
    this.hit();
  }

  setFrontFace(face: GLFrontFace): void {
    if (this.frontFace === face) {
      this.miss();
      return;
    }
    this.gl.frontFace(frontFaceToGL(face));
    this.frontFace = face;
    this.hit();
  }

  setViewport(x: number, y: number, width: number, height: number): void {
    const current = this.viewport;
    if (current !== UNKNOWN && current[0] === x && current[1] === y && current[2] === width && current[3] === height) {
      this.miss();
      return;
    }
    this.gl.viewport(x, y, width, height);
    this.viewport = [x, y, width, height];
    this.hit();
  }

  setScissor(rect: readonly [number, number, number, number] | null): void {
    this.setCapability(GLENUM.SCISSOR_TEST, rect !== null);
    if (rect === null) {
      this.scissor = null;
      return;
    }
    const current = this.scissor;
    if (current !== UNKNOWN && current !== null && current[0] === rect[0] && current[1] === rect[1] && current[2] === rect[2] && current[3] === rect[3]) {
      this.miss();
      return;
    }
    this.gl.scissor(rect[0], rect[1], rect[2], rect[3]);
    this.scissor = rect;
    this.hit();
  }

  setColorMask(r: boolean, g: boolean, b: boolean, a: boolean): void {
    const current = this.colorMask;
    if (current !== UNKNOWN && current[0] === r && current[1] === g && current[2] === b && current[3] === a) {
      this.miss();
      return;
    }
    this.gl.colorMask(r, g, b, a);
    this.colorMask = [r, g, b, a];
    this.hit();
  }

  setPolygonOffset(factor: number, units: number): void {
    const current = this.polygonOffset;
    this.setCapability(GLENUM.POLYGON_OFFSET_FILL, true);
    if (current !== UNKNOWN && current[0] === factor && current[1] === units) {
      this.miss();
      return;
    }
    this.gl.polygonOffset(factor, units);
    this.polygonOffset = [factor, units];
    this.hit();
  }

  disablePolygonOffset(): void {
    this.setCapability(GLENUM.POLYGON_OFFSET_FILL, false);
  }

  setUnpack(flipY: boolean, premultiplyAlpha: boolean, alignment: number): void {
    if (this.unpackFlipY !== flipY) {
      this.gl.pixelStorei(GLENUM.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
      this.unpackFlipY = flipY;
      this.hit();
    }
    if (this.unpackPremultiply !== premultiplyAlpha) {
      this.gl.pixelStorei(GLENUM.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha ? 1 : 0);
      this.unpackPremultiply = premultiplyAlpha;
      this.hit();
    }
    if (this.unpackAlignment !== alignment) {
      this.gl.pixelStorei(GLENUM.UNPACK_ALIGNMENT, alignment);
      this.unpackAlignment = alignment;
      this.hit();
    }
  }

  setPackAlignment(alignment: number): void {
    if (this.packAlignment === alignment) return;
    this.gl.pixelStorei(GLENUM.PACK_ALIGNMENT, alignment);
    this.packAlignment = alignment;
    this.hit();
  }

  /** Forget everything. The next setter always reaches the native context. */
  invalidate(): void {
    this.program = UNKNOWN;
    this.vao = UNKNOWN;
    this.arrayBuffer = UNKNOWN;
    this.elementBuffer = UNKNOWN;
    this.framebuffer = UNKNOWN;
    this.activeUnit = undefined;
    this.units.length = 0;
    this.uniformBuffers.length = 0;
    this.capabilities.clear();
    this.blend = UNKNOWN;
    this.blendColor = UNKNOWN;
    this.depthTest = UNKNOWN;
    this.depthMask = UNKNOWN;
    this.depthFunc = UNKNOWN;
    this.depthRange = UNKNOWN;
    this.cullEnabled = UNKNOWN;
    this.cullMode = UNKNOWN;
    this.frontFace = UNKNOWN;
    this.viewport = UNKNOWN;
    this.scissor = UNKNOWN;
    this.colorMask = UNKNOWN;
    this.polygonOffset = UNKNOWN;
    this.unpackFlipY = UNKNOWN;
    this.unpackPremultiply = UNKNOWN;
    this.unpackAlignment = UNKNOWN;
    this.packAlignment = UNKNOWN;
  }
}
