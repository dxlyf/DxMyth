import { createCaps, type GPUBackendCaps } from './caps.js';
import {
  WebGPUError,
  WebGPUCapabilityError,
  WebGPUPipelineError,
  WebGPUResourceError,
} from './errors.js';
import {
  ComputePipelineHandle,
  PipelineCache,
  RenderPipelineHandle,
  type GroupLayout,
} from './pipeline.js';
import { BindGroupCache } from './bind-group.js';
import { UniformArena, UniformLayout, type UniformBlock, type UniformLayoutDescriptor } from './uniform.js';
import { ComputePass, RenderPass } from './pass.js';
import { GPUStatsTracker, type GPUStats } from './stats.js';
import { readBufferSlice, readTexture, type ReadRect } from './texture-tools.js';
import { MipmapGenerator } from './mipmap.js';
import { TimestampQuery } from './timestamp.js';
import { hashString, stableSerialize } from '../internal/hash.js';
import {
  isTextureHandle,
  type BindGroupEntryDecl,
  type BufferDescriptorEx,
  type BufferHandle,
  type ComputePipelineDescriptor,
  type RenderPassDescriptorEx,
  type RenderPipelineDescriptor,
  type TextureDescriptorEx,
  type TextureHandle,
  type WebGPUBackendOptions,
} from './types.js';

export interface FrameResources {
  readonly index: number;
  readonly uniforms: {
    allocate(layout: UniformLayout): UniformBlock;
    readonly usedBytes: number;
  };
}

const BYTES_PER_PIXEL: Partial<Record<GPUTextureFormat, number>> = {
  r8unorm: 1,
  rg8unorm: 2,
  rgba8unorm: 4,
  'rgba8unorm-srgb': 4,
  bgra8unorm: 4,
  'bgra8unorm-srgb': 4,
  rgba16float: 8,
  rgba32float: 16,
};

let nextResourceId = 1;

class ManagedBuffer implements BufferHandle {
  readonly id = nextResourceId++;

  constructor(
    readonly buffer: GPUBuffer,
    readonly size: number,
  ) {}

  destroy(): void {
    this.buffer.destroy();
  }
}

class ManagedTexture implements TextureHandle {
  readonly id = nextResourceId++;
  readonly view: GPUTextureView;

  constructor(
    readonly texture: GPUTexture,
    readonly width: number,
    readonly height: number,
    readonly format: GPUTextureFormat,
    readonly mipLevels: number,
    readonly usage: GPUTextureUsageFlags,
  ) {
    this.view = texture.createView();
  }

  createView(desc?: GPUTextureViewDescriptor): GPUTextureView {
    return this.texture.createView(desc);
  }

  destroy(): void {
    this.texture.destroy();
  }
}

function toLayoutEntry(entry: BindGroupEntryDecl): GPUBindGroupLayoutEntry {
  const base: GPUBindGroupLayoutEntry = { binding: entry.binding, visibility: entry.visibility };
  if (entry.buffer) {
    return {
      ...base,
      buffer: {
        type: entry.buffer.type,
        ...(entry.buffer.hasDynamicOffset ? { hasDynamicOffset: true } : {}),
        ...(entry.buffer.minBindingSize !== undefined ? { minBindingSize: entry.buffer.minBindingSize } : {}),
      },
    };
  }
  if (entry.texture) return { ...base, texture: entry.texture };
  if (entry.sampler) return { ...base, sampler: entry.sampler };
  if (entry.storageTexture) return { ...base, storageTexture: entry.storageTexture };
  throw new WebGPUError('webgpu/pipeline', `bind group entry "${entry.name}" has no resource layout`);
}

function usageOf(usage: BufferDescriptorEx['usage']): GPUBufferUsageFlags {
  if (!usage) return GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
  let flags = 0;
  if (usage.vertex) flags |= GPUBufferUsage.VERTEX;
  if (usage.index) flags |= GPUBufferUsage.INDEX;
  if (usage.uniform) flags |= GPUBufferUsage.UNIFORM;
  if (usage.storage) flags |= GPUBufferUsage.STORAGE;
  if (usage.readOnlyStorage) flags |= GPUBufferUsage.STORAGE;
  if (usage.copySrc) flags |= GPUBufferUsage.COPY_SRC;
  if (usage.copyDst) flags |= GPUBufferUsage.COPY_DST;
  return flags;
}

