import type {
  BlendState,
  DepthStencilState,
  RasterizerState,
  ScissorRect,
  Viewport,
} from '../../../core/descriptors';
import { UnsupportedError } from '../../../core/errors';
import type { ExtensionRegistry } from '../extensions/ExtensionRegistry';
import {
  blendEquation,
  blendFactor,
  compareFunction,
  cullFace,
  frontFace,
  stencilOperation,
} from '../util/glEnums';

/**
 * WebGL 状态缓存。
 *
 * 所有状态写入先与影子状态比较，值未变化时直接返回，避免重复的 GL 调用。
 * 上下文丢失或恢复后必须调用 {@link reset}，让缓存与驱动状态重新对齐。
 */
export class StateCache {
  readonly #gl: WebGLRenderingContext;
  readonly #extensions: ExtensionRegistry;
  readonly #capabilities = new Map<number, boolean>();
  readonly #textures = new Map<string, WebGLTexture | null>();
  readonly #pixelStore = new Map<number, number>();

  #program: WebGLProgram | null = null;
  #vertexArray: WebGLVertexArrayObject | null = null;
  #arrayBuffer: WebGLBuffer | null = null;
  #elementArrayBuffer: WebGLBuffer | null = null;
  #framebuffer: WebGLFramebuffer | null = null;
  #renderbuffer: WebGLRenderbuffer | null = null;
  #activeTextureUnit = -1;
  #viewport: Viewport | null = null;
  #clearColor: readonly [number, number, number, number] | null = null;
  #clearDepth: number | null = null;
  #clearStencil: number | null = null;
  #depthTest: boolean | null = null;
  #depthMask: boolean | null = null;
  #depthFunc: number | null = null;
  #blend: boolean | null = null;
  #blendFunc: readonly [number, number, number, number] | null = null;
  #blendEquation: readonly [number, number] | null = null;
  #cullFace: number | null = null;
  #frontFace: number | null = null;
  #colorMask: readonly [boolean, boolean, boolean, boolean] | null = null;
  #scissorTest: boolean | null = null;
  #scissor: ScissorRect | null = null;
  #stencilTest: boolean | null = null;
  #stencilFunc = new Map<number, readonly [number, number, number]>();
  #stencilOp = new Map<number, readonly [number, number, number]>();
  #stencilMask = new Map<number, number>();
  #polygonOffsetEnabled: boolean | null = null;
  #polygonOffset: readonly [number, number] | null = null;

  constructor(gl: WebGLRenderingContext, extensions: ExtensionRegistry) {
    this.#gl = gl;
    this.#extensions = extensions;
  }

  /** 绑定程序。 */
  useProgram(program: WebGLProgram | null): void {
    if (this.#program === program) {
      return;
    }
    this.#gl.useProgram(program);
    this.#program = program;
  }

  /** 绑定顶点数组对象；WebGL2 使用原生实现，WebGL1 走扩展。 */
  bindVertexArray(vertexArray: WebGLVertexArrayObject | null): void {
    const gl2 = this.#gl as WebGL2RenderingContext;
    if (typeof gl2.bindVertexArray === 'function') {
      if (this.#vertexArray === vertexArray) {
        return;
      }
      gl2.bindVertexArray(vertexArray);
      this.#vertexArray = vertexArray;
      return;
    }
    const extension = this.#extensions.vertexArrayObject;
    if (extension === null) {
      if (vertexArray !== null) {
        throw new UnsupportedError('顶点数组对象（WebGL1 缺少 OES_vertex_array_object）', 'webgl');
      }
      return;
    }
    if (this.#vertexArray === vertexArray) {
      return;
    }
    extension.bindVertexArrayOES(vertexArray);
    this.#vertexArray = vertexArray;
  }

  /** 绑定缓冲区，仅缓存 ARRAY_BUFFER 与 ELEMENT_ARRAY_BUFFER。 */
  bindBuffer(target: number, buffer: WebGLBuffer | null): void {
    if (target === this.#gl.ARRAY_BUFFER) {
      if (this.#arrayBuffer === buffer) {
        return;
      }
      this.#gl.bindBuffer(target, buffer);
      this.#arrayBuffer = buffer;
      return;
    }
    if (target === this.#gl.ELEMENT_ARRAY_BUFFER) {
      if (this.#elementArrayBuffer === buffer) {
        return;
      }
      this.#gl.bindBuffer(target, buffer);
      this.#elementArrayBuffer = buffer;
      return;
    }
    this.#gl.bindBuffer(target, buffer);
  }

