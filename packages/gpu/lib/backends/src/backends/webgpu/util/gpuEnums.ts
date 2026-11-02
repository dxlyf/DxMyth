import type { SamplerDesc } from '../../../core/descriptors';
import { BufferUsage, TextureUsage, type TextureFormat } from '../../../core/enums';
import { UnsupportedError, ValidationError } from '../../../core/errors';

/**
 * WebGPU 用途标志的数值常量。
 *
 * 浏览器里可以直接使用 `GPUBufferUsage` / `GPUTextureUsage` 全局对象，
 * 但 Node 测试环境没有这些全局，因此按规范写入同样的位值。
 */
const BUFFER_USAGE = {
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

const TEXTURE_USAGE = {
  COPY_SRC: 0x0001,
  COPY_DST: 0x0002,
  TEXTURE_BINDING: 0x0004,
  STORAGE_BINDING: 0x0008,
  RENDER_ATTACHMENT: 0x0010,
} as const;

/** 本库的缓冲区用途标志转换为 WebGPU 标志。 */
export function gpuBufferUsage(usage: number): GPUBufferUsageFlags {
  let flags = 0;
  if ((usage & BufferUsage.Vertex) !== 0) {
    flags |= BUFFER_USAGE.VERTEX;
  }
  if ((usage & BufferUsage.Index) !== 0) {
    flags |= BUFFER_USAGE.INDEX;
  }
  if ((usage & BufferUsage.Uniform) !== 0) {
    flags |= BUFFER_USAGE.UNIFORM;
  }
  if ((usage & BufferUsage.Storage) !== 0) {
    flags |= BUFFER_USAGE.STORAGE;
  }
  if ((usage & BufferUsage.Indirect) !== 0) {
    flags |= BUFFER_USAGE.INDIRECT;
  }
  if ((usage & BufferUsage.CopySrc) !== 0) {
    flags |= BUFFER_USAGE.COPY_SRC;
  }
  if ((usage & BufferUsage.CopyDst) !== 0) {
    flags |= BUFFER_USAGE.COPY_DST;
  }
  if ((usage & BufferUsage.MapRead) !== 0) {
    flags |= BUFFER_USAGE.MAP_READ;
  }
  if ((usage & BufferUsage.MapWrite) !== 0) {
    flags |= BUFFER_USAGE.MAP_WRITE;
  }
  if ((usage & BufferUsage.QueryResolve) !== 0) {
    flags |= BUFFER_USAGE.QUERY_RESOLVE;
  }
  if (flags === 0) {
    throw new ValidationError('缓冲区用途至少需要设置一个标志位');
  }
  return flags;
}

/** 本库的纹理用途标志转换为 WebGPU 标志。 */
export function gpuTextureUsage(usage: number): GPUTextureUsageFlags {
  let flags = 0;
  if ((usage & TextureUsage.Sample) !== 0) {
    flags |= TEXTURE_USAGE.TEXTURE_BINDING;
  }
  if ((usage & TextureUsage.Render) !== 0) {
    flags |= TEXTURE_USAGE.RENDER_ATTACHMENT;
  }
  if ((usage & TextureUsage.Storage) !== 0) {
    flags |= TEXTURE_USAGE.STORAGE_BINDING;
  }
  if ((usage & TextureUsage.CopySrc) !== 0) {
    flags |= TEXTURE_USAGE.COPY_SRC;
  }
  if ((usage & TextureUsage.CopyDst) !== 0) {
    flags |= TEXTURE_USAGE.COPY_DST;
  }
  if (flags === 0) {
    throw new ValidationError('纹理用途至少需要设置一个标志位');
  }
  return flags;
}

/** 校验并返回 WebGPU 纹理格式。 */
export function gpuTextureFormat(format: TextureFormat): GPUTextureFormat {
  if (format === 'rgb8') {
    throw new UnsupportedError('WebGPU 纹理格式 rgb8', 'webgpu');
  }
  return format as GPUTextureFormat;
}

/** 采样器描述转换为 WebGPU 描述符。 */
export function gpuSamplerDescriptor(desc: SamplerDesc): GPUSamplerDescriptor {
  return {
    label: desc.label,
    addressModeU: desc.addressModeU ?? 'clamp-to-edge',
    addressModeV: desc.addressModeV ?? 'clamp-to-edge',
    addressModeW: desc.addressModeW ?? 'clamp-to-edge',
    magFilter: desc.magFilter ?? 'nearest',
    minFilter: desc.minFilter ?? 'nearest',
    mipmapFilter: desc.mipmapFilter ?? 'nearest',
    lodMinClamp: desc.lodMinClamp,
    lodMaxClamp: desc.lodMaxClamp,
    maxAnisotropy: desc.maxAnisotropy,
    compare: desc.compare,
  };
}
