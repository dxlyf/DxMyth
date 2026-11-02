import { Context, type ContextOptions } from '../../core/Context';
import type { Capabilities } from '../../core/Capabilities';
import type {
  BlendState,
  BufferDesc,
  Color,
  ColorMask,
  DepthStencilState,
  RasterizerState,
  RenderState,
  SamplerDesc,
  ScissorRect,
  TextureDesc,
  Viewport,
} from '../../core/descriptors';
import { BackendKind, type IndexFormat, type PrimitiveTopology } from '../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../core/errors';
import { ResourceScope } from '../../core/ResourceScope';
import { ExtensionRegistry } from './extensions/ExtensionRegistry';
import type { NativeVertexArray } from './native';
import { WebGLAttribute } from './resources/WebGLAttribute';
import { WebGLBuffer } from './resources/WebGLBuffer';
import { WebGLFramebuffer, type FramebufferDesc } from './resources/WebGLFramebuffer';
import { linkProgram, WebGLProgram, type ProgramDesc } from './resources/WebGLProgram';
import { WebGLRenderbuffer, type RenderbufferDesc } from './resources/WebGLRenderbuffer';
import { WebGLSampler } from './resources/WebGLSampler';
import { WebGLShader } from './resources/WebGLShader';
import { WebGLTexture } from './resources/WebGLTexture';
import { WebGLVertexArray, type VertexArrayDesc } from './resources/WebGLVertexArray';
import { StateCache } from './state/StateCache';
import { createWebGLCapabilities } from './WebGLCapabilities';
import { WebGLInfo } from './WebGLInfo';
import { primitiveMode } from './util/glEnums';

/** `drawArrays` 参数。 */
export interface DrawArraysDesc {
  /** 默认 `'triangle-list'`。 */
  mode?: PrimitiveTopology;
  /** 顶点数量。 */
  count: number;
  /** 起始顶点。 */
  first?: number;
  /** 实例数量；提供时使用实例化绘制。 */
  instances?: number;
}

/** `drawElements` 参数。 */
export interface DrawElementsDesc {
  /** 默认 `'triangle-list'`。 */
  mode?: PrimitiveTopology;
  /** 索引数量。 */
  count: number;
  /** 索引格式，默认 `'uint16'`。 */
  type?: IndexFormat;
  /** 索引数据在索引缓冲中的字节偏移。 */
  offset?: number;
  /** 实例数量；提供时使用实例化绘制。 */
  instances?: number;
}

/** 一次绘制调用的参数；按是否包含 `type` 区分数组 / 索引绘制。 */
export type DrawDesc = DrawArraysDesc | DrawElementsDesc;

/** 清屏参数。 */
export interface ClearDesc {
  color?: Color;
  depth?: number;
  stencil?: number;
}

/** 能力构建函数，允许 WebGL2 子类替换归一化结果。 */
export type CapabilitiesFactory = (
  gl: WebGLRenderingContext,
  extensions: ExtensionRegistry,
  info: WebGLInfo,
) => Capabilities;

/** WebGL1 上下文封装。 */
export class WebGLContext extends Context {
  readonly backend: BackendKind = BackendKind.WebGL;

  /** 原生 WebGL 上下文。 */
  readonly gl: WebGLRenderingContext;
  /** 扩展注册表。 */
  readonly extensions: ExtensionRegistry;
  /** 状态缓存。 */
  readonly state: StateCache;
  /** 驱动信息。 */
  readonly info: WebGLInfo;
  readonly capabilities: Capabilities;
  /** 资源跟踪与统一销毁。 */
  readonly scope = new ResourceScope();

  readonly #onLost: (event: Event) => void;
  readonly #onRestored: () => void;

