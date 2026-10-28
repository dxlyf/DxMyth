import {
  GL_ALWAYS,
  GL_BACK,
  GL_BOOL,
  GL_BOOL_VEC2,
  GL_BOOL_VEC3,
  GL_BOOL_VEC4,
  GL_BYTE,
  GL_CCW,
  GL_CLAMP_TO_EDGE,
  GL_CONSTANT_ALPHA,
  GL_CONSTANT_COLOR,
  GL_CW,
  GL_DECR,
  GL_DECR_WRAP,
  GL_DEPTH24_STENCIL8,
  GL_DEPTH_COMPONENT,
  GL_DEPTH_COMPONENT24,
  GL_DEPTH_COMPONENT32F,
  GL_DEPTH_STENCIL,
  GL_DST_ALPHA,
  GL_DST_COLOR,
  GL_DYNAMIC_DRAW,
  GL_EQUAL,
  GL_FLOAT,
  GL_FLOAT_MAT2,
  GL_FLOAT_MAT3,
  GL_FLOAT_MAT4,
  GL_FLOAT_VEC2,
  GL_FLOAT_VEC3,
  GL_FLOAT_VEC4,
  GL_FRONT,
  GL_FRONT_AND_BACK,
  GL_FUNC_ADD,
  GL_FUNC_REVERSE_SUBTRACT,
  GL_FUNC_SUBTRACT,
  GL_GEQUAL,
  GL_GREATER,
  GL_HALF_FLOAT,
  GL_INCR,
  GL_INCR_WRAP,
  GL_INT,
  GL_INT_VEC2,
  GL_INT_VEC3,
  GL_INT_VEC4,
  GL_INVERT,
  GL_KEEP,
  GL_LEQUAL,
  GL_LESS,
  GL_LINEAR,
  GL_LINEAR_MIPMAP_LINEAR,
  GL_LINEAR_MIPMAP_NEAREST,
  GL_LINES,
  GL_LINE_LOOP,
  GL_LINE_STRIP,
  GL_MIRRORED_REPEAT,
  GL_NEAREST,
  GL_NEAREST_MIPMAP_LINEAR,
  GL_NEAREST_MIPMAP_NEAREST,
  GL_NEVER,
  GL_NOTEQUAL,
  GL_ONE,
  GL_ONE_MINUS_CONSTANT_ALPHA,
  GL_ONE_MINUS_CONSTANT_COLOR,
  GL_ONE_MINUS_DST_ALPHA,
  GL_ONE_MINUS_DST_COLOR,
  GL_ONE_MINUS_SRC_ALPHA,
  GL_ONE_MINUS_SRC_COLOR,
  GL_POINTS,
  GL_R16F,
  GL_R8,
  GL_RED,
  GL_REPEAT,
  GL_REPLACE,
  GL_RG,
  GL_RG8,
  GL_RGB,
  GL_RGB8,
  GL_RGBA,
  GL_RGBA16F,
  GL_RGBA32F,
  GL_RGBA8,
  GL_SAMPLER_2D,
  GL_SHORT,
  GL_SRC_ALPHA,
  GL_SRC_ALPHA_SATURATE,
  GL_SRC_COLOR,
  GL_SRGB8_ALPHA8,
  GL_STATIC_DRAW,
  GL_STREAM_DRAW,
  GL_TRIANGLES,
  GL_TRIANGLE_FAN,
  GL_TRIANGLE_STRIP,
  GL_UNSIGNED_BYTE,
  GL_UNSIGNED_INT,
  GL_UNSIGNED_INT_24_8,
  GL_UNSIGNED_INT_VEC2,
  GL_UNSIGNED_INT_VEC3,
  GL_UNSIGNED_INT_VEC4,
  GL_UNSIGNED_SHORT,
  GL_ZERO,
} from './constants.js';
import type {
  GL2AttributeType,
  GL2BlendEquation,
  GL2BlendFactor,
  GL2BufferUsage,
  GL2CompareFunc,
  GL2CullFace,
  GL2DrawMode,
  GL2FrontFace,
  GL2IndexType,
  GL2StencilOp,
  GL2TextureFilter,
  GL2TextureFormat,
  GL2TextureWrap,
  GL2UniformType,
} from './types.js';