  /** 激活纹理单元。 */
  activeTexture(unit: number): void {
    if (unit === this.#activeTextureUnit) {
      return;
    }
    this.#gl.activeTexture(this.#gl.TEXTURE0 + unit);
    this.#activeTextureUnit = unit;
  }

  /** 把纹理绑定到当前纹理单元的指定目标。 */
  bindTexture(target: number, texture: WebGLTexture | null): void {
    const unit = Math.max(this.#activeTextureUnit, 0);
    const key = `${unit}:${target}`;
    if (this.#textures.has(key) && this.#textures.get(key) === texture) {
      return;
    }
    this.#gl.bindTexture(target, texture);
    this.#textures.set(key, texture);
  }

  /** 绑定帧缓冲。 */
  bindFramebuffer(target: number, framebuffer: WebGLFramebuffer | null): void {
    if (this.#framebuffer === framebuffer) {
      return;
    }
    this.#gl.bindFramebuffer(target, framebuffer);
    this.#framebuffer = framebuffer;
  }

  /** 绑定渲染缓冲。 */
  bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer | null): void {
    if (this.#renderbuffer === renderbuffer) {
      return;
    }
    this.#gl.bindRenderbuffer(target, renderbuffer);
    this.#renderbuffer = renderbuffer;
  }

  /** 当前绑定的缓冲区；未跟踪时返回 `null`。 */
  getBoundBuffer(target: number): WebGLBuffer | null {
    if (target === this.#gl.ARRAY_BUFFER) {
      return this.#arrayBuffer;
    }
    if (target === this.#gl.ELEMENT_ARRAY_BUFFER) {
      return this.#elementArrayBuffer;
    }
    return null;
  }

  /** 当前绑定的程序。 */
  getBoundProgram(): WebGLProgram | null {
    return this.#program;
  }

  /** 当前绑定的顶点数组。 */
  getBoundVertexArray(): WebGLVertexArrayObject | null {
    return this.#vertexArray;
  }

  /** 当前绑定的帧缓冲。 */
  getBoundFramebuffer(): WebGLFramebuffer | null {
    return this.#framebuffer;
  }

  /** 当前绑定的渲染缓冲。 */
  getBoundRenderbuffer(): WebGLRenderbuffer | null {
    return this.#renderbuffer;
  }

  /** 当前激活的纹理单元。 */
  getActiveTextureUnit(): number {
    return this.#activeTextureUnit;
  }

  /** 指定纹理单元上的纹理。 */
  getBoundTexture(unit: number, target: number): WebGLTexture | null {
    return this.#textures.get(`${unit}:${target}`) ?? null;
  }

  /** 缓冲区被销毁后清理缓存。 */
  onBufferDestroyed(target: number, buffer: WebGLBuffer): void {
    if (target === this.#gl.ARRAY_BUFFER && this.#arrayBuffer === buffer) {
      this.#arrayBuffer = null;
    } else if (target === this.#gl.ELEMENT_ARRAY_BUFFER && this.#elementArrayBuffer === buffer) {
      this.#elementArrayBuffer = null;
    }
  }

  /** 程序被销毁后清理缓存。 */
  onProgramDestroyed(program: WebGLProgram): void {
    if (this.#program === program) {
      this.#program = null;
    }
  }

  /** 顶点数组被销毁后清理缓存。 */
  onVertexArrayDestroyed(vertexArray: WebGLVertexArrayObject): void {
    if (this.#vertexArray === vertexArray) {
      this.#vertexArray = null;
    }
  }

  /** 帧缓冲被销毁后清理缓存。 */
  onFramebufferDestroyed(framebuffer: WebGLFramebuffer): void {
    if (this.#framebuffer === framebuffer) {
      this.#framebuffer = null;
    }
  }

  /** 渲染缓冲被销毁后清理缓存。 */
  onRenderbufferDestroyed(renderbuffer: WebGLRenderbuffer): void {
    if (this.#renderbuffer === renderbuffer) {
      this.#renderbuffer = null;
    }
  }

