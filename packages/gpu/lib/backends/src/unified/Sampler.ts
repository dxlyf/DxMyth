import type { WebGLSampler } from '../backends/webgl/resources/WebGLSampler';
import type { WebGL2Sampler } from '../backends/webgl2/resources/WebGL2Sampler';
import type { WebGPUSampler } from '../backends/webgpu/resources/WebGPUSampler';
import type { BackendKind } from '../core/enums';
import type { Device } from './Device';
import type { UnifiedSamplerDescriptor } from './types';

/** 统一采样器。 */
export class Sampler {
  readonly label: string | undefined;
  readonly desc: Readonly<UnifiedSamplerDescriptor>;
  readonly #device: Device;
  readonly #gpu: WebGPUSampler | null;
  readonly #gl2: WebGL2Sampler | null;
  readonly #gl1: WebGLSampler | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(
    device: Device,
    desc: UnifiedSamplerDescriptor,
    gpu: WebGPUSampler | null,
    gl2: WebGL2Sampler | null,
    gl1: WebGLSampler | null,
  ) {
    this.#device = device;
    this.label = desc.label;
    this.desc = { ...desc };
    this.#gpu = gpu;
    this.#gl2 = gl2;
    this.#gl1 = gl1;
  }

  /** WebGPU 原生采样器。 */
  get gpuSampler(): WebGPUSampler | null {
    return this.#gpu;
  }

  /** WebGL2 原生采样器对象。 */
  get gl2Sampler(): WebGL2Sampler | null {
    return this.#gl2;
  }

  /** WebGL1 参数型采样器。 */
  get gl1Sampler(): WebGLSampler | null {
    return this.#gl1;
  }

  /** @internal 把采样参数写入当前绑定的纹理（WebGL1）。 */
  applyToTexture(gl: WebGLRenderingContext, target: number): void {
    this.#gl1?.apply(gl, target);
  }

  /** @internal WebGL2 原生采样器绑定。 */
  bind(unit: number): void {
    this.#gl2?.bind(unit);
  }

  /** 销毁采样器；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
    this.#gl2?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }

  /** @internal */
  get backend(): BackendKind {
    return this.#device.backend;
  }
}
