import {
  GL_ARRAY_BUFFER,
  GL_ELEMENT_ARRAY_BUFFER,
  GL_FRAMEBUFFER,
  GL_FRAMEBUFFER_BINDING,
  GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS,
  GL_MAX_RENDERBUFFER_SIZE,
  GL_MAX_TEXTURE_IMAGE_UNITS,
  GL_MAX_TEXTURE_SIZE,
  GL_MAX_VARYING_VECTORS,
  GL_MAX_VERTEX_ATTRIBS,
  GL_MAX_VERTEX_UNIFORM_VECTORS,
  GL_RENDERER,
  GL_TEXTURE_2D,
  GL_VENDOR,
  GL_VERSION,
} from './constants.js';
import { GL1DisposedError, GL1Error } from './errors.js';
import { GL1Buffer, GL1BufferPool } from './GL1Buffer.js';
import { GL1Framebuffer } from './GL1Framebuffer.js';
import { GL1ProgramCache, type GL1Defines, type GL1Program } from './GL1Program.js';
import { GL1State } from './GL1State.js';
import { GL1Texture, GL1TexturePool } from './GL1Texture.js';
import { GL1VertexArray, defineGL1VertexLayout, type GL1VertexArrayOptions } from './GL1VertexLayout.js';
import { drawMode, indexType } from './mappings.js';
import { createGL1Stats, resetGL1Stats, snapshotGL1Stats } from './stats.js';
import type {
  GL1ClearOptions,
  GL1DrawCall,
  GL1FramebufferOptions,
  GL1FrameStats,
  GL1Limits,
  GL1PipelineState,
  GL1RendererOptions,
  GL1Stats,
  GL1TextureOptions,
} from './types.js';

function resolveContext(options: GL1RendererOptions): WebGLRenderingContext {
  if (options.gl) return options.gl;
  const canvas = options.canvas;
  if (!canvas) throw new GL1Error('GL1Renderer requires either a `canvas` or an existing `gl` context');
  const attributes: WebGLContextAttributes = {
    alpha: options.alpha ?? true,
    antialias: options.antialias ?? true,
    depth: options.depth ?? true,
    stencil: options.stencil ?? false,
    premultipliedAlpha: options.premultipliedAlpha ?? true,
    preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
    powerPreference: options.powerPreference ?? 'default',
    failIfMajorPerformanceCaveat: options.failIfMajorPerformanceCaveat ?? false,
  };
  const context = canvas.getContext('webgl', attributes) as WebGLRenderingContext | null;
  if (!context) throw new GL1Error('Unable to create a WebGL 1.0 context');
  return context;
}

function readLimits(gl: WebGLRenderingContext): GL1Limits {
  const anisotropyExt = gl.getExtension('EXT_texture_filter_anisotropic');
  const vaoExt = gl.getExtension('OES_vertex_array_object');
  const instancingExt = gl.getExtension('ANGLE_instanced_arrays');
  const number = (parameter: number, fallback: number): number => {
    const value = gl.getParameter(parameter);
    return typeof value === 'number' ? value : fallback;
  };
  return {
    maxTextureSize: number(GL_MAX_TEXTURE_SIZE, 2048),
    maxVertexAttributes: number(GL_MAX_VERTEX_ATTRIBS, 8),
    maxTextureUnits: number(GL_MAX_TEXTURE_IMAGE_UNITS, 8),
    maxCombinedTextureUnits: number(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS, 8),
    maxRenderbufferSize: number(GL_MAX_RENDERBUFFER_SIZE, 2048),
    maxVaryingVectors: number(GL_MAX_VARYING_VECTORS, 8),
    maxVertexUniformVectors: number(GL_MAX_VERTEX_UNIFORM_VECTORS, 128),
    maxAnisotropy: anisotropyExt ? number(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT, 1) : 1,
    hasInstancing: instancingExt !== null,
    hasVertexArrayObject: vaoExt !== null,
  };
}

/**
 * WebGL 1.0 renderer: a thin, cache-first layer over the raw context.
 *
 * Cache layers:
 *  - `state`: redundant GL state calls and bindings are dropped,
 *  - `programs`: shader programs are compiled once per source combination,
 *  - `program` uniform caches: identical uniform values are not re-sent,
 *  - `vertexArrays`: attribute configuration is applied once (VAO when available),
 *  - `bufferPool` / `texturePool`: GPU objects are recycled, not recreated.
 */
export class GL1Renderer {
  readonly gl: WebGLRenderingContext;
  readonly canvas: HTMLCanvasElement | OffscreenCanvas | null;
  readonly stats: GL1Stats;
  readonly state: GL1State;
  readonly programs: GL1ProgramCache;
  readonly bufferPool: GL1BufferPool;
  readonly texturePool: GL1TexturePool;
  readonly limits: GL1Limits;

