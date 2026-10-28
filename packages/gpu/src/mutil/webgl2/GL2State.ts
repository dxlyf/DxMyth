import {
  GL_BLEND,
  GL_COLOR_BUFFER_BIT,
  GL_CULL_FACE,
  GL_DEPTH_BUFFER_BIT,
  GL_DEPTH_TEST,
  GL_DITHER,
  GL_DRAW_FRAMEBUFFER,
  GL_ELEMENT_ARRAY_BUFFER,
  GL_FRAMEBUFFER,
  GL_POLYGON_OFFSET_FILL,
  GL_RASTERIZER_DISCARD,
  GL_READ_FRAMEBUFFER,
  GL_SAMPLE_ALPHA_TO_COVERAGE,
  GL_SCISSOR_TEST,
  GL_STENCIL_BUFFER_BIT,
  GL_STENCIL_TEST,
  GL_TEXTURE0,
  GL_TEXTURE_2D,
  GL_UNPACK_ALIGNMENT,
  GL_UNPACK_FLIP_Y_WEBGL,
  GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL,
  GL_UNPACK_ROW_LENGTH,
  GL_ALWAYS,
  GL_KEEP,
  GL_LESS,
  GL_ONE,
  GL_ZERO,
} from './constants.js';
import { blendEquation, blendFactor, compareFunc, cullFace, frontFace, stencilOp } from './mappings.js';
import type {
  GL2BlendState,
  GL2BufferRef,
  GL2ClearOptions,
  GL2CullState,
  GL2DepthState,
  GL2PipelineState,
  GL2StencilFaceState,
  GL2StencilState,
  GL2Stats,
  GL2TextureRef,
} from './types.js';

const DEFAULT_CAPS = new Map<number, boolean>([[GL_DITHER, true]]);

interface FaceStencilCache {
  func: number;
  reference: number;
  readMask: number;
  writeMask: number;
  fail: number;
  depthFail: number;
  pass: number;
}

function defaultFaceStencil(): FaceStencilCache {
  return {
    func: GL_ALWAYS,
    reference: 0,
    readMask: 0x7fffffff,
    writeMask: 0x7fffffff,
    fail: GL_KEEP,
    depthFail: GL_KEEP,
    pass: GL_KEEP,
  };
}

export class GL2State {
  readonly gl: WebGL2RenderingContext;
  readonly stats: GL2Stats;

