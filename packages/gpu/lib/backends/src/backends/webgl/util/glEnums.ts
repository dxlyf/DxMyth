import {
  BufferUsage,
  type AddressMode,
  type BlendFactor,
  type BlendOperation,
  type CompareFunction,
  type CullMode,
  type FilterMode,
  type FrontFace,
  type IndexFormat,
  type MipmapFilterMode,
  type PrimitiveTopology,
  type ShaderStage,
  type TextureFormat,
} from '../../../core/enums';
import type { AttributeType, StencilOperation } from '../../../core/descriptors';
import { UnsupportedError, ValidationError } from '../../../core/errors';

/** 顶点属性标量类型到 WebGL 枚举的映射。 */
export function attributeType(gl: WebGLRenderingContext, type: AttributeType): number {
  switch (type) {
    case 'float':
      return gl.FLOAT;
    case 'int8':
      return gl.BYTE;
    case 'uint8':
      return gl.UNSIGNED_BYTE;
    case 'int16':
      return gl.SHORT;
    case 'uint16':
      return gl.UNSIGNED_SHORT;
    case 'int32':
    case 'uint32':
    case 'float16': {
      const gl2 = gl as WebGL2RenderingContext;
      if (typeof gl2.vertexAttribDivisor !== 'function') {
        throw new UnsupportedError(`顶点属性类型 ${type}（WebGL1）`, 'webgl');
      }
      if (type === 'int32') {
        return gl2.INT;
      }
      if (type === 'uint32') {
        return gl2.UNSIGNED_INT;
      }
      return gl2.HALF_FLOAT;
    }
    default:
      throw new UnsupportedError(`顶点属性类型 ${String(type)}`, 'webgl');
  }
}

/** 索引格式到 WebGL 枚举的映射。 */
export function indexType(gl: WebGLRenderingContext, format: IndexFormat): number {
  switch (format) {
    case 'uint16':
      return gl.UNSIGNED_SHORT;
    case 'uint32':
      return gl.UNSIGNED_INT;
    default:
      throw new ValidationError(`未知的索引格式：${String(format)}`);
  }
}

/** 图元拓扑到 WebGL 绘制模式的映射。 */
export function primitiveMode(gl: WebGLRenderingContext, topology: PrimitiveTopology): number {
  switch (topology) {
    case 'point-list':
      return gl.POINTS;
    case 'line-list':
      return gl.LINES;
    case 'line-strip':
      return gl.LINE_STRIP;
    case 'triangle-list':
      return gl.TRIANGLES;
    case 'triangle-strip':
      return gl.TRIANGLE_STRIP;
    case 'triangle-fan':
      return gl.TRIANGLE_FAN;
    default:
      throw new ValidationError(`未知的图元拓扑：${String(topology)}`);
  }
}

/** 缓冲区用途标志到绑定目标的映射。 */
export function bufferTarget(gl: WebGLRenderingContext, usage: BufferUsage): number {
  if ((usage & BufferUsage.Uniform) !== 0) {
    const gl2 = gl as WebGL2RenderingContext;
    if (typeof gl2.bindBufferBase !== 'function') {
      throw new UnsupportedError('Uniform 缓冲（WebGL1）', 'webgl');
    }
    return gl2.UNIFORM_BUFFER;
  }
  if ((usage & BufferUsage.Index) !== 0) {
    return gl.ELEMENT_ARRAY_BUFFER;
  }
  if ((usage & BufferUsage.Vertex) !== 0) {
    return gl.ARRAY_BUFFER;
  }
  throw new ValidationError('缓冲区用途必须包含 Vertex、Index 或 Uniform 之一');
}

/** 缓冲区用途标志到使用频率提示的映射。 */
export function bufferUsageHint(gl: WebGLRenderingContext, usage: BufferUsage): number {
  if (
    (usage & BufferUsage.MapWrite) !== 0 ||
    (usage & BufferUsage.Storage) !== 0 ||
    (usage & BufferUsage.Uniform) !== 0
  ) {
    return gl.DYNAMIC_DRAW;
  }
  return gl.STATIC_DRAW;
}