  /** 纹理被销毁后清理所有纹理单元缓存。 */
  onTextureDestroyed(texture: WebGLTexture): void {
    for (const [key, value] of this.#textures) {
      if (value === texture) {
        this.#textures.delete(key);
      }
    }
  }

  /** 设置视口。 */
  setViewport(viewport: Viewport): void {
    const current = this.#viewport;
    if (
      current !== null &&
      current.x === viewport.x &&
      current.y === viewport.y &&
      current.width === viewport.width &&
      current.height === viewport.height
    ) {
      return;
    }
    this.#gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    this.#viewport = { ...viewport };
  }

  /** 设置清屏颜色。 */
  setClearColor(r: number, g: number, b: number, a: number): void {
    const current = this.#clearColor;
    if (
      current !== null &&
      current[0] === r &&
      current[1] === g &&
      current[2] === b &&
      current[3] === a
    ) {
      return;
    }
    this.#gl.clearColor(r, g, b, a);
    this.#clearColor = [r, g, b, a];
  }

  /** 设置清屏深度。 */
  setClearDepth(depth: number): void {
    if (this.#clearDepth === depth) {
      return;
    }
    this.#gl.clearDepth(depth);
    this.#clearDepth = depth;
  }

  /** 设置清屏模板值。 */
  setClearStencil(stencil: number): void {
    if (this.#clearStencil === stencil) {
      return;
    }
    this.#gl.clearStencil(stencil);
    this.#clearStencil = stencil;
  }

  /** 开关深度测试。 */
  setDepthTest(enabled: boolean): void {
    if (this.#depthTest === enabled) {
      return;
    }
    this.#toggle(this.#gl.DEPTH_TEST, enabled);
    this.#depthTest = enabled;
  }

  /** 设置深度写入。 */
  setDepthMask(enabled: boolean): void {
    if (this.#depthMask === enabled) {
      return;
    }
    this.#gl.depthMask(enabled);
    this.#depthMask = enabled;
  }

  /** 设置深度比较函数。 */
  setDepthFunc(func: number): void {
    if (this.#depthFunc === func) {
      return;
    }
    this.#gl.depthFunc(func);
    this.#depthFunc = func;
  }

  /** 开关混合。 */
  setBlend(enabled: boolean): void {
    if (this.#blend === enabled) {
      return;
    }
    this.#toggle(this.#gl.BLEND, enabled);
    this.#blend = enabled;
  }

  /** 设置颜色与 alpha 的混合因子。 */
  setBlendFuncSeparate(srcRgb: number, dstRgb: number, srcAlpha: number, dstAlpha: number): void {
    const current = this.#blendFunc;
    if (
      current !== null &&
      current[0] === srcRgb &&
      current[1] === dstRgb &&
      current[2] === srcAlpha &&
      current[3] === dstAlpha
    ) {
      return;
    }
    this.#gl.blendFuncSeparate(srcRgb, dstRgb, srcAlpha, dstAlpha);
    this.#blendFunc = [srcRgb, dstRgb, srcAlpha, dstAlpha];
  }

  /** 设置颜色与 alpha 的混合方程。 */
  setBlendEquationSeparate(modeRgb: number, modeAlpha: number): void {
    const current = this.#blendEquation;
    if (current !== null && current[0] === modeRgb && current[1] === modeAlpha) {
      return;
    }
    this.#gl.blendEquationSeparate(modeRgb, modeAlpha);
    this.#blendEquation = [modeRgb, modeAlpha];
  }

  /** 设置剔除面；`null` 关闭剔除。 */
  setCullFace(mode: number | null): void {
    if (this.#cullFace === mode) {
      return;
    }
    if (mode === null) {
      this.#toggle(this.#gl.CULL_FACE, false);
    } else {
      this.#toggle(this.#gl.CULL_FACE, true);
      this.#gl.cullFace(mode);
    }
    this.#cullFace = mode;
  }

  /** 设置正面绕序。 */
  setFrontFace(mode: number): void {
    if (this.#frontFace === mode) {
      return;
    }
    this.#gl.frontFace(mode);
    this.#frontFace = mode;
  }

  /** 设置颜色写入掩码。 */
  setColorMask(r: boolean, g: boolean, b: boolean, a: boolean): void {
    const current = this.#colorMask;
    if (
      current !== null &&
      current[0] === r &&
      current[1] === g &&
      current[2] === b &&
      current[3] === a
    ) {
      return;
    }
    this.#gl.colorMask(r, g, b, a);
    this.#colorMask = [r, g, b, a];
  }

