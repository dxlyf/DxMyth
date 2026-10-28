/**
 * WebGPU bit flags used by this module.
 *
 * Declared locally (rather than read from the `GPUBufferUsage` global) so the
 * cache layer is testable in Node without a browser runtime.
 */
export const BufferUsage = {
  MAP_READ: 0x0001,
  MAP_WRITE: 0x0002,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  INDEX: 0x0010,
  VERTEX: 0x0020,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
  INDIRECT: 0x0100,
  QUERY_RESOLVE: 0x0200,
} as const;

export const TextureUsage = {
  COPY_SRC: 0x01,
  COPY_DST: 0x02,
  TEXTURE_BINDING: 0x04,
  STORAGE_BINDING: 0x08,
  RENDER_ATTACHMENT: 0x10,
} as const;

export const ShaderStage = {
  VERTEX: 0x1,
  FRAGMENT: 0x2,
  COMPUTE: 0x4,
} as const;

export const MapMode = {
  READ: 0x0001,
  WRITE: 0x0002,
} as const;

/** Default alignment for dynamic uniform offsets (WebGPU minimum is 256). */
export const DEFAULT_UNIFORM_ALIGNMENT = 256;
