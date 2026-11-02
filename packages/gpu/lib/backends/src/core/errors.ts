/** 本库抛出的所有错误的基类。 */
export interface BackendErrorOptions {
  cause?: unknown;
  /** 稳定的机器可读错误码，例如 `ERR_UNSUPPORTED`。 */
  code?: string;
}

/** 所有错误的基类。 */
export class BackendError extends Error {
  readonly code: string;

  constructor(message: string, options: BackendErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = new.target.name;
    this.code = options.code ?? 'ERR_BACKEND';
  }
}

/** 当前后端无法提供所请求特性时抛出。 */
export class UnsupportedError extends BackendError {
  readonly feature: string;

  constructor(feature: string, backend?: string, cause?: unknown) {
    super(`不支持的特性「${feature}」${backend === undefined ? '' : `（后端：${backend}）`}`, {
      code: 'ERR_UNSUPPORTED',
      cause,
    });
    this.name = 'UnsupportedError';
    this.feature = feature;
  }
}

/** 描述符在到达 GPU 之前校验失败时抛出。 */
export class ValidationError extends BackendError {
  constructor(message: string, options: BackendErrorOptions = {}) {
    super(message, { ...options, code: options.code ?? 'ERR_VALIDATION' });
    this.name = 'ValidationError';
  }
}

/** GPU 设备已丢失且无法原地恢复时抛出。 */
export class DeviceLostError extends BackendError {
  readonly reason: string;

  constructor(reason: string, options: BackendErrorOptions = {}) {
    super(`GPU 设备已丢失：${reason}`, { ...options, code: 'ERR_DEVICE_LOST' });
    this.name = 'DeviceLostError';
    this.reason = reason;
  }
}

/** 资源仍在使用时上下文丢失，抛出此错误。 */
export class ContextLostError extends BackendError {
  constructor(message = '图形上下文已丢失', options: BackendErrorOptions = {}) {
    super(message, { ...options, code: 'ERR_CONTEXT_LOST' });
    this.name = 'ContextLostError';
  }
}

/** 访问已销毁或已丢失的资源时抛出。 */
export class ResourceStateError extends BackendError {
  constructor(message: string, options: BackendErrorOptions = {}) {
    super(message, { ...options, code: 'ERR_RESOURCE_STATE' });
    this.name = 'ResourceStateError';
  }
}
