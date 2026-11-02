import type {
  BlendState,
  Color,
  DepthStencilState as CoreDepthStencilState,
  SamplerDesc,
} from '../core/descriptors';
import type { PrimitiveTopology, TextureFormat } from '../core/enums';
import type { Buffer } from './Buffer';
import type { BindGroupLayout } from './BindGroupLayout';
import type { PipelineLayout } from './PipelineLayout';
import type { Sampler } from './Sampler';
import type { ShaderModule } from './ShaderModule';
import type { Texture } from './Texture';
import type { TextureView } from './TextureView';

/** WebGPU 风格的着色器阶段位标志。 */
export const ShaderStageFlags = {
  Vertex: 1,
  Fragment: 2,
  Compute: 4,
} as const;
export type ShaderStageFlags = number;

/** 支持的顶点属性格式。 */
export type VertexFormat =
  | 'float32'
  | 'float32x2'
  | 'float32x3'
  | 'float32x4'
  | 'uint32'
  | 'uint32x2'
  | 'uint32x3'
  | 'uint32x4'
  | 'sint32'
  | 'sint32x2'
  | 'sint32x3'
  | 'sint32x4';

/** 单个顶点属性。 */
export interface VertexAttribute {
  /** GLSL 属性名；WebGL1 需要，WebGPU 可省略。 */
  name?: string;
  shaderLocation: number;
  offset: number;
  format: VertexFormat;
}

/** 顶点缓冲布局。 */
export interface VertexBufferLayout {
  arrayStride: number;
  stepMode?: 'vertex' | 'instance';
  attributes: readonly VertexAttribute[];
}

/** 缓冲区描述。 */
export interface BufferDescriptor {
  label?: string;
  size: number;
  usage: number;
  mappedAtCreation?: boolean;
}

/** 纹理尺寸。 */
export interface Extent3D {
  width: number;
  height?: number;
  depthOrArrayLayers?: number;
}

/** 纹理描述。 */
export interface TextureDescriptor {
  label?: string;
  size: Extent3D;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: '2d';
  format: TextureFormat;
  usage: number;
  viewFormats?: readonly TextureFormat[];
}

/** 纹理视图描述。 */
export interface TextureViewDescriptor {
  label?: string;
  format?: TextureFormat;
  dimension?: '2d';
  aspect?: 'all' | 'depth-only' | 'stencil-only';
  baseMipLevel?: number;
  mipLevelCount?: number;
  baseArrayLayer?: number;
  arrayLayerCount?: number;
}

/** 采样器描述；与 WebGPU 命名对齐。 */
export type UnifiedSamplerDescriptor = SamplerDesc;

/** GLSL 顶点 / 片元源码对。 */
export interface GlslShaderPair {
  vertex: string;
  fragment: string;
}

/** 各后端着色器源码。 */
export interface ShaderCode {
  /** WebGPU WGSL 源码。 */
  wgsl?: string;
  /** WebGL1 使用的 GLSL 源码。 */
  glsl?: GlslShaderPair;
  /** WebGL2 使用的 GLSL 源码；省略时回退到 `glsl`。 */
  glsl2?: GlslShaderPair;
}

/** 着色器模块描述。 */
export interface ShaderModuleDescriptor {
  label?: string;
  code: ShaderCode;
}

/** 绑定组布局中的缓冲区条目。 */
export interface BufferBindingLayout {
  type: 'uniform' | 'storage' | 'read-only-storage';
  hasDynamicOffset?: boolean;
  minBindingSize?: number;
  /** WebGL2：uniform block 名称；默认 `Block${binding}`。 */
  glslBlock?: string;
}

/** 绑定组布局中的纹理条目。 */
export interface TextureBindingLayout {
  sampleType?: 'float' | 'unfilterable-float' | 'depth' | 'sint' | 'uint';
  viewDimension?: '2d';
  multisampled?: boolean;
  /** WebGL：sampler uniform 名称；默认 `uTexture${binding}`。 */
  glslSampler?: string;
}

