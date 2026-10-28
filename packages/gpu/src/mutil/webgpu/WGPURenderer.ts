import { BufferUsage, ShaderStage, TextureUsage } from './constants.js';
import { WGPUDeviceLostError, WGPUDisposedError, WGPUError } from './errors.js';
import { WGPUBuffer, WGPUBufferPool } from './WGPUBuffer.js';
import {
  WGPUBindGroupCache,
  WGPUBindGroupLayoutCache,
  WGPUPipelineCache,
  WGPUSamplerCache,
  WGPUShaderCache,
  type WGPUBindGroupRequest,
} from './WGPUCaches.js';
import { WGPURenderPass } from './WGPURenderPass.js';
import { WGPUTexture, WGPUTexturePool, type WGPUTextureDescriptorLike, type WGPUTextureUploadOptions } from './WGPUTexture.js';
import { WGPUUniformArena } from './WGPUUniformArena.js';
import { createWGPUStats, resetWGPUStats, snapshotWGPUStats } from './stats.js';
import type {
  WGPUColorAttachmentLike,
  WGPUComputePipelineDescriptorLike,
  WGPUDepthStencilAttachmentLike,
  WGPUFrameStats,
  WGPUPipelineDescriptor,
  WGPURenderPassLike,
  WGPURendererOptions,
  WGPUStats,
} from './types.js';

/** A single frame: one command encoder, one canvas texture, one uniform reset. */
export class WGPUFrame {
  readonly label: string | undefined;

  private readonly renderer: WGPURenderer;
  private readonly encoder: GPUCommandEncoder;
  private readonly canvasView: GPUTextureView | null;
  private ended = false;

  constructor(renderer: WGPURenderer, encoder: GPUCommandEncoder, canvasView: GPUTextureView | null, label?: string) {
    this.renderer = renderer;
    this.encoder = encoder;
    this.canvasView = canvasView;
    this.label = label;
  }

  get commandEncoder(): GPUCommandEncoder {
    return this.encoder;
  }

  get currentCanvasView(): GPUTextureView | null {
    return this.canvasView;
  }

  get uniforms(): WGPUUniformArena {
    return this.renderer.uniforms;
  }

  beginRenderPass(descriptor: WGPURenderPassLike = {}): WGPURenderPass {
    if (this.ended) throw new WGPUError('Frame has already ended');
    const colorAttachments: (GPURenderPassColorAttachment | null)[] = [];
    if (descriptor.colorAttachments && descriptor.colorAttachments.length > 0) {
      for (const attachment of descriptor.colorAttachments) {
        if (!attachment) {
          colorAttachments.push(null);
          continue;
        }
        colorAttachments.push(this.buildColorAttachment(attachment));
      }
    } else if (this.canvasView) {
      colorAttachments.push({ view: this.canvasView, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: 'clear', storeOp: 'store' });
    } else {
      throw new WGPUError('A render pass needs at least one color attachment (no canvas view is available)');
    }

    let depthStencilAttachment: GPURenderPassDepthStencilAttachment | undefined;
    if (descriptor.depthStencilAttachment) {
      depthStencilAttachment = this.buildDepthAttachment(descriptor.depthStencilAttachment);
    }

    const encoder = this.encoder.beginRenderPass({
      label: descriptor.label,
      colorAttachments: colorAttachments as (GPURenderPassColorAttachment | null)[],
      depthStencilAttachment,
      timestampWrites: descriptor.timestampWrites,
      occlusionQuerySet: descriptor.occlusionQuerySet,
    });
    const stats = this.renderer.stats;
    stats.renderPasses++;
    return new WGPURenderPass(encoder, stats);
  }

  /** Flush the uniform ring once, submit the command buffer and end the frame. */
  end(): WGPUFrameStats {
    if (this.ended) throw new WGPUError('Frame has already ended');
    this.ended = true;
    return this.renderer.finishFrame(this.encoder);
  }

  private buildColorAttachment(attachment: WGPUColorAttachmentLike): GPURenderPassColorAttachment {
    const view = attachment.view ?? this.canvasView;
    if (!view) throw new WGPUError('Color attachment is missing a texture view');
    return {
      view,
      clearValue: attachment.clearValue ?? { r: 0, g: 0, b: 0, a: 1 },
      loadOp: attachment.loadOp ?? 'clear',
      storeOp: attachment.storeOp ?? 'store',
    };
  }

