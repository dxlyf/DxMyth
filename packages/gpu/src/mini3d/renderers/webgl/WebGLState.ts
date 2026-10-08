import type { Color } from '../../math/Color';
import type { Blending, DepthFunc, Side } from '../../constants';
import type { GL } from './GLProgram';

/**
 * Shadow copy of the GL state machine.
 *
 * Every setter is a no-op when the requested value already matches what the
 * driver was told last, which is what keeps a frame with hundreds of draws
 * from issuing thousands of redundant `gl.enable`/`gl.depthFunc` calls.
 */
export class WebGLState {
  currentProgram: WebGLProgram | null = null;
  currentVertexArray: WebGLVertexArrayObject | null = null;
  currentArrayBuffer: WebGLBuffer | null = null;
  currentElementBuffer: WebGLBuffer | null = null;

  readonly viewport = { x: 0, y: 0, width: 0, height: 0 };
  /** Scissor rectangle; compare-only state, applied through `gl.scissor`. */
  private readonly scissorRect = { x: 0, y: 0, width: 0, height: 0 };

  private readonly gl: GL;
  private readonly capabilities: { isWebGL2: boolean };

  private readonly colorMaskState: { r: boolean; g: boolean; b: boolean; a: boolean } = {
    r: true,
    g: true,
    b: true,
    a: true,
  };
  private readonly clearColorState: { r: number; g: number; b: number; a: number } = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  private readonly depthTest: { enabled: boolean; func: number } = {
    enabled: true,
    func: 0x0203 /* LEQUAL */,
  };
  private readonly cullFace: { enabled: boolean; mode: number; frontFace: number } = {
    enabled: false,
    mode: 0x0405 /* BACK */,
    frontFace: 0x0901 /* CCW */,
  };
  private readonly blend: {
    enabled: boolean;
    srcRGB: number;
    dstRGB: number;
    srcAlpha: number;
    dstAlpha: number;
    equation: number;
  } = {
    enabled: false,
    srcRGB: 0,
    dstRGB: 0,
    srcAlpha: 0,
    dstAlpha: 0,
    equation: 0x8006 /* FUNC_ADD */,
  };
  private readonly polygonOffset: { enabled: boolean; factor: number; units: number } = {
    enabled: false,
    factor: 0,
    units: 0,
  };
  private readonly scissor: { enabled: boolean } = { enabled: false };

  private activeTextureUnit = -1;
  private readonly boundTextures: (WebGLTexture | null)[] = [];

  constructor(gl: GL, capabilities: { isWebGL2: boolean }) {
    this.gl = gl;
    this.capabilities = capabilities;
    this.reset();
  }

  /** Forces every cached value back to "unknown" and re-applies defaults. */
  reset(): void {
    const gl = this.gl;
    this.currentProgram = null;
    this.currentVertexArray = null;
    this.currentArrayBuffer = null;
    this.currentElementBuffer = null;

    gl.disable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.disable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0, 0);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.colorMask(true, true, true, true);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clearStencil(0);

    this.depthTest.enabled = false;
    this.depthTest.func = gl.LEQUAL;
    this._depthWriteRef = false;
    gl.depthMask(true);
    this._depthWriteRef = true;
    this.cullFace.enabled = false;
    this.cullFace.mode = gl.BACK;
    this.cullFace.frontFace = gl.CCW;
    this.blend.enabled = false;
    this.blend.srcRGB = gl.ONE;
    this.blend.dstRGB = gl.ZERO;
    this.blend.srcAlpha = gl.ONE;
    this.blend.dstAlpha = gl.ZERO;
    this.polygonOffset.enabled = false;
    this.polygonOffset.factor = 0;
    this.polygonOffset.units = 0;
    this.scissor.enabled = false;
    this.colorMaskState.r = true;
    this.colorMaskState.g = true;
    this.colorMaskState.b = true;
    this.colorMaskState.a = true;
    this.clearColorState.r = 0;
    this.clearColorState.g = 0;
    this.clearColorState.b = 0;
    this.clearColorState.a = 0;

