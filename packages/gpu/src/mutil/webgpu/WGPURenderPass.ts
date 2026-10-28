import { WGPUDisposedError, WGPUError } from './errors.js';
import { objectId, unwrapHandle } from './WGPUDescriptors.js';
import type { WGPUStats } from './types.js';

/**
 * A render pass encoder with a per-pass state cache.
 *
 * WebGPU validation and driver bookkeeping make redundant encoder calls more
 * expensive than GL state changes, so pipeline, bind group (including dynamic
 * offsets), vertex/index buffer, viewport, scissor, stencil reference and blend
 * constant writes are all de-duplicated.
 */
export class WGPURenderPass {
  private readonly encoder: GPURenderPassEncoder;
  private readonly stats: WGPUStats;
  private readonly bindGroupKeys = new Map<number, string>();
  private readonly vertexBufferKeys = new Map<number, string>();
  private pipeline: GPURenderPipeline | null = null;
  private indexBufferKey: string | null = null;
  private viewportKey = '';
  private scissorKey = '';
  private stencilReference: number | null = null;
  private blendConstantKey = '';
  private endedFlag = false;

  constructor(encoder: GPURenderPassEncoder, stats: WGPUStats) {
    this.encoder = encoder;
    this.stats = stats;
  }

  get handle(): GPURenderPassEncoder {
    return this.encoder;
  }

  get ended(): boolean {
    return this.endedFlag;
  }

  setPipeline(pipeline: GPURenderPipeline): this {
    this.assertOpen();
    this.stats.stateCalls++;
    if (this.pipeline === pipeline) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setPipeline(pipeline);
    this.pipeline = pipeline;
    // Bind group layouts may be incompatible across pipelines; rebind them.
    this.bindGroupKeys.clear();
    return this;
  }

  setBindGroup(index: number, group: GPUBindGroup, dynamicOffsets?: readonly number[]): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const offsets = dynamicOffsets && dynamicOffsets.length > 0 ? dynamicOffsets : undefined;
    const key = `${objectId(group)}|${offsets ? offsets.join(',') : ''}`;
    if (this.bindGroupKeys.get(index) === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setBindGroup(index, group, offsets as Iterable<number> | undefined);
    this.bindGroupKeys.set(index, key);
    return this;
  }

  setVertexBuffer(slot: number, buffer: GPUBuffer, offset = 0, size?: number): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const handle = unwrapHandle(buffer);
    const key = `${objectId(handle)}|${offset}|${size ?? 0}`;
    if (this.vertexBufferKeys.get(slot) === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setVertexBuffer(slot, handle, offset, size);
    this.vertexBufferKeys.set(slot, key);
    return this;
  }

  setIndexBuffer(buffer: GPUBuffer, format: GPUIndexFormat, offset = 0, size?: number): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const handle = unwrapHandle(buffer);
    const key = `${objectId(handle)}|${format}|${offset}|${size ?? 0}`;
    if (this.indexBufferKey === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setIndexBuffer(handle, format, offset, size);
    this.indexBufferKey = key;
    return this;
  }

  setViewport(x: number, y: number, width: number, height: number, minDepth = 0, maxDepth = 1): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const key = `${x}|${y}|${width}|${height}|${minDepth}|${maxDepth}`;
    if (this.viewportKey === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setViewport(x, y, width, height, minDepth, maxDepth);
    this.viewportKey = key;
    return this;
  }

  setScissorRect(x: number, y: number, width: number, height: number): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const key = `${x}|${y}|${width}|${height}`;
    if (this.scissorKey === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setScissorRect(x, y, width, height);
    this.scissorKey = key;
    return this;
  }

  setStencilReference(reference: number): this {
    this.assertOpen();
    this.stats.stateCalls++;
    if (this.stencilReference === reference) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setStencilReference(reference);
    this.stencilReference = reference;
    return this;
  }

  setBlendConstant(color: GPUColor): this {
    this.assertOpen();
    this.stats.stateCalls++;
    const key = Array.isArray(color) ? color.join(',') : `${(color as GPUColorDict).r},${(color as GPUColorDict).g},${(color as GPUColorDict).b},${(color as GPUColorDict).a}`;
    if (this.blendConstantKey === key) {
      this.stats.stateSkipped++;
      return this;
    }
    this.encoder.setBlendConstant(color);
    this.blendConstantKey = key;
    return this;
  }

  draw(vertexCount: number, instanceCount = 1, firstVertex = 0, firstInstance = 0): void {
    this.assertOpen();
    this.encoder.draw(vertexCount, instanceCount, firstVertex, firstInstance);
    this.stats.drawCalls++;
  }

  drawIndexed(indexCount: number, instanceCount = 1, firstIndex = 0, baseVertex = 0, firstInstance = 0): void {
    this.assertOpen();
    this.encoder.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    this.stats.drawCalls++;
  }

  end(): void {
    if (this.endedFlag) throw new WGPUError('Render pass has already ended');
    this.endedFlag = true;
    this.encoder.end();
  }

  private assertOpen(): void {
    if (this.endedFlag) throw new WGPUDisposedError('WGPURenderPass (already ended)');
  }
}
