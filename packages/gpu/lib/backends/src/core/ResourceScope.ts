import type { Resource } from './Resource';
import type { Disposable } from './types';

/** 跟踪一组资源，便于统一销毁。 */
export class ResourceScope implements Disposable {
  readonly #resources = new Set<Resource>();

  /** 当前跟踪的资源数量。 */
  get size(): number {
    return this.#resources.size;
  }

  /** 当前跟踪的资源快照。 */
  get resources(): readonly Resource[] {
    return [...this.#resources];
  }

  /** 纳入跟踪并返回同一个资源。 */
  track<T extends Resource>(resource: T): T {
    this.#resources.add(resource);
    resource.setDestroyHook(() => {
      this.#resources.delete(resource);
    });
    return resource;
  }

  /** 取消跟踪。 */
  untrack(resource: Resource): boolean {
    resource.setDestroyHook(null);
    return this.#resources.delete(resource);
  }

  /** 销毁全部资源；单个失败不影响其余资源，最后聚合抛出。 */
  disposeAll(): void {
    const snapshot = [...this.#resources];
    this.#resources.clear();
    const errors: unknown[] = [];
    for (const resource of snapshot) {
      try {
        resource.destroy();
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length > 0) {
      throw new AggregateError(errors, '销毁资源时发生错误');
    }
  }

  dispose(): void {
    this.disposeAll();
  }
}