export function blendFactor(value: GL2BlendFactor): number {
  switch (value) {
    case 'zero': return GL_ZERO;
    case 'one': return GL_ONE;
    case 'src-color': return GL_SRC_COLOR;
    case 'one-minus-src-color': return GL_ONE_MINUS_SRC_COLOR;
    case 'src-alpha': return GL_SRC_ALPHA;
    case 'one-minus-src-alpha': return GL_ONE_MINUS_SRC_ALPHA;
    case 'dst-color': return GL_DST_COLOR;
    case 'one-minus-dst-color': return GL_ONE_MINUS_DST_COLOR;
    case 'dst-alpha': return GL_DST_ALPHA;
    case 'one-minus-dst-alpha': return GL_ONE_MINUS_DST_ALPHA;
    case 'constant-color': return GL_CONSTANT_COLOR;
    case 'one-minus-constant-color': return GL_ONE_MINUS_CONSTANT_COLOR;
    case 'constant-alpha': return GL_CONSTANT_ALPHA;
    case 'one-minus-constant-alpha': return GL_ONE_MINUS_CONSTANT_ALPHA;
    case 'src-alpha-saturate': return GL_SRC_ALPHA_SATURATE;
    default: return GL_ONE;
  }
}

export function blendEquation(value: GL2BlendEquation): number {
  switch (value) {
    case 'add': return GL_FUNC_ADD;
    case 'subtract': return GL_FUNC_SUBTRACT;
    case 'reverse-subtract': return GL_FUNC_REVERSE_SUBTRACT;
    default: return GL_FUNC_ADD;
  }
}

export function compareFunc(value: GL2CompareFunc): number {
  switch (value) {
    case 'never': return GL_NEVER;
    case 'less': return GL_LESS;
    case 'equal': return GL_EQUAL;
    case 'lequal': return GL_LEQUAL;
    case 'greater': return GL_GREATER;
    case 'notequal': return GL_NOTEQUAL;
    case 'gequal': return GL_GEQUAL;
    case 'always': return GL_ALWAYS;
    default: return GL_LESS;
  }
}

export function cullFace(value: GL2CullFace): number {
  switch (value) {
    case 'front': return GL_FRONT;
    case 'back': return GL_BACK;
    case 'front-and-back': return GL_FRONT_AND_BACK;
    default: return GL_BACK;
  }
}

export function frontFace(value: GL2FrontFace): number {
  return value === 'cw' ? GL_CW : GL_CCW;
}

export function stencilOp(value: GL2StencilOp): number {
  switch (value) {
    case 'keep': return GL_KEEP;
    case 'zero': return GL_ZERO;
    case 'replace': return GL_REPLACE;
    case 'increment': return GL_INCR;
    case 'increment-wrap': return GL_INCR_WRAP;
    case 'decrement': return GL_DECR;
    case 'decrement-wrap': return GL_DECR_WRAP;
    case 'invert': return GL_INVERT;
    default: return GL_KEEP;
  }
}

export function drawMode(value: GL2DrawMode): number {
  switch (value) {
    case 'points': return GL_POINTS;
    case 'lines': return GL_LINES;
    case 'line-strip': return GL_LINE_STRIP;
    case 'line-loop': return GL_LINE_LOOP;
    case 'triangles': return GL_TRIANGLES;
    case 'triangle-strip': return GL_TRIANGLE_STRIP;
    case 'triangle-fan': return GL_TRIANGLE_FAN;
    default: return GL_TRIANGLES;
  }
}

export function bufferUsage(value: GL2BufferUsage): number {
  switch (value) {
    case 'static': return GL_STATIC_DRAW;
    case 'dynamic': return GL_DYNAMIC_DRAW;
    case 'stream': return GL_STREAM_DRAW;
    default: return GL_STATIC_DRAW;
  }
}

export function textureFilter(value: GL2TextureFilter): number {
  switch (value) {
    case 'nearest': return GL_NEAREST;
    case 'linear': return GL_LINEAR;
    case 'nearest-mipmap-nearest': return GL_NEAREST_MIPMAP_NEAREST;
    case 'linear-mipmap-nearest': return GL_LINEAR_MIPMAP_NEAREST;
    case 'nearest-mipmap-linear': return GL_NEAREST_MIPMAP_LINEAR;
    case 'linear-mipmap-linear': return GL_LINEAR_MIPMAP_LINEAR;
    default: return GL_LINEAR;
  }
}

export function textureWrap(value: GL2TextureWrap): number {
  switch (value) {
    case 'clamp-to-edge': return GL_CLAMP_TO_EDGE;
    case 'repeat': return GL_REPEAT;
    case 'mirrored-repeat': return GL_MIRRORED_REPEAT;
    default: return GL_CLAMP_TO_EDGE;
  }
}

export function indexType(value: GL2IndexType): number {
  switch (value) {
    case 'uint8': return GL_UNSIGNED_BYTE;
    case 'uint32': return GL_UNSIGNED_INT;
    default: return GL_UNSIGNED_SHORT;
  }
}

export function indexBytes(value: GL2IndexType): number {
  switch (value) {
    case 'uint8': return 1;
    case 'uint32': return 4;
    default: return 2;
  }
}

export interface GL2AttributeFormat {
  glType: number;
  integer: boolean;
  componentBytes: number;
}

