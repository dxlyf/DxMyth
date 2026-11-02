import type {
  AddressMode,
  BlendFactor,
  BlendOperation,
  BufferUsage,
  CompareFunction,
  CullMode,
  FilterMode,
  FrontFace,
  IndexFormat,
  MipmapFilterMode,
  PrimitiveTopology,
  TextureDimension,
  TextureFormat,
  TextureUsage,
} from './enums';

/** 描述一个 GPU 缓冲区。 */
export interface BufferDesc {
  label?: string;
  /** 初始数据；与 `size` 互斥。 */
  data?: ArrayBufferView;
  /** 未提供初始数据时的字节大小。 */
  size?: number;
  usage: BufferUsage;
  mappedAtCreation?: boolean;
}

/** 描述一张纹理。 */
export interface TextureDesc {
  label?: string;
  width: number;
  /** 默认 `1`。 */
  height?: number;
  /** 默认 `1`。 */
  depthOrArrayLayers?: number;
  /** 默认 `'2d'`。 */
  dimension?: TextureDimension;
  format: TextureFormat;
  usage: TextureUsage;
  mipLevelCount?: number;
  sampleCount?: number;
  viewFormats?: TextureFormat[];
  /** 基础 mip 层级的初始像素数据。 */
  data?: ArrayBufferView;
}

/** 描述一个采样器。 */
export interface SamplerDesc {
  label?: string;
  addressModeU?: AddressMode;
  addressModeV?: AddressMode;
  addressModeW?: AddressMode;
  magFilter?: FilterMode;
  minFilter?: FilterMode;
  mipmapFilter?: MipmapFilterMode;
  lodMinClamp?: number;
  lodMaxClamp?: number;
  maxAnisotropy?: number;
  compare?: CompareFunction;
}

/** RGBA 颜色，各分量取值范围 `[0, 1]`。 */
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** 用于清空颜色或深度 / 模板附件的值。 */
export type ClearValue = Color | { depth: number; stencil?: number };

/** 视口矩形，单位为设备像素。 */
export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  minDepth?: number;
  maxDepth?: number;
}

/** 裁剪矩形，单位为设备像素。 */
export interface ScissorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 一组混合方程及其因子。 */
export interface BlendComponent {
  srcFactor?: BlendFactor;
  dstFactor?: BlendFactor;
  operation?: BlendOperation;
}

/** 颜色与 alpha 的混合配置。 */
export interface BlendState {
  color?: BlendComponent;
  alpha?: BlendComponent;
}

/** 深度 / 模板状态。 */
export interface DepthStencilState {
  format?: TextureFormat;
  depthWriteEnabled?: boolean;
  depthCompare?: CompareFunction;
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
  stencilFront?: StencilFaceState;
  stencilBack?: StencilFaceState;
  stencilReference?: number;
  stencilReadMask?: number;
  stencilWriteMask?: number;
}

/** 单个面的模板操作。 */
export interface StencilFaceState {
  compare?: CompareFunction;
  failOp?: StencilOperation;
  depthFailOp?: StencilOperation;
  passOp?: StencilOperation;
}

/** 作用于某个面的模板操作。 */
export type StencilOperation =
  | 'keep'
  | 'zero'
  | 'replace'
  | 'invert'
  | 'increment-clamp'
  | 'decrement-clamp'
  | 'increment-wrap'
  | 'decrement-wrap';

/** 管线描述共享的光栅化状态。 */
export interface RasterizerState {
  topology?: PrimitiveTopology;
  cullMode?: CullMode;
  frontFace?: FrontFace;
  /** 为 0 时关闭多边形偏移。 */
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
}

/** 颜色写入掩码。 */
export interface ColorMask {
  r: boolean;
  g: boolean;
  b: boolean;
  a: boolean;
}

/**
 * 一次性应用的渲染状态描述。
 *
 * 每个字段都可省略；省略表示保持当前状态不变。
 * `blend: null` 与 `scissor: null` 表示显式关闭对应功能。
 */
export interface RenderState {
  viewport?: Viewport;
  blend?: BlendState | null;
  depthStencil?: DepthStencilState;
  rasterizer?: RasterizerState;
  colorMask?: ColorMask;
  scissor?: ScissorRect | null;
}

/** 顶点缓冲中单个属性的描述。 */
export interface VertexAttributeDesc {
  /** 着色器中的属性名，用于反射匹配。 */
  name?: string;
  /** 显式指定属性位置。 */
  location?: number;
  /** 分量数量，1–4。 */
  size: number;
  /** 分量类型，例如 `'float'`、`'uint8'`、`'int16'`。 */
  type: AttributeType;
  normalized?: boolean;
  /** 在顶点缓冲中的字节偏移。 */
  offset?: number;
  /** 相邻顶点之间的字节跨度。 */
  stride?: number;
  /** 提供数据的缓冲区。 */
  buffer: unknown;
  /** 实例化除数；`0` 表示逐顶点。 */
  divisor?: number;
  /** 索引属性的元素格式。 */
  indexFormat?: IndexFormat;
}

/** 顶点属性的标量类型。 */
export type AttributeType =
  'float' | 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float16';
