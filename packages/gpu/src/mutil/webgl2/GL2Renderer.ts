import {
  GL_ARRAY_BUFFER,
  GL_ELEMENT_ARRAY_BUFFER,
  GL_FRAMEBUFFER,
  GL_FRAMEBUFFER_BINDING,
  GL_MAX_COLOR_ATTACHMENTS,
  GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS,
  GL_MAX_DRAW_BUFFERS,
  GL_MAX_RENDERBUFFER_SIZE,
  GL_MAX_TEXTURE_IMAGE_UNITS,
  GL_MAX_TEXTURE_SIZE,
  GL_MAX_UNIFORM_BLOCK_SIZE,
  GL_MAX_UNIFORM_BUFFER_BINDINGS,
  GL_MAX_VARYING_VECTORS,
  GL_MAX_VERTEX_ATTRIBS,
  GL_MAX_VERTEX_UNIFORM_VECTORS,
  GL_RENDERER,
  GL_TEXTURE_2D,
  GL_UNIFORM_BUFFER,
  GL_VENDOR,
  GL_VERSION,
} from './constants.js';
import { GL2DisposedError, GL2Error } from './errors.js';
import { GL2Buffer, GL2BufferPool, GL2UniformBuffer } from './GL2Buffer.js';
import { GL2Framebuffer } from './GL2Framebuffer.js';
import { GL2ProgramCache, type GL2Defines, type GL2Program } from './GL2Program.js';
import { GL2Sampler, GL2SamplerCache } from './GL2Sampler.js';
import { GL2State } from './GL2State.js';
import { GL2Texture, GL2TexturePool } from './GL2Texture.js';
import { GL2VertexArray, defineGL2VertexLayout, type GL2VertexArrayOptions } from './GL2VertexArray.js';
import { drawMode, indexBytes, indexType } from './mappings.js';
import { createGL2Stats, resetGL2Stats, snapshotGL2Stats } from './stats.js';
import type {
  GL2ClearOptions,
  GL2DrawCall,
  GL2FrameStats,
  GL2FramebufferOptions,
  GL2Limits,
  GL2PipelineState,
  GL2RendererOptions,
  GL2SamplerOptions,
  GL2Stats,
  GL2TextureOptions,
} from './types.js';

function resolveContext(options: GL2RendererOptions): WebGL2RenderingContext {
  if (options.gl) return options.gl;
  const canvas = options.canvas;
  if (!canvas) throw new GL2Error('GL2Renderer requires either a `canvas` or an existing `gl` context');
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
  const context = canvas.getContext('webgl2', attributes) as WebGL2RenderingContext | null;
  if (!context) throw new GL2Error('WebGL 2.0 is not available on this canvas');
  return context;
}

function readLimits(gl: WebGL2RenderingContext): GL2Limits {
  const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  const number = (parameter: number, fallback: number): number => {
    const value = gl.getParameter(parameter);
    return typeof value === 'number' ? value : fallback;
  };
  return {
    maxTextureSize: number(GL_MAX_TEXTURE_SIZE, 2048),
    maxVertexAttributes: number(GL_MAX_VERTEX_ATTRIBS, 16),
    maxTextureUnits: number(GL_MAX_TEXTURE_IMAGE_UNITS, 16),
    maxCombinedTextureUnits: number(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS, 32),
    maxRenderbufferSize: number(GL_MAX_RENDERBUFFER_SIZE, 2048),
    maxVaryingVectors: number(GL_MAX_VARYING_VECTORS, 15),
    maxVertexUniformVectors: number(GL_MAX_VERTEX_UNIFORM_VECTORS, 256),
    maxUniformBufferBindings: number(GL_MAX_UNIFORM_BUFFER_BINDINGS, 24),
    maxUniformBlockSize: number(GL_MAX_UNIFORM_BLOCK_SIZE, 16384),
    maxDrawBuffers: number(GL_MAX_DRAW_BUFFERS, 4),
    maxColorAttachments: number(GL_MAX_COLOR_ATTACHMENTS, 4),
    maxAnisotropy: anisotropy ? number(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT, 1) : 1,
  };
}

