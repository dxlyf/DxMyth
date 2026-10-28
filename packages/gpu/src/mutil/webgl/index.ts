/**
 * WebGL 1.0 backend.
 *
 * This entry point is completely standalone: its types, enums and cache layer
 * are defined here and share nothing with the WebGL2 or WebGPU backends.
 */
export { GL1Renderer } from './GL1Renderer.js';
export { GL1State } from './GL1State.js';
export { GL1Program, GL1ProgramCache, injectGL1Defines } from './GL1Program.js';
export type { GL1Defines } from './GL1Program.js';
export { GL1Buffer, GL1BufferPool } from './GL1Buffer.js';
export { GL1Texture, GL1TexturePool } from './GL1Texture.js';
export { GL1VertexArray, defineGL1VertexLayout } from './GL1VertexLayout.js';
export type { GL1VertexArrayOptions } from './GL1VertexLayout.js';
export { GL1Framebuffer } from './GL1Framebuffer.js';
export { createGL1Stats, resetGL1Stats, snapshotGL1Stats } from './stats.js';
export { GL1Error, GL1ProgramError, GL1FramebufferError, GL1DisposedError } from './errors.js';
export * from './types.js';
