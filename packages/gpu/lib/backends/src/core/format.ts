import type { TextureFormat } from './enums';
import { ValidationError } from './errors';

/** 描述单个 {@link TextureFormat} 的静态元数据。 */
export interface TextureFormatInfo {
  readonly format: TextureFormat;
  /** 未压缩格式每像素占用的字节数。 */
  readonly bytesPerPixel: number;
  /** 颜色通道数（深度 / 模板格式为 1）。 */
  readonly channels: number;
  /** 整数（uint / sint）格式不可过滤、不可混合。 */
  readonly integer: boolean;
  readonly depth: boolean;
  readonly stencil: boolean;
  /** sRGB 编码的颜色格式。 */
  readonly srgb: boolean;
}

/**
 * 所有规范化格式的元数据。
 *
 * 格式名采用 WebGPU 拼写，WebGPU 后端可直接透传；
 * WebGL 后端通过各自的映射表转换。
 */
export const TEXTURE_FORMATS: Record<TextureFormat, TextureFormatInfo> = {
  r8unorm: {
    format: 'r8unorm',
    bytesPerPixel: 1,
    channels: 1,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r8snorm: {
    format: 'r8snorm',
    bytesPerPixel: 1,
    channels: 1,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r8uint: {
    format: 'r8uint',
    bytesPerPixel: 1,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r8sint: {
    format: 'r8sint',
    bytesPerPixel: 1,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },

  r16uint: {
    format: 'r16uint',
    bytesPerPixel: 2,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r16sint: {
    format: 'r16sint',
    bytesPerPixel: 2,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r16float: {
    format: 'r16float',
    bytesPerPixel: 2,
    channels: 1,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rg8unorm: {
    format: 'rg8unorm',
    bytesPerPixel: 2,
    channels: 2,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg8snorm: {
    format: 'rg8snorm',
    bytesPerPixel: 2,
    channels: 2,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg8uint: {
    format: 'rg8uint',
    bytesPerPixel: 2,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg8sint: {
    format: 'rg8sint',
    bytesPerPixel: 2,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },

  r32uint: {
    format: 'r32uint',
    bytesPerPixel: 4,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r32sint: {
    format: 'r32sint',
    bytesPerPixel: 4,
    channels: 1,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  r32float: {
    format: 'r32float',
    bytesPerPixel: 4,
    channels: 1,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rg16uint: {
    format: 'rg16uint',
    bytesPerPixel: 4,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg16sint: {
    format: 'rg16sint',
    bytesPerPixel: 4,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg16float: {
    format: 'rg16float',
    bytesPerPixel: 4,
    channels: 2,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rgba8unorm: {
    format: 'rgba8unorm',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  'rgba8unorm-srgb': {
    format: 'rgba8unorm-srgb',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: true,
  },
  rgba8snorm: {
    format: 'rgba8snorm',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba8uint: {
    format: 'rgba8uint',
    bytesPerPixel: 4,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba8sint: {
    format: 'rgba8sint',
    bytesPerPixel: 4,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },

  bgra8unorm: {
    format: 'bgra8unorm',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  'bgra8unorm-srgb': {
    format: 'bgra8unorm-srgb',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: true,
  },

  rgb10a2unorm: {
    format: 'rgb10a2unorm',
    bytesPerPixel: 4,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg11b10ufloat: {
    format: 'rg11b10ufloat',
    bytesPerPixel: 4,
    channels: 3,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rg32uint: {
    format: 'rg32uint',
    bytesPerPixel: 8,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg32sint: {
    format: 'rg32sint',
    bytesPerPixel: 8,
    channels: 2,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rg32float: {
    format: 'rg32float',
    bytesPerPixel: 8,
    channels: 2,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rgba16uint: {
    format: 'rgba16uint',
    bytesPerPixel: 8,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba16sint: {
    format: 'rgba16sint',
    bytesPerPixel: 8,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba16float: {
    format: 'rgba16float',
    bytesPerPixel: 8,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  rgba32uint: {
    format: 'rgba32uint',
    bytesPerPixel: 16,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba32sint: {
    format: 'rgba32sint',
    bytesPerPixel: 16,
    channels: 4,
    integer: true,
    depth: false,
    stencil: false,
    srgb: false,
  },
  rgba32float: {
    format: 'rgba32float',
    bytesPerPixel: 16,
    channels: 4,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },

  depth16unorm: {
    format: 'depth16unorm',
    bytesPerPixel: 2,
    channels: 1,
    integer: false,
    depth: true,
    stencil: false,
    srgb: false,
  },
  depth24plus: {
    format: 'depth24plus',
    bytesPerPixel: 4,
    channels: 1,
    integer: false,
    depth: true,
    stencil: false,
    srgb: false,
  },
  'depth24plus-stencil8': {
    format: 'depth24plus-stencil8',
    bytesPerPixel: 4,
    channels: 1,
    integer: false,
    depth: true,
    stencil: true,
    srgb: false,
  },
  depth32float: {
    format: 'depth32float',
    bytesPerPixel: 4,
    channels: 1,
    integer: false,
    depth: true,
    stencil: false,
    srgb: false,
  },
  'depth32float-stencil8': {
    format: 'depth32float-stencil8',
    bytesPerPixel: 8,
    channels: 1,
    integer: false,
    depth: true,
    stencil: true,
    srgb: false,
  },
  stencil8: {
    format: 'stencil8',
    bytesPerPixel: 1,
    channels: 1,
    integer: true,
    depth: false,
    stencil: true,
    srgb: false,
  },

  // 仅 WebGL 支持的旧格式，WebGPU 后端会抛出 UnsupportedError。
  rgb8: {
    format: 'rgb8',
    bytesPerPixel: 3,
    channels: 3,
    integer: false,
    depth: false,
    stencil: false,
    srgb: false,
  },
};

/** 返回 `format` 的元数据；未知格式在运行时抛错。 */
export function getTextureFormatInfo(format: TextureFormat): TextureFormatInfo {
  const info = TEXTURE_FORMATS[format];
  if (info === undefined) {
    throw new ValidationError(`未知的纹理格式：${String(format)}`);
  }
  return info;
}

/** 单个像素（压缩格式为单个块）占用的字节数。 */
export function bytesPerPixel(format: TextureFormat): number {
  return getTextureFormatInfo(format).bytesPerPixel;
}

/** 紧密排列的 2D 纹理（`width * height` 像素）的总字节数。 */
export function textureByteSize(
  format: TextureFormat,
  width: number,
  height = 1,
  depthOrArrayLayers = 1,
): number {
  return bytesPerPixel(format) * width * height * depthOrArrayLayers;
}

/** 是否为深度格式。 */
export function isDepthFormat(format: TextureFormat): boolean {
  return getTextureFormatInfo(format).depth;
}

/** 是否为模板格式。 */
export function isStencilFormat(format: TextureFormat): boolean {
  return getTextureFormatInfo(format).stencil;
}

/** 是否为颜色格式。 */
export function isColorFormat(format: TextureFormat): boolean {
  const info = getTextureFormatInfo(format);
  return !info.depth && !info.stencil;
}

/** 是否为 sRGB 编码格式。 */
export function isSrgbFormat(format: TextureFormat): boolean {
  return getTextureFormatInfo(format).srgb;
}

/** 是否为整数格式。 */
export function isIntegerFormat(format: TextureFormat): boolean {
  return getTextureFormatInfo(format).integer;
}

/** 是否可作为深度 / 模板附件。 */
export function isDepthStencilFormat(format: TextureFormat): boolean {
  const info = getTextureFormatInfo(format);
  return info.depth || info.stencil;
}