  constructor(
    options: ContextOptions,
    gl: WebGLRenderingContext,
    capabilitiesFactory: CapabilitiesFactory = createWebGLCapabilities,
  ) {
    super(options);
    this.gl = gl;
    this.extensions = new ExtensionRegistry(gl);
    this.state = new StateCache(gl, this.extensions);
    this.info = new WebGLInfo(gl);
    this.capabilities = capabilitiesFactory(gl, this.extensions, this.info);
    this.state.setViewport({
      x: 0,
      y: 0,
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
    });

    this.#onLost = (event: Event): void => {
      // 阻止默认行为，浏览器才会在之后派发 restored 事件。
      event.preventDefault();
      this.state.reset();
      for (const resource of this.scope.resources) {
        resource.markLost();
      }
      this.events.emit('lost');
    };
    this.#onRestored = (): void => {
      const errors: unknown[] = [];
      for (const resource of this.scope.resources) {
        try {
          resource.restore();
        } catch (error) {
          errors.push(error);
        }
      }
      this.state.reset();
      if (errors.length > 0) {
        console.error('WebGL 上下文恢复时部分资源重建失败', errors);
      }
      this.events.emit('restored');
    };
    if ('addEventListener' in this.canvas) {
      this.canvas.addEventListener('webglcontextlost', this.#onLost);
      this.canvas.addEventListener('webglcontextrestored', this.#onRestored);
    }
  }

  /** 绘制缓冲宽度（设备像素）。 */
  override get width(): number {
    return this.gl.drawingBufferWidth;
  }

  /** 绘制缓冲高度（设备像素）。 */
  override get height(): number {
    return this.gl.drawingBufferHeight;
  }

  /** 创建缓冲区。 */
  createBuffer(desc: BufferDesc): WebGLBuffer {
    const native = this.gl.createBuffer();
    if (native === null) {
      throw new BackendError('创建缓冲区失败', { code: 'ERR_WEBGL' });
    }
    try {
      const buffer = new WebGLBuffer(this, native, desc);
      return this.scope.track(buffer);
    } catch (error) {
      this.gl.deleteBuffer(native);
      throw error;
    }
  }

  /** 创建二维纹理。 */
  createTexture(desc: TextureDesc): WebGLTexture {
    const native = this.gl.createTexture();
    if (native === null) {
      throw new BackendError('创建纹理失败', { code: 'ERR_WEBGL' });
    }
    try {
      const texture = new WebGLTexture(this, native, desc);
      return this.scope.track(texture);
    } catch (error) {
      this.gl.deleteTexture(native);
      throw error;
    }
  }

  /** 创建采样器；WebGL1 下它只是采样参数的容器。 */
  createSampler(desc: SamplerDesc = {}): WebGLSampler {
    return new WebGLSampler(desc);
  }

  /** 创建渲染缓冲。 */
  createRenderbuffer(desc: RenderbufferDesc): WebGLRenderbuffer {
    const native = this.gl.createRenderbuffer();
    if (native === null) {
      throw new BackendError('创建渲染缓冲失败', { code: 'ERR_WEBGL' });
    }
    try {
      const renderbuffer = new WebGLRenderbuffer(this, native, desc);
      return this.scope.track(renderbuffer);
    } catch (error) {
      this.gl.deleteRenderbuffer(native);
      throw error;
    }
  }

  /** 创建帧缓冲。 */
  createFramebuffer(desc: FramebufferDesc): WebGLFramebuffer {
    const native = this.gl.createFramebuffer();
    if (native === null) {
      throw new BackendError('创建帧缓冲失败', { code: 'ERR_WEBGL' });
    }
    try {
      const framebuffer = new WebGLFramebuffer(this, native, desc);
      return this.scope.track(framebuffer);
    } catch (error) {
      this.gl.deleteFramebuffer(native);
      throw error;
    }
  }

  /** 绑定帧缓冲；传 `null` 恢复默认帧缓冲。 */
  bindFramebuffer(framebuffer: WebGLFramebuffer | null): void {
    this.state.bindFramebuffer(
      this.gl.FRAMEBUFFER,
      framebuffer === null ? null : framebuffer.handle,
    );
  }

  /** 编译一个独立着色器。 */
  createShader(stage: 'vertex' | 'fragment', source: string): WebGLShader {
    const shader = new WebGLShader(this, stage, source);
    return this.scope.track(shader);
  }

  /** 由顶点 / 片元源码创建并链接程序。 */
  createProgram(desc: ProgramDesc): WebGLProgram {
    const { native, reflection } = linkProgram(this.gl, desc);
    try {
      const program = new WebGLProgram(this, native, desc, reflection);
      return this.scope.track(program);
    } catch (error) {
      this.gl.deleteProgram(native);
      throw error;
    }
  }

  /** 创建顶点数组对象。 */
  createVertexArray(desc: VertexArrayDesc): WebGLVertexArray {
    const native = this.createVertexArrayHandle();
    const previous = this.state.getBoundVertexArray();
    try {
      const attributes = this.resolveAttributes(desc);
      this.state.bindVertexArray(native);
      for (const attribute of attributes) {
        attribute.apply(this.gl, this.state, this.extensions);
      }
      const vertexArray = new WebGLVertexArray(this, native, attributes, desc.label);
      this.scope.track(vertexArray);
      return vertexArray;
    } catch (error) {
      const gl2 = this.gl as WebGL2RenderingContext;
      if (typeof gl2.deleteVertexArray === 'function') {
        gl2.deleteVertexArray(native);
      } else {
        this.extensions.vertexArrayObject?.deleteVertexArrayOES(native);
      }
      throw error;
    } finally {
      this.state.bindVertexArray(previous);
    }
  }

  /** 创建原生顶点数组对象；WebGL2 子类改为原生实现。 */
  protected createVertexArrayHandle(): NativeVertexArray {
    const extension = this.extensions.vertexArrayObject;
    if (extension === null) {
      throw new UnsupportedError('顶点数组对象（缺少 OES_vertex_array_object）', 'webgl');
    }
    const native = extension.createVertexArrayOES();
    if (native === null) {
      throw new BackendError('创建顶点数组对象失败', { code: 'ERR_WEBGL' });
    }
    return native;
  }

  /** 解析顶点属性的位置。 */
  protected resolveAttributes(desc: VertexArrayDesc): WebGLAttribute[] {
    return desc.attributes.map((attribute) => {
      let location = attribute.location;
      if (location === undefined) {
        if (attribute.name === undefined || desc.program === undefined) {
          throw new ValidationError('顶点属性需要显式 location，或提供 program 与 name 以便解析');
        }
        location = desc.program.getAttributeLocation(attribute.name);
        if (location < 0) {
          throw new ValidationError(`程序中没有活动属性「${attribute.name}」`);
        }
      }
      return new WebGLAttribute(this.gl, attribute, location);
    });
  }

  /** 使用程序。 */
  useProgram(program: WebGLProgram | null): void {
    this.state.useProgram(program === null ? null : program.handle);
  }

  /** 绑定顶点数组。 */
  bindVertexArray(vertexArray: WebGLVertexArray | null): void {
    this.state.bindVertexArray(vertexArray === null ? null : vertexArray.handle);
  }

  /** 设置视口。 */
  setViewport(viewport: Viewport): void {
    this.state.setViewport(viewport);
  }

  /** 一次性设置混合状态；`null` 关闭混合。 */
  setBlendState(state: BlendState | null): void {
    this.state.applyBlend(state);
  }

  /** 一次性设置深度 / 模板状态。 */
  setDepthStencilState(state: DepthStencilState): void {
    this.state.applyDepthStencil(state);
  }

  /** 一次性设置光栅化状态（剔除 / 绕序 / 多边形偏移）。 */
  setRasterizerState(state: RasterizerState): void {
    this.state.applyRasterizer(state);
  }

  /** 设置颜色写入掩码；传 `true` / `false` 表示全开 / 全关。 */
  setColorMask(mask: ColorMask | boolean): void {
    const value = typeof mask === 'boolean' ? { r: mask, g: mask, b: mask, a: mask } : mask;
    this.state.setColorMask(value.r, value.g, value.b, value.a);
  }

  /** 设置裁剪矩形；`null` 关闭裁剪。 */
  setScissor(rect: ScissorRect | null): void {
    this.state.applyScissor(rect);
  }

  /** 一次性应用一组渲染状态；省略的字段保持当前值。 */
  setRenderState(state: RenderState): void {
    if (state.viewport !== undefined) {
      this.state.setViewport(state.viewport);
    }
    if (state.scissor !== undefined) {
      this.state.applyScissor(state.scissor);
    }
    if (state.rasterizer !== undefined) {
      this.state.applyRasterizer(state.rasterizer);
    }
    if (state.depthStencil !== undefined) {
      this.state.applyDepthStencil(state.depthStencil);
    }
    if (state.blend !== undefined) {
      this.state.applyBlend(state.blend);
    }
    if (state.colorMask !== undefined) {
      const mask = state.colorMask;
      this.state.setColorMask(mask.r, mask.g, mask.b, mask.a);
    }
  }

  /** 清屏。 */
  clear(desc: ClearDesc): void {
    const gl = this.gl;
    let mask = 0;
    if (desc.color !== undefined) {
      this.state.setClearColor(desc.color.r, desc.color.g, desc.color.b, desc.color.a);
      mask |= gl.COLOR_BUFFER_BIT;
    }
    if (desc.depth !== undefined) {
      this.state.setClearDepth(desc.depth);
      mask |= gl.DEPTH_BUFFER_BIT;
    }
    if (desc.stencil !== undefined) {
      this.state.setClearStencil(desc.stencil);
      mask |= gl.STENCIL_BUFFER_BIT;
    }
    if (mask !== 0) {
      gl.clear(mask);
    }
  }

  /** 执行一次绘制；按描述符字段自动选择数组 / 索引绘制。 */
  draw(desc: DrawDesc): void {
    if ('type' in desc) {
      this.drawElements(desc);
      return;
    }
    this.drawArrays(desc);
  }

  /** 数组绘制。 */
  drawArrays(desc: DrawArraysDesc): void {
    if (!Number.isInteger(desc.count) || desc.count <= 0) {
      throw new ValidationError('绘制顶点数量必须大于 0');
    }
    if (desc.instances !== undefined && desc.instances <= 0) {
      throw new ValidationError('实例数量必须大于 0');
    }
    const gl = this.gl;
    const gl2 = gl as WebGL2RenderingContext;
    const mode = primitiveMode(gl, desc.mode ?? 'triangle-list');

    if (desc.instances !== undefined) {
      if (this.backend === BackendKind.WebGL2) {
        gl2.drawArraysInstanced(mode, desc.first ?? 0, desc.count, desc.instances);
        return;
      }
      const instanced = this.extensions.instancedArrays;
      if (instanced === null) {
        throw new UnsupportedError('实例化绘制（缺少 ANGLE_instanced_arrays）', 'webgl');
      }
      instanced.drawArraysInstancedANGLE(mode, desc.first ?? 0, desc.count, desc.instances);
      return;
    }
    gl.drawArrays(mode, desc.first ?? 0, desc.count);
  }

  /** 索引绘制；需要当前 VAO 已绑定索引缓冲。 */
  drawElements(desc: DrawElementsDesc): void {
    if (!Number.isInteger(desc.count) || desc.count <= 0) {
      throw new ValidationError('索引数量必须大于 0');
    }
    if (desc.instances !== undefined && desc.instances <= 0) {
      throw new ValidationError('实例数量必须大于 0');
    }
    const gl = this.gl;
    const gl2 = gl as WebGL2RenderingContext;
    const isWebGL2 = this.backend === BackendKind.WebGL2;
    const mode = primitiveMode(gl, desc.mode ?? 'triangle-list');
    const type = desc.type === 'uint32' ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    if (type === gl.UNSIGNED_INT && !isWebGL2 && this.extensions.elementIndexUint === null) {
      throw new UnsupportedError('32 位索引（缺少 OES_element_index_uint）', 'webgl');
    }
    const offset = desc.offset ?? 0;

    if (desc.instances !== undefined) {
      if (isWebGL2) {
        gl2.drawElementsInstanced(mode, desc.count, type, offset, desc.instances);
        return;
      }
      const instanced = this.extensions.instancedArrays;
      if (instanced === null) {
        throw new UnsupportedError('实例化绘制（缺少 ANGLE_instanced_arrays）', 'webgl');
      }
      instanced.drawElementsInstancedANGLE(mode, desc.count, type, offset, desc.instances);
      return;
    }
    gl.drawElements(mode, desc.count, type, offset);
  }

  /** 调整绘制缓冲尺寸并同步视口。 */
  override resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      throw new ValidationError('画布尺寸必须大于 0');
    }
    const canvas = this.canvas;
    canvas.width = width;
    canvas.height = height;
    this.state.setViewport({ x: 0, y: 0, width, height });
    this.events.emit('resize', { width, height });
  }

  /** 释放资源与事件监听。 */
  protected override disposeContext(): void {
    if ('removeEventListener' in this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.#onLost);
      this.canvas.removeEventListener('webglcontextrestored', this.#onRestored);
    }
    this.scope.disposeAll();
    this.state.reset();
  }
}