/**
 * WebGL2 renderer with cache-first state, program, uniform, VAO, sampler,
 * buffer and texture layers. See README for the measured call reductions.
 */
export class GL2Renderer {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement | OffscreenCanvas | null;
  readonly stats: GL2Stats;
  readonly state: GL2State;
  readonly programs: GL2ProgramCache;
  readonly samplers: GL2SamplerCache;
  readonly bufferPool: GL2BufferPool;
  readonly texturePool: GL2TexturePool;
  readonly limits: GL2Limits;

  private readonly resources = new Set<{ dispose(): void }>();
  private widthValue = 0;
  private heightValue = 0;
  private frameIndex = 0;
  private lastFrame: GL2FrameStats | null = null;
  private disposedFlag = false;

  constructor(options: GL2RendererOptions) {
    const gl = resolveContext(options);
    this.gl = gl;
    this.canvas = options.canvas ?? null;
    this.stats = createGL2Stats();
    this.state = new GL2State(gl, this.stats);
    this.programs = new GL2ProgramCache(gl, this.stats, this.state);
    this.samplers = new GL2SamplerCache(gl, this.stats);
    this.bufferPool = new GL2BufferPool(gl, this.stats, this.state, options.bufferPool);
    this.texturePool = new GL2TexturePool(gl, this.stats, this.state, this.samplers, options.texturePool);
    this.limits = readLimits(gl);
    const width = options.width ?? (this.canvas ? this.canvas.width : 0);
    const height = options.height ?? (this.canvas ? this.canvas.height : 0);
    this.resize(width, height);
  }

