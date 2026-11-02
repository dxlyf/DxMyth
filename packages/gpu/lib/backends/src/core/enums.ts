import type { ValueOf } from './types';

/** 资源或上下文所属的图形 API。 */
export const BackendKind = {
  WebGL: 'webgl',
  WebGL2: 'webgl2',
  WebGPU: 'webgpu',
} as const;
export type BackendKind = ValueOf<typeof BackendKind>;

/** 描述缓冲区用途的位标志。 */
export const BufferUsage = {
  /** 顶点数据。 */
  Vertex: 1 << 0,
  /** 索引数据。 */
  Index: 1 << 1,
  /** Uniform 缓冲（WebGL2 / WebGPU）。 */
  Uniform: 1 << 2,
  /** 存储缓冲（WebGPU）。 */
  Storage: 1 << 3,
  /** 间接绘制参数（WebGPU）。 */
  Indirect: 1 << 4,
  /** 可作为拷贝源。 */
  CopySrc: 1 << 5,
  /** 可作为拷贝目标。 */
  CopyDst: 1 << 6,
  /** 可映射读取。 */
  MapRead: 1 << 7,
  /** 可映射写入。 */
  MapWrite: 1 << 8,
  /** 查询结果写入（WebGPU）。 */
  QueryResolve: 1 << 9,
} as const;
/** {@link BufferUsage} 标志的组合。 */
export type BufferUsage = number;

/** 描述纹理用途的位标志。 */
export const TextureUsage = {
  /** 可被着色器采样。 */
  Sample: 1 << 0,
  /** 可作为渲染目标。 */
  Render: 1 << 1,
  /** 可作为存储纹理（WebGPU）。 */
  Storage: 1 << 2,
  /** 可作为拷贝源。 */
  CopySrc: 1 << 3,
  /** 可作为拷贝目标。 */
  CopyDst: 1 << 4,
  /** 仅 WebGL：可通过 `readPixels` 回读。 */
  Readback: 1 << 5,
} as const;
/** {@link TextureUsage} 标志的组合。 */
export type TextureUsage = number;

/** 判断 `flags` 中是否包含 `flag` 的全部位。 */
export function hasFlag(flags: number, flag: number): boolean {
  return (flags & flag) === flag;
}

/** 顶点组装为图元的方式。 */
export const PrimitiveTopology = {
  PointList: 'point-list',
  LineList: 'line-list',
  LineStrip: 'line-strip',
  TriangleList: 'triangle-list',
  TriangleStrip: 'triangle-strip',
  /** WebGPU 不支持该模式。 */
  TriangleFan: 'triangle-fan',
} as const;
export type PrimitiveTopology = ValueOf<typeof PrimitiveTopology>;

/** 剔除哪些面。 */
export const CullMode = {
  None: 'none',
  Front: 'front',
  Back: 'back',
} as const;
export type CullMode = ValueOf<typeof CullMode>;

/** 被视为正面的三角形绕序。 */
export const FrontFace = {
  CCW: 'ccw',
  CW: 'cw',
} as const;
export type FrontFace = ValueOf<typeof FrontFace>;

/** 深度 / 模板比较函数。 */
export const CompareFunction = {
  Never: 'never',
  Less: 'less',
  Equal: 'equal',
  LessEqual: 'less-equal',
  Greater: 'greater',
  NotEqual: 'not-equal',
  GreaterEqual: 'greater-equal',
  Always: 'always',
} as const;
export type CompareFunction = ValueOf<typeof CompareFunction>;

/** 混合因子。 */
export const BlendFactor = {
  Zero: 'zero',
  One: 'one',
  Src: 'src',
  OneMinusSrc: 'one-minus-src',
  SrcAlpha: 'src-alpha',
  OneMinusSrcAlpha: 'one-minus-src-alpha',
  Dst: 'dst',
  OneMinusDst: 'one-minus-dst',
  DstAlpha: 'dst-alpha',
  OneMinusDstAlpha: 'one-minus-dst-alpha',
  SrcAlphaSaturated: 'src-alpha-saturated',
  Constant: 'constant',
  OneMinusConstant: 'one-minus-constant',
} as const;
export type BlendFactor = ValueOf<typeof BlendFactor>;

/** 混合方程。 */
export const BlendOperation = {
  Add: 'add',
  Subtract: 'subtract',
  ReverseSubtract: 'reverse-subtract',
  Min: 'min',
  Max: 'max',
} as const;
export type BlendOperation = ValueOf<typeof BlendOperation>;

/** 纹理放大 / 缩小过滤方式。 */
export const FilterMode = {
  Nearest: 'nearest',
  Linear: 'linear',
} as const;
export type FilterMode = ValueOf<typeof FilterMode>;

/** 多级渐远纹理的过滤方式。 */
export const MipmapFilterMode = {
  Nearest: 'nearest',
  Linear: 'linear',
} as const;
export type MipmapFilterMode = ValueOf<typeof MipmapFilterMode>;

/** 纹理坐标环绕方式。 */
export const AddressMode = {
  ClampToEdge: 'clamp-to-edge',
  Repeat: 'repeat',
  MirrorRepeat: 'mirror-repeat',
} as const;
export type AddressMode = ValueOf<typeof AddressMode>;

/** 索引缓冲元素格式。 */
export const IndexFormat = {
  Uint16: 'uint16',
  Uint32: 'uint32',
} as const;
export type IndexFormat = ValueOf<typeof IndexFormat>;

/** 着色器阶段。 */
export const ShaderStage = {
  Vertex: 'vertex',
  Fragment: 'fragment',
  Compute: 'compute',
} as const;
export type ShaderStage = ValueOf<typeof ShaderStage>;

/** 纹理维度。 */
export const TextureDimension = {
  D1: '1d',
  D2: '2d',
  D3: '3d',
} as const;
export type TextureDimension = ValueOf<typeof TextureDimension>;

/** 规范化的（WebGPU 风格）纹理格式。 */
export type TextureFormat =
  | 'r8unorm'
  | 'r8snorm'
  | 'r8uint'
  | 'r8sint'
  | 'r16uint'
  | 'r16sint'
  | 'r16float'
  | 'rg8unorm'
  | 'rg8snorm'
  | 'rg8uint'
  | 'rg8sint'
  | 'r32uint'
  | 'r32sint'
  | 'r32float'
  | 'rg16uint'
  | 'rg16sint'
  | 'rg16float'
  | 'rgba8unorm'
  | 'rgba8unorm-srgb'
  | 'rgba8snorm'
  | 'rgba8uint'
  | 'rgba8sint'
  | 'bgra8unorm'
  | 'bgra8unorm-srgb'
  | 'rgb10a2unorm'
  | 'rg11b10ufloat'
  | 'rg32uint'
  | 'rg32sint'
  | 'rg32float'
  | 'rgba16uint'
  | 'rgba16sint'
  | 'rgba16float'
  | 'rgba32uint'
  | 'rgba32sint'
  | 'rgba32float'
  | 'depth16unorm'
  | 'depth24plus'
  | 'depth24plus-stencil8'
  | 'depth32float'
  | 'depth32float-stencil8'
  | 'stencil8'
  | 'rgb8';
