import type { ContextOptions } from '../../core/Context';
import type { SamplerDesc } from '../../core/descriptors';
import { BackendKind, BufferUsage } from '../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../core/errors';
import type { NativeVertexArray } from '../webgl/native';
import { WebGLContext } from '../webgl/WebGLContext';
import { createWebGL2Capabilities } from './WebGL2Capabilities';
import { WebGL2Query, type QueryDesc } from './resources/WebGL2Query';
import { WebGL2Sampler } from './resources/WebGL2Sampler';
import { WebGL2Sync } from './resources/WebGL2Sync';
import { WebGL2TransformFeedback } from './resources/WebGL2TransformFeedback';
import { WebGL2UniformBlock, type UniformBlockDesc } from './resources/WebGL2UniformBlock';

/** WebGL2 上下文封装。 */
export class WebGL2Context extends WebGLContext {
  override readonly backend: BackendKind = BackendKind.WebGL2;
  readonly #uniformBlocks = new Set<WebGL2UniformBlock>();

  constructor(options: ContextOptions, gl: WebGL2RenderingContext) {
    super(options, gl as unknown as WebGLRenderingContext, createWebGL2Capabilities);
    this.events.on('restored', () => {
      for (const block of this.#uniformBlocks) {
        try {
          block.bind();
        } catch (error) {
          console.error('恢复 uniform 块绑定失败', error);
        }
      }
    });
  }

  /** 原生 WebGL2 上下文。 */
  get gl2(): WebGL2RenderingContext {
    return this.gl as WebGL2RenderingContext;
  }

  /** 创建原生采样器对象（与 WebGL1 的参数型 `createSampler` 区分）。 */
  createSamplerObject(desc: SamplerDesc = {}): WebGL2Sampler {
    const gl = this.gl2;
    const native = gl.createSampler();
    if (native === null) {
      throw new BackendError('创建采样器失败', { code: 'ERR_WEBGL' });
    }
    try {
      return this.scope.track(new WebGL2Sampler(this, native, desc));
    } catch (error) {
      gl.deleteSampler(native);
      throw error;
    }
  }

  /** 使用原生的顶点数组对象。 */
  protected override createVertexArrayHandle(): NativeVertexArray {
    const native = this.gl2.createVertexArray();
    if (native === null) {
      throw new BackendError('创建顶点数组对象失败', { code: 'ERR_WEBGL' });
    }
    return native;
  }

  /** 创建 uniform 块（UBO）。 */
  createUniformBlock(desc: UniformBlockDesc): WebGL2UniformBlock {
    if (desc.data === undefined && desc.size === undefined) {
      throw new ValidationError('Uniform 块需要提供 data 或 size');
    }
    const buffer = this.createBuffer({
      label: desc.label,
      data: desc.data,
      size: desc.size,
      usage: BufferUsage.Uniform | BufferUsage.CopyDst,
    });
    const block = new WebGL2UniformBlock(this, buffer, desc.binding);
    this.#uniformBlocks.add(block);
    return block;
  }

  /** 创建查询对象。 */
  createQuery(desc: QueryDesc): WebGL2Query {
    const gl = this.gl2;
    let target: number;
    switch (desc.type) {
      case 'occlusion':
        target = gl.ANY_SAMPLES_PASSED;
        break;
      case 'occlusion-conservative':
        target = gl.ANY_SAMPLES_PASSED_CONSERVATIVE;
        break;
      case 'primitives-written':
        target = gl.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN;
        break;
      case 'timestamp': {
        const extension = this.extensions.get<{ TIME_ELAPSED_EXT: number }>(
          'EXT_disjoint_timer_query_webgl2',
        );
        if (extension === null) {
          throw new UnsupportedError(
            '时间戳查询（缺少 EXT_disjoint_timer_query_webgl2）',
            'webgl2',
          );
        }
        target = extension.TIME_ELAPSED_EXT;
        break;
      }
      default:
        throw new ValidationError(`未知的查询类型：${String(desc.type)}`);
    }

    const native = gl.createQuery();
    if (native === null) {
      throw new BackendError('创建查询对象失败', { code: 'ERR_WEBGL' });
    }
    try {
      const query = new WebGL2Query(this, native, target, desc.label);
      return this.scope.track(query);
    } catch (error) {
      gl.deleteQuery(native);
      throw error;
    }
  }

  /** 创建 Transform Feedback 对象。 */
  createTransformFeedback(label?: string): WebGL2TransformFeedback {
    const gl = this.gl2;
    const native = gl.createTransformFeedback();
    if (native === null) {
      throw new BackendError('创建 Transform Feedback 失败', { code: 'ERR_WEBGL' });
    }
    try {
      return this.scope.track(new WebGL2TransformFeedback(this, native, label));
    } catch (error) {
      gl.deleteTransformFeedback(native);
      throw error;
    }
  }

  /** 创建同步对象（fence）。 */
  createSync(label?: string): WebGL2Sync {
    const gl = this.gl2;
    const native = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (native === null) {
      throw new BackendError('创建同步对象失败', { code: 'ERR_WEBGL' });
    }
    try {
      return this.scope.track(new WebGL2Sync(this, native, label));
    } catch (error) {
      gl.deleteSync(native);
      throw error;
    }
  }
}
