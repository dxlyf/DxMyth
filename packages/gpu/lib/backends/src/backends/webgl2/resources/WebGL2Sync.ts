import { BackendError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeSync } from '../../webgl/native';
import type { WebGL2Context } from '../WebGL2Context';

/** WebGL2 同步对象（fence）。 */
export class WebGL2Sync extends Resource<NativeSync> {
  readonly #context: WebGL2Context;

  constructor(context: WebGL2Context, native: NativeSync, label?: string) {
    super(native, { label });
    this.#context = context;
  }

  /** 当前状态，不阻塞。 */
  status(): number {
    return this.#context.gl2.clientWaitSync(this.handle, 0, 0);
  }

  /** 等待同步对象；`timeoutNs` 为 0 时只查询一次。 */
  wait(timeoutNs = 0): boolean {
    const gl = this.#context.gl2;
    const status = gl.clientWaitSync(this.handle, gl.SYNC_FLUSH_COMMANDS_BIT, timeoutNs);
    return status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED;
  }

  /** 上下文恢复：重新插入一个 fence（原 fence 语义已丢失）。 */
  override restore(): void {
    const gl = this.#context.gl2;
    const native = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (native === null) {
      throw new BackendError('恢复同步对象失败', { code: 'ERR_WEBGL' });
    }
    this.markRestored(native);
  }

  protected override destroyNative(native: NativeSync): void {
    this.#context.gl2.deleteSync(native);
  }
}