/** 深度 / 模板比较函数映射。 */
export function compareFunction(gl: WebGLRenderingContext, func: CompareFunction): number {
  switch (func) {
    case 'never':
      return gl.NEVER;
    case 'less':
      return gl.LESS;
    case 'equal':
      return gl.EQUAL;
    case 'less-equal':
      return gl.LEQUAL;
    case 'greater':
      return gl.GREATER;
    case 'not-equal':
      return gl.NOTEQUAL;
    case 'greater-equal':
      return gl.GEQUAL;
    case 'always':
      return gl.ALWAYS;
    default:
      throw new ValidationError(`未知的比较函数：${String(func)}`);
  }
}

/** 混合因子映射。 */
export function blendFactor(gl: WebGLRenderingContext, factor: BlendFactor): number {
  switch (factor) {
    case 'zero':
      return gl.ZERO;
    case 'one':
      return gl.ONE;
    case 'src':
      return gl.SRC_COLOR;
    case 'one-minus-src':
      return gl.ONE_MINUS_SRC_COLOR;
    case 'src-alpha':
      return gl.SRC_ALPHA;
    case 'one-minus-src-alpha':
      return gl.ONE_MINUS_SRC_ALPHA;
    case 'dst':
      return gl.DST_COLOR;
    case 'one-minus-dst':
      return gl.ONE_MINUS_DST_COLOR;
    case 'dst-alpha':
      return gl.DST_ALPHA;
    case 'one-minus-dst-alpha':
      return gl.ONE_MINUS_DST_ALPHA;
    case 'src-alpha-saturated':
      return gl.SRC_ALPHA_SATURATE;
    case 'constant':
      return gl.CONSTANT_COLOR;
    case 'one-minus-constant':
      return gl.ONE_MINUS_CONSTANT_COLOR;
    default:
      throw new ValidationError(`未知的混合因子：${String(factor)}`);
  }
}

/** 混合方程映射。 */
export function blendEquation(gl: WebGLRenderingContext, operation: BlendOperation): number {
  switch (operation) {
    case 'add':
      return gl.FUNC_ADD;
    case 'subtract':
      return gl.FUNC_SUBTRACT;
    case 'reverse-subtract':
      return gl.FUNC_REVERSE_SUBTRACT;
    case 'min':
      // WebGL1 仅在 EXT_blend_minmax 扩展下可用，由上下文能力检查负责校验。
      return 0x8007;
    case 'max':
      return 0x8008;
    default:
      throw new ValidationError(`未知的混合方程：${String(operation)}`);
  }
}

/** 模板操作映射。 */
export function stencilOperation(gl: WebGLRenderingContext, operation: StencilOperation): number {
  switch (operation) {
    case 'keep':
      return gl.KEEP;
    case 'zero':
      return gl.ZERO;
    case 'replace':
      return gl.REPLACE;
    case 'invert':
      return gl.INVERT;
    case 'increment-clamp':
      return gl.INCR;
    case 'decrement-clamp':
      return gl.DECR;
    case 'increment-wrap':
      return gl.INCR_WRAP;
    case 'decrement-wrap':
      return gl.DECR_WRAP;
    default:
      throw new ValidationError(`未知的模板操作：${String(operation)}`);
  }
}

/** 剔除模式映射；`null` 表示关闭剔除。 */
export function cullFace(gl: WebGLRenderingContext, mode: CullMode): number | null {
  switch (mode) {
    case 'none':
      return null;
    case 'front':
      return gl.FRONT;
    case 'back':
      return gl.BACK;
    default:
      throw new ValidationError(`未知的剔除模式：${String(mode)}`);
  }
}

/** 正面绕序映射。 */
export function frontFace(gl: WebGLRenderingContext, face: FrontFace): number {
  switch (face) {
    case 'ccw':
      return gl.CCW;
    case 'cw':
      return gl.CW;
    default:
      throw new ValidationError(`未知的正面绕序：${String(face)}`);
  }
}

/** 纹理环绕方式映射。 */
export function addressMode(gl: WebGLRenderingContext, mode: AddressMode): number {
  switch (mode) {
    case 'clamp-to-edge':
      return gl.CLAMP_TO_EDGE;
    case 'repeat':
      return gl.REPEAT;
    case 'mirror-repeat':
      return gl.MIRRORED_REPEAT;
    default:
      throw new ValidationError(`未知的环绕方式：${String(mode)}`);
  }
}

/** 纹理过滤方式映射。 */
export function filterMode(gl: WebGLRenderingContext, mode: FilterMode): number {
  switch (mode) {
    case 'nearest':
      return gl.NEAREST;
    case 'linear':
      return gl.LINEAR;
    default:
      throw new ValidationError(`未知的过滤方式：${String(mode)}`);
  }
}