  private readonly instancing: ANGLE_instanced_arrays | null;
  private readonly vaoExtension: OES_vertex_array_object | null;
  private readonly resources = new Set<{ dispose(): void }>();
  private frameIndex = 0;
  private lastFrame: GL1FrameStats | null = null;
  private widthValue = 0;
  private heightValue = 0;
  private disposedFlag = false;

  constructor(options: GL1RendererOptions) {
    const gl = resolveContext(options);
    this.gl = gl;
    this.canvas = options.canvas ?? null;
    this.stats = createGL1Stats();
    this.state = new GL1State(gl, this.stats);
    this.programs = new GL1ProgramCache(gl, this.stats, this.state);
    this.bufferPool = new GL1BufferPool(gl, this.stats, this.state, options.bufferPool);
    this.texturePool = new GL1TexturePool(gl, this.stats, this.state, options.texturePool);
    this.limits = readLimits(gl);
    this.instancing = gl.getExtension('ANGLE_instanced_arrays');
    this.vaoExtension = gl.getExtension('OES_vertex_array_object');

    const width = options.width ?? (this.canvas ? this.canvas.width : 0);
    const height = options.height ?? (this.canvas ? this.canvas.height : 0);
    this.resize(width, height);
  }

  static isSupported(): boolean {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') ?? (canvas.getContext as (id: string) => RenderingContext | null)('experimental-webgl');
    return context !== null;
  }

  get width(): number {
    return this.widthValue;
  }

