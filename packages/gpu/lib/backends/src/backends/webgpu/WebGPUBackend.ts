import { Backend, type BackendCreateOptions } from '../../core/Backend';
import { BackendKind } from '../../core/enums';
import { UnsupportedError } from '../../core/errors';
import { WebGPUContext, type WebGPUContextOptions } from './WebGPUContext';

/** WebGPU 后端。 */
export class WebGPUBackend extends Backend<WebGPUContext> {
  readonly kind = BackendKind.WebGPU;

  /** 当前环境是否提供 WebGPU。 */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && navigator.gpu !== undefined;
  }

  /** 请求适配器与设备，并创建上下文。 */
  async create(options: BackendCreateOptions): Promise<WebGPUContext> {
    if (typeof navigator === 'undefined' || navigator.gpu === undefined) {
      throw new UnsupportedError('WebGPU（navigator.gpu 不可用）', 'webgpu');
    }
    const powerPreference =
      options.powerPreference === 'default' ? undefined : options.powerPreference;
    const adapter = await navigator.gpu.requestAdapter({ powerPreference });
    if (adapter === null) {
      throw new UnsupportedError('WebGPU 适配器', 'webgpu');
    }
    const device = await adapter.requestDevice();
    const contextOptions = options as WebGPUContextOptions;
    return new WebGPUContext(contextOptions, adapter, device);
  }
}
