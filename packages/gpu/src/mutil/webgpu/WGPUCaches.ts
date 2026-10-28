import { WGPUDisposedError } from './errors.js';
import { WGPUError } from './errors.js';
import type { WGPUStats, WGPUComputePipelineDescriptorLike, WGPUPipelineDescriptor } from './types.js';
import { bindGroupEntriesKey, objectId, stableKey, unwrapHandle } from './WGPUDescriptors.js';

/** Caches WGSL shader modules by source text. */
export class WGPUShaderCache {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly modules = new Map<string, GPUShaderModule>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats) {
    this.device = device;
    this.stats = stats;
  }

  get(source: string, label?: string): GPUShaderModule {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUShaderCache');
    const existing = this.modules.get(source);
    if (existing) {
      this.stats.shaderModuleCacheHits++;
      return existing;
    }
    const module = this.device.createShaderModule({ code: source, label });
    this.stats.shaderModulesCreated++;
    this.modules.set(source, module);
    return module;
  }

  resolve(module: string | GPUShaderModule): GPUShaderModule {
    return typeof module === 'string' ? this.get(module) : module;
  }

  get size(): number {
    return this.modules.size;
  }

  dispose(): void {
    this.disposedFlag = true;
    this.modules.clear();
  }
}

export type WGPUOwnedPipeline = GPURenderPipeline | GPUComputePipeline;

/**
 * Caches render/compute pipelines by descriptor content. Pipelines are the most
 * expensive WebGPU resource to create (driver shader compilation), so both the
 * synchronous and asynchronous creation paths share one cache.
 */
export class WGPUPipelineCache {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly shaders: WGPUShaderCache;
  private readonly render = new Map<string, GPURenderPipeline>();
  private readonly renderPending = new Map<string, Promise<GPURenderPipeline>>();
  private readonly compute = new Map<string, GPUComputePipeline>();
  private readonly layouts = new Map<string, GPUPipelineLayout>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats, shaders: WGPUShaderCache) {
    this.device = device;
    this.stats = stats;
    this.shaders = shaders;
  }

  /** Returns a cached pipeline or creates one synchronously. */
  get(descriptor: WGPUPipelineDescriptor): GPURenderPipeline {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUPipelineCache');
    const key = stableKey(descriptor);
    const existing = this.render.get(key) ?? null;
    if (existing) {
      this.stats.pipelineCacheHits++;
      return existing;
    }
    const pipeline = this.device.createRenderPipeline(this.toNative(descriptor));
    this.stats.pipelinesCreated++;
    this.render.set(key, pipeline);
    return pipeline;
  }

  /** Async creation with de-duplication of concurrent requests. */
  async getAsync(descriptor: WGPUPipelineDescriptor): Promise<GPURenderPipeline> {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUPipelineCache');
    const key = stableKey(descriptor);
    const existing = this.render.get(key);
    if (existing) {
      this.stats.pipelineCacheHits++;
      return existing;
    }
    const pending = this.renderPending.get(key);
    if (pending) {
      this.stats.pipelineCacheHits++;
      return pending;
    }
    const promise = this.device.createRenderPipelineAsync(this.toNative(descriptor))
      .then((pipeline) => {
        this.stats.pipelinesCreated++;
        this.render.set(key, pipeline);
        this.renderPending.delete(key);
        return pipeline;
      })
      .catch((error: unknown) => {
        this.renderPending.delete(key);
        throw new WGPUError('Failed to create render pipeline', { cause: error });
      });
    this.renderPending.set(key, promise);
    return promise;
  }

  getCompute(descriptor: WGPUComputePipelineDescriptorLike): GPUComputePipeline {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUPipelineCache');
    const key = stableKey(descriptor);
    const existing = this.compute.get(key);
    if (existing) {
      this.stats.pipelineCacheHits++;
      return existing;
    }
    const pipeline = this.device.createComputePipeline(this.toNativeCompute(descriptor));
    this.stats.pipelinesCreated++;
    this.compute.set(key, pipeline);
    return pipeline;
  }

  private toNative(descriptor: WGPUPipelineDescriptor): GPURenderPipelineDescriptor {
    const native: GPURenderPipelineDescriptor = {
      label: descriptor.label,
      vertex: {
        ...descriptor.vertex,
        module: this.shaders.resolve(descriptor.vertex.module),
      },
      primitive: descriptor.primitive,
      depthStencil: descriptor.depthStencil,
      multisample: descriptor.multisample,
      layout: this.resolveLayout(descriptor.layout),
    };
    if (descriptor.fragment) {
      native.fragment = {
        ...descriptor.fragment,
        module: this.shaders.resolve(descriptor.fragment.module),
      };
    }
    return native;
  }

  private toNativeCompute(descriptor: WGPUComputePipelineDescriptorLike): GPUComputePipelineDescriptor {
    return {
      label: descriptor.label,
      layout: this.resolveLayout(descriptor.layout),
      compute: {
        ...descriptor.compute,
        module: this.shaders.resolve(descriptor.compute.module),
      },
    };
  }

  /** Turns an array of bind group layouts into a cached pipeline layout. */
  private resolveLayout(layout: WGPUPipelineDescriptor['layout']): 'auto' | GPUPipelineLayout {
    if (!layout || layout === 'auto') return 'auto';
    if (!Array.isArray(layout)) return layout as GPUPipelineLayout;
    const key = layout.map((item) => objectId(item)).join(',');
    let pipelineLayout = this.layouts.get(key);
    if (!pipelineLayout) {
      pipelineLayout = this.device.createPipelineLayout({ bindGroupLayouts: [...layout] });
      this.layouts.set(key, pipelineLayout);
    }
    return pipelineLayout;
  }

  get size(): number {
    return this.render.size + this.compute.size;
  }

  dispose(): void {
    this.disposedFlag = true;
    this.render.clear();
    this.renderPending.clear();
    this.compute.clear();
    this.layouts.clear();
    this.shaders.dispose();
  }
}

