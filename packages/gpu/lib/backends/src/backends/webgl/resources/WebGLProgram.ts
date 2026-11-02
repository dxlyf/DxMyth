import { BackendError, UnsupportedError, ValidationError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeProgram, NativeShader } from '../native';
import {
  reflectProgram,
  type ProgramReflection,
  type ReflectedAttribute,
} from '../reflection/ProgramReflection';
import type { WebGLContext } from '../WebGLContext';
import { compileShader } from './WebGLShader';
import type { WebGLShader } from './WebGLShader';
import { WebGLUniform } from './WebGLUniform';

/** 创建程序的描述。 */
export interface ProgramDesc {
  label?: string;
  /** 顶点着色器源码；与 `vertexShader` 二选一。 */
  vertex?: string;
  /** 片元着色器源码；与 `fragmentShader` 二选一。 */
  fragment?: string;
  /** 独立编译的顶点着色器对象；与 `vertex` 二选一。 */
  vertexShader?: WebGLShader;
  /** 独立编译的片元着色器对象；与 `fragment` 二选一。 */
  fragmentShader?: WebGLShader;
  /** 链接前显式绑定的属性位置。 */
  attributeLocations?: Record<string, number>;
  /** WebGL2：链接前声明的 transform feedback varying 列表。 */
  transformFeedbackVaryings?: string[];
  /** WebGL2：varying 模式，默认 `'separate'`。 */
  transformFeedbackMode?: 'separate' | 'interleaved';
}

/** 链接结果。 */
export interface LinkedProgram {
  native: NativeProgram;
  reflection: ProgramReflection;
}

/**
 * 编译并链接程序。
 *
 * 该函数不创建资源对象，便于上下文创建与上下文恢复复用。
 */
export function linkProgram(gl: WebGLRenderingContext, desc: ProgramDesc): LinkedProgram {
  const fromSources = desc.vertex !== undefined || desc.fragment !== undefined;
  const fromObjects = desc.vertexShader !== undefined || desc.fragmentShader !== undefined;
  if (fromSources === fromObjects) {
    throw new ValidationError('程序必须提供源码或着色器对象（二选一）');
  }
  if (fromSources && (desc.vertex === undefined || desc.fragment === undefined)) {
    throw new ValidationError('必须同时提供顶点与片元源码');
  }
  if (fromObjects && (desc.vertexShader === undefined || desc.fragmentShader === undefined)) {
    throw new ValidationError('必须同时提供顶点与片元着色器对象');
  }
  if (desc.vertex !== undefined && desc.vertex.trim() === '') {
    throw new ValidationError('顶点着色器源码不能为空');
  }
  if (desc.fragment !== undefined && desc.fragment.trim() === '') {
    throw new ValidationError('片元着色器源码不能为空');
  }

  const gl2 = gl as WebGL2RenderingContext;
  if (
    desc.transformFeedbackVaryings !== undefined &&
    typeof gl2.transformFeedbackVaryings !== 'function'
  ) {
    throw new UnsupportedError('Transform Feedback（WebGL1）', 'webgl');
  }

  const owned: NativeShader[] = [];
  let vertexShader: NativeShader;
  let fragmentShader: NativeShader;
  if (desc.vertexShader !== undefined) {
    vertexShader = desc.vertexShader.handle;
  } else {
    vertexShader = compileShader(gl, 'vertex', desc.vertex!);
    owned.push(vertexShader);
  }
  try {
    if (desc.fragmentShader !== undefined) {
      fragmentShader = desc.fragmentShader.handle;
    } else {
      fragmentShader = compileShader(gl, 'fragment', desc.fragment!);
      owned.push(fragmentShader);
    }
  } catch (error) {
    for (const shader of owned) {
      gl.deleteShader(shader);
    }
    throw error;
  }

  let native: NativeProgram | null = null;
  try {
    native = gl.createProgram();
    if (native === null) {
      throw new BackendError('创建程序对象失败', { code: 'ERR_WEBGL' });
    }
    gl.attachShader(native, vertexShader);
    gl.attachShader(native, fragmentShader);
    if (desc.attributeLocations !== undefined) {
      for (const [name, location] of Object.entries(desc.attributeLocations)) {
        gl.bindAttribLocation(native, location, name);
      }
    }
    if (desc.transformFeedbackVaryings !== undefined) {
      gl2.transformFeedbackVaryings(
        native,
        desc.transformFeedbackVaryings,
        desc.transformFeedbackMode === 'interleaved'
          ? gl2.INTERLEAVED_ATTRIBS
          : gl2.SEPARATE_ATTRIBS,
      );
    }
    gl.linkProgram(native);
    const linked = gl.getProgramParameter(native, gl.LINK_STATUS) as boolean;

    gl.detachShader(native, vertexShader);
    gl.detachShader(native, fragmentShader);
    for (const shader of owned) {
      gl.deleteShader(shader);
    }

    if (!linked) {
      const log = gl.getProgramInfoLog(native) ?? '(驱动未返回日志)';
      throw new BackendError(`程序链接失败：\n${log}`, { code: 'ERR_PROGRAM_LINK' });
    }

    return { native, reflection: reflectProgram(gl, native) };
  } catch (error) {
    for (const shader of owned) {
      gl.deleteShader(shader);
    }
    if (native !== null) {
      gl.deleteProgram(native);
    }
    throw error;
  }
}

