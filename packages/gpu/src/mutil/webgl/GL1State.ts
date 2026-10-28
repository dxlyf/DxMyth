import {
  GL_BLEND,
  GL_COLOR_BUFFER_BIT,
  GL_CULL_FACE,
  GL_DEPTH_BUFFER_BIT,
  GL_DEPTH_TEST,
  GL_DITHER,
  GL_ELEMENT_ARRAY_BUFFER,
  GL_FRAMEBUFFER,
  GL_POLYGON_OFFSET_FILL,
  GL_SCISSOR_TEST,
  GL_STENCIL_BUFFER_BIT,
  GL_STENCIL_TEST,
  GL_TEXTURE0,
  GL_TEXTURE_2D,
  GL_UNPACK_ALIGNMENT,
  GL_UNPACK_FLIP_Y_WEBGL,
  GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL,
  GL_ALWAYS,
  GL_KEEP,
  GL_LESS,
  GL_ONE,
  GL_ZERO,
} from './constants.js';
import { blendEquation, blendFactor, compareFunc, cullFace, frontFace, stencilOp } from './mappings.js';
import { GL1Error } from './errors.js';
import type {
  GL1BlendState,
  GL1BufferRef,
  GL1ClearOptions,
  GL1CullState,
  GL1DepthState,
  GL1PipelineState,
  GL1StencilState,
  GL1Stats,
  GL1TextureRef,
} from './types.js';

/** WebGL defaults, so the very first state application can be a no-op. */
const DEFAULT_CAPS = new Map<number, boolean>([[GL_DITHER, true]]);

const EMPTY_TEXTURES: ReadonlyMap<number, WebGLTexture | null> = new Map();

export class GL1State {
  readonly gl: WebGLRenderingContext;
  readonly stats: GL1Stats;

  private caps = new Map<number, boolean>();
  private colorMask: [boolean, boolean, boolean, boolean] = [true, true, true, true];
  private depthMask = true;
  private stencilWriteMask = 0x7fffffff;
  private viewport: [number, number, number, number] | null = null;
  private scissorBox: [number, number, number, number] | null = null;
  private scissorEnabled = false;
  private clearColor: [number, number, number, number] = [0, 0, 0, 0];
  private clearDepthValue = 1;
  private clearStencilValue = 0;
  private blendSrcRGB = GL_ONE;
  private blendDstRGB = GL_ZERO;
  private blendSrcAlpha = GL_ONE;
  private blendDstAlpha = GL_ZERO;
  private blendEquationRGB = 0x8006;
  private blendEquationAlpha = 0x8006;
  private blendColorValue: [number, number, number, number] = [0, 0, 0, 0];
  private depthFuncValue = GL_LESS;
  private depthRangeValue: [number, number] = [0, 1];
  private cullFaceValue = 0x0405;
  private frontFaceValue = 0x0901;
  private stencilFunc = GL_ALWAYS;
  private stencilRef = 0;
  private stencilReadMask = 0x7fffffff;
  private stencilFail = GL_KEEP;
  private stencilDepthFail = GL_KEEP;
  private stencilPass = GL_KEEP;
  private program: WebGLProgram | null = null;
  private arrayBuffer: WebGLBuffer | null = null;
  private elementBuffer: WebGLBuffer | null = null;
  private framebuffer: WebGLFramebuffer | null = null;
  private textureUnits = new Map<number, ReadonlyMap<number, WebGLTexture | null>>();
  private activeUnit = 0;
  private unpackFlipY = false;
  private unpackPremultiply = false;
  private unpackAlignment = 4;
  private attribDivisors = new Map<number, number>();

  constructor(gl: WebGLRenderingContext, stats: GL1Stats) {
    this.gl = gl;
    this.stats = stats;
  }

  // ---------------------------------------------------------------- pipeline

  /** Apply a partial pipeline description; omitted fields keep their value. */
  applyPipeline(pipeline: GL1PipelineState | undefined): void {
    if (!pipeline) return;
    if (pipeline.blend) this.setBlend(pipeline.blend);
    if (pipeline.depth) this.setDepth(pipeline.depth);
    if (pipeline.cull) this.setCull(pipeline.cull);
    if (pipeline.stencil) this.setStencil(pipeline.stencil);
    if (pipeline.colorMask) this.setColorMask(pipeline.colorMask);
    if (pipeline.depthMask !== undefined) this.setDepthMask(pipeline.depthMask);
    if (pipeline.polygonOffset) this.setPolygonOffset(pipeline.polygonOffset);
  }