  private caps = new Map<number, boolean>();
  private colorMask: [boolean, boolean, boolean, boolean] = [true, true, true, true];
  private depthMask = true;
  private viewport: [number, number, number, number] | null = null;
  private scissorBox: [number, number, number, number] | null = null;
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
  private frontStencil = defaultFaceStencil();
  private backStencil = defaultFaceStencil();
  private program: WebGLProgram | null = null;
  private arrayBuffer: WebGLBuffer | null = null;
  private elementBuffer: WebGLBuffer | null = null;
  private vertexArray: WebGLVertexArrayObject | null = null;
  private drawFramebuffer: WebGLFramebuffer | null = null;
  private readFramebuffer: WebGLFramebuffer | null = null;
  private textures = new Map<number, WebGLTexture | null>();
  private samplers = new Map<number, WebGLSampler | null>();
  private uniformBuffers = new Map<number, WebGLBuffer | null>();
  private activeUnit = 0;
  private unpackFlipY = false;
  private unpackPremultiply = false;
  private unpackAlignment = 4;
  private unpackRowLength = 0;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats) {
    this.gl = gl;
    this.stats = stats;
  }

  applyPipeline(pipeline: GL2PipelineState | undefined): void {
    if (!pipeline) return;
    if (pipeline.blend) this.setBlend(pipeline.blend);
    if (pipeline.depth) this.setDepth(pipeline.depth);
    if (pipeline.cull) this.setCull(pipeline.cull);
    if (pipeline.stencil) this.setStencil(pipeline.stencil);
    if (pipeline.colorMask) this.setColorMask(pipeline.colorMask);
    if (pipeline.depthMask !== undefined) this.setDepthMask(pipeline.depthMask);
    if (pipeline.polygonOffset) this.setPolygonOffset(pipeline.polygonOffset);
    if (pipeline.sampleAlphaToCoverage !== undefined) this.setCapability(GL_SAMPLE_ALPHA_TO_COVERAGE, pipeline.sampleAlphaToCoverage);
    if (pipeline.rasterizerDiscard !== undefined) this.setCapability(GL_RASTERIZER_DISCARD, pipeline.rasterizerDiscard);
  }

  setBlend(desc: GL2BlendState): void {
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

  setDepth(desc: GL2DepthState): void {
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

  setCull(desc: GL2CullState): void {
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

  setStencil(desc: GL2StencilState): void {
    this.stats.stateCalls++;
    this.setCapability(GL_STENCIL_TEST, desc.enabled);
    if (!desc.enabled) return;
    if (desc.front) this.applyStencilFace(0x0404, desc.front, this.frontStencil);
    if (desc.back) this.applyStencilFace(0x0405, desc.back, this.backStencil);
  }

  private applyStencilFace(face: number, part: GL2StencilFaceState, cache: FaceStencilCache): void {
    const func = part.func !== undefined ? compareFunc(part.func) : cache.func;
    const reference = part.reference ?? cache.reference;
    const readMask = part.readMask ?? cache.readMask;
    const writeMask = part.writeMask ?? cache.writeMask;
    if (func !== cache.func || reference !== cache.reference || readMask !== cache.readMask) {
      // FRONT/BACK is the WebGL2 face enum; both constants live in constants.ts.
      this.gl.stencilFuncSeparate(face, func, reference, readMask);
      this.stats.glCalls++;
      cache.func = func;
      cache.reference = reference;
      cache.readMask = readMask;
    } else {
      this.stats.stateSkipped++;
    }
    if (writeMask !== cache.writeMask) {
      this.gl.stencilMaskSeparate(face, writeMask);
      this.stats.glCalls++;
      cache.writeMask = writeMask;
    } else {
      this.stats.stateSkipped++;
    }
    const fail = part.fail !== undefined ? stencilOp(part.fail) : cache.fail;
    const depthFail = part.depthFail !== undefined ? stencilOp(part.depthFail) : cache.depthFail;
    const pass = part.pass !== undefined ? stencilOp(part.pass) : cache.pass;
    if (fail !== cache.fail || depthFail !== cache.depthFail || pass !== cache.pass) {
      this.gl.stencilOpSeparate(face, fail, depthFail, pass);
      this.stats.glCalls++;
      cache.fail = fail;
      cache.depthFail = depthFail;
      cache.pass = pass;
    } else {
      this.stats.stateSkipped++;
    }
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
    if (offset[0] === 0 && offset[1] === 0) {
      this.setCapability(GL_POLYGON_OFFSET_FILL, false);
      return;
    }
    this.setCapability(GL_POLYGON_OFFSET_FILL, true);
    this.gl.polygonOffset(offset[0], offset[1]);
    this.stats.glCalls++;
  }

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
      this.setCapability(GL_SCISSOR_TEST, false);
      return;
    }
    this.setCapability(GL_SCISSOR_TEST, true);
    const s = this.scissorBox;
    if (s && s[0] === box[0] && s[1] === box[1] && s[2] === box[2] && s[3] === box[3]) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.scissor(box[0], box[1], box[2], box[3]);
    this.stats.glCalls++;
    this.scissorBox = [box[0], box[1], box[2], box[3]];
  }

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

  clear(options: GL2ClearOptions = {}): void {
    this.stats.stateCalls++;
    let mask = 0;
    if (options.color) {
      this.setClearColor(options.color);
      if (options.mask?.color !== false) mask |= GL_COLOR_BUFFER_BIT;
    }
    if (options.depth !== undefined) {
      this.setClearDepth(options.depth);
      if (options.mask?.depth !== false) mask |= GL_DEPTH_BUFFER_BIT;
    }
    if (options.stencil !== undefined) {
      this.setClearStencil(options.stencil);
      if (options.mask?.stencil !== false) mask |= GL_STENCIL_BUFFER_BIT;
    }
    if (mask === 0) return;
    this.gl.clear(mask);
    this.stats.glCalls++;
  }

  bindTexture(unit: number, texture: GL2TextureRef | WebGLTexture | null): void {
    this.stats.stateCalls++;
    if (this.activeUnit !== unit) {
      this.gl.activeTexture(GL_TEXTURE0 + unit);
      this.stats.glCalls++;
      this.activeUnit = unit;
    }
    const handle = texture === null ? null : 'handle' in texture ? texture.handle : texture;
    const current = this.textures.get(unit) ?? null;
    if (current === handle) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindTexture(GL_TEXTURE_2D, handle);
    this.stats.glCalls++;
    this.textures.set(unit, handle);
  }

  bindSampler(unit: number, sampler: WebGLSampler | null): void {
    this.stats.stateCalls++;
    const current = this.samplers.get(unit) ?? null;
    if (current === sampler) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindSampler(unit, sampler);
    this.stats.glCalls++;
    this.samplers.set(unit, sampler);
  }

  bindBuffer(target: number, buffer: GL2BufferRef | WebGLBuffer | null): void {
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

  bindUniformBufferBase(index: number, buffer: WebGLBuffer | null): void {
    this.stats.stateCalls++;
    const current = this.uniformBuffers.get(index) ?? null;
    if (current === buffer) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindBufferBase(0x8a11, index, buffer);
    this.stats.glCalls++;
    this.uniformBuffers.set(index, buffer);
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

  bindVertexArray(vertexArray: WebGLVertexArrayObject | null): void {
    this.stats.stateCalls++;
    if (this.vertexArray === vertexArray) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindVertexArray(vertexArray);
    this.stats.glCalls++;
    this.vertexArray = vertexArray;
    this.invalidateElementArray();
  }

  get currentVertexArray(): WebGLVertexArrayObject | null {
    return this.vertexArray;
  }

  bindFramebuffer(target: number, framebuffer: WebGLFramebuffer | null): void {
    this.stats.stateCalls++;
    if (target === GL_FRAMEBUFFER) {
      if (this.drawFramebuffer === framebuffer && this.readFramebuffer === framebuffer) {
        this.stats.stateSkipped++;
        return;
      }
      this.gl.bindFramebuffer(target, framebuffer);
      this.stats.glCalls++;
      this.drawFramebuffer = framebuffer;
      this.readFramebuffer = framebuffer;
      return;
    }
    if (target === GL_DRAW_FRAMEBUFFER) {
      if (this.drawFramebuffer === framebuffer) {
        this.stats.stateSkipped++;
        return;
      }
      this.gl.bindFramebuffer(target, framebuffer);
      this.stats.glCalls++;
      this.drawFramebuffer = framebuffer;
      return;
    }
    if (this.readFramebuffer === framebuffer) {
      this.stats.stateSkipped++;
      return;
    }
    this.gl.bindFramebuffer(target, framebuffer);
    this.stats.glCalls++;
    this.readFramebuffer = framebuffer;
  }

  get currentDrawFramebuffer(): WebGLFramebuffer | null {
    return this.drawFramebuffer;
  }

  invalidateElementArray(): void {
    this.elementBuffer = null;
    this.stats.stateSkipped++;
  }

  setPixelStore(options: {
    flipY?: boolean;
    premultiplyAlpha?: boolean;
    unpackAlignment?: 1 | 2 | 4 | 8;
    unpackRowLength?: number;
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
    if (options.unpackRowLength !== undefined && options.unpackRowLength !== this.unpackRowLength) {
      this.stats.stateCalls++;
      this.gl.pixelStorei(GL_UNPACK_ROW_LENGTH, options.unpackRowLength);
      this.stats.glCalls++;
      this.unpackRowLength = options.unpackRowLength;
    }
  }

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

  reset(): void {
    this.caps.clear();
    this.colorMask = [true, true, true, true];
    this.depthMask = true;
    this.viewport = null;
    this.scissorBox = null;
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
    this.frontStencil = defaultFaceStencil();
    this.backStencil = defaultFaceStencil();
    this.program = null;
    this.arrayBuffer = null;
    this.elementBuffer = null;
    this.vertexArray = null;
    this.drawFramebuffer = null;
    this.readFramebuffer = null;
    this.textures.clear();
    this.samplers.clear();
    this.uniformBuffers.clear();
    this.activeUnit = 0;
    this.unpackFlipY = false;
    this.unpackPremultiply = false;
    this.unpackAlignment = 4;
    this.unpackRowLength = 0;
  }
}
