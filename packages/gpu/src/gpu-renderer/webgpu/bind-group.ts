import { WebGPUBindingError } from './errors.js';
import type { GPUStatsTracker } from './stats.js';
import { isTextureHandle, type BindGroupEntryDecl, type BindingValue, type BindingValues } from './types.js';
import type { GroupLayout } from './pipeline.js';
import type { UniformBlock } from './uniform.js';

function isUniformBlock(value: unknown): value is UniformBlock {
  return typeof value === 'object' && value !== null && 'layout' in value && 'bufferId' in value;
}

function isBufferHandle(value: unknown): value is { buffer: GPUBuffer; size: number } {
  return typeof value === 'object' && value !== null && 'buffer' in value && 'size' in value;
}

interface CacheEntry {
  readonly ids: number[];
  readonly aux: number[];
  readonly bindGroup: GPUBindGroup;
}

export interface ResolvedBindGroup {
  bindGroup: GPUBindGroup;
  dynamicOffsets: number[];
}

interface ResolvedResource {
  resource: GPUBindingResource;
  identity: number;
  aux: number;
  dynamicOffset: number | null;
}

/**
 * Caches GPUBindGroup objects by resource identity.
 *
 * Identity is a pair of numbers per entry (handle id + offset/aux), compared
 * element-wise, so the hot path allocates nothing: scratch arrays are reused
 * and no strings are built. Uniform blocks contribute their arena buffer id
 * and pass their offset as a dynamic offset.
 */
export class BindGroupCache {
  private readonly cache = new Map<GPUBindGroupLayout, CacheEntry[]>();
  private readonly objectIds = new WeakMap<object, number>();
  private readonly ids: number[] = [];
  private readonly aux: number[] = [];
  private readonly offsets: number[] = [];
  private readonly resources: GPUBindingResource[] = [];
  private readonly bindings: number[] = [];
  private readonly seen = new Set<string>();
  private nextObjectId = 1;

  constructor(
    private readonly device: GPUDevice,
    private readonly stats: GPUStatsTracker,
    private readonly maxPerGroup = 64,
  ) {}

  get(pipeline: { group(index: number): GroupLayout }, groupIndex: number, values: BindingValues): ResolvedBindGroup {
    const group = pipeline.group(groupIndex);

    this.ids.length = 0;
    this.aux.length = 0;
    this.offsets.length = 0;
    this.resources.length = 0;
    this.bindings.length = 0;
    this.seen.clear();

    for (const declaration of group.entries) {
      const value = values[declaration.name];
      if (value === undefined || value === null) {
        throw new WebGPUBindingError(groupIndex, declaration.name, 'missing value');
      }
      this.seen.add(declaration.name);
      const resolved = this.resolve(declaration, value, groupIndex);
      this.ids.push(resolved.identity);
      this.aux.push(resolved.aux);
      this.bindings.push(declaration.binding);
      this.resources.push(resolved.resource);
      if (resolved.dynamicOffset !== null) this.offsets.push(resolved.dynamicOffset);
    }

    for (const name in values) {
      if (!this.seen.has(name)) {
        throw new WebGPUBindingError(groupIndex, name, 'not declared in this bind group');
      }
    }

    const cached = this.cache.get(group.layout);
    if (cached) {
      for (const entry of cached) {
        if (this.matches(entry)) {
          this.stats.bindGroupCacheHits++;
          return { bindGroup: entry.bindGroup, dynamicOffsets: this.offsets };
        }
      }
    }

    const entries: GPUBindGroupEntry[] = new Array(this.resources.length);
    for (let i = 0; i < this.resources.length; i++) {
      entries[i] = {
        binding: this.bindings[i] as number,
        resource: this.resources[i] as GPUBindingResource,
      };
    }
    const bindGroup = this.device.createBindGroup({ layout: group.layout, entries });
    this.stats.bindGroupCacheMisses++;

    let bucket = this.cache.get(group.layout);
    if (!bucket) {
      bucket = [];
      this.cache.set(group.layout, bucket);
    }
    if (bucket.length >= this.maxPerGroup) bucket.shift();
    bucket.push({ ids: this.ids.slice(), aux: this.aux.slice(), bindGroup });
    return { bindGroup, dynamicOffsets: this.offsets };
  }

  private matches(entry: CacheEntry): boolean {
    if (entry.ids.length !== this.ids.length) return false;
    for (let i = 0; i < this.ids.length; i++) {
      if (entry.ids[i] !== this.ids[i] || entry.aux[i] !== this.aux[i]) return false;
    }
    return true;
  }

  private resolve(
    declaration: BindGroupEntryDecl,
    value: BindingValue,
    groupIndex: number,
  ): ResolvedResource {
    const name = declaration.name;

    if (declaration.buffer) {
      if (declaration.buffer.hasDynamicOffset) {
        if (!isUniformBlock(value)) {
          throw new WebGPUBindingError(groupIndex, name, 'dynamic-offset buffer must be a uniform block');
        }
        return {
          resource: { buffer: value.buffer, size: value.size },
          identity: value.bufferId,
          aux: 0,
          dynamicOffset: value.offset,
        };
      }
      if (isUniformBlock(value)) {
        return {
          resource: { buffer: value.buffer, offset: value.offset, size: value.size },
          identity: value.bufferId,
          aux: value.offset + 1,
          dynamicOffset: null,
        };
      }
      if (isBufferHandle(value)) {
        return {
          resource: { buffer: value.buffer, size: value.size },
          identity: this.objectId(value),
          aux: 1,
          dynamicOffset: null,
        };
      }
      throw new WebGPUBindingError(groupIndex, name, 'expected a buffer handle or uniform block');
    }

    if (declaration.texture || declaration.storageTexture) {
      if (isTextureHandle(value)) {
        return {
          resource: declaration.storageTexture ? value.createView() : value.view,
          identity: value.id,
          aux: declaration.storageTexture ? 2 : 1,
          dynamicOffset: null,
        };
      }
      return {
        resource: value as GPUTextureView,
        identity: this.objectId(value as object),
        aux: 3,
        dynamicOffset: null,
      };
    }

    if (declaration.sampler) {
      return {
        resource: value as GPUSampler,
        identity: this.objectId(value as object),
        aux: 4,
        dynamicOffset: null,
      };
    }

    throw new WebGPUBindingError(groupIndex, name, 'declaration has no buffer/texture/sampler entry');
  }

  private objectId(value: object): number {
    const existing = this.objectIds.get(value);
    if (existing !== undefined) return existing;
    const id = this.nextObjectId++;
    this.objectIds.set(value, id);
    return id;
  }

  clear(): void {
    this.cache.clear();
  }
}
