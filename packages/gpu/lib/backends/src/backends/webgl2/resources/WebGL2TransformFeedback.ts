import type { PrimitiveTopology } from '../../../core/enums';
import { BackendError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeTransformFeedback } from '../../webgl/native';
import { primitiveMode } from '../../webgl/util/glEnums';
import type { WebGL2Context } from '../WebGL2Context';

/** WebGL2 Transform Feedback 对象。 */
export class WebGL2TransformFeedback extends Resource<NativeTransformFeedback> {
  readonly #context: WebGL2Context;

  constructor(context: WebGL2Context, native: NativeTransformFeedback, label?: string) {
    super(native, { label });
    this.#context = context;
  }

  /** 绑定到 `TRANSFORM_FEEDBACK` 目标。 */
  bind(): void {
    const gl = this.#context.gl2;
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.handle);
  }

  /** 解绑。 */
  unbind(): void {
    const gl = this.#context.gl2;
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  }

  /** 开始记录。 */
  begin(topology: PrimitiveTopology = 'triangle-list'): void {
    this.#context.gl2.beginTransformFeedback(primitiveMode(this.#context.gl, topology));
  }

  /** 结束记录。 */
  end(): void {
    this.#context.gl2.endTransformFeedback();
  }

  /** 上下文恢复：重新创建对象。 */
  override restore(): void {
    const native = this.#context.gl2.createTransformFeedback();
    if (native === null) {
      throw new BackendError('恢复 Transform Feedback 失败', { code: 'ERR_WEBGL' });
    }
    this.markRestored(native);
  }

  protected override destroyNative(native: NativeTransformFeedback): void {
    this.#context.gl2.deleteTransformFeedback(native);
  }
}