  private buildDepthAttachment(attachment: WGPUDepthStencilAttachmentLike): GPURenderPassDepthStencilAttachment {
    const view = attachment.view ?? this.renderer.ensureDepthTexture().view;
    return {
      view,
      depthClearValue: attachment.depthClearValue ?? 1,
      depthLoadOp: attachment.depthLoadOp ?? 'clear',
      depthStoreOp: attachment.depthStoreOp ?? 'store',
      depthReadOnly: attachment.depthReadOnly,
      stencilClearValue: attachment.stencilClearValue,
      stencilLoadOp: attachment.stencilLoadOp,
      stencilStoreOp: attachment.stencilStoreOp,
      stencilReadOnly: attachment.stencilReadOnly,
    };
  }
}

/**
 * WebGPU renderer.
 *
 * Cache layers:
 *  - shader modules by WGSL source,
 *  - render/compute pipelines by descriptor content,
 *  - bind groups by (pipeline, group, entries) + dynamic offsets,
 *  - samplers by descriptor,
 *  - buffers in size classes, textures by exact descriptor,
 *  - one uniform ring buffer with aligned dynamic offsets (one upload/frame),
 *  - a per-pass encoder state cache,
 *  - canvas configuration only when the size actually changes.
 */
export class WGPURenderer {
  readonly device: GPUDevice;
  readonly context: GPUCanvasContext | null;
  readonly canvas: HTMLCanvasElement | OffscreenCanvas | null;
  readonly format: GPUTextureFormat;
  readonly alphaMode: GPUCanvasAlphaMode;
  readonly stats: WGPUStats;
  readonly shaders: WGPUShaderCache;
  readonly pipelines: WGPUPipelineCache;
  readonly bindGroups: WGPUBindGroupCache;
  readonly bindGroupLayouts: WGPUBindGroupLayoutCache;
  readonly samplers: WGPUSamplerCache;
  readonly buffers: WGPUBufferPool;
  readonly textures: WGPUTexturePool;
  readonly uniforms: WGPUUniformArena;

  private readonly ownsDevice: boolean;
  private readonly depthFormat: GPUTextureFormat;
  private readonly canvasUsage: number;
  private readonly tracked = new Set<{ dispose(): void }>();
  private depthTexture: WGPUTexture | null = null;
  private configured: { width: number; height: number } | null = null;
  private widthValue = 0;
  private heightValue = 0;
  private frameIndex = 0;
  private lastFrame: WGPUFrameStats | null = null;
  private disposedFlag = false;
  private deviceLost = false;
  private lostReason = '';
  private readonly deviceLossGuard: Promise<void> | null;

  private constructor(device: GPUDevice, options: WGPURendererOptions, context: GPUCanvasContext | null, format: GPUTextureFormat, ownsDevice: boolean) {
    this.device = device;
    this.context = context;
    this.canvas = options.canvas ?? (context?.canvas as HTMLCanvasElement | OffscreenCanvas | undefined) ?? null;
    this.format = format;
    this.alphaMode = options.alphaMode ?? 'premultiplied';
    this.ownsDevice = ownsDevice;
    this.depthFormat = options.depthFormat ?? 'depth24plus';
    this.canvasUsage = options.usage ?? TextureUsage.RENDER_ATTACHMENT;
    this.stats = createWGPUStats();
    this.shaders = new WGPUShaderCache(device, this.stats);
    this.pipelines = new WGPUPipelineCache(device, this.stats, this.shaders);
    this.bindGroups = new WGPUBindGroupCache(device, this.stats);
    this.bindGroupLayouts = new WGPUBindGroupLayoutCache(device, this.stats);
    this.samplers = new WGPUSamplerCache(device, this.stats);
    this.buffers = new WGPUBufferPool(device, this.stats, { maxFreeBuffers: options.maxPooledBuffers });
    this.textures = new WGPUTexturePool(device, this.stats);
    this.uniforms = new WGPUUniformArena(device, this.stats, { initialSize: options.uniformBufferSize });

    if (device.lost && typeof device.lost.then === 'function') {
      this.deviceLossGuard = device.lost.then((info) => {
        this.deviceLost = true;
        this.lostReason = info.reason ?? 'unknown';
      });
    } else {
      this.deviceLossGuard = null;
    }

    if (this.canvas && this.canvas.width > 0 && this.canvas.height > 0) this.resize(this.canvas.width, this.canvas.height);
    else this.configureCanvas();
  }