  get height(): number {
    return this.heightValue;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  get vendor(): string {
    return String(this.gl.getParameter(GL_VENDOR) ?? '');
  }

  get version(): string {
    return String(this.gl.getParameter(GL_VERSION) ?? '');
  }

  get rendererName(): string {
    return String(this.gl.getParameter(GL_RENDERER) ?? '');
  }

  get frameStats(): GL1FrameStats | null {
    return this.lastFrame;
  }

  /** Use a pool for renderer-owned buffers. */
  createProgram(vertexSource: string, fragmentSource: string, defines?: GL1Defines): GL1Program {
    this.assertLive();
    return this.programs.get(vertexSource, fragmentSource, defines);
  }

  createBuffer(options: { target?: 'array' | 'element'; usage?: 'static' | 'dynamic' | 'stream'; data?: BufferSource } = {}): GL1Buffer {
    this.assertLive();
    const buffer = new GL1Buffer(
      this.gl,
      this.stats,
      this.state,
      options.target === 'element' ? GL_ELEMENT_ARRAY_BUFFER : GL_ARRAY_BUFFER,
      options.usage ?? 'static',
    );
    if (options.data) buffer.setData(options.data);
    this.track(buffer);
    return buffer;
  }

  createTexture(options: GL1TextureOptions = {}): GL1Texture {
    this.assertLive();
    const texture = new GL1Texture(this.gl, this.stats, this.state, options);
    this.track(texture);
    return texture;
  }

  createVertexArray(options: GL1VertexArrayOptions): GL1VertexArray {
    this.assertLive();
    const vertexArray = new GL1VertexArray(this.gl, this.stats, this.state, options, {
      vao: this.vaoExtension,
      instancing: this.instancing,
    });
    this.track(vertexArray);
    return vertexArray;
  }

  createFramebuffer(options: GL1FramebufferOptions): GL1Framebuffer {
    this.assertLive();
    const framebuffer = new GL1Framebuffer(this.gl, this.stats, this.state, options);
    this.track(framebuffer);
    return framebuffer;
  }

  /** Convenience: acquire a recycled buffer from the pool. */
  acquireBuffer(options: { target?: 'array' | 'element'; usage?: 'static' | 'dynamic' | 'stream'; byteLength?: number } = {}): GL1Buffer {
    this.assertLive();
    return this.bufferPool.acquire(options);
  }

  releaseBuffer(buffer: GL1Buffer): void {
    this.bufferPool.release(buffer);
  }

  /** Acquire a recycled texture (upload content before drawing with it). */
  acquireTexture(options: GL1TextureOptions = {}): GL1Texture {
    this.assertLive();
    return this.texturePool.acquire(options);
  }

  releaseTexture(texture: GL1Texture): void {
    this.texturePool.release(texture);
  }

  resize(width: number, height: number, devicePixelRatio = 1): void {
    this.assertLive();
    const w = Math.max(1, Math.floor(width * devicePixelRatio));
    const h = Math.max(1, Math.floor(height * devicePixelRatio));
    if (this.canvas && (this.canvas.width !== w || this.canvas.height !== h)) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (w === this.widthValue && h === this.heightValue) {
      this.state.setViewport(0, 0, w, h);
      return;
    }
    this.widthValue = w;
    this.heightValue = h;
    this.state.setViewport(0, 0, w, h);
  }

  setViewport(x: number, y: number, width: number, height: number): void {
    this.state.setViewport(x, y, width, height);
  }

  setScissor(box: readonly [number, number, number, number] | null): void {
    this.state.setScissor(box);
  }

  /** Bind a render target (or the default framebuffer when null). */
  setRenderTarget(framebuffer: GL1Framebuffer | null): void {
    if (framebuffer) {
      framebuffer.bind();
      this.state.setViewport(0, 0, framebuffer.width, framebuffer.height);
      return;
    }
    this.state.bindFramebuffer(GL_FRAMEBUFFER, null);
    this.state.setViewport(0, 0, this.widthValue, this.heightValue);
  }

  /** Current render target dimensions (default framebuffer when null). */
  getRenderTargetSize(framebuffer: GL1Framebuffer | null): readonly [number, number] {
    return framebuffer ? [framebuffer.width, framebuffer.height] : [this.widthValue, this.heightValue];
  }

  setState(pipeline: GL1PipelineState): void {
    this.state.applyPipeline(pipeline);
  }

  clear(options: GL1ClearOptions = {}): void {
    this.state.clear(options);
  }

  /**
   * Draw one call. Every write goes through a cache:
   * program use, texture bindings, uniform values, vertex layout and pipeline
   * state are all skipped when unchanged.
   */
  draw(call: GL1DrawCall): void {
    this.assertLive();
    const stats = this.stats;
    stats.drawCalls++;
    const program = call.program;
    program.use();
    this.state.applyPipeline(call.state);

    if (call.textures) {
      for (const name of Object.keys(call.textures)) {
        const unit = program.textureUnit(name);
        if (unit === undefined) {
          stats.uniformSkipped++;
          continue;
        }
        const texture = call.textures[name] ?? null;
        this.state.bindTexture(GL_TEXTURE_2D, unit, texture ? texture.handle : null);
        program.setUniform(name, unit);
      }
    }
    if (call.textureBindings) {
      for (const binding of call.textureBindings) {
        this.state.bindTexture(GL_TEXTURE_2D, binding.unit, binding.texture ? binding.texture.handle : null);
      }
    }
    if (call.uniforms) program.setUniforms(call.uniforms);

    const vertexArray = call.vertexArray;
    vertexArray.bind(program);

    const mode = drawMode(call.mode ?? 'triangles');
    const first = call.offset ?? 0;
    const count = call.count;
    if (call.instances !== undefined && call.instances > 1) {
      if (!this.instancing) throw new GL1Error('Instanced drawing requires the ANGLE_instanced_arrays extension');
      if (vertexArray.indexBuffer) {
        this.instancing.drawElementsInstancedANGLE(mode, count, indexType(vertexArray.indexType), first * this.indexSize(vertexArray.indexType), call.instances);
      } else {
        this.instancing.drawArraysInstancedANGLE(mode, first, count, call.instances);
      }
      stats.glCalls++;
    } else if (vertexArray.indexBuffer) {
      this.gl.drawElements(mode, count, indexType(vertexArray.indexType), first * this.indexSize(vertexArray.indexType));
      stats.glCalls++;
    } else {
      this.gl.drawArrays(mode, first, count);
      stats.glCalls++;
    }
  }

  private indexSize(type: 'uint8' | 'uint16'): number {
    return type === 'uint8' ? 1 : 2;
  }

  beginFrame(): void {
    this.assertLive();
  }

  endFrame(): GL1FrameStats {
    this.assertLive();
    this.frameIndex++;
    this.lastFrame = snapshotGL1Stats(this.stats, this.frameIndex);
    return this.lastFrame;
  }

  getStats(): GL1Stats {
    return { ...this.stats };
  }

  resetStats(): void {
    resetGL1Stats(this.stats);
  }

  /** Force all cached GL state to be re-applied on the next call. */
  invalidateCaches(): void {
    this.state.reset();
    for (const program of this.programs.values()) program.resetUniformCache();
  }

  get drawingBufferWidth(): number {
    return typeof this.gl.drawingBufferWidth === 'number' ? this.gl.drawingBufferWidth : this.widthValue;
  }

  get drawingBufferHeight(): number {
    return typeof this.gl.drawingBufferHeight === 'number' ? this.gl.drawingBufferHeight : this.heightValue;
  }

  get framebufferBinding(): WebGLFramebuffer | null {
    return this.gl.getParameter(GL_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.programs.clear();
    this.bufferPool.dispose();
    this.texturePool.dispose();
    for (const resource of this.resources) resource.dispose();
    this.resources.clear();
    this.state.reset();
  }

  private track<T extends { dispose(): void }>(resource: T): T {
    this.resources.add(resource);
    return resource;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Renderer');
  }
}

export { GL1Buffer, GL1Texture, GL1VertexArray, GL1Framebuffer, defineGL1VertexLayout };
