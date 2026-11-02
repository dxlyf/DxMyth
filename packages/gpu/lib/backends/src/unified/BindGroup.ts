import type { WebGPUBindGroup } from '../backends/webgpu/resources/WebGPUBindGroup';
import { BackendKind } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { Device } from './Device';
import type { BindGroupLayout } from './BindGroupLayout';
import type { BindGroupDescriptor, BindGroupEntry } from './types';

/** 统一的绑定组。 */
export class BindGroup {
  readonly label: string | undefined;
  readonly layout: BindGroupLayout;
  readonly entries: readonly BindGroupEntry[];
  readonly #device: Device;
  readonly #gpu: WebGPUBindGroup | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: BindGroupDescriptor) {
    this.#device = device;
    this.label = desc.label;
    this.layout = desc.layout;
    this.entries = [...desc.entries];

    for (const entry of this.entries) {
      const layoutEntry = this.layout.entry(entry.binding);
      const hasBuffer = 'buffer' in entry.resource;
      const hasView = 'view' in entry.resource;
      const hasSampler = 'sampler' in entry.resource;
      const count = (hasBuffer ? 1 : 0) + (hasView ? 1 : 0) + (hasSampler ? 1 : 0);
      if (count !== 1) {
        throw new ValidationError(`绑定 ${entry.binding} 必须且只能提供一种资源`);
      }
      if (layoutEntry.buffer !== undefined && !hasBuffer) {
        throw new ValidationError(`绑定 ${entry.binding} 需要缓冲区`);
      }
      if (layoutEntry.texture !== undefined && !hasView) {
        throw new ValidationError(`绑定 ${entry.binding} 需要纹理视图`);
      }
      if (layoutEntry.sampler !== undefined && !hasSampler) {
        throw new ValidationError(`绑定 ${entry.binding} 需要采样器`);
      }
      if (hasBuffer && device.backend === BackendKind.WebGL) {
        throw new UnsupportedError('WebGL 的 uniform 缓冲绑定（降级模式）', 'webgl');
      }
    }

    if (device.backend === BackendKind.WebGPU) {
      this.#gpu = device.gpuContext.createBindGroup({
        label: desc.label,
        layout: this.layout.gpuLayout?.handle as GPUBindGroupLayout,
        entries: this.entries.map((entry) => ({
          binding: entry.binding,
          resource: this.#gpuResource(entry),
        })),
      });
    } else {
      this.#gpu = null;
    }
  }

  #gpuResource(entry: BindGroupEntry): GPUBindingResource {
    if ('buffer' in entry.resource) {
      const { buffer, offset = 0, size } = entry.resource;
      const handle = buffer.gpuBuffer?.handle;
      if (handle === undefined) {
        throw new ValidationError('绑定组中的缓冲区不是 WebGPU 缓冲区');
      }
      return { buffer: handle, offset, size };
    }
    if ('view' in entry.resource) {
      const view = entry.resource.view.gpuView;
      if (view === null) {
        throw new ValidationError('绑定组中的纹理视图不是 WebGPU 视图');
      }
      return view;
    }
    const sampler = entry.resource.sampler.gpuSampler;
    if (sampler === null) {
      throw new ValidationError('绑定组中的采样器不是 WebGPU 采样器');
    }
    return sampler.handle;
  }

  /** WebGPU 原生绑定组。 */
  get gpuBindGroup(): WebGPUBindGroup | null {
    return this.#gpu;
  }

  /** 按 binding 查找条目。 */
  entry(binding: number): BindGroupEntry {
    const found = this.entries.find((entry) => entry.binding === binding);
    if (found === undefined) {
      throw new ValidationError(`绑定组中不存在 binding ${binding}`);
    }
    return found;
  }

  /** 销毁绑定组；幂等。 */
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
