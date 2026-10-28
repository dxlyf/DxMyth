/**
 * WebGPU backend.
 *
 * Standalone entry point. It exposes WebGPU-native descriptors plus caches for
 * shader modules, pipelines, bind groups, buffers, textures and samplers, a
 * frame-scoped uniform ring buffer and a cached render-pass encoder. No type in
 * this file is shared with the WebGL backends.
 */
export { WGPURenderer, WGPUFrame } from './WGPURenderer.js';
export { WGPURenderPass } from './WGPURenderPass.js';
export { WGPUUniformArena } from './WGPUUniformArena.js';
export { WGPUBuffer, WGPUBufferPool } from './WGPUBuffer.js';
export { WGPUTexture, WGPUTexturePool, textureBytesPerPixel } from './WGPUTexture.js';
export type { WGPUTextureDescriptorLike, WGPUTextureUploadOptions } from './WGPUTexture.js';
export { WGPUShaderCache, WGPUPipelineCache, WGPUBindGroupCache, WGPUBindGroupLayoutCache, WGPUSamplerCache } from './WGPUCaches.js';
export type { WGPUBindGroupRequest } from './WGPUCaches.js';
export { stableKey, objectId } from './WGPUDescriptors.js';
export { BufferUsage, TextureUsage, ShaderStage, MapMode } from './constants.js';
export { createWGPUStats, resetWGPUStats, snapshotWGPUStats } from './stats.js';
export { WGPUError, WGPUDeviceLostError, WGPUDisposedError, WGPUPipelineError } from './errors.js';
export * from './types.js';
