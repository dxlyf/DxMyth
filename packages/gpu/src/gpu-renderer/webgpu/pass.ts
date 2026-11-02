import { WebGPUError, WebGPUResourceError } from './errors.js';
import type { BindGroupCache } from './bind-group.js';
import type { ComputePipelineHandle, RenderPipelineHandle } from './pipeline.js';
import type { GPUStatsTracker } from './stats.js';
import type { BindingValues, BufferHandle } from './types.js';

export class RenderPass {
  private pipeline: RenderPipelineHandle | null = null;
  private ended = false;

  constructor(
    private readonly native: GPURenderPassEncoder,
    private readonly bindGroups: BindGroupCache,
    private readonly stats: GPUStatsTracker,
    private readonly label: string,
  ) {}

  private ensureOpen(): void {
    if (this.ended) throw new WebGPUResourceError(`render pass "${this.label}"`);
  }

  setPipeline(pipeline: RenderPipelineHandle): this {
    this.ensureOpen();
    this.native.setPipeline(pipeline.native);
    this.pipeline = pipeline;
    this.stats.pipelineSwitches++;
    return this;
  }

  setBindings(group: number, values: BindingValues): this {
    this.ensureOpen();
    if (!this.pipeline) {
      throw new WebGPUError('webgpu/pass', 'setPipeline must be called before setBindings');
    }
    const resolved = this.bindGroups.get(this.pipeline, group, values);
    if (resolved.dynamicOffsets.length > 0) {
      this.native.setBindGroup(group, resolved.bindGroup, resolved.dynamicOffsets);
    } else {
      this.native.setBindGroup(group, resolved.bindGroup);
    }
    return this;
  }

  setVertexBuffer(slot: number, buffer: BufferHandle, offset = 0, size?: number): this {
    this.ensureOpen();
    this.native.setVertexBuffer(slot, buffer.buffer, offset, size ?? buffer.size - offset);
    return this;
  }

  setIndexBuffer(buffer: BufferHandle, format: GPUIndexFormat, offset = 0, size?: number): this {
    this.ensureOpen();
    this.native.setIndexBuffer(buffer.buffer, format, offset, size ?? buffer.size - offset);
    return this;
  }

  draw(vertexCount: number, instanceCount = 1, firstVertex = 0, firstInstance = 0): this {
    this.ensureOpen();
    this.native.draw(vertexCount, instanceCount, firstVertex, firstInstance);
    this.stats.drawCalls++;
    return this;
  }

  drawIndexed(
    indexCount: number,
    instanceCount = 1,
    firstIndex = 0,
    baseVertex = 0,
    firstInstance = 0,
  ): this {
    this.ensureOpen();
    this.native.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    this.stats.drawCalls++;
    return this;
  }

  setViewport(x: number, y: number, width: number, height: number, minDepth = 0, maxDepth = 1): this {
    this.ensureOpen();
    this.native.setViewport(x, y, width, height, minDepth, maxDepth);
    return this;
  }

  setScissorRect(x: number, y: number, width: number, height: number): this {
    this.ensureOpen();
    this.native.setScissorRect(x, y, width, height);
    return this;
  }

  pushDebugGroup(label: string): this {
    this.ensureOpen();
    this.native.pushDebugGroup(label);
    return this;
  }

  popDebugGroup(): this {
    this.ensureOpen();
    this.native.popDebugGroup();
    return this;
  }

  end(): void {
    if (this.ended) return;
    this.native.end();
    this.ended = true;
  }
}

export class ComputePass {
  private pipeline: ComputePipelineHandle | null = null;
  private ended = false;

  constructor(
    private readonly native: GPUComputePassEncoder,
    private readonly bindGroups: BindGroupCache,
    private readonly label: string,
  ) {}

  private ensureOpen(): void {
    if (this.ended) throw new WebGPUResourceError(`compute pass "${this.label}"`);
  }

  setPipeline(pipeline: ComputePipelineHandle): this {
    this.ensureOpen();
    this.native.setPipeline(pipeline.native);
    this.pipeline = pipeline;
    return this;
  }

  setBindings(group: number, values: BindingValues): this {
    this.ensureOpen();
    if (!this.pipeline) {
      throw new WebGPUError('webgpu/pass', 'setPipeline must be called before setBindings');
    }
    const resolved = this.bindGroups.get(this.pipeline, group, values);
    if (resolved.dynamicOffsets.length > 0) {
      this.native.setBindGroup(group, resolved.bindGroup, resolved.dynamicOffsets);
    } else {
      this.native.setBindGroup(group, resolved.bindGroup);
    }
    return this;
  }

  dispatchWorkgroups(x: number, y = 1, z = 1): this {
    this.ensureOpen();
    this.native.dispatchWorkgroups(x, y, z);
    return this;
  }

  end(): void {
    if (this.ended) return;
    this.native.end();
    this.ended = true;
  }
}