export interface WGPUBindGroupRequest {
  pipeline: GPURenderPipeline | GPUComputePipeline;
  group: number;
  entries: readonly { binding: number; resource: unknown }[];
}

/**
 * Caches explicit bind group layouts. Dynamic-offset uniform bindings require
 * `hasDynamicOffset: true`, which an `'auto'` layout cannot express, so this
 * cache makes the ergonomic uniform-ring path work with one layout object.
 */
export class WGPUBindGroupLayoutCache {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly layouts = new Map<string, GPUBindGroupLayout>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats) {
    this.device = device;
    this.stats = stats;
  }

  get(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUBindGroupLayoutCache');
    this.stats.bindGroupLayoutsRequested++;
    const key = stableKey(descriptor);
    const existing = this.layouts.get(key);
    if (existing) return existing;
    const layout = this.device.createBindGroupLayout(descriptor);
    this.stats.bindGroupLayoutsCreated++;
    this.layouts.set(key, layout);
    return layout;
  }

  get size(): number {
    return this.layouts.size;
  }

  dispose(): void {
    this.disposedFlag = true;
    this.layouts.clear();
  }
}

/**
 * Caches bind groups by (pipeline, group index, entries). Combined with dynamic
 * uniform offsets this keeps bind group creation to a one-time cost.
 */
export class WGPUBindGroupCache {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly groups = new Map<string, GPUBindGroup>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats) {
    this.device = device;
    this.stats = stats;
  }

  get(request: WGPUBindGroupRequest): GPUBindGroup {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUBindGroupCache');
    const key = `${objectId(request.pipeline)}:${request.group}:${bindGroupEntriesKey(request.entries as readonly { binding: number; resource: unknown }[])}`;
    const existing = this.groups.get(key);
    if (existing) {
      this.stats.bindGroupCacheHits++;
      return existing;
    }
    const entries: GPUBindGroupEntry[] = request.entries.map((entry) => {
      const resource = entry.resource as Record<string, unknown>;
      if (resource && typeof resource === 'object' && 'buffer' in resource) {
        return {
          binding: entry.binding,
          resource: {
            buffer: unwrapHandle(resource.buffer as GPUBuffer),
            offset: typeof resource.offset === 'number' ? resource.offset : 0,
            size: typeof resource.size === 'number' ? resource.size : undefined,
          },
        } as GPUBindGroupEntry;
      }
      return { binding: entry.binding, resource: unwrapHandle(entry.resource) as GPUBindingResource };
    });
    const layout = request.pipeline.getBindGroupLayout(request.group);
    this.stats.bindGroupLayoutsRequested++;
    const group = this.device.createBindGroup({ layout, entries, label: `bindgroup-${key}` });
    this.stats.bindGroupsCreated++;
    this.groups.set(key, group);
    return group;
  }

  get size(): number {
    return this.groups.size;
  }

  dispose(): void {
    this.disposedFlag = true;
    this.groups.clear();
  }
}

/** Caches sampler objects by descriptor content. */
export class WGPUSamplerCache {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly samplers = new Map<string, GPUSampler>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats) {
    this.device = device;
    this.stats = stats;
  }

  get(descriptor: GPUSamplerDescriptor = {}): GPUSampler {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUSamplerCache');
    const key = stableKey(descriptor);
    const existing = this.samplers.get(key);
    if (existing) {
      this.stats.samplerCacheHits++;
      return existing;
    }
    const sampler = this.device.createSampler(descriptor);
    this.stats.samplersCreated++;
    this.samplers.set(key, sampler);
    return sampler;
  }

  get size(): number {
    return this.samplers.size;
  }

  dispose(): void {
    this.disposedFlag = true;
    this.samplers.clear();
  }
}
