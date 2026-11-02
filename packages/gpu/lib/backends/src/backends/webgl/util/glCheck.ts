import { BackendError } from '../../../core/errors';

const ERROR_NAMES: Record<number, string> = {
  0: 'NO_ERROR',
  0x0500: 'INVALID_ENUM',
  0x0501: 'INVALID_VALUE',
  0x0502: 'INVALID_OPERATION',
  0x0505: 'OUT_OF_MEMORY',
  0x0506: 'INVALID_FRAMEBUFFER_OPERATION',
  0x9242: 'CONTEXT_LOST_WEBGL',
};

/** 将 WebGL 错误码转换为可读名称。 */
export function errorName(code: number): string {
  return ERROR_NAMES[code] ?? `0x${code.toString(16)}`;
}

/** 读取并清空当前错误队列，发现错误时抛出。 */
export function checkError(gl: WebGLRenderingContext, operation: string): void {
  const code = gl.getError();
  if (code !== gl.NO_ERROR) {
    throw new BackendError(`${operation} 产生 WebGL 错误：${errorName(code)}`, {
      code: 'ERR_WEBGL',
    });
  }
}

/** 校验帧缓冲完整性，不完整时抛出。 */
export function checkFramebufferStatus(gl: WebGLRenderingContext, target: number): void {
  const status = gl.checkFramebufferStatus(target);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new BackendError(`帧缓冲不完整：0x${status.toString(16)}`, {
      code: 'ERR_FRAMEBUFFER_INCOMPLETE',
    });
  }
}