  static async create(options: WGPURendererOptions): Promise<WGPURenderer> {
    let device = options.device;
    let ownsDevice = false;
    if (!device) {
      let adapter = options.adapter;
      if (!adapter) {
        const gpu = typeof navigator !== 'undefined' ? (navigator as Navigator & { gpu?: GPU }).gpu : undefined;
        if (!gpu) throw new WGPUError('WebGPU is not available: navigator.gpu is missing');
        adapter = (await gpu.requestAdapter({ powerPreference: options.powerPreference })) ?? undefined;
        if (!adapter) throw new WGPUError('No WebGPU adapter is available');
      }
      device = await adapter.requestDevice({
        label: options.label,
        requiredFeatures: options.requiredFeatures as GPUFeatureName[] | undefined,
        requiredLimits: options.requiredLimits as Record<string, number> | undefined,
      });
      ownsDevice = true;
    }

    let context = options.context ?? null;
    if (!context && options.canvas) {
      context = options.canvas.getContext('webgpu') as GPUCanvasContext | null;
      if (!context) throw new WGPUError('Failed to acquire a WebGPU canvas context');
    }
    const preferred = typeof navigator !== 'undefined' && (navigator as Navigator & { gpu?: GPU }).gpu
      ? (navigator as Navigator & { gpu: GPU }).gpu.getPreferredCanvasFormat()
      : 'bgra8unorm';
    const format = options.format ?? preferred;
    return new WGPURenderer(device, options, context, format, ownsDevice);
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

  get isDeviceLost(): boolean {
    return this.deviceLost;
  }

  get lostReasonText(): string {
    return this.lostReason;
  }

  get frameStats(): WGPUFrameStats | null {
    return this.lastFrame;
  }

  get depthTextureRef(): WGPUTexture | null {
    return this.depthTexture;
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
    this.configureCanvas();
  }

  /** Configure the swap chain only when the canvas size actually changed. */
  private configureCanvas(): void {
    if (!this.context) {
      if (this.canvas) {
        this.widthValue = this.widthValue || this.canvas.width;
        this.heightValue = this.heightValue || this.canvas.height;
      }
      return;
    }
    const width = this.canvas ? this.canvas.width : this.widthValue;
    const height = this.canvas ? this.canvas.height : this.heightValue;
    this.widthValue = width;
    this.heightValue = height;
    if (this.configured && this.configured.width === width && this.configured.height === height) return;
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: this.alphaMode,
      usage: this.canvasUsage,
    });
    this.configured = { width, height };
    this.stats.canvasConfigures++;
  }

  getPipeline(descriptor: WGPUPipelineDescriptor): GPURenderPipeline {
    this.assertLive();
    return this.pipelines.get(descriptor);
  }

  getPipelineAsync(descriptor: WGPUPipelineDescriptor): Promise<GPURenderPipeline> {
    this.assertLive();
    return this.pipelines.getAsync(descriptor);
  }

  getComputePipeline(descriptor: WGPUComputePipelineDescriptorLike): GPUComputePipeline {
    this.assertLive();
    return this.pipelines.getCompute(descriptor);
  }

  getBindGroup(request: WGPUBindGroupRequest): GPUBindGroup {
    this.assertLive();
    return this.bindGroups.get(request);
  }

  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    this.assertLive();
    return this.bindGroupLayouts.get(descriptor);
  }

  /**
   * A cached bind group layout for a uniform binding with dynamic offsets.
   * Use it in a pipeline's `layout` array, then pass offsets to setBindGroup:
   *
   * ```ts
   * const layout = renderer.uniformLayout(0);
   * const pipeline = renderer.getPipeline({ ...desc, layout: [layout] });
   * ```
   */
  uniformLayout(binding: number, options: { visibility?: number; dynamic?: boolean; label?: string } = {}): GPUBindGroupLayout {
    this.assertLive();
    const visibility = options.visibility ?? (ShaderStage.VERTEX | ShaderStage.FRAGMENT);
    return this.bindGroupLayouts.get({
      label: options.label ?? `uniform-layout-${binding}`,
      entries: [
        {
          binding,
          visibility,
          buffer: { type: 'uniform', hasDynamicOffset: options.dynamic ?? true },
        },
      ],
    });
  }

  getSampler(descriptor: GPUSamplerDescriptor = {}): GPUSampler {
    this.assertLive();
    return this.samplers.get(descriptor);
  }

  createBuffer(options: { size: number; usage?: number; label?: string; data?: ArrayBufferView }): WGPUBuffer {
    this.assertLive();
    const usage = options.usage ?? (BufferUsage.VERTEX | BufferUsage.COPY_DST);
    const handle = this.device.createBuffer({ size: options.size, usage, label: options.label });
    this.stats.buffersCreated++;
    const buffer = new WGPUBuffer(this.device, this.stats, handle, options.size, usage, options.label);
    if (options.data) buffer.write(options.data);
    this.track(buffer);
    return buffer;
  }

  acquireBuffer(options: { size: number; usage?: number; label?: string }): WGPUBuffer {
    this.assertLive();
    return this.buffers.acquire(options);
  }

  releaseBuffer(buffer: WGPUBuffer): void {
    this.buffers.release(buffer);
  }

  acquireTexture(descriptor: WGPUTextureDescriptorLike): WGPUTexture {
    this.assertLive();
    return this.textures.acquire(descriptor);
  }

  /** Create a tracked (non-pooled) texture, e.g. for persistent materials. */
  createTexture(descriptor: WGPUTextureDescriptorLike): WGPUTexture {
    this.assertLive();
    const texture = this.textures.acquire(descriptor);
    this.track(texture);
    return texture;
  }

  /** Upload pixels into a texture (raw data or DOM image source). */
  uploadTexture(texture: WGPUTexture, source: ImageBitmapSource | ArrayBufferView, options: WGPUTextureUploadOptions = {}): void {
    this.assertLive();
    texture.upload(source, options);
  }

  releaseTexture(texture: WGPUTexture): void {
    this.textures.release(texture);
  }

  /** Lazily (re)creates the cached depth texture for the current canvas size. */
  ensureDepthTexture(width?: number, height?: number, format?: GPUTextureFormat): WGPUTexture {
    this.assertLive();
    const w = Math.max(1, width ?? this.widthValue ?? 1);
    const h = Math.max(1, height ?? this.heightValue ?? 1);
    const targetFormat = format ?? this.depthFormat;
    if (this.depthTexture && this.depthTexture.width === w && this.depthTexture.height === h && this.depthTexture.format === targetFormat) {
      return this.depthTexture;
    }
    if (this.depthTexture) this.textures.release(this.depthTexture);
    this.depthTexture = this.textures.acquire({
      width: w,
      height: h,
      format: targetFormat,
      usage: TextureUsage.RENDER_ATTACHMENT | TextureUsage.TEXTURE_BINDING,
      label: 'depth-target',
    });
    return this.depthTexture;
  }

  beginFrame(label?: string): WGPUFrame {
    this.assertLive();
    this.configureCanvas();
    this.uniforms.beginFrame();
    let canvasView: GPUTextureView | null = null;
    if (this.context) {
      const texture = this.context.getCurrentTexture();
      this.stats.currentTextureRequests++;
      canvasView = texture.createView();
    }
    const encoder = this.device.createCommandEncoder({ label: label ?? 'multi-render-frame' });
    this.stats.commandEncoders++;
    return new WGPUFrame(this, encoder, canvasView, label);
  }

  /** Internal: called by `WGPUFrame.end()` after the ring upload. */
  finishFrame(encoder: GPUCommandEncoder): WGPUFrameStats {
    this.uniforms.flush();
    this.device.queue.submit([encoder.finish()]);
    this.stats.frames++;
    this.frameIndex++;
    this.lastFrame = snapshotWGPUStats(this.stats, this.frameIndex);
    return this.lastFrame;
  }

  getStats(): WGPUStats {
    return { ...this.stats };
  }

  resetStats(): void {
    resetWGPUStats(this.stats);
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.pipelines.dispose();
    this.bindGroups.dispose();
    this.bindGroupLayouts.dispose();
    this.samplers.dispose();
    this.buffers.dispose();
    this.textures.dispose();
    this.uniforms.dispose();
    for (const resource of this.tracked) resource.dispose();
    this.tracked.clear();
    if (this.depthTexture) {
      this.depthTexture.dispose();
      this.depthTexture = null;
    }
    if (this.ownsDevice) this.device.destroy();
    void this.deviceLossGuard;
  }

  private track<T extends { dispose(): void }>(resource: T): T {
    this.tracked.add(resource);
    return resource;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPURenderer');
    if (this.deviceLost) throw new WGPUDeviceLostError(`WebGPU device lost (${this.lostReason})`, this.lostReason);
  }
}