/** WebGL 程序对象（着色器 + 反射信息）。 */
export class WebGLProgram extends Resource<NativeProgram> {
  readonly #context: WebGLContext;
  readonly #desc: ProgramDesc;
  #uniforms: ReadonlyMap<string, WebGLUniform>;
  #attributes: ReadonlyMap<string, ReflectedAttribute>;

  constructor(
    context: WebGLContext,
    native: NativeProgram,
    desc: ProgramDesc,
    reflection: ProgramReflection,
  ) {
    super(native, { label: desc.label });
    this.#context = context;
    this.#desc = { ...desc };
    this.#uniforms = new Map();
    this.#attributes = new Map();
    this.#rebuild(reflection);
  }

  /** 按逻辑名称索引的 uniform。 */
  get uniforms(): ReadonlyMap<string, WebGLUniform> {
    return this.#uniforms;
  }

  /** 按名称索引的活动属性。 */
  get attributes(): ReadonlyMap<string, ReflectedAttribute> {
    return this.#attributes;
  }

  /** 使用此程序。 */
  use(): void {
    this.#context.state.useProgram(this.handle);
  }

  /** 按名称查找 uniform，不存在时返回 `undefined`。 */
  getUniform(name: string): WebGLUniform | undefined {
    return this.#uniforms.get(name);
  }

  /** 按名称查找 uniform，不存在时抛错。 */
  requireUniform(name: string): WebGLUniform {
    const uniform = this.#uniforms.get(name);
    if (uniform === undefined) {
      throw new ValidationError(`程序「${this.label ?? this.id}」中不存在 uniform「${name}」`);
    }
    return uniform;
  }

  /** 查询属性位置；未使用时返回 `-1`。 */
  getAttributeLocation(name: string): number {
    return this.#context.gl.getAttribLocation(this.handle, name);
  }

  /** 把 uniform 块绑定到指定绑定点（WebGL2）。 */
  bindUniformBlock(name: string, binding: number): void {
    const gl = this.#context.gl as WebGL2RenderingContext;
    if (typeof gl.getUniformBlockIndex !== 'function') {
      throw new ValidationError('Uniform 块只支持 WebGL2');
    }
    const index = gl.getUniformBlockIndex(this.handle, name);
    if (index === gl.INVALID_INDEX) {
      throw new ValidationError(`程序「${this.label ?? this.id}」中不存在 uniform 块「${name}」`);
    }
    gl.uniformBlockBinding(this.handle, index, binding);
  }

  /** 上下文恢复：重新链接并刷新反射信息。 */
  override restore(): void {
    const { native, reflection } = linkProgram(this.#context.gl, this.#desc);
    this.markRestored(native);
    this.#rebuild(reflection);
  }

  #rebuild(reflection: ProgramReflection): void {
    this.#attributes = new Map(
      reflection.attributes.map((attribute) => [attribute.name, attribute]),
    );
    this.#uniforms = new Map(
      reflection.uniforms.map((uniform) => [
        uniform.name,
        new WebGLUniform(this.#context.gl, uniform),
      ]),
    );
  }

  protected override destroyNative(native: NativeProgram): void {
    this.#context.state.onProgramDestroyed(native);
    this.#context.gl.deleteProgram(native);
  }
}