  /** 开关裁剪测试。 */
  setScissorTest(enabled: boolean): void {
    if (this.#scissorTest === enabled) {
      return;
    }
    this.#toggle(this.#gl.SCISSOR_TEST, enabled);
    this.#scissorTest = enabled;
  }

  /** 设置裁剪矩形。 */
  setScissor(rect: ScissorRect): void {
    const current = this.#scissor;
    if (
      current !== null &&
      current.x === rect.x &&
      current.y === rect.y &&
      current.width === rect.width &&
      current.height === rect.height
    ) {
      return;
    }
    this.#gl.scissor(rect.x, rect.y, rect.width, rect.height);
    this.#scissor = { ...rect };
  }

  /** 开关模板测试。 */
  setStencilTest(enabled: boolean): void {
    if (this.#stencilTest === enabled) {
      return;
    }
    this.#toggle(this.#gl.STENCIL_TEST, enabled);
    this.#stencilTest = enabled;
  }

  /** 设置某个面的模板比较函数。 */
  setStencilFuncSeparate(face: number, func: number, reference: number, mask: number): void {
    const current = this.#stencilFunc.get(face);
    if (
      current !== undefined &&
      current[0] === func &&
      current[1] === reference &&
      current[2] === mask
    ) {
      return;
    }
    this.#gl.stencilFuncSeparate(face, func, reference, mask);
    this.#stencilFunc.set(face, [func, reference, mask]);
  }

  /** 设置某个面的模板操作。 */
  setStencilOpSeparate(face: number, fail: number, depthFail: number, pass: number): void {
    const current = this.#stencilOp.get(face);
    if (
      current !== undefined &&
      current[0] === fail &&
      current[1] === depthFail &&
      current[2] === pass
    ) {
      return;
    }
    this.#gl.stencilOpSeparate(face, fail, depthFail, pass);
    this.#stencilOp.set(face, [fail, depthFail, pass]);
  }

  /** 设置某个面的模板写入掩码。 */
  setStencilMaskSeparate(face: number, mask: number): void {
    if (this.#stencilMask.get(face) === mask) {
      return;
    }
    this.#gl.stencilMaskSeparate(face, mask);
    this.#stencilMask.set(face, mask);
  }

  /** 开关多边形偏移。 */
  setPolygonOffsetEnabled(enabled: boolean): void {
    if (this.#polygonOffsetEnabled === enabled) {
      return;
    }
    this.#toggle(this.#gl.POLYGON_OFFSET_FILL, enabled);
    this.#polygonOffsetEnabled = enabled;
  }

  /** 设置多边形偏移参数；自动开启偏移。 */
  setPolygonOffset(factor: number, units: number): void {
    this.setPolygonOffsetEnabled(true);
    const current = this.#polygonOffset;
    if (current !== null && current[0] === factor && current[1] === units) {
      return;
    }
    this.#gl.polygonOffset(factor, units);
    this.#polygonOffset = [factor, units];
  }

  /** 一次性应用混合状态；`null` 表示关闭混合。 */
  applyBlend(state: BlendState | null): void {
    if (state === null) {
      this.setBlend(false);
      return;
    }
    const gl = this.#gl;
    const color = state.color ?? {};
    const alpha = state.alpha ?? state.color ?? {};
    this.setBlend(true);
    this.setBlendFuncSeparate(
      blendFactor(gl, color.srcFactor ?? 'one'),
      blendFactor(gl, color.dstFactor ?? 'zero'),
      blendFactor(gl, alpha.srcFactor ?? 'one'),
      blendFactor(gl, alpha.dstFactor ?? 'zero'),
    );
    this.setBlendEquationSeparate(
      blendEquation(gl, color.operation ?? 'add'),
      blendEquation(gl, alpha.operation ?? 'add'),
    );
  }