/** 绑定组布局中的采样器条目。 */
export interface SamplerBindingLayout {
  type?: 'filtering' | 'non-filtering' | 'comparison';
}

/** 绑定组布局条目。 */
export interface BindGroupLayoutEntry {
  binding: number;
  visibility: ShaderStageFlags;
  buffer?: BufferBindingLayout;
  texture?: TextureBindingLayout;
  sampler?: SamplerBindingLayout;
}

/** 绑定组布局描述。 */
export interface BindGroupLayoutDescriptor {
  label?: string;
  entries: readonly BindGroupLayoutEntry[];
}

/** 管线布局描述。 */
export interface PipelineLayoutDescriptor {
  label?: string;
  bindGroupLayouts: readonly BindGroupLayout[];
}

/** 缓冲区绑定资源。 */
export interface BufferBinding {
  buffer: Buffer;
  offset?: number;
  size?: number;
}

/** 绑定组条目资源。 */
export type BindingResource = BufferBinding | { view: TextureView } | { sampler: Sampler };

/** 绑定组条目。 */
export interface BindGroupEntry {
  binding: number;
  resource: BindingResource;
}

/** 绑定组描述。 */
export interface BindGroupDescriptor {
  label?: string;
  layout: BindGroupLayout;
  entries: readonly BindGroupEntry[];
}

/** 颜色目标状态。 */
export interface ColorTargetState {
  format: TextureFormat;
  blend?: BlendState;
  writeMask?: number;
}

/** 渲染管线中的顶点状态。 */
export interface VertexState {
  module: ShaderModule;
  entryPoint: string;
  buffers?: readonly VertexBufferLayout[];
}

/** 渲染管线中的片元状态。 */
export interface FragmentState {
  module: ShaderModule;
  entryPoint: string;
  targets: readonly ColorTargetState[];
}

/** 图元状态。 */
export interface PrimitiveState {
  topology?: PrimitiveTopology;
  stripIndexFormat?: 'uint16' | 'uint32';
  frontFace?: 'ccw' | 'cw';
  cullMode?: 'none' | 'front' | 'back';
}

/** 渲染管线描述。 */
export interface RenderPipelineDescriptor {
  label?: string;
  layout: PipelineLayout;
  vertex: VertexState;
  fragment?: FragmentState;
  primitive?: PrimitiveState;
  depthStencil?: CoreDepthStencilState & { format: TextureFormat };
  multisample?: { count?: number; alphaToCoverageEnabled?: boolean };
}

/** 计算管线描述。 */
export interface ComputePipelineDescriptor {
  label?: string;
  layout: PipelineLayout;
  compute: {
    module: ShaderModule;
    entryPoint: string;
  };
}

/** 命令编码器描述。 */
export interface CommandEncoderDescriptor {
  label?: string;
}

/** 颜色附件。 */
export interface ColorAttachment {
  view: TextureView;
  clearValue?: Color;
  loadOp?: 'clear' | 'load';
  storeOp?: 'store' | 'discard';
}

/** 深度 / 模板附件。 */
export interface DepthStencilAttachment {
  view: TextureView;
  depthClearValue?: number;
  depthLoadOp?: 'clear' | 'load';
  depthStoreOp?: 'store' | 'discard';
  stencilClearValue?: number;
  stencilLoadOp?: 'clear' | 'load';
  stencilStoreOp?: 'store' | 'discard';
}

/** 渲染通道描述。 */
export interface RenderPassDescriptor {
  label?: string;
  colorAttachments: readonly ColorAttachment[];
  depthStencilAttachment?: DepthStencilAttachment;
}

/** 计算通道描述。 */
export interface ComputePassDescriptor {
  label?: string;
}

/** 纹理写入目标。 */
export interface TextureCopyDestination {
  texture: Texture;
  mipLevel?: number;
  origin?: { x?: number; y?: number; z?: number };
}

/** `queue.writeTexture` 的数据布局。 */
export interface TextureDataLayout {
  offset?: number;
  bytesPerRow?: number;
  rowsPerImage?: number;
}

/** 命令缓冲描述。 */
export interface CommandBufferDescriptor {
  label?: string;
}