  setBlend(desc: GL1BlendState): void {
    this.stats.stateCalls++;
    this.setCapability(GL_BLEND, desc.enabled);
    if (!desc.enabled) return;
    const srcRGB = desc.srcRGB ? blendFactor(desc.srcRGB) : this.blendSrcRGB;
    const dstRGB = desc.dstRGB ? blendFactor(desc.dstRGB) : this.blendDstRGB;
    const srcAlpha = desc.srcAlpha ? blendFactor(desc.srcAlpha) : this.blendSrcAlpha;
    const dstAlpha = desc.dstAlpha ? blendFactor(desc.dstAlpha) : this.blendDstAlpha;
    if (srcRGB !== this.blendSrcRGB || dstRGB !== this.blendDstRGB || srcAlpha !== this.blendSrcAlpha || dstAlpha !== this.blendDstAlpha) {
      this.gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
      this.stats.glCalls++;
      this.blendSrcRGB = srcRGB;
      this.blendDstRGB = dstRGB;
      this.blendSrcAlpha = srcAlpha;
      this.blendDstAlpha = dstAlpha;
    } else {
      this.stats.stateSkipped++;
    }
    const eqRGB = desc.equationRGB ? blendEquation(desc.equationRGB) : this.blendEquationRGB;
    const eqAlpha = desc.equationAlpha ? blendEquation(desc.equationAlpha) : this.blendEquationAlpha;
    if (eqRGB !== this.blendEquationRGB || eqAlpha !== this.blendEquationAlpha) {
      this.gl.blendEquationSeparate(eqRGB, eqAlpha);
      this.stats.glCalls++;
      this.blendEquationRGB = eqRGB;
      this.blendEquationAlpha = eqAlpha;
    } else {
      this.stats.stateSkipped++;
    }
    if (desc.color) this.setBlendColor(desc.color);
  }

  setBlendColor(color: readonly [number, number, number, number]): void {
    this.stats.stateCalls++;
    const c = this.blendColorValue;
    if (c[0] === color[0] && c[1] === color[1] && c[2] === color[2] && c[3] === color[3]) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.blendColor(color[0], color[1], color[2], color[3]);
    this.stats.glCalls++;
    c[0] = color[0];
    c[1] = color[1];
    c[2] = color[2];
    c[3] = color[3];
  }

  setDepth(desc: GL1DepthState): void {
    this.stats.stateCalls++;
    if (desc.test !== undefined) this.setCapability(GL_DEPTH_TEST, desc.test);
    if (desc.write !== undefined) this.setDepthMask(desc.write);
    if (desc.func !== undefined) {
      const func = compareFunc(desc.func);
      if (func !== this.depthFuncValue) {
        this.gl.depthFunc(func);
        this.stats.glCalls++;
        this.depthFuncValue = func;
      } else {
        this.stats.stateSkipped++;
      }
    }
    if (desc.range !== undefined) {
      const r = this.depthRangeValue;
      if (r[0] !== desc.range[0] || r[1] !== desc.range[1]) {
        this.gl.depthRange(desc.range[0], desc.range[1]);
        this.stats.glCalls++;
        r[0] = desc.range[0];
        r[1] = desc.range[1];
      } else {
        this.stats.stateSkipped++;
      }
    }
  }

  setDepthMask(write: boolean): void {
    this.stats.stateCalls++;
    if (this.depthMask === write) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.depthMask(write);
    this.stats.glCalls++;
    this.depthMask = write;
  }

  setCull(desc: GL1CullState): void {
    this.stats.stateCalls++;
    if (desc.enabled !== undefined) this.setCapability(GL_CULL_FACE, desc.enabled);
    if (desc.face !== undefined) {
      const face = cullFace(desc.face);
      if (face !== this.cullFaceValue) {
        this.gl.cullFace(face);
        this.stats.glCalls++;
        this.cullFaceValue = face;
      } else {
        this.stats.stateSkipped++;
      }
    }
    if (desc.frontFace !== undefined) {
      const ff = frontFace(desc.frontFace);
      if (ff !== this.frontFaceValue) {
        this.gl.frontFace(ff);
        this.stats.glCalls++;
        this.frontFaceValue = ff;
      } else {
        this.stats.stateSkipped++;
      }
    }
  }