function textureUsageOf(usage: TextureDescriptorEx['usage']): GPUTextureUsageFlags {
  if (!usage) return GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
  let flags = 0;
  if (usage.sample) flags |= GPUTextureUsage.TEXTURE_BINDING;
  if (usage.render) flags |= GPUTextureUsage.RENDER_ATTACHMENT;
  if (usage.storage) flags |= GPUTextureUsage.STORAGE_BINDING;
  if (usage.copySrc) flags |= GPUTextureUsage.COPY_SRC;
  if (usage.copyDst) flags |= GPUTextureUsage.COPY_DST;
  return flags;
}

export class WebGPUBackend {
  readonly device: GPUDevice;
  readonly context: GPUCanvasContext | null;
  readonly caps: GPUBackendCaps;
  readonly stats: GPUStats;

  private readonly canvas: HTMLCanvasElement | OffscreenCanvas | null;
  private readonly tracker = new GPUStatsTracker();
  private readonly arena: UniformArena;
  private readonly renderPipelines = new PipelineCache<RenderPipelineHandle>(this.tracker);
  private readonly computePipelines = new PipelineCache<ComputePipelineHandle>(this.tracker);
  private readonly bindGroups: BindGroupCache;
  private readonly mipmaps: MipmapGenerator;
  private readonly frameResources: FrameResources;
  private readonly moduleIds = new WeakMap<GPUShaderModule, number>();
  private readonly lostListeners = new Set<() => void>();
  private readonly errorListeners = new Set<(error: Error) => void>();
  private readonly ownsDevice: boolean;
  private encoder: GPUCommandEncoder | null = null;
  private frameIndexValue = 0;
  private nextModuleId = 1;
  private lostFlag = false;

  private constructor(
    device: GPUDevice,
    context: GPUCanvasContext | null,
    canvas: HTMLCanvasElement | OffscreenCanvas | null,
    caps: GPUBackendCaps,
    ownsDevice: boolean,
  ) {
    this.device = device;
    this.context = context;
    this.canvas = canvas;
    this.caps = caps;
    this.stats = this.tracker;
    this.ownsDevice = ownsDevice;
    this.arena = new UniformArena(device, device.limits.minUniformBufferOffsetAlignment);
    this.bindGroups = new BindGroupCache(device, this.tracker);
    this.mipmaps = new MipmapGenerator(device);

    const self = this;
    this.frameResources = {
      get index() {
        return self.frameIndexValue;
      },
      uniforms: {
        allocate: (layout) => self.arena.allocate(layout),
        get usedBytes() {
          return self.arena.usedBytes;
        },
      },
    };

    device.lost.then((info) => {
      this.lostFlag = true;
      for (const listener of this.lostListeners) listener();
      if (info.reason !== 'destroyed') {
        for (const listener of this.errorListeners) listener(new WebGPUError('webgpu/device-lost', info.message));
      }
    });
    device.addEventListener('uncapturederror', (event) => {
      const error = (event as GPUUncapturedErrorEvent).error;
      for (const listener of this.errorListeners) {
        listener(new WebGPUError('webgpu/uncaptured', error.message));
      }
    });
  }

  static async create(options: WebGPUBackendOptions = {}): Promise<WebGPUBackend> {
    const gpu = navigator.gpu;
    if (!gpu) throw new WebGPUCapabilityError('webgpu', 'navigator.gpu is not available in this environment');

    const adapter =
      options.adapter ??
      (await gpu.requestAdapter({ powerPreference: options.powerPreference ?? 'high-performance' }));
    if (!adapter) throw new WebGPUCapabilityError('adapter', 'no WebGPU adapter available');

    const requiredFeatures = options.requiredFeatures ?? [];
    for (const feature of requiredFeatures) {
      if (!adapter.features.has(feature)) {
        throw new WebGPUCapabilityError(feature, `adapter does not support feature "${feature}"`);
      }
    }

    const device =
      options.device ??
      (await adapter.requestDevice({
        requiredFeatures,
        ...(options.requiredLimits ? { requiredLimits: options.requiredLimits } : {}),
      }));

    const format =
      options.format ??
      (options.canvas ? gpu.getPreferredCanvasFormat() : ('bgra8unorm' as GPUTextureFormat));

    let context: GPUCanvasContext | null = null;
    if (options.canvas) {
      const canvas = options.canvas as HTMLCanvasElement;
      context = canvas.getContext('webgpu') as GPUCanvasContext | null;
      if (!context) throw new WebGPUCapabilityError('context', 'unable to acquire a webgpu canvas context');
      context.configure({
        device,
        format,
        alphaMode: options.alphaMode ?? 'premultiplied',
      });
    }

    return new WebGPUBackend(
      device,
      context,
      options.canvas ?? null,
      createCaps(device, format, options.alphaMode ?? 'premultiplied'),
      options.device === undefined,
    );
  }

