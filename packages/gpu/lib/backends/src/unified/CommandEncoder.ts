import type { WebGPUCommandEncoder } from '../backends/webgpu/command/WebGPUCommandEncoder';
import { BackendKind } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { Buffer } from './Buffer';
import { CommandBuffer } from './CommandBuffer';
import { ComputePassEncoder } from './ComputePassEncoder';
import type { Device } from './Device';
import { RenderPassEncoder } from './RenderPassEncoder';
import type {
  CommandEncoderDescriptor,
  ComputePassDescriptor,
  RenderPassDescriptor,
} from './types';

/** 统一的 WebGPU 风格命令编码器。 */
export class CommandEncoder {
  readonly label: string | undefined;
  readonly #device: Device;
  readonly #gpu: WebGPUCommandEncoder | null;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: CommandEncoderDescriptor = {}) {
    this.#device = device;
    this.label = desc.label;
    this.#gpu =
      device.backend === BackendKind.WebGPU
        ? device.gpuContext.createCommandEncoder(desc.label)
        : null;
  }

  /** 开始渲染通道。 */
  beginRenderPass(desc: RenderPassDescriptor): RenderPassEncoder {
    if (this.#gpu === null) {
      return new RenderPassEncoder(this.#device, desc, null);
    }
    const colorAttachments = desc.colorAttachments.map((attachment) => {
      const view = attachment.view.gpuView;
      if (view === null) {
        throw new ValidationError('WebGPU 颜色附件需要纹理视图');
      }
      return {
        view,
        clearValue: attachment.clearValue,
        loadOp: attachment.loadOp ?? 'clear',
        storeOp: attachment.storeOp ?? 'store',
      };
    });
    const depth = desc.depthStencilAttachment;
    const depthView = depth?.view.gpuView ?? null;
    if (depth !== undefined && depthView === null) {
      throw new ValidationError('WebGPU 深度附件需要纹理视图');
    }
    const gpuDesc: GPURenderPassDescriptor = {
      label: desc.label,
      colorAttachments,
      depthStencilAttachment:
        depth === undefined || depthView === null
          ? undefined
          : {
              view: depthView,
              depthClearValue: depth.depthClearValue,
              depthLoadOp: depth.depthLoadOp ?? 'clear',
              depthStoreOp: depth.depthStoreOp ?? 'store',
              stencilClearValue: depth.stencilClearValue,
              stencilLoadOp: depth.stencilLoadOp,
              stencilStoreOp: depth.stencilStoreOp,
            },
    };
    return new RenderPassEncoder(this.#device, desc, this.#gpu.beginRenderPass(gpuDesc));
  }

  /** 开始计算通道。 */
  beginComputePass(desc: ComputePassDescriptor = {}): ComputePassEncoder {
    if (this.#gpu === null) {
      throw new UnsupportedError('计算通道（WebGL）', this.#device.backend);
    }
    return new ComputePassEncoder(this.#device, this.#gpu.beginComputePass({ label: desc.label }));
  }

  /** 缓冲区间拷贝。 */
  copyBufferToBuffer(
    source: Buffer,
    sourceOffset: number,
    destination: Buffer,
    destinationOffset: number,
    size: number,
  ): void {
    if (this.#gpu !== null) {
      const from = source.gpuBuffer?.handle;
      const to = destination.gpuBuffer?.handle;
      if (from === undefined || to === undefined) {
        throw new ValidationError('拷贝需要 WebGPU 缓冲区');
      }
      this.#gpu.copyBufferToBuffer(from, sourceOffset, to, destinationOffset, size);
      return;
    }
    if (this.#device.backend !== BackendKind.WebGL2) {
      throw new UnsupportedError('copyBufferToBuffer（WebGL1）', 'webgl');
    }
    const gl = this.#device.glContext.gl as WebGL2RenderingContext;
    const from = source.glBuffer?.handle;
    const to = destination.glBuffer?.handle;
    if (from === undefined || to === undefined) {
      throw new ValidationError('拷贝需要 WebGL 缓冲区');
    }
    gl.bindBuffer(gl.COPY_READ_BUFFER, from);
    gl.bindBuffer(gl.COPY_WRITE_BUFFER, to);
    gl.copyBufferSubData(
      gl.COPY_READ_BUFFER,
      gl.COPY_WRITE_BUFFER,
      sourceOffset,
      destinationOffset,
      size,
    );
  }

  /** 结束编码并生成命令缓冲。 */
  finish(desc: { label?: string } = {}): CommandBuffer {
    if (this.#gpu === null) {
      return new CommandBuffer(null, desc.label);
    }
    return new CommandBuffer(this.#gpu.finish({ label: desc.label }), desc.label);
  }
}
