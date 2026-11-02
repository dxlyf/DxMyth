import { BackendError, ValidationError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { ShaderStage } from '../../../core/enums';
import type { NativeShader } from '../native';
import type { WebGLContext } from '../WebGLContext';
import { shaderType } from '../util/glEnums';

/** 编译着色器源码，失败时抛出包含编译日志的错误。 */
export function compileShader(
  gl: WebGLRenderingContext,
  stage: ShaderStage,
  source: string,
): NativeShader {
  const type = shaderType(gl, stage);
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new BackendError('创建着色器对象失败', { code: 'ERR_WEBGL' });
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? '(驱动未返回日志)';
    gl.deleteShader(shader);
    throw new BackendError(`着色器编译失败（${stage}）：\n${log}`, {
      code: 'ERR_SHADER_COMPILE',
    });
  }
  return shader;
}

/** 独立的着色器资源，适合需要手动链接的场景。 */
export class WebGLShader extends Resource<NativeShader> {
  readonly stage: ShaderStage;
  readonly source: string;
  readonly #gl: WebGLRenderingContext;

  constructor(context: WebGLContext, stage: ShaderStage, source: string) {
    if (source.trim() === '') {
      throw new ValidationError('着色器源码不能为空');
    }
    super(compileShader(context.gl, stage, source));
    this.#gl = context.gl;
    this.stage = stage;
    this.source = source;
  }

  /** 上下文恢复：重新编译。 */
  override restore(): void {
    this.markRestored(compileShader(this.#gl, this.stage, this.source));
  }

  protected override destroyNative(native: NativeShader): void {
    this.#gl.deleteShader(native);
  }
}