export function attributeFormat(type: GL2AttributeType): GL2AttributeFormat {
  switch (type) {
    case 'int8': return { glType: GL_BYTE, integer: true, componentBytes: 1 };
    case 'uint8': return { glType: GL_UNSIGNED_BYTE, integer: true, componentBytes: 1 };
    case 'int16': return { glType: GL_SHORT, integer: true, componentBytes: 2 };
    case 'uint16': return { glType: GL_UNSIGNED_SHORT, integer: true, componentBytes: 2 };
    case 'int32': return { glType: GL_INT, integer: true, componentBytes: 4 };
    case 'uint32': return { glType: GL_UNSIGNED_INT, integer: true, componentBytes: 4 };
    case 'float32':
    default:
      return { glType: GL_FLOAT, integer: false, componentBytes: 4 };
  }
}

export interface GL2PixelFormat {
  internalFormat: number;
  format: number;
  type: number;
  bytesPerPixel: number;
  depth: boolean;
}

export function textureFormat(format: GL2TextureFormat): GL2PixelFormat {
  switch (format) {
    case 'rgb8':
      return { internalFormat: GL_RGB8, format: GL_RGB, type: GL_UNSIGNED_BYTE, bytesPerPixel: 3, depth: false };
    case 'r8':
      return { internalFormat: GL_R8, format: GL_RED, type: GL_UNSIGNED_BYTE, bytesPerPixel: 1, depth: false };
    case 'rg8':
      return { internalFormat: GL_RG8, format: GL_RG, type: GL_UNSIGNED_BYTE, bytesPerPixel: 2, depth: false };
    case 'srgb8-alpha8':
      return { internalFormat: GL_SRGB8_ALPHA8, format: GL_RGBA, type: GL_UNSIGNED_BYTE, bytesPerPixel: 4, depth: false };
    case 'rgba16f':
      return { internalFormat: GL_RGBA16F, format: GL_RGBA, type: GL_HALF_FLOAT, bytesPerPixel: 8, depth: false };
    case 'rgba32f':
      return { internalFormat: GL_RGBA32F, format: GL_RGBA, type: GL_FLOAT, bytesPerPixel: 16, depth: false };
    case 'r16f':
      return { internalFormat: GL_R16F, format: GL_RED, type: GL_HALF_FLOAT, bytesPerPixel: 2, depth: false };
    case 'depth24':
      return { internalFormat: GL_DEPTH_COMPONENT24, format: GL_DEPTH_COMPONENT, type: GL_UNSIGNED_INT, bytesPerPixel: 4, depth: true };
    case 'depth32f':
      return { internalFormat: GL_DEPTH_COMPONENT32F, format: GL_DEPTH_COMPONENT, type: GL_FLOAT, bytesPerPixel: 4, depth: true };
    case 'depth24-stencil8':
      return { internalFormat: GL_DEPTH24_STENCIL8, format: GL_DEPTH_STENCIL, type: GL_UNSIGNED_INT_24_8, bytesPerPixel: 4, depth: true };
    case 'rgba8':
    default:
      return { internalFormat: GL_RGBA8, format: GL_RGBA, type: GL_UNSIGNED_BYTE, bytesPerPixel: 4, depth: false };
  }
}

export function isDepthFormat(format: GL2TextureFormat): boolean {
  return textureFormat(format).depth;
}

/** Number of mip levels for a full chain. */
export function mipLevelCount(width: number, height: number): number {
  return Math.floor(Math.log2(Math.max(1, Math.max(width, height)))) + 1;
}

export function uniformTypeFromGL(type: number): GL2UniformType {
  switch (type) {
    case GL_FLOAT: return 'float';
    case GL_INT: return 'int';
    case GL_UNSIGNED_INT: return 'uint';
    case GL_BOOL: return 'bool';
    case GL_FLOAT_VEC2: return 'vec2';
    case GL_FLOAT_VEC3: return 'vec3';
    case GL_FLOAT_VEC4: return 'vec4';
    case GL_INT_VEC2: return 'ivec2';
    case GL_INT_VEC3: return 'ivec3';
    case GL_INT_VEC4: return 'ivec4';
    case GL_UNSIGNED_INT_VEC2: return 'uvec2';
    case GL_UNSIGNED_INT_VEC3: return 'uvec3';
    case GL_UNSIGNED_INT_VEC4: return 'uvec4';
    case GL_BOOL_VEC2: return 'bvec2';
    case GL_BOOL_VEC3: return 'bvec3';
    case GL_BOOL_VEC4: return 'bvec4';
    case GL_FLOAT_MAT2: return 'mat2';
    case GL_FLOAT_MAT3: return 'mat3';
    case GL_FLOAT_MAT4: return 'mat4';
    case GL_SAMPLER_2D: return 'sampler2d';
    default: return 'unknown';
  }
}
