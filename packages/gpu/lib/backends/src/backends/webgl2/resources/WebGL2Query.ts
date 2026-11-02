import { BackendError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeQuery } from '../../webgl/native';
import type { WebGL2Context } from '../WebGL2Context';

/** 支持的查询类型。 */
export type QueryType = 'occlusion' | 'occlusion-conservative' | 'primitives-written' | 'timestamp';

/** 查询对象描述。 */
export interface QueryDesc {
  label?: string;
  type: QueryType;
}

/** WebGL2 查询对象。 */
export class WebGL2Query extends Resource<NativeQuery> {
  /** 原生查询目标（`ANY_SAMPLES_PASSED` 等）。 */
  readonly target: number;
  readonly #context: WebGL2Context;

  constructor(context: WebGL2Context, native: NativeQuery, target: number, label?: string) {
    super(native, { label });
    this.#context = context;
    this.target = target;
  }

  /** 开始查询。 */
  begin(): void {
    this.#context.gl2.beginQuery(this.target, this.handle);
  }

  /** 结束查询。 */
  end(): void {
    this.#context.gl2.endQuery(this.target);
  }

  /** 结果是否已经可用，避免同步等待。 */
  get available(): boolean {
    return this.#context.gl2.getQueryParameter(
      this.handle,
      this.#context.gl2.QUERY_RESULT_AVAILABLE,
    ) as boolean;
  }

  /** 读取查询结果；未完成时可能返回 0。 */
  getResult(): number {
    return this.#context.gl2.getQueryParameter(
      this.handle,
      this.#context.gl2.QUERY_RESULT,
    ) as number;
  }

  /** 上下文恢复：重新创建查询对象。 */
  override restore(): void {
    const native = this.#context.gl2.createQuery();
    if (native === null) {
      throw new BackendError('恢复查询对象失败', { code: 'ERR_WEBGL' });
    }
    this.markRestored(native);
  }

  protected override destroyNative(native: NativeQuery): void {
    this.#context.gl2.deleteQuery(native);
  }
}