  setStencil(desc: GL1StencilState): void {
    this.stats.stateCalls++;
    this.setCapability(GL_STENCIL_TEST, desc.enabled);
    if (!desc.enabled) return;
    const func = desc.func ? compareFunc(desc.func) : this.stencilFunc;
    const ref = desc.reference ?? this.stencilRef;
    const readMask = desc.readMask ?? this.stencilReadMask;
    if (func !== this.stencilFunc || ref !== this.stencilRef || readMask !== this.stencilReadMask) {
      this.gl.stencilFunc(func, ref, readMask);
      this.stats.glCalls++;
      this.stencilFunc = func;
      this.stencilRef = ref;
      this.stencilReadMask = readMask;
    } else {
      this.stats.stateSkipped++;
    }
    if (desc.writeMask !== undefined) this.setStencilMask(desc.writeMask);
    const fail = desc.fail ? stencilOp(desc.fail) : this.stencilFail;
    const depthFail = desc.depthFail ? stencilOp(desc.depthFail) : this.stencilDepthFail;
    const pass = desc.pass ? stencilOp(desc.pass) : this.stencilPass;
    if (fail !== this.stencilFail || depthFail !== this.stencilDepthFail || pass !== this.stencilPass) {
      this.gl.stencilOp(fail, depthFail, pass);
      this.stats.glCalls++;
      this.stencilFail = fail;
      this.stencilDepthFail = depthFail;
      this.stencilPass = pass;
    } else {
      this.stats.stateSkipped++;
    }
  }

  setStencilMask(mask: number): void {
    this.stats.stateCalls++;
    if (this.stencilWriteMask === mask) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.stencilMask(mask);
    this.stats.glCalls++;
    this.stencilWriteMask = mask;
  }

  setColorMask(mask: readonly [boolean, boolean, boolean, boolean]): void {
    this.stats.stateCalls++;
    const c = this.colorMask;
    if (c[0] === mask[0] && c[1] === mask[1] && c[2] === mask[2] && c[3] === mask[3]) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.colorMask(mask[0], mask[1], mask[2], mask[3]);
    this.stats.glCalls++;
    c[0] = mask[0];
    c[1] = mask[1];
    c[2] = mask[2];
    c[3] = mask[3];
  }

  setPolygonOffset(offset: readonly [number, number]): void {
    this.stats.stateCalls++;
    const gl = this.gl;
    if (offset[0] === 0 && offset[1] === 0) {
      if (this.capability(GL_POLYGON_OFFSET_FILL)) this.setCapability(GL_POLYGON_OFFSET_FILL, false);
      else this.stats.stateSkipped++;
      return;
    }
    this.setCapability(GL_POLYGON_OFFSET_FILL, true);
    gl.polygonOffset(offset[0], offset[1]);
    this.stats.glCalls++;
  }

  // --------------------------------------------------------------- viewport

  setViewport(x: number, y: number, width: number, height: number): void {
    this.stats.stateCalls++;
    const v = this.viewport;
    if (v && v[0] === x && v[1] === y && v[2] === width && v[3] === height) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.viewport(x, y, width, height);
    this.stats.glCalls++;
    this.viewport = [x, y, width, height];
  }

  getViewport(): readonly [number, number, number, number] | null {
    return this.viewport;
  }

  setScissor(box: readonly [number, number, number, number] | null): void {
    this.stats.stateCalls++;
    if (box === null) {
      if (!this.capability(GL_SCISSOR_TEST)) {
        this.stats.stateSkipped++;
        return;
      }
      this.setCapability(GL_SCISSOR_TEST, false);
      this.scissorEnabled = false;
      return;
    }
    this.setCapability(GL_SCISSOR_TEST, true);
    this.scissorEnabled = true;
    const s = this.scissorBox;
    if (s && s[0] === box[0] && s[1] === box[1] && s[2] === box[2] && s[3] === box[3]) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.scissor(box[0], box[1], box[2], box[3]);
    this.stats.glCalls++;
    this.scissorBox = [box[0], box[1], box[2], box[3]];
  }

  // ------------------------------------------------------------------ clear

