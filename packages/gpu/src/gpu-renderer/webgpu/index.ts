export { createWebGPUBackend, WebGPUBackend } from './backend.js';
export type { FrameResources } from './backend.js';

export { ComputePipelineHandle, RenderPipelineHandle } from './pipeline.js';
export type { GroupLayout } from './pipeline.js';

export { UniformArena, UniformLayout } from './uniform.js';
export type { UniformBlock, UniformFieldDescriptor, UniformFieldType, UniformLayoutDescriptor } from './uniform.js';

export { ComputePass, RenderPass } from './pass.js';
export { TimestampQuery } from './timestamp.js';
export { BindGroupCache } from './bind-group.js';
export type { ResolvedBindGroup } from './bind-group.js';

export { createCaps } from './caps.js';
export type { GPUBackendCaps } from './caps.js';

export { toWebGPULayout } from './adapters.js';
export type { VertexLayoutLike } from './adapters.js';

export type {
  BindGroupDecl,
  BindGroupEntryDecl,
  BindingValue,
  BindingValues,
  BufferBindingLayoutEx,
  BufferDescriptorEx,
  BufferHandle,
  ColorAttachmentEx,
  ComputePipelineDescriptor,
  DepthAttachmentEx,
  ReadPixelsOptions,
  RenderPassDescriptorEx,
  RenderPipelineDescriptor,
  TextureDescriptorEx,
  TextureHandle,
  WebGPUBackendOptions,
} from './types.js';

export type { GPUStats } from './stats.js';
export { isTextureHandle } from './types.js';
export type { ReadRect } from './texture-tools.js';

export {
  WebGPUError,
  WebGPUBindingError,
  WebGPUCapabilityError,
  WebGPUDeviceLostError,
  WebGPUPipelineError,
  WebGPUResourceError,
} from './errors.js';
