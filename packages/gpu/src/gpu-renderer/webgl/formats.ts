import { GLCapabilityError } from './errors.js';
import { GLENUM, type GL, type GLTextureFormat } from './enums.js';
import type { GLCapabilities } from './caps.js';

export interface GLFormatInfo {
  internalFormat: number;
  format: number;
  type: number;
  bytesPerPixel: number;
  depth: boolean;
  colorRenderable: boolean;
  srgb: boolean;
}

const RED = 0x1903;
const RG = 0x8227;
const SRGB_ALPHA_EXT = 0x8c42;
const HALF_FLOAT_OES = 0x8d61;

function color(
  internalFormat: number,
  format: number,
  type: number,
  bytesPerPixel: number,
  colorRenderable: boolean,
  srgb = false,
): GLFormatInfo {
  return { internalFormat, format, type, bytesPerPixel, depth: false, colorRenderable, srgb };
}

function depth(internalFormat: number, type: number, bytesPerPixel: number): GLFormatInfo {
  return {
    internalFormat,
    format: GLENUM.DEPTH_COMPONENT,
    type,
    bytesPerPixel,
    depth: true,
    colorRenderable: false,
    srgb: false,
  };
}

/**
 * Resolves a normalized texture format to the WebGL enums for this context.
 * Throws GLCapabilityError when the format needs an extension that is missing.
 */
export function getFormatInfo(
  gl: GL,
  version: 1 | 2,
  caps: GLCapabilities,
  format: GLTextureFormat,
): GLFormatInfo {
  if (version === 2) {
    switch (format) {
      case 'rgba8':
        return color(GLENUM.RGBA8, GLENUM.RGBA, GLENUM.UNSIGNED_BYTE, 4, true);
      case 'rgba8-srgb':
        return color(GLENUM.SRGB8_ALPHA8, GLENUM.RGBA, GLENUM.UNSIGNED_BYTE, 4, true, true);
      case 'rgb8':
        return color(GLENUM.RGB8, GLENUM.RGB, GLENUM.UNSIGNED_BYTE, 3, false);
      case 'r8':
        return color(GLENUM.R8, RED, GLENUM.UNSIGNED_BYTE, 1, true);
      case 'rg8':
        return color(GLENUM.RG8, RG, GLENUM.UNSIGNED_BYTE, 2, true);
      case 'rgba16f':
        return color(GLENUM.RGBA16F, GLENUM.RGBA, GLENUM.HALF_FLOAT, 8, caps.has('float-texture'));
      case 'rgba32f':
        return color(GLENUM.RGBA32F, GLENUM.RGBA, GLENUM.FLOAT, 16, caps.has('float-texture'));
      case 'depth16':
        return depth(GLENUM.DEPTH_COMPONENT16, GLENUM.UNSIGNED_SHORT, 2);
      case 'depth24':
        return depth(GLENUM.DEPTH_COMPONENT24, GLENUM.UNSIGNED_INT, 4);
      case 'depth32f':
        return depth(GLENUM.DEPTH_COMPONENT32F, GLENUM.FLOAT, 4);
    }
  }

  switch (format) {
    case 'rgba8':
      return color(GLENUM.RGBA, GLENUM.RGBA, GLENUM.UNSIGNED_BYTE, 4, true);
    case 'rgba8-srgb':
      if (!caps.has('srgb')) {
        throw new GLCapabilityError('srgb', 'sRGB textures need the EXT_sRGB extension on WebGL1');
      }
      return color(SRGB_ALPHA_EXT, SRGB_ALPHA_EXT, GLENUM.UNSIGNED_BYTE, 4, true, true);
    case 'rgb8':
      return color(GLENUM.RGB, GLENUM.RGB, GLENUM.UNSIGNED_BYTE, 3, false);
    case 'r8':
      return color(GLENUM.LUMINANCE, GLENUM.LUMINANCE, GLENUM.UNSIGNED_BYTE, 1, false);
    case 'rg8':
      return color(GLENUM.LUMINANCE_ALPHA, GLENUM.LUMINANCE_ALPHA, GLENUM.UNSIGNED_BYTE, 2, false);
    case 'rgba16f': {
      const ext = caps.extension<{ HALF_FLOAT_OES: number }>('OES_texture_half_float');
      if (!ext) {
        throw new GLCapabilityError('half-float-texture', 'half-float textures need OES_texture_half_float');
      }
      return color(GLENUM.RGBA, GLENUM.RGBA, ext.HALF_FLOAT_OES ?? HALF_FLOAT_OES, 8, false);
    }
    case 'rgba32f':
      if (!caps.has('float-texture')) {
        throw new GLCapabilityError('float-texture', 'float textures need OES_texture_float');
      }
      return color(GLENUM.RGBA, GLENUM.RGBA, GLENUM.FLOAT, 16, false);
    case 'depth16':
      if (!caps.has('depth-texture')) {
        throw new GLCapabilityError('depth-texture', 'depth textures need WEBGL_depth_texture');
      }
      return depth(GLENUM.DEPTH_COMPONENT, GLENUM.UNSIGNED_SHORT, 2);
    case 'depth24':
    case 'depth32f':
      if (!caps.has('depth-texture')) {
        throw new GLCapabilityError('depth-texture', 'depth textures need WEBGL_depth_texture');
      }
      return depth(GLENUM.DEPTH_COMPONENT, GLENUM.UNSIGNED_INT, 4);
  }
}

export function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0;
}

export function formatBytes(info: GLFormatInfo, width: number, height: number): number {
  return info.bytesPerPixel * width * height;
}

export function glFormatInfoOrNull(
  gl: GL,
  version: 1 | 2,
  caps: GLCapabilities,
  format: GLTextureFormat,
): GLFormatInfo | null {
  try {
    return getFormatInfo(gl, version, caps, format);
  } catch {
    return null;
  }
}