  setClearColor(color: readonly [number, number, number, number]): void {
    this.stats.stateCalls++;
    const c = this.clearColor;
    if (c[0] === color[0] && c[1] === color[1] && c[2] === color[2] && c[3] === color[3]) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.clearColor(color[0], color[1], color[2], color[3]);
    this.stats.glCalls++;
    c[0] = color[0];
    c[1] = color[1];
    c[2] = color[2];
    c[3] = color[3];
  }

  setClearDepth(depth: number): void {
    this.stats.stateCalls++;
    if (this.clearDepthValue === depth) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.clearDepth(depth);
    this.stats.glCalls++;
    this.clearDepthValue = depth;
  }

  setClearStencil(stencil: number): void {
    this.stats.stateCalls++;
    if (this.clearStencilValue === stencil) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.clearStencil(stencil);
    this.stats.glCalls++;
    this.clearStencilValue = stencil;
  }

  clear(options: GL1ClearOptions = {}): void {
    this.stats.stateCalls++;
    let mask = 0;
    if (options.color) {
      this.setClearColor(options.color);
      mask |= options.mask?.color === false ? 0 : GL_COLOR_BUFFER_BIT;
    }
    if (options.depth !== undefined) {
      this.setClearDepth(options.depth);
      mask |= options.mask?.depth === false ? 0 : GL_DEPTH_BUFFER_BIT;
    }
    if (options.stencil !== undefined) {
      this.setClearStencil(options.stencil);
      mask |= options.mask?.stencil === false ? 0 : GL_STENCIL_BUFFER_BIT;
    }
    if (mask === 0) return;
    this.gl.clear(mask);
    this.stats.glCalls++;
  }

  // --------------------------------------------------------------- bindings

  bindTexture(target: number, unit: number, texture: GL1TextureRef | WebGLTexture | null): void {
    this.stats.stateCalls++;
    if (this.activeUnit !== unit) {
      this.gl.activeTexture(GL_TEXTURE0 + unit);
      this.stats.glCalls++;
      this.activeUnit = unit;
    }
    const handle = texture === null ? null : 'handle' in texture ? texture.handle : texture;
    let units = this.textureUnits.get(unit);
    if (!units) {
      units = EMPTY_TEXTURES;
      this.textureUnits.set(unit, units);
    }
    const current = units.get(target) ?? null;
    if (current === handle) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindTexture(target, handle);
    this.stats.glCalls++;
    const next = new Map(units);
    next.set(target, handle);
    this.textureUnits.set(unit, next);
  }

  bindBuffer(target: number, buffer: GL1BufferRef | WebGLBuffer | null): void {
    this.stats.stateCalls++;
    const handle = buffer === null ? null : 'handle' in buffer ? (buffer as { handle: WebGLBuffer | null }).handle : buffer;
    if (target === GL_ELEMENT_ARRAY_BUFFER) {
      if (this.elementBuffer === handle) {
        this.stats.stateSkipped++;
        return;
      }
      this.gl.bindBuffer(target, handle);
      this.stats.glCalls++;
      this.elementBuffer = handle;
      return;
    }
    if (this.arrayBuffer === handle) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindBuffer(target, handle);
    this.stats.glCalls++;
    this.arrayBuffer = handle;
  }

  useProgram(program: WebGLProgram | null): void {
    this.stats.stateCalls++;
    if (this.program === program) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.useProgram(program);
    this.stats.glCalls++;
    this.program = program;
  }

  get currentProgram(): WebGLProgram | null {
    return this.program;
  }

  get boundElementBuffer(): WebGLBuffer | null {
    return this.elementBuffer;
  }

  bindFramebuffer(target: number, framebuffer: WebGLFramebuffer | null): void {
    this.stats.stateCalls++;
    if (target === GL_FRAMEBUFFER) {
      if (this.framebuffer === framebuffer) {
        this.stats.stateSkipped++;
        return;
      }
      this.gl.bindFramebuffer(target, framebuffer);
      this.stats.glCalls++;
      this.framebuffer = framebuffer;
      return;
    }
    this.gl.bindFramebuffer(target, framebuffer);
    this.stats.glCalls++;
  }

  /** Called when a vertex array object changes the element buffer binding. */
  invalidateElementArray(): void {
    this.elementBuffer = null;
    this.stats.stateSkipped++;
  }

