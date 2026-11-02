import type { BufferDesc } from '../../../core/descriptors';
import { BufferUsage } from '../../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeBuffer } from '../native';
import type { WebGLContext } from '../WebGLContext';
import { bufferTarget, bufferUsageHint } from '../util/glEnums';

/** 创建缓冲区缓冲。 */
export class WebGLBuffer extends Resource<NativeBuffer> {
  /** 绑定目标：`ARRAY_BUFFER`、`ELEMENT_ARRAY_BUFFER` 或 `UNIFORM_BUFFER`。 */
  readonly target: number;
  /** 使用频率提示。 */
  readonly usageHint: number;
  /** 字节大小。 */
  readonly byteLength: number;
  readonly #context: WebGLContext;
  readonly #desc: BufferDesc;

  constructor(context: WebGLContext, native: NativeBuffer, desc: BufferDesc) {
    super(native, { label: desc.label });
    this.#context = context;
    this.#desc = { ...desc };

    if (desc.data !== undefined && desc.size !== undefined) {
      throw new ValidationError('缓冲区不能同时指定 data 与 size');
    }
    if (desc.mappedAtCreation === true) {
      throw new UnsupportedError('mappedAtCreation（WebGL）', 'webgl');
    }
    const targets = [BufferUsage.Vertex, BufferUsage.Index, BufferUsage.Uniform].filter(
      (flag) => (desc.usage & flag) !== 0,
    );
    if (targets.length !== 1) {
      throw new ValidationError('缓冲区用途必须且只能设置 Vertex、Index、Uniform 之一');
    }
    const unsupported =
      BufferUsage.Storage |
      BufferUsage.Indirect |
      BufferUsage.MapRead |
      BufferUsage.MapWrite |
      BufferUsage.QueryResolve;
    if ((desc.usage & unsupported) !== 0) {
      throw new UnsupportedError('存储 / 间接 / 映射缓冲（WebGL）', 'webgl');
    }

    this.target = bufferTarget(context.gl, desc.usage);
    this.usageHint = bufferUsageHint(context.gl, desc.usage);

    const byteLength = desc.data?.byteLength ?? desc.size ?? 0;
    if (!Number.isInteger(byteLength) || byteLength <= 0) {
      throw new ValidationError('缓冲区大小必须是大于 0 的整数');
    }
    this.byteLength = byteLength;

    const state = context.state;
    const previous = state.getBoundBuffer(this.target);
    state.bindBuffer(this.target, native);
    try {
      if (desc.data !== undefined) {
        context.gl.bufferData(this.target, desc.data, this.usageHint);
      } else {
        context.gl.bufferData(this.target, byteLength, this.usageHint);
      }
    } finally {
      state.bindBuffer(this.target, previous);
    }
  }

  /** 创建参数，供上下文恢复使用。 */
  get descriptor(): Readonly<BufferDesc> {
    return this.#desc;
  }

  /** 绑定到自身目标。 */
  bind(): void {
    this.#context.state.bindBuffer(this.target, this.handle);
  }

  /** 上下文恢复：重新创建并上传。 */
  override restore(): void {
    const gl = this.#context.gl;
    const native = gl.createBuffer();
    if (native === null) {
      throw new BackendError('恢复缓冲区失败', { code: 'ERR_WEBGL' });
    }
    const state = this.#context.state;
    const previous = state.getBoundBuffer(this.target);
    state.bindBuffer(this.target, native);
    try {
      if (this.#desc.data !== undefined) {
        gl.bufferData(this.target, this.#desc.data, this.usageHint);
      } else {
        gl.bufferData(this.target, this.byteLength, this.usageHint);
      }
    } catch (error) {
      state.bindBuffer(this.target, previous);
      gl.deleteBuffer(native);
      throw error;
    }
    state.bindBuffer(this.target, previous);
    this.markRestored(native);
  }

  /** 更新部分数据。 */
  update(data: ArrayBufferView, offset = 0): void {
    if (offset < 0 || offset + data.byteLength > this.byteLength) {
      throw new ValidationError('缓冲区更新超出范围');
    }
    this.bind();
    this.#context.gl.bufferSubData(this.target, offset, data);
  }

  protected override destroyNative(native: NativeBuffer): void {
    this.#context.state.onBufferDestroyed(this.target, native);
    this.#context.gl.deleteBuffer(native);
  }
}