/** 结合缩放过滤与多级渐远过滤，得到 WebGL 的 minFilter。 */
export function minFilter(
  gl: WebGLRenderingContext,
  filter: FilterMode,
  mipmap: MipmapFilterMode | undefined,
): number {
  if (mipmap === undefined) {
    return filterMode(gl, filter);
  }
  if (filter === 'linear') {
    return mipmap === 'linear' ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR_MIPMAP_NEAREST;
  }
  return mipmap === 'linear' ? gl.NEAREST_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST;
}

/** 纹理格式在 WebGL 中的内部格式、数据格式与类型。 */
export interface GLTextureFormat {
  internalFormat: number;
  format: number;
  type: number;
}

/**
 * 规范化纹理格式到 WebGL 三元组的映射。
 *
 * WebGL1 不支持尺寸化内部格式与大部分浮点格式，未覆盖的格式会抛出
 * {@link UnsupportedError}；WebGL2 使用尺寸化内部格式，可直接配合
 * `texStorage2D` 使用。
 */
export function textureFormat(gl: WebGLRenderingContext, format: TextureFormat): GLTextureFormat {
  if (typeof (gl as WebGL2RenderingContext).texStorage2D === 'function') {
    return textureFormat2(gl as WebGL2RenderingContext, format);
  }
  switch (format) {
    case 'rgba8unorm':
      return { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
    case 'rgb8':
      return { internalFormat: gl.RGB, format: gl.RGB, type: gl.UNSIGNED_BYTE };
    case 'depth16unorm':
      return {
        internalFormat: gl.DEPTH_COMPONENT16,
        format: gl.DEPTH_COMPONENT,
        type: gl.UNSIGNED_SHORT,
      };
    default:
      throw new UnsupportedError(`WebGL1 纹理格式 ${format}`, 'webgl');
  }
}

/** WebGL2 尺寸化内部格式映射。 */
function textureFormat2(gl: WebGL2RenderingContext, format: TextureFormat): GLTextureFormat {
  switch (format) {
    case 'r8unorm':
      return { internalFormat: gl.R8, format: gl.RED, type: gl.UNSIGNED_BYTE };
    case 'r8snorm':
      return { internalFormat: gl.R8_SNORM, format: gl.RED, type: gl.BYTE };
    case 'r8uint':
      return { internalFormat: gl.R8UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_BYTE };
    case 'r8sint':
      return { internalFormat: gl.R8I, format: gl.RED_INTEGER, type: gl.BYTE };
    case 'r16uint':
      return { internalFormat: gl.R16UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_SHORT };
    case 'r16sint':
      return { internalFormat: gl.R16I, format: gl.RED_INTEGER, type: gl.SHORT };
    case 'r16float':
      return { internalFormat: gl.R16F, format: gl.RED, type: gl.HALF_FLOAT };
    case 'rg8unorm':
      return { internalFormat: gl.RG8, format: gl.RG, type: gl.UNSIGNED_BYTE };
    case 'rg8snorm':
      return { internalFormat: gl.RG8_SNORM, format: gl.RG, type: gl.BYTE };
    case 'rg8uint':
      return { internalFormat: gl.RG8UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_BYTE };
    case 'rg8sint':
      return { internalFormat: gl.RG8I, format: gl.RG_INTEGER, type: gl.BYTE };
    case 'r32uint':
      return { internalFormat: gl.R32UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_INT };
    case 'r32sint':
      return { internalFormat: gl.R32I, format: gl.RED_INTEGER, type: gl.INT };
    case 'r32float':
      return { internalFormat: gl.R32F, format: gl.RED, type: gl.FLOAT };
    case 'rg16uint':
      return { internalFormat: gl.RG16UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_SHORT };
    case 'rg16sint':
      return { internalFormat: gl.RG16I, format: gl.RG_INTEGER, type: gl.SHORT };
    case 'rg16float':
      return { internalFormat: gl.RG16F, format: gl.RG, type: gl.HALF_FLOAT };
    case 'rgba8unorm':
      return { internalFormat: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
    case 'rgba8unorm-srgb':
      return { internalFormat: gl.SRGB8_ALPHA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
    case 'rgba8snorm':
      return { internalFormat: gl.RGBA8_SNORM, format: gl.RGBA, type: gl.BYTE };
    case 'rgba8uint':
      return { internalFormat: gl.RGBA8UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_BYTE };
    case 'rgba8sint':
      return { internalFormat: gl.RGBA8I, format: gl.RGBA_INTEGER, type: gl.BYTE };
    case 'rgb10a2unorm':
      return {
        internalFormat: gl.RGB10_A2,
        format: gl.RGBA,
        type: gl.UNSIGNED_INT_2_10_10_10_REV,
      };
    case 'rg11b10ufloat':
      return {
        internalFormat: gl.R11F_G11F_B10F,
        format: gl.RGB,
        type: gl.UNSIGNED_INT_10F_11F_11F_REV,
      };
    case 'rg32uint':
      return { internalFormat: gl.RG32UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_INT };
    case 'rg32sint':
      return { internalFormat: gl.RG32I, format: gl.RG_INTEGER, type: gl.INT };
    case 'rg32float':
      return { internalFormat: gl.RG32F, format: gl.RG, type: gl.FLOAT };
    case 'rgba16uint':
      return { internalFormat: gl.RGBA16UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_SHORT };
    case 'rgba16sint':
      return { internalFormat: gl.RGBA16I, format: gl.RGBA_INTEGER, type: gl.SHORT };
    case 'rgba16float':
      return { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT };
    case 'rgba32uint':
      return { internalFormat: gl.RGBA32UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_INT };
    case 'rgba32sint':
      return { internalFormat: gl.RGBA32I, format: gl.RGBA_INTEGER, type: gl.INT };
    case 'rgba32float':
      return { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT };
    case 'rgb8':
      return { internalFormat: gl.RGB8, format: gl.RGB, type: gl.UNSIGNED_BYTE };
    case 'depth16unorm':
      return {
        internalFormat: gl.DEPTH_COMPONENT16,
        format: gl.DEPTH_COMPONENT,
        type: gl.UNSIGNED_SHORT,
      };
    case 'depth24plus':
      return {
        internalFormat: gl.DEPTH_COMPONENT24,
        format: gl.DEPTH_COMPONENT,
        type: gl.UNSIGNED_INT,
      };
    case 'depth24plus-stencil8':
      return {
        internalFormat: gl.DEPTH24_STENCIL8,
        format: gl.DEPTH_STENCIL,
        type: gl.UNSIGNED_INT_24_8,
      };
    case 'depth32float':
      return {
        internalFormat: gl.DEPTH_COMPONENT32F,
        format: gl.DEPTH_COMPONENT,
        type: gl.FLOAT,
      };
    case 'depth32float-stencil8':
      return {
        internalFormat: gl.DEPTH32F_STENCIL8,
        format: gl.DEPTH_STENCIL,
        type: gl.FLOAT_32_UNSIGNED_INT_24_8_REV,
      };
    default:
      throw new UnsupportedError(`WebGL2 纹理格式 ${format}`, 'webgl2');
  }
}

/** 渲染缓冲格式到 WebGL 内部格式的映射。 */
export function renderbufferFormat(gl: WebGLRenderingContext, format: TextureFormat): number {
  switch (format) {
    case 'depth16unorm':
      return gl.DEPTH_COMPONENT16;
    case 'stencil8':
      return gl.STENCIL_INDEX8;
    case 'depth24plus-stencil8':
      // DEPTH_STENCIL 需要 OES_packed_depth_stencil 扩展，由上下文负责检查。
      return 0x84f9;
    case 'rgba8unorm': {
      const gl2 = gl as WebGL2RenderingContext;
      if (typeof gl2.texStorage2D !== 'function') {
        throw new UnsupportedError('WebGL1 颜色渲染缓冲', 'webgl');
      }
      return gl2.RGBA8;
    }
    default:
      throw new UnsupportedError(`WebGL1 渲染缓冲格式 ${format}`, 'webgl');
  }
}

/** 着色器阶段到 WebGL 着色器类型的映射。 */
export function shaderType(gl: WebGLRenderingContext, stage: ShaderStage): number {
  switch (stage) {
    case 'vertex':
      return gl.VERTEX_SHADER;
    case 'fragment':
      return gl.FRAGMENT_SHADER;
    case 'compute':
      throw new UnsupportedError('计算着色器（WebGL1）', 'webgl');
    default:
      throw new ValidationError(`未知的着色器阶段：${String(stage)}`);
  }
}
