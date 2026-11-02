import { ResourceStateError } from './errors';
import type { Disposable } from './types';

let nextResourceId = 0;

/** 分配一个进程内唯一的资源 id。 */
export function allocResourceId(): number {
  return ++nextResourceId;
}

/** 资源通用选项。 */
export interface ResourceOptions {
  label?: string;
}

/**
 * 所有 GPU 资源的基类。
 *
 * 资源由所属上下文跟踪；`destroy()` 必须幂等，重复调用不得抛错。
 */
export abstract class Resource<TNative = unknown> implements Disposable {
  /** 进程内唯一 id，便于日志追踪。 */
  readonly id: number;
  readonly label: string | undefined;
  #native: TNative | null;
  #destroyed = false;
  #onDestroy: (() => void) | null = null;

  protected constructor(native: TNative, options: ResourceOptions = {}) {
    this.id = allocResourceId();
    this.label = options.label;
    this.#native = native;
  }

  /** 是否已销毁。 */
  get destroyed(): boolean {
    return this.#destroyed;
  }

  /** {@link destroyed} 的别名，便于实现 {@link Disposable}。 */
  get disposed(): boolean {
    return this.#destroyed;
  }

  /** 原生句柄；已销毁或上下文丢失时抛错。 */
  get handle(): TNative {
    if (this.#native === null) {
      throw new ResourceStateError(
        this.#destroyed
          ? `资源 #${this.id} 已销毁`
          : `资源 #${this.id} 的原生句柄不可用（上下文已丢失）`,
      );
    }
    return this.#native;
  }

  dispose(): void {
    this.destroy();
  }

  /** 销毁资源；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    const native = this.#native;
    this.#native = null;
    try {
      if (native !== null) {
        this.destroyNative(native);
      }
    } finally {
      const hook = this.#onDestroy;
      this.#onDestroy = null;
      hook?.();
    }
  }

  /** @internal 由 ResourceScope 注册，销毁时自动取消跟踪。 */
  setDestroyHook(hook: (() => void) | null): void {
    this.#onDestroy = hook;
  }

  /** 子类在此释放原生句柄。 */
  protected abstract destroyNative(native: TNative): void;

  /** @internal 上下文丢失时由上下文调用，句柄置空但保留资源对象。 */
  markLost(): void {
    this.#native = null;
  }

  /** @internal 上下文恢复后由上下文调用。 */
  markRestored(native: TNative): void {
    if (this.#destroyed) {
      return;
    }
    this.#native = native;
  }

  /**
   * 上下文恢复后重建原生句柄。
   *
   * 默认不做任何事；支持的资源会重写此方法。
   */
  restore(): void {
    // 默认不支持自动恢复。
  }
}
