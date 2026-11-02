import type { Backend, BackendCreateOptions } from '../core/Backend';
import type { Context } from '../core/Context';
import { BackendKind } from '../core/enums';
import { UnsupportedError } from '../core/errors';
import { WebGLBackend } from './webgl/WebGLBackend';
import { WebGL2Backend } from './webgl2/WebGL2Backend';
import { WebGPUBackend } from './webgpu/WebGPUBackend';

interface BackendEntry {
  kind: BackendKind;
  backend: Backend;
}

/** 内置后端，顺序即默认优先级。 */
const ENTRIES: readonly BackendEntry[] = [
  { kind: BackendKind.WebGPU, backend: new WebGPUBackend() },
  { kind: BackendKind.WebGL2, backend: new WebGL2Backend() },
  { kind: BackendKind.WebGL, backend: new WebGLBackend() },
];

/** 解析后端尝试顺序；未知或重复的 kind 会被忽略。 */
export function resolveBackendOrder(prefer?: readonly BackendKind[]): Backend[] {
  const requested =
    prefer === undefined || prefer.length === 0
      ? ENTRIES.map((entry) => entry.kind)
      : [...new Set(prefer)];

  return requested
    .map((kind) => ENTRIES.find((entry) => entry.kind === kind)?.backend)
    .filter((backend): backend is Backend => backend !== undefined);
}

/** 创建后端上下文时的选项。 */
export interface CreateBackendOptions extends BackendCreateOptions {
  /** 后端优先级；省略时为 WebGPU → WebGL2 → WebGL。 */
  prefer?: readonly BackendKind[];
}

/** 按优先级创建第一个可用后端。 */
export async function createBackend(options: CreateBackendOptions): Promise<Context> {
  const order = resolveBackendOrder(options.prefer);
  let lastError: unknown;

  for (const backend of order) {
    try {
      if (!backend.isSupported()) {
        continue;
      }
      return await backend.create(options);
    } catch (error) {
      lastError = error;
    }
  }

  throw new UnsupportedError(
    `没有可用的图形后端（尝试：${order.map((backend) => backend.kind).join(' → ') || '无'}）`,
    'auto',
    lastError,
  );
}