  setPixelStore(options: {
    flipY?: boolean;
    premultiplyAlpha?: boolean;
    unpackAlignment?: 1 | 2 | 4 | 8;
  }): void {
    if (options.flipY !== undefined && options.flipY !== this.unpackFlipY) {
      this.stats.stateCalls++;
      this.gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, options.flipY ? 1 : 0);
      this.stats.glCalls++;
      this.unpackFlipY = options.flipY;
    }
    if (options.premultiplyAlpha !== undefined && options.premultiplyAlpha !== this.unpackPremultiply) {
      this.stats.stateCalls++;
      this.gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha ? 1 : 0);
      this.stats.glCalls++;
      this.unpackPremultiply = options.premultiplyAlpha;
    }
    if (options.unpackAlignment !== undefined && options.unpackAlignment !== this.unpackAlignment) {
      this.stats.stateCalls++;
      this.gl.pixelStorei(GL_UNPACK_ALIGNMENT, options.unpackAlignment);
      this.stats.glCalls++;
      this.unpackAlignment = options.unpackAlignment;
    }
  }

  /** Attribute divisors are global GL1 state; keep them in the same cache. */
  setAttributeDivisor(location: number, divisor: number, ext: ANGLE_instanced_arrays | null): void {
    if (!ext) {
      if (divisor > 0) throw new GL1Error('Instanced attributes require the ANGLE_instanced_arrays extension');
      return;
    }
    const current = this.attribDivisors.get(location) ?? 0;
    if (current === divisor) {
      this.stats.stateSkipped++;
      return;
    }
    this.attribDivisors.set(location, divisor);
    ext.vertexAttribDivisorANGLE(location, divisor);
    this.stats.glCalls++;
  }

  /** The active texture unit, exposed for texture uploads that need it. */
  get textureUnit(): number {
    return this.activeUnit;
  }

  // ---------------------------------------------------------------- helpers

  private capability(cap: number): boolean {
    return this.caps.get(cap) ?? DEFAULT_CAPS.get(cap) ?? false;
  }

  private setCapability(cap: number, enable: boolean): void {
    if (this.capability(cap) === enable) {
      this.stats.stateSkipped++;
      return;
    }
    this.caps.set(cap, enable);
    this.stats.glCalls++;
    if (enable) this.gl.enable(cap);
    else this.gl.disable(cap);
  }

  /**
   * Forget every cached value. Needed after a context loss/restore: the driver
   * state is gone, so all values must be re-applied. Does not issue GL calls.
   */
  reset(): void {
    this.caps.clear();
    this.colorMask = [true, true, true, true];
    this.depthMask = true;
    this.stencilWriteMask = 0x7fffffff;
    this.viewport = null;
    this.scissorBox = null;
    this.scissorEnabled = false;
    this.clearColor = [0, 0, 0, 0];
    this.clearDepthValue = 1;
    this.clearStencilValue = 0;
    this.blendSrcRGB = GL_ONE;
    this.blendDstRGB = GL_ZERO;
    this.blendSrcAlpha = GL_ONE;
    this.blendDstAlpha = GL_ZERO;
    this.blendEquationRGB = 0x8006;
    this.blendEquationAlpha = 0x8006;
    this.blendColorValue = [0, 0, 0, 0];
    this.depthFuncValue = GL_LESS;
    this.depthRangeValue = [0, 1];
    this.cullFaceValue = 0x0405;
    this.frontFaceValue = 0x0901;
    this.stencilFunc = GL_ALWAYS;
    this.stencilRef = 0;
    this.stencilReadMask = 0x7fffffff;
    this.stencilFail = GL_KEEP;
    this.stencilDepthFail = GL_KEEP;
    this.stencilPass = GL_KEEP;
    this.program = null;
    this.arrayBuffer = null;
    this.elementBuffer = null;
    this.framebuffer = null;
    this.textureUnits.clear();
    this.activeUnit = 0;
    this.unpackFlipY = false;
    this.unpackPremultiply = false;
    this.unpackAlignment = 4;
    this.attribDivisors.clear();
  }
}

// Re-exported here to keep the state object free of magic numbers in callers.
export const GL1_CLEAR_ALL = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT;
export const GL1_TEXTURE_2D = GL_TEXTURE_2D;
export const GL1_ARRAY_BUFFER = 0x8892;
export const GL1_ELEMENT_ARRAY_BUFFER = GL_ELEMENT_ARRAY_BUFFER;
