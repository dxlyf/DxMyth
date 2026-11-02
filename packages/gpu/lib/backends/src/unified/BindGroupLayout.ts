import type { WebGPUBindGroupLayout } from '../backends/webgpu/resources/WebGPUBindGroupLayout';
import { BackendKind } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { Device } from './Device';
import type { BindGroupLayoutDescriptor, BindGroupLayoutEntry } from './types';

/** 统一的绑定组布局。 */
export class BindGroupLayout {
  readonly label: string | undefined;
  readonly entries: readonly BindGroupLayoutEntry[];
  readonly #device: Device;
  readonly #gpu: WebGPUBindGroupLayout | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: BindGroupLayoutDescriptor) {
    this.#device = device;
    this.label = desc.label;
    this.entries = [...desc.entries];
    const seen = new Set<number>();
    for (const entry of this.entries) {
      if (!Number.isInteger(entry.binding) || entry.binding < 0) {
        throw new ValidationError('绑定索引必须是非负整数');
      }
      if (seen.has(entry.binding)) {
        throw new ValidationError(`重复的绑定索引 ${entry.binding}`);
      }
      seen.add(entry.binding);
      const count =
        (entry.buffer === undefined ? 0 : 1) +
        (entry.texture === undefined ? 0 : 1) +
        (entry.sampler === undefined ? 0 : 1);
      if (count !== 1) {
        throw new ValidationError(`绑定 ${entry.binding} 必须且只能指定一种资源类型`);
      }
      if (entry.buffer?.type === 'storage' || entry.buffer?.type === 'read-only-storage') {
        if (device.backend !== BackendKind.WebGPU) {
          throw new UnsupportedError('存储缓冲绑定（WebGL）', device.backend);
        }
      }
    }

    if (device.backend === BackendKind.WebGPU) {
      this.#gpu = device.gpuContext.createBindGroupLayout({
        label: desc.label,
        entries: this.entries.map((entry) => ({
          binding: entry.binding,
          visibility: entry.visibility,
          buffer:
            entry.buffer === undefined
              ? undefined
              : {
                  type: entry.buffer.type,
                  hasDynamicOffset: entry.buffer.hasDynamicOffset,
                  minBindingSize: entry.buffer.minBindingSize,
                },
          texture:
            entry.texture === undefined
              ? undefined
              : {
                  sampleType: entry.texture.sampleType,
                  viewDimension: entry.texture.viewDimension,
                  multisampled: entry.texture.multisampled,
                },
          sampler: entry.sampler === undefined ? undefined : { type: entry.sampler.type },
        })),
      });
    } else {
      this.#gpu = null;
    }
  }

  /** WebGPU 原生布局。 */
  get gpuLayout(): WebGPUBindGroupLayout | null {
    return this.#gpu;
  }

  /** 按 binding 查找条目。 */
  entry(binding: number): BindGroupLayoutEntry {
    const found = this.entries.find((entry) => entry.binding === binding);
    if (found === undefined) {
      throw new ValidationError(`绑定组布局中不存在 binding ${binding}`);
    }
    return found;
  }

  /** 销毁布局；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}
