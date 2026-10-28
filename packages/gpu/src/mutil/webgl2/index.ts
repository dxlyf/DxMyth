/**
 * WebGL 2.0 backend.
 *
 * Standalone entry point with its own type descriptions, state cache, VAO
 * cache, uniform-buffer support and texture/sampler caches. It shares no types
 * with the WebGL1 or WebGPU backends.
 */
export { GL2Renderer } from './GL2Renderer.js';
export { GL2State } from './GL2State.js';
export { GL2Program, GL2ProgramCache, injectGL2Defines } from './GL2Program.js';
export type { GL2Defines } from './GL2Program.js';
export { GL2Buffer, GL2UniformBuffer, GL2BufferPool } from './GL2Buffer.js';
export { GL2Texture, GL2TexturePool } from './GL2Texture.js';
export { GL2Sampler, GL2SamplerCache } from './GL2Sampler.js';
export { GL2VertexArray, defineGL2VertexLayout } from './GL2VertexArray.js';
export type { GL2VertexArrayOptions } from './GL2VertexArray.js';
export { GL2Framebuffer } from './GL2Framebuffer.js';
export { createGL2Stats, resetGL2Stats, snapshotGL2Stats } from './stats.js';
export { GL2Error, GL2ProgramError, GL2FramebufferError, GL2DisposedError } from './errors.js';
export * from './types.js';