  /** 一次性应用深度 / 模板状态。 */
  applyDepthStencil(state: DepthStencilState): void {
    const gl = this.#gl;
    if (state.depthCompare !== undefined) {
      this.setDepthTest(true);
      this.setDepthFunc(compareFunction(gl, state.depthCompare));
    } else {
      this.setDepthTest(false);
    }
    if (state.depthWriteEnabled !== undefined) {
      this.setDepthMask(state.depthWriteEnabled);
    }

    const stencilEnabled = state.stencilFront !== undefined || state.stencilBack !== undefined;
    if (!stencilEnabled) {
      this.setStencilTest(false);
      return;
    }

    this.setStencilTest(true);
    const front = state.stencilFront ?? {};
    const back = state.stencilBack ?? front;
    const reference = state.stencilReference ?? 0;
    const readMask = state.stencilReadMask ?? 0xff;
    const writeMask = state.stencilWriteMask ?? 0xff;

    this.setStencilFuncSeparate(
      gl.FRONT,
      compareFunction(gl, front.compare ?? 'always'),
      reference,
      readMask,
    );
    this.setStencilFuncSeparate(
      gl.BACK,
      compareFunction(gl, back.compare ?? 'always'),
      reference,
      readMask,
    );
    this.setStencilOpSeparate(
      gl.FRONT,
      stencilOperation(gl, front.failOp ?? 'keep'),
      stencilOperation(gl, front.depthFailOp ?? 'keep'),
      stencilOperation(gl, front.passOp ?? 'keep'),
    );
    this.setStencilOpSeparate(
      gl.BACK,
      stencilOperation(gl, back.failOp ?? 'keep'),
      stencilOperation(gl, back.depthFailOp ?? 'keep'),
      stencilOperation(gl, back.passOp ?? 'keep'),
    );
    this.setStencilMaskSeparate(gl.FRONT, writeMask);
    this.setStencilMaskSeparate(gl.BACK, writeMask);
  }

  /** 一次性应用光栅化状态。 */
  applyRasterizer(state: RasterizerState): void {
    if (state.depthBiasClamp !== undefined) {
      throw new UnsupportedError('depthBiasClamp（WebGL）', 'webgl');
    }
    if (state.cullMode !== undefined) {
      this.setCullFace(cullFace(this.#gl, state.cullMode));
    }
    if (state.frontFace !== undefined) {
      this.setFrontFace(frontFace(this.#gl, state.frontFace));
    }
    const bias = state.depthBias ?? 0;
    const slope = state.depthBiasSlopeScale ?? 0;
    if (bias !== 0 || slope !== 0) {
      this.setPolygonOffset(bias, slope);
    } else {
      this.setPolygonOffsetEnabled(false);
    }
  }

  /** 应用裁剪矩形；`null` 关闭裁剪。 */
  applyScissor(rect: ScissorRect | null): void {
    if (rect === null) {
      this.setScissorTest(false);
      return;
    }
    this.setScissorTest(true);
    this.setScissor(rect);
  }

  /** 设置像素存储参数（如 UNPACK_FLIP_Y_WEBGL）。 */
  pixelStorei(pname: number, value: number): void {
    if (this.#pixelStore.get(pname) === value) {
      return;
    }
    this.#gl.pixelStorei(pname, value);
    this.#pixelStore.set(pname, value);
  }

  /** 清空影子状态，不产生 GL 调用；上下文丢失 / 恢复后使用。 */
  reset(): void {
    this.#program = null;
    this.#vertexArray = null;
    this.#arrayBuffer = null;
    this.#elementArrayBuffer = null;
    this.#framebuffer = null;
    this.#renderbuffer = null;
    this.#activeTextureUnit = -1;
    this.#viewport = null;
    this.#clearColor = null;
    this.#clearDepth = null;
    this.#clearStencil = null;
    this.#depthTest = null;
    this.#depthMask = null;
    this.#depthFunc = null;
    this.#blend = null;
    this.#blendFunc = null;
    this.#blendEquation = null;
    this.#cullFace = null;
    this.#frontFace = null;
    this.#colorMask = null;
    this.#scissorTest = null;
    this.#scissor = null;
    this.#stencilTest = null;
    this.#stencilFunc.clear();
    this.#stencilOp.clear();
    this.#stencilMask.clear();
    this.#polygonOffsetEnabled = null;
    this.#polygonOffset = null;
    this.#capabilities.clear();
    this.#textures.clear();
    this.#pixelStore.clear();
  }

  #toggle(capability: number, enabled: boolean): void {
    if (this.#capabilities.get(capability) === enabled) {
      return;
    }
    if (enabled) {
      this.#gl.enable(capability);
    } else {
      this.#gl.disable(capability);
    }
    this.#capabilities.set(capability, enabled);
  }
}
