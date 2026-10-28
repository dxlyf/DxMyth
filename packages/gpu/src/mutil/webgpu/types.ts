/**
 * Public type descriptions for the WebGPU renderer.
 *
 * This is the WebGPU-native vocabulary (descriptor maps, WGSL entry points,
 * pipeline descriptors). Nothing here is shared with the WebGL backends: no
 * GL enum, no GL state object, no common "device" abstraction.
 */

export interface WGPUProgrammableStage {
  /** Inline WGSL source or a pre-created module. */
  module: string | GPUShaderModule;
  entryPoint?: string;
  constants?: Record<string, number>;
}

export interface WGPUVertexStage extends WGPUProgrammableStage {
  buffers?: readonly GPUVertexBufferLayout[];
}

export interface WGPUFragmentStage extends WGPUProgrammableStage {
  targets: readonly (GPUColorTargetState | null)[];
}

export interface WGPUPipelineDescriptor {
  label?: string;
  vertex: WGPUVertexStage;
  fragment?: WGPUFragmentStage;
  primitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  multisample?: GPUMultisampleState;
  /** `'auto'` derives the layout from the shaders, or pass explicit layouts. */
  layout?: 'auto' | readonly GPUBindGroupLayout[] | GPUPipelineLayout;
}

export interface WGPUComputePipelineDescriptorLike {
  label?: string;
  compute: WGPUProgrammableStage;
  layout?: 'auto' | readonly GPUBindGroupLayout[] | GPUPipelineLayout;
}

export interface WGPURendererOptions {
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  /** Use an existing configured/unconfigured canvas context. */
  context?: GPUCanvasContext;
  device?: GPUDevice;
  adapter?: GPUAdapter;
  powerPreference?: GPUPowerPreference;
  requiredFeatures?: readonly GPUFeatureName[];
  requiredLimits?: Record<string, number>;
  label?: string;
  /** Canvas texture format; defaults to the preferred canvas format. */
  format?: GPUTextureFormat;
  alphaMode?: GPUCanvasAlphaMode;
  usage?: number;
  /** Depth format used by the convenience depth attachment, if any. */
  depthFormat?: GPUTextureFormat;
  /** Uniform ring initial size in bytes (default 64 KiB). */
  uniformBufferSize?: number;
  /** Max free buffers retained by the pool (default 32). */
  maxPooledBuffers?: number;
}

export interface WGPUColorAttachmentLike {
  /** Defaults to the canvas current-texture view when omitted. */
  view?: GPUTextureView;
  clearValue?: GPUColor;
  loadOp?: GPULoadOp;
  storeOp?: GPUStoreOp;
}

export interface WGPUDepthStencilAttachmentLike {
  view?: GPUTextureView;
  depthClearValue?: number;
  depthLoadOp?: GPULoadOp;
  depthStoreOp?: GPUStoreOp;
  depthReadOnly?: boolean;
  stencilClearValue?: number;
  stencilLoadOp?: GPULoadOp;
  stencilStoreOp?: GPUStoreOp;
  stencilReadOnly?: boolean;
}

export interface WGPURenderPassLike {
  label?: string;
  colorAttachments?: readonly (WGPUColorAttachmentLike | null)[];
  depthStencilAttachment?: WGPUDepthStencilAttachmentLike;
  timestampWrites?: GPURenderPassTimestampWrites;
  occlusionQuerySet?: GPUQuerySet;
}

export interface WGPUBindGroupEntryLike {
  binding: number;
  resource:
    | GPUBufferBinding
    | GPUSampler
    | GPUTextureView
    | GPUExternalTexture
    | { buffer: GPUBuffer; offset?: number; size?: number };
}

export interface WGPUBindGroupCacheKey {
  pipeline: GPURenderPipeline | GPUComputePipeline;
  /** Bind group index inside the pipeline layout. */
  group: number;
  entries: readonly WGPUBindGroupEntryLike[];
}

/** A resolved uniform allocation inside the frame's uniform ring buffer. */
export interface WGPUUniformAllocation {
  readonly buffer: GPUBuffer;
  readonly offset: number;
  readonly size: number;
}

export interface WGPUFrameOptions {
  label?: string;
}

export interface WGPUStats {
  frames: number;
  commandEncoders: number;
  renderPasses: number;
  drawCalls: number;
  stateCalls: number;
  stateSkipped: number;
  shaderModulesCreated: number;
  shaderModuleCacheHits: number;
  pipelinesCreated: number;
  pipelineCacheHits: number;
  bindGroupsCreated: number;
  bindGroupCacheHits: number;
  buffersCreated: number;
  buffersReused: number;
  bufferWrites: number;
  bufferWriteBytes: number;
  texturesCreated: number;
  texturesReused: number;
  textureUploads: number;
  textureUploadBytes: number;
  samplersCreated: number;
  samplerCacheHits: number;
  uniformAllocations: number;
  uniformFlushes: number;
  uniformFlushBytes: number;
  canvasConfigures: number;
  currentTextureRequests: number;
  /** Bind group layout objects created for auto layouts (tracked, not unique). */
  bindGroupLayoutsRequested: number;
  bindGroupLayoutsCreated: number;
}

export interface WGPUFrameStats extends WGPUStats {
  frame: number;
}

export interface WGPUCanvasState {
  configuredWidth: number;
  configuredHeight: number;
  format: GPUTextureFormat;
  alphaMode: GPUCanvasAlphaMode;
}