  static isSupported(): boolean {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2') !== null;
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

  get frameStats(): GL2FrameStats | null {
    return this.lastFrame;
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

  createProgram(vertexSource: string, fragmentSource: string, defines?: GL2Defines): GL2Program {
    this.assertLive();
    return this.programs.get(vertexSource, fragmentSource, defines);
  }

  createBuffer(options: { target?: 'array' | 'element' | 'uniform'; usage?: 'static' | 'dynamic' | 'stream'; data?: BufferSource } = {}): GL2Buffer {
    this.assertLive();
    const target = options.target === 'element' ? GL_ELEMENT_ARRAY_BUFFER : options.target === 'uniform' ? GL_UNIFORM_BUFFER : GL_ARRAY_BUFFER;
    const buffer = target === GL_UNIFORM_BUFFER
      ? new GL2UniformBuffer(this.gl, this.stats, this.state, options.usage ?? 'dynamic')
      : new GL2Buffer(this.gl, this.stats, this.state, target, options.usage ?? 'static');
    if (options.data) buffer.setData(options.data);
    this.track(buffer);
    return buffer;
  }

  createUniformBuffer(usage: 'static' | 'dynamic' | 'stream' = 'dynamic'): GL2UniformBuffer {
    this.assertLive();
    const buffer = new GL2UniformBuffer(this.gl, this.stats, this.state, usage);
    this.track(buffer);
    return buffer;
  }

  createTexture(options: GL2TextureOptions = {}): GL2Texture {
    this.assertLive();
    const texture = new GL2Texture(this.gl, this.stats, this.state, this.samplers, options);
    this.track(texture);
    return texture;
  }

  createSampler(options: GL2SamplerOptions = {}): GL2Sampler {
    this.assertLive();
    return this.samplers.get(options);
  }

  createVertexArray(options: GL2VertexArrayOptions): GL2VertexArray {
    this.assertLive();
    const vertexArray = new GL2VertexArray(this.gl, this.stats, this.state, options);
    this.track(vertexArray);
    return vertexArray;
  }

  createFramebuffer(options: GL2FramebufferOptions): GL2Framebuffer {
    this.assertLive();
    const framebuffer = new GL2Framebuffer(this.gl, this.stats, this.state, this.samplers, options);
    this.track(framebuffer);
    return framebuffer;
  }

  acquireBuffer(options: { target?: 'array' | 'element' | 'uniform'; usage?: 'static' | 'dynamic' | 'stream'; byteLength?: number } = {}): GL2Buffer {
    this.assertLive();
    return this.bufferPool.acquire(options);
  }

  releaseBuffer(buffer: GL2Buffer): void {
    this.bufferPool.release(buffer);
  }

  acquireTexture(options: GL2TextureOptions = {}): GL2Texture {
    this.assertLive();
    return this.texturePool.acquire(options);
  }

  releaseTexture(texture: GL2Texture): void {
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

  setRenderTarget(framebuffer: GL2Framebuffer | null): void {
    if (framebuffer) {
      framebuffer.bind();
      this.state.setViewport(0, 0, framebuffer.width, framebuffer.height);
      return;
    }
    this.state.bindFramebuffer(GL_FRAMEBUFFER, null);
    this.state.setViewport(0, 0, this.widthValue, this.heightValue);
  }

  setState(pipeline: GL2PipelineState): void {
    this.state.applyPipeline(pipeline);
  }

  clear(options: GL2ClearOptions = {}): void {
    this.state.clear(options);
  }

  draw(call: GL2DrawCall): void {
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
        this.state.bindTexture(unit, texture ? texture.handle : null);
        if (texture) this.state.bindSampler(unit, texture.samplerHandle);
        program.setUniform(name, unit);
      }
    }
    if (call.textureBindings) {
      for (const binding of call.textureBindings) {
        this.state.bindTexture(binding.unit, binding.texture ? binding.texture.handle : null);
        if (binding.texture) this.state.bindSampler(binding.unit, binding.texture.samplerHandle);
      }
    }
    if (call.uniforms) program.setUniforms(call.uniforms);
    if (call.uniformBlocks) {
      for (const name of Object.keys(call.uniformBlocks)) {
        program.bindUniformBlock(name, call.uniformBlocks[name]!);
      }
    }

    const vertexArray = call.vertexArray;
    vertexArray.bind(program);

    const mode = drawMode(call.mode ?? 'triangles');
    const first = call.offset ?? 0;
    const count = call.count;
    const indexBytesPerElement = indexBytes(vertexArray.indexType);
    if (call.instances !== undefined && call.instances > 1) {
      if (vertexArray.indexBuffer) {
        this.gl.drawElementsInstanced(mode, count, indexType(vertexArray.indexType), first * indexBytesPerElement, call.instances);
      } else {
        this.gl.drawArraysInstanced(mode, first, count, call.instances);
      }
    } else if (vertexArray.indexBuffer) {
      this.gl.drawElements(mode, count, indexType(vertexArray.indexType), first * indexBytesPerElement);
    } else {
      this.gl.drawArrays(mode, first, count);
    }
    stats.glCalls++;
  }

  beginFrame(): void {
    this.assertLive();
  }

  endFrame(): GL2FrameStats {
    this.assertLive();
    this.frameIndex++;
    this.lastFrame = snapshotGL2Stats(this.stats, this.frameIndex);
    return this.lastFrame;
  }

  getStats(): GL2Stats {
    return { ...this.stats };
  }

  resetStats(): void {
    resetGL2Stats(this.stats);
  }

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
    this.samplers.dispose();
    for (const resource of this.resources) resource.dispose();
    this.resources.clear();
    this.state.reset();
  }

  private track<T extends { dispose(): void }>(resource: T): T {
    this.resources.add(resource);
    return resource;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Renderer');
  }
}

export { GL2Buffer, GL2UniformBuffer, GL2Texture, GL2VertexArray, GL2Framebuffer, defineGL2VertexLayout };
