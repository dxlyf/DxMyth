import type { UniformBlock } from './uniform.js';

export interface BufferHandle {
  readonly id: number;
  readonly buffer: GPUBuffer;
  readonly size: number;
  destroy(): void;
}

export interface TextureHandle {
  readonly id: number;
  readonly texture: GPUTexture;
  readonly view: GPUTextureView;
  readonly width: number;
  readonly height: number;
  readonly format: GPUTextureFormat;
  readonly mipLevels: number;
  readonly usage: GPUTextureUsageFlags;
  createView(desc?: GPUTextureViewDescriptor): GPUTextureView;
  destroy(): void;
}

export interface BufferBindingLayoutEx {
  type: 'uniform' | 'storage' | 'read-only-storage';
  hasDynamicOffset?: boolean;
  minBindingSize?: number;
}

export interface BindGroupEntryDecl {
  name: string;
  binding: number;
  visibility: GPUShaderStageFlags;
  buffer?: BufferBindingLayoutEx;
  texture?: GPUTextureBindingLayout;
  sampler?: GPUSamplerBindingLayout;
  storageTexture?: GPUStorageTextureBindingLayout;
}

export interface BindGroupDecl {
  group: number;
  entries: BindGroupEntryDecl[];
}

export type BindingValue = BufferHandle | TextureHandle | UniformBlock | GPUTextureView | GPUSampler | null;

export type BindingValues = Record<string, BindingValue>;

export interface WebGPUBackendOptions {
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  adapter?: GPUAdapter;
  device?: GPUDevice;
  requiredFeatures?: GPUFeatureName[];
  requiredLimits?: Record<string, number>;
  format?: GPUTextureFormat;
  alphaMode?: GPUCanvasAlphaMode;
  powerPreference?: GPUPowerPreference;
}

export interface RenderPipelineDescriptor {
  label?: string;
  vertex: {
    module: GPUShaderModule;
    entryPoint?: string;
    buffers?: GPUVertexBufferLayout[];
  };
  fragment?: {
    module: GPUShaderModule;
    entryPoint?: string;
    targets: GPUColorTargetState[];
  };
  primitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  multisample?: GPUMultisampleState;
  /** Explicit layout. `name` is what `setBindings` keys on. */
  bindings: BindGroupDecl[];
  /** Use synchronous pipeline creation. */
  sync?: boolean;
}

export interface ComputePipelineDescriptor {
  label?: string;
  module: GPUShaderModule;
  entryPoint?: string;
  bindings?: BindGroupDecl[];
}

export interface ColorAttachmentEx {
  view: GPUTextureView | TextureHandle;
  clear?: readonly [number, number, number, number];
  load?: 'clear' | 'load';
  store?: 'store' | 'discard';
  resolve?: GPUTextureView | TextureHandle;
}

export interface DepthAttachmentEx {
  view: GPUTextureView | TextureHandle;
  clear?: number;
  load?: 'clear' | 'load';
  store?: 'store' | 'discard';
  readOnly?: boolean;
}

export interface RenderPassDescriptorEx {
  label?: string;
  color?: ColorAttachmentEx[];
  depth?: DepthAttachmentEx;
  timestampWrites?: GPURenderPassTimestampWrites;
}

export interface TextureDescriptorEx {
  label?: string;
  width: number;
  height: number;
  depthOrArrayLayers?: number;
  format: GPUTextureFormat;
  mipLevels?: number;
  sampleCount?: number;
  usage?: {
    sample?: boolean;
    render?: boolean;
    storage?: boolean;
    copySrc?: boolean;
    copyDst?: boolean;
  };
}

export interface BufferDescriptorEx {
  label?: string;
  size: number;
  usage?: {
    vertex?: boolean;
    index?: boolean;
    uniform?: boolean;
    storage?: boolean;
    readOnlyStorage?: boolean;
    copySrc?: boolean;
    copyDst?: boolean;
  };
}

export interface ReadPixelsOptions {
  /** Bytes per row alignment; defaults to 256. */
  bytesPerRow?: number;
}

export function isTextureHandle(value: unknown): value is TextureHandle {
  return typeof value === 'object' && value !== null && 'texture' in value && 'createView' in value;
}