    this.activeTextureUnit = -1;
    this.boundTextures.length = 0;
    this._depthWriteRef = true;
  }

  private _depthWriteRef = true;

  // ------------------------------------------------------------- viewport ---

  setViewport(x: number, y: number, width: number, height: number): void {
    if (
      this.viewport.x === x &&
      this.viewport.y === y &&
      this.viewport.width === width &&
      this.viewport.height === height
    ) {
      return;
    }
    this.viewport.x = x;
    this.viewport.y = y;
    this.viewport.width = width;
    this.viewport.height = height;
    this.gl.viewport(x, y, width, height);
  }

  /**
   * Sets the scissor rectangle.
   *
   * `gl.scissor` is separate from `SCISSOR_TEST`: the rectangle can be stored
   * while the test is disabled, which is how a render target keeps its scissor
   * configured but inactive.
   */
  setScissor(x: number, y: number, width: number, height: number): void {
    if (
      this.scissorRect.x === x &&
      this.scissorRect.y === y &&
      this.scissorRect.width === width &&
      this.scissorRect.height === height
    ) {
      return;
    }
    this.scissorRect.x = x;
    this.scissorRect.y = y;
    this.scissorRect.width = width;
    this.scissorRect.height = height;
    this.gl.scissor(x, y, width, height);
  }

  /** Enables or disables the scissor test, without touching the rectangle. */
  setScissorTest(enabled: boolean): void {
    if (this.scissor.enabled === enabled) return;
    this.scissor.enabled = enabled;
    if (enabled) this.gl.enable(this.gl.SCISSOR_TEST);
    else this.gl.disable(this.gl.SCISSOR_TEST);
  }

  // ---------------------------------------------------------------- clear ---

  setClearColor(color: Color, alpha: number): void {
    const gl = this.gl;
    if (
      this.clearColorState.r === color.r &&
      this.clearColorState.g === color.g &&
      this.clearColorState.b === color.b &&
      this.clearColorState.a === alpha
    ) {
      return;
    }
    this.clearColorState.r = color.r;
    this.clearColorState.g = color.g;
    this.clearColorState.b = color.b;
    this.clearColorState.a = alpha;
    gl.clearColor(color.r, color.g, color.b, alpha);
  }

  // ---------------------------------------------------------------- depth ---

  setDepthTest(enabled: boolean): void {
    if (this.depthTest.enabled === enabled) return;
    this.depthTest.enabled = enabled;
    if (enabled) this.gl.enable(this.gl.DEPTH_TEST);
    else this.gl.disable(this.gl.DEPTH_TEST);
  }

  setDepthWrite(enabled: boolean): void {
    if (this._depthWriteRef === enabled) return;
    this._depthWriteRef = enabled;
    this.gl.depthMask(enabled);
  }

  setDepthFunc(func: DepthFunc): void {
    const value = depthFuncToGL(this.gl, func);
    if (this.depthTest.func === value) return;
    this.depthTest.func = value;
    this.gl.depthFunc(value);
  }

  // ------------------------------------------------------------ cull/side ---

  setSide(side: Side): void {
    const gl = this.gl;
    if (side === 'double') {
      if (this.cullFace.enabled) {
        this.cullFace.enabled = false;
        gl.disable(gl.CULL_FACE);
      }
      return;
    }
    if (!this.cullFace.enabled) {
      this.cullFace.enabled = true;
      gl.enable(gl.CULL_FACE);
    }
    const mode = side === 'back' ? gl.FRONT : gl.BACK;
    if (this.cullFace.mode !== mode) {
      this.cullFace.mode = mode;
      gl.cullFace(mode);
    }
  }

  // -------------------------------------------------------------- blending --

  setBlending(blending: Blending): void {
    const gl = this.gl;
    if (blending === 'none') {
      if (this.blend.enabled) {
        this.blend.enabled = false;
        gl.disable(gl.BLEND);
      }
      return;
    }
    if (!this.blend.enabled) {
      this.blend.enabled = true;
      gl.enable(gl.BLEND);
    }

    let srcRGB: number = gl.ONE;
    let dstRGB: number = gl.ZERO;
    let srcAlpha: number = gl.ONE;
    let dstAlpha: number = gl.ZERO;
    const equation: number = gl.FUNC_ADD;

    switch (blending) {
      case 'additive':
        srcRGB = gl.SRC_ALPHA;
        dstRGB = gl.ONE;
        srcAlpha = gl.SRC_ALPHA;
        dstAlpha = gl.ONE;
        break;
      case 'subtractive':
        srcRGB = gl.ZERO;
        dstRGB = gl.ONE_MINUS_SRC_COLOR;
        srcAlpha = gl.ZERO;
        dstAlpha = gl.ONE_MINUS_SRC_ALPHA;
        break;
      case 'multiply':
        srcRGB = gl.ZERO;
        dstRGB = gl.SRC_COLOR;
        srcAlpha = gl.ZERO;
        dstAlpha = gl.SRC_ALPHA;
        break;
      case 'normal':
      default:
        srcRGB = gl.SRC_ALPHA;
        dstRGB = gl.ONE_MINUS_SRC_ALPHA;
        srcAlpha = gl.ONE;
        dstAlpha = gl.ONE_MINUS_SRC_ALPHA;
        break;
    }

    if (
      this.blend.srcRGB !== srcRGB ||
      this.blend.dstRGB !== dstRGB ||
      this.blend.srcAlpha !== srcAlpha ||
      this.blend.dstAlpha !== dstAlpha
    ) {
      this.blend.srcRGB = srcRGB;
      this.blend.dstRGB = dstRGB;
      this.blend.srcAlpha = srcAlpha;
      this.blend.dstAlpha = dstAlpha;
      gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
    }
    if (this.blend.equation !== equation) {
      this.blend.equation = equation;
      gl.blendEquation(equation);
    }
  }

  // -------------------------------------------------------- misc switches ---

  setColorWrite(enabled: boolean): void {
    const mask = this.colorMaskState;
    if (mask.r === enabled && mask.g === enabled && mask.b === enabled && mask.a === enabled) return;
    mask.r = enabled;
    mask.g = enabled;
    mask.b = enabled;
    mask.a = enabled;
    this.gl.colorMask(enabled, enabled, enabled, enabled);
  }

  setPolygonOffset(enabled: boolean, factor: number, units: number): void {
    const gl = this.gl;
    if (this.polygonOffset.enabled !== enabled) {
      this.polygonOffset.enabled = enabled;
      if (enabled) gl.enable(gl.POLYGON_OFFSET_FILL);
      else gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    if (enabled && (this.polygonOffset.factor !== factor || this.polygonOffset.units !== units)) {
      this.polygonOffset.factor = factor;
      this.polygonOffset.units = units;
      gl.polygonOffset(factor, units);
    }
  }

  // ------------------------------------------------------------- resources --

  useProgram(program: WebGLProgram | null): void {
    if (this.currentProgram === program) return;
    this.currentProgram = program;
    this.gl.useProgram(program);
  }

  bindVertexArray(vao: WebGLVertexArrayObject | null): void {
    if (!this.capabilities.isWebGL2 && vao === null) return;
    if (this.currentVertexArray === vao) return;
    this.currentVertexArray = vao;
    this.gl.bindVertexArray(vao);
  }

  bindArrayBuffer(buffer: WebGLBuffer | null): void {
    if (this.currentArrayBuffer === buffer) return;
    this.currentArrayBuffer = buffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  }

  bindElementArrayBuffer(buffer: WebGLBuffer | null): void {
    // Element buffer binding is part of VAO state when a VAO is bound.
    if (this.currentElementBuffer === buffer) return;
    this.currentElementBuffer = buffer;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  activeTexture(unit: number): void {
    if (this.activeTextureUnit === unit) return;
    this.activeTextureUnit = unit;
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
  }

  /** Called by the texture cache so the state shadow knows what is bound. */
  noteTextureBinding(unit: number, texture: WebGLTexture | null): void {
    this.boundTextures[unit] = texture;
  }

  /** Invalidates the element-buffer shadow (VAO switches change it). */
  invalidateElementBuffer(): void {
    this.currentElementBuffer = null;
  }
}

/** Maps the string depth functions onto GL enums. */
export function depthFuncToGL(gl: GL, func: DepthFunc): number {
  switch (func) {
    case 'never':
      return gl.NEVER;
    case 'less':
      return gl.LESS;
    case 'equal':
      return gl.EQUAL;
    case 'le-Equal':
      return gl.LEQUAL;
    case 'greater':
      return gl.GREATER;
    case 'not-equal':
      return gl.NOTEQUAL;
    case 'ge-Equal':
      return gl.GEQUAL;
    case 'always':
    default:
      return gl.ALWAYS;
  }
}