  get lost(): boolean {
    return this.lostFlag;
  }

  get frame(): FrameResources {
    return this.frameResources;
  }

  get usedUniformBytes(): number {
    return this.arena.usedBytes;
  }

  onLost(listener: () => void): () => void {
    this.lostListeners.add(listener);
    return () => this.lostListeners.delete(listener);
  }

  onError(listener: (error: Error) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private ensureLive(): void {
    if (this.lostFlag) throw new WebGPUResourceError('device');
  }

  beginFrame(): void {
    this.ensureLive();
    if (this.encoder) throw new WebGPUError('webgpu/frame', 'beginFrame called twice without submit');
    this.encoder = this.device.createCommandEncoder({ label: 'frame' });
    this.arena.beginFrame();
  }

  submit(): void {
    this.ensureLive();
    const encoder = this.encoder;
    if (!encoder) throw new WebGPUError('webgpu/frame', 'submit called without beginFrame');
    this.tracker.uniformBytes += this.arena.usedBytes;
    this.arena.flush(this.device.queue);
    this.device.queue.submit([encoder.finish()]);
    this.encoder = null;
    this.frameIndexValue++;
    this.tracker.frameIndex = this.frameIndexValue;
  }

  createShaderModule(code: string, options: { label?: string } = {}): GPUShaderModule {
    return this.device.createShaderModule({
      code,
      ...(options.label !== undefined ? { label: options.label } : {}),
    });
  }

  createBuffer(desc: BufferDescriptorEx): BufferHandle {
    const buffer = this.device.createBuffer({
      ...(desc.label !== undefined ? { label: desc.label } : {}),
      size: desc.size,
      usage: usageOf(desc.usage),
    });
    return new ManagedBuffer(buffer, desc.size);
  }

  createTexture(desc: TextureDescriptorEx): TextureHandle {
    const mipLevels = desc.mipLevels ?? 1;
    const usage = textureUsageOf(desc.usage);
    const texture = this.device.createTexture({
      ...(desc.label !== undefined ? { label: desc.label } : {}),
      size: { width: desc.width, height: desc.height, depthOrArrayLayers: desc.depthOrArrayLayers ?? 1 },
      format: desc.format,
      mipLevelCount: mipLevels,
      sampleCount: desc.sampleCount ?? 1,
      usage,
    });
    return new ManagedTexture(texture, desc.width, desc.height, desc.format, mipLevels, usage);
  }

  createSampler(desc: GPUSamplerDescriptor = {}): GPUSampler {
    return this.device.createSampler(desc);
  }

  createUniformLayout(desc: UniformLayoutDescriptor): UniformLayout {
    return new UniformLayout(desc);
  }

  createTimestampQuery(count = 2): TimestampQuery {
    this.ensureLive();
    if (!this.device.features.has('timestamp-query')) {
      throw new WebGPUCapabilityError(
        'timestamp-query',
        'timestamp queries require the "timestamp-query" device feature',
      );
    }
    return new TimestampQuery(this.device, count);
  }

  async createRenderPipeline(desc: RenderPipelineDescriptor): Promise<RenderPipelineHandle> {
    this.ensureLive();
    const key = this.pipelineKey(desc);
    const cached = this.renderPipelines.get(key);
    if (cached) return cached;

    const promise = this.buildRenderPipeline(desc);
    this.renderPipelines.set(key, promise);
    promise.catch(() => this.renderPipelines.delete(key));
    return promise;
  }

  async createComputePipeline(desc: ComputePipelineDescriptor): Promise<ComputePipelineHandle> {
    this.ensureLive();
    const key = hashString(stableSerialize({ ...desc, module: this.moduleId(desc.module) }));
    const cached = this.computePipelines.get(key);
    if (cached) return cached;

    const promise = this.buildComputePipeline(desc);
    this.computePipelines.set(key, promise);
    promise.catch(() => this.computePipelines.delete(key));
    return promise;
  }

  private moduleId(module: GPUShaderModule): number {
    const existing = this.moduleIds.get(module);
    if (existing !== undefined) return existing;
    const id = this.nextModuleId++;
    this.moduleIds.set(module, id);
    return id;
  }

  private pipelineKey(desc: RenderPipelineDescriptor): string {
    return hashString(
      stableSerialize({
        vertex: {
          module: this.moduleId(desc.vertex.module),
          entryPoint: desc.vertex.entryPoint ?? null,
          buffers: desc.vertex.buffers ?? [],
        },
        fragment: desc.fragment
          ? {
              module: this.moduleId(desc.fragment.module),
              entryPoint: desc.fragment.entryPoint ?? null,
              targets: desc.fragment.targets,
            }
          : null,
        primitive: desc.primitive ?? null,
        depthStencil: desc.depthStencil ?? null,
        multisample: desc.multisample ?? null,
        bindings: desc.bindings,
      }),
    );
  }

  private createGroupLayouts(declarations: readonly { group: number; entries: readonly BindGroupEntryDecl[] }[]): {
    layouts: GPUBindGroupLayout[];
    groups: Map<number, GroupLayout>;
  } {
    const groups = new Map<number, GroupLayout>();
    const maxGroup = declarations.reduce((max, decl) => Math.max(max, decl.group), 0);
    const layouts: GPUBindGroupLayout[] = [];
    for (let index = 0; index <= maxGroup; index++) {
      const declaration = declarations.find((decl) => decl.group === index);
      const entries = declaration?.entries ?? [];
      const layout = this.device.createBindGroupLayout({
        entries: entries.map(toLayoutEntry),
      });
      layouts.push(layout);
      groups.set(index, { group: index, layout, entries });
    }
    return { layouts, groups };
  }

  private async buildRenderPipeline(desc: RenderPipelineDescriptor): Promise<RenderPipelineHandle> {
    const { layouts, groups } = this.createGroupLayouts(desc.bindings);
    const pipelineLayout = this.device.createPipelineLayout({ bindGroupLayouts: layouts });

    const descriptor: GPURenderPipelineDescriptor = {
      ...(desc.label !== undefined ? { label: desc.label } : {}),
      layout: pipelineLayout,
      vertex: {
        module: desc.vertex.module,
        ...(desc.vertex.entryPoint !== undefined ? { entryPoint: desc.vertex.entryPoint } : {}),
        ...(desc.vertex.buffers ? { buffers: desc.vertex.buffers } : {}),
      },
      ...(desc.fragment
        ? {
            fragment: {
              module: desc.fragment.module,
              ...(desc.fragment.entryPoint !== undefined ? { entryPoint: desc.fragment.entryPoint } : {}),
              targets: desc.fragment.targets,
            },
          }
        : {}),
      ...(desc.primitive ? { primitive: desc.primitive } : {}),
      ...(desc.depthStencil ? { depthStencil: desc.depthStencil } : {}),
      ...(desc.multisample ? { multisample: desc.multisample } : {}),
    };

    const native = await this.guarded(desc.label ?? 'pipeline', () =>
      desc.sync
        ? Promise.resolve(this.device.createRenderPipeline(descriptor))
        : this.device.createRenderPipelineAsync(descriptor),
    );
    return new RenderPipelineHandle(desc.label ?? 'pipeline', native, groups);
  }

  private async buildComputePipeline(desc: ComputePipelineDescriptor): Promise<ComputePipelineHandle> {
    const { layouts, groups } = this.createGroupLayouts(desc.bindings ?? []);
    const pipelineLayout = this.device.createPipelineLayout({ bindGroupLayouts: layouts });
    const descriptor: GPUComputePipelineDescriptor = {
      ...(desc.label !== undefined ? { label: desc.label } : {}),
      layout: pipelineLayout,
      compute: {
        module: desc.module,
        ...(desc.entryPoint !== undefined ? { entryPoint: desc.entryPoint } : {}),
      },
    };
    const native = await this.guarded(desc.label ?? 'compute', () =>
      this.device.createComputePipelineAsync(descriptor),
    );
    return new ComputePipelineHandle(desc.label ?? 'compute', native, groups);
  }

  private async guarded<T>(label: string, create: () => Promise<T>): Promise<T> {
    this.device.pushErrorScope('validation');
    let result: T | null = null;
    let thrown: unknown = null;
    try {
      result = await create();
    } catch (error) {
      thrown = error;
    }
    const scopeError = await this.device.popErrorScope();
    if (scopeError) {
      throw new WebGPUError('webgpu/pipeline', `pipeline "${label}" failed: ${scopeError.message}`);
    }
    if (thrown) throw thrown;
    return result as T;
  }

  beginPass(desc: RenderPassDescriptorEx = {}): RenderPass {
    this.ensureLive();
    if (!this.encoder) throw new WebGPUError('webgpu/frame', 'beginPass called before beginFrame');
    const encoder = this.encoder;

    const colorAttachments: GPURenderPassColorAttachment[] = (desc.color ?? []).map((attachment) => {
      const loadOp = attachment.load ?? (attachment.clear ? 'clear' : 'load');
      return {
        view: this.viewOf(attachment.view),
        loadOp,
        storeOp: attachment.store ?? 'store',
        ...(loadOp === 'clear'
          ? {
              clearValue: {
                r: attachment.clear?.[0] ?? 0,
                g: attachment.clear?.[1] ?? 0,
                b: attachment.clear?.[2] ?? 0,
                a: attachment.clear?.[3] ?? 1,
              },
            }
          : {}),
        ...(attachment.resolve ? { resolveTarget: this.viewOf(attachment.resolve) } : {}),
      };
    });

    const native: GPURenderPassDescriptor = {
      ...(desc.label !== undefined ? { label: desc.label } : {}),
      colorAttachments,
      ...(desc.depth
        ? {
            depthStencilAttachment: {
              view: this.viewOf(desc.depth.view),
              depthLoadOp: desc.depth.load ?? (desc.depth.clear !== undefined ? 'clear' : 'load'),
              ...(desc.depth.clear !== undefined ? { depthClearValue: desc.depth.clear } : {}),
              depthStoreOp: desc.depth.store ?? 'store',
              ...(desc.depth.readOnly !== undefined ? { depthReadOnly: desc.depth.readOnly } : {}),
            },
          }
        : {}),
      ...(desc.timestampWrites ? { timestampWrites: desc.timestampWrites } : {}),
    };

    return new RenderPass(
      encoder.beginRenderPass(native),
      this.bindGroups,
      this.tracker,
      desc.label ?? 'pass',
    );
  }

  beginComputePass(desc: GPUComputePassDescriptor = {}): ComputePass {
    this.ensureLive();
    if (!this.encoder) throw new WebGPUError('webgpu/frame', 'beginComputePass called before beginFrame');
    const encoder = this.encoder;
    return new ComputePass(
      encoder.beginComputePass(desc),
      this.bindGroups,
      desc.label ?? 'compute-pass',
    );
  }

  private viewOf(value: GPUTextureView | TextureHandle): GPUTextureView {
    return isTextureHandle(value) ? value.view : value;
  }

  upload(
    texture: TextureHandle,
    source: GPUCopyExternalImageSource | ArrayBufferView,
    options: { flipY?: boolean; mipLevel?: number } = {},
  ): void {
    this.ensureLive();
    const width = texture.width;
    const height = texture.height;
    const bpp = BYTES_PER_PIXEL[texture.format] ?? 4;
    if (ArrayBuffer.isView(source)) {
      this.device.queue.writeTexture(
        { texture: texture.texture, mipLevel: options.mipLevel ?? 0 },
        source as unknown as GPUAllowSharedBufferSource,
        { bytesPerRow: width * bpp, rowsPerImage: height },
        { width, height, depthOrArrayLayers: 1 },
      );
    } else {
      this.device.queue.copyExternalImageToTexture(
        { source, flipY: options.flipY ?? false },
        { texture: texture.texture, mipLevel: options.mipLevel ?? 0 },
        { width, height, depthOrArrayLayers: 1 },
      );
    }
    this.tracker.textureUploads += width * height * bpp;
  }

  readPixels(texture: TextureHandle, rect?: ReadRect): Promise<Uint8Array> {
    return readTexture(this.device, texture, rect);
  }

  readBuffer(buffer: BufferHandle, offset = 0, size?: number): Promise<ArrayBuffer> {
    const length = size ?? buffer.size - offset;
    return readBufferSlice(this.device, buffer.buffer, offset, length);
  }

  resize(width: number, height: number): void {
    if (!this.canvas) return;
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.context) {
      this.context.configure({ device: this.device, format: this.caps.format, alphaMode: this.caps.alphaMode });
    }
  }

  async withErrorScope<T>(scope: GPUErrorFilter, fn: () => Promise<T>): Promise<T> {
    this.device.pushErrorScope(scope);
    try {
      return await fn();
    } finally {
      await this.device.popErrorScope();
    }
  }

  /** Generates the full mip chain (texture must have RENDER_ATTACHMENT | TEXTURE_BINDING). */
  mipmap(texture: TextureHandle): void {
    this.ensureLive();
    this.mipmaps.generate(texture);
  }

  destroy(): void {
    this.arena.destroy();
    this.bindGroups.clear();
    this.renderPipelines.clear();
    this.computePipelines.clear();
    if (this.ownsDevice) this.device.destroy();
  }
}

export async function createWebGPUBackend(options: WebGPUBackendOptions = {}): Promise<WebGPUBackend> {
  return WebGPUBackend.create(options);
}
