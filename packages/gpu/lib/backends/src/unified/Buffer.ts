import type { WebGLBuffer } from '../backends/webgl/resources/WebGLBuffer';
import type { WebGPUBuffer } from '../backends/webgpu/resources/WebGPUBuffer';
import { BackendKind, BufferUsage } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { Device } from './Device';
import type { BufferDescriptor } from './types';

let nextBufferId = 0;

/**
 * 统一的 WebGPU 风格缓冲区。
 *
 * WebGPU 后端直接包装 `GPUBuffer`；WebGL 后端维护一份 CPU 影子数据，
 * 用于 `writeBuffer`、映射读取以及未来的 WebGL1 uniform 模拟。
 */
export class Buffer {
  readonly size: number;
  readonly usage: number;
  readonly label: string | undefined;

  readonly #device: Device;
  readonly #gpu: WebGPUBuffer | null;
  readonly #gl: WebGLBuffer | null;
  readonly #shadow: Uint8Array | null;
  readonly id: number;
  #destroyed = false;
  #mapped: ArrayBuffer | null = null;
  #mappedOffset = 0;

  constructor(device: Device, desc: BufferDescriptor) {
    if (!Number.isInteger(desc.size) || desc.size <= 0) {
      throw new ValidationError('缓冲区大小必须是大于 0 的整数');
    }
    this.id = ++nextBufferId;
    if (desc.mappedAtCreation === true && device.backend !== BackendKind.WebGPU) {
      throw new UnsupportedError('mappedAtCreation（WebGL）', 'webgl');
    }
    this.#device = device;
    this.size = desc.size;
    this.usage = desc.usage;
    this.label = desc.label;

    if (device.backend === BackendKind.WebGPU) {
      this.#gpu = device.gpuContext.createBuffer({
        label: desc.label,
        size: desc.size,
        usage: desc.usage,
        mappedAtCreation: desc.mappedAtCreation,
      });
      this.#gl = null;
      this.#shadow = null;
      return;
    }

    const targets = [BufferUsage.Vertex, BufferUsage.Index, BufferUsage.Uniform].filter(
      (flag) => (desc.usage & flag) !== 0,
    );
    if (targets.length !== 1) {
      throw new ValidationError('WebGL 缓冲区用途必须且只能设置 Vertex、Index、Uniform 之一');
    }
    const unsupported =
      BufferUsage.Storage |
      BufferUsage.Indirect |
      BufferUsage.QueryResolve |
      BufferUsage.MapRead |
      BufferUsage.MapWrite;
    if ((desc.usage & unsupported) !== 0) {
      throw new UnsupportedError('存储 / 间接 / 映射缓冲（WebGL）', 'webgl');
    }
    const context = device.glContext;
    this.#gl = context.createBuffer({
      label: desc.label,
      size: desc.size,
      usage: desc.usage,
    });
    this.#gpu = null;
    this.#shadow = new Uint8Array(desc.size);
  }

  /** 是否为 WebGPU 后端资源。 */
  get isGpu(): boolean {
    return this.#gpu !== null;
  }

  /** WebGPU 原生缓冲区。 */
  get gpuBuffer(): WebGPUBuffer | null {
    return this.#gpu;
  }

  /** WebGL 原生缓冲区。 */
  get glBuffer(): WebGLBuffer | null {
    return this.#gl;
  }

  /** 销毁缓冲区；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
    this.#gl?.destroy();
  }

  /** @internal 写入 CPU / GPU 数据。 */
  write(offset: number, data: ArrayBufferView): void {
    if (offset < 0 || offset + data.byteLength > this.size) {
      throw new ValidationError('缓冲区写入超出范围');
    }
    if (this.#gpu !== null) {
      this.#gpu.write(data, offset);
      return;
    }
    this.#gl?.update(data, offset);
    if (this.#shadow !== null) {
      this.#shadow.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), offset);
    }
  }

  /** @internal 读取 CPU 影子数据；WebGPU 后端需要先映射。 */
  read(offset = 0, size = this.size - offset): Uint8Array {
    if (offset < 0 || size < 0 || offset + size > this.size) {
      throw new ValidationError('缓冲区读取超出范围');
    }
    if (this.#shadow !== null) {
      return this.#shadow.slice(offset, offset + size);
    }
    if (this.#mapped !== null) {
      return new Uint8Array(this.#mapped, this.#mappedOffset, size).slice();
    }
    throw new ValidationError('WebGPU 缓冲区需要先 mapAsync 才能读取');
  }

  /** 映射缓冲区；WebGL 后端使用 CPU 影子数据。 */
  async mapAsync(_mode: number = 1, _offset = 0, _size = this.size - _offset): Promise<void> {
    if (this.#gpu !== null) {
      await this.#gpu.mapAsync(_mode);
      return;
    }
    this.#mappedOffset = 0;
    this.#mapped = (this.#shadow?.slice().buffer ?? new ArrayBuffer(0)) as ArrayBuffer;
  }

  /** 获取映射区间。 */
  getMappedRange(offset = 0, size?: number): ArrayBuffer {
    if (this.#gpu !== null) {
      return this.#gpu.getMappedRange(offset, size);
    }
    if (this.#mapped === null) {
      throw new ValidationError('缓冲区尚未映射');
    }
    const available = this.#mapped.byteLength - offset;
    return this.#mapped.slice(offset, offset + (size ?? available));
  }

  /** 解除映射；WebGL 后端会把映射内容写回。 */
  unmap(): void {
    if (this.#gpu !== null) {
      this.#gpu.unmap();
      return;
    }
    this.#mapped = null;
  }

  /** @internal 所属设备。 */
  get device(): Device {
    return this.#device;
  }
}
