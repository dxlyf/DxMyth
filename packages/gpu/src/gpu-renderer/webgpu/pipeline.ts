import type { GPUStatsTracker } from './stats.js';
import type { BindGroupEntryDecl } from './types.js';

export interface GroupLayout {
  group: number;
  layout: GPUBindGroupLayout;
  entries: readonly BindGroupEntryDecl[];
}

export class RenderPipelineHandle {
  constructor(
    readonly label: string,
    readonly native: GPURenderPipeline,
    readonly groups: ReadonlyMap<number, GroupLayout>,
  ) {}

  group(index: number): GroupLayout {
    const group = this.groups.get(index);
    if (!group) throw new Error(`pipeline "${this.label}" has no bind group ${index}`);
    return group;
  }
}

export class ComputePipelineHandle {
  constructor(
    readonly label: string,
    readonly native: GPUComputePipeline,
    readonly groups: ReadonlyMap<number, GroupLayout>,
  ) {}

  group(index: number): GroupLayout {
    const group = this.groups.get(index);
    if (!group) throw new Error(`pipeline "${this.label}" has no bind group ${index}`);
    return group;
  }
}

/** Bounded FIFO cache keyed by the normalized descriptor. */
export class PipelineCache<T> {
  private readonly entries = new Map<string, Promise<T>>();
  private readonly order: string[] = [];
  private readonly max: number;

  constructor(
    private readonly stats: GPUStatsTracker,
    max = 256,
  ) {
    this.max = max;
  }

  get(key: string): Promise<T> | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    this.stats.pipelineCacheHits++;
    return entry;
  }

  set(key: string, pipeline: Promise<T>): void {
    this.stats.pipelineCacheMisses++;
    this.entries.set(key, pipeline);
    this.order.push(key);
    while (this.order.length > this.max) {
      const oldest = this.order.shift();
      if (oldest !== undefined) this.entries.delete(oldest);
    }
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
    this.order.length = 0;
  }
}
