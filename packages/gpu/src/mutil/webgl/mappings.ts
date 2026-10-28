import {
  GL_ALPHA,
  GL_ALWAYS,
  GL_BACK,
  GL_BOOL,
  GL_BOOL_VEC2,
  GL_BOOL_VEC3,
  GL_BOOL_VEC4,
  GL_CCW,
  GL_CLAMP_TO_EDGE,
  GL_CONSTANT_ALPHA,
  GL_CONSTANT_COLOR,
  GL_CW,
  GL_DECR,
  GL_DECR_WRAP,
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
  GL_LUMINANCE,
  GL_LUMINANCE_ALPHA,
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
  GL_REPEAT,
  GL_REPLACE,
  GL_RGB,
  GL_RGB565,
  GL_RGB5_A1,
  GL_RGBA,
  GL_RGBA4,
  GL_SAMPLER_2D,
  GL_SRC_ALPHA,
  GL_SRC_ALPHA_SATURATE,
  GL_SRC_COLOR,
  GL_STATIC_DRAW,
  GL_STREAM_DRAW,
  GL_TRIANGLES,
  GL_TRIANGLE_FAN,
  GL_TRIANGLE_STRIP,
  GL_UNSIGNED_BYTE,
  GL_UNSIGNED_SHORT,
  GL_UNSIGNED_SHORT_4_4_4_4,
  GL_UNSIGNED_SHORT_5_5_5_1,
  GL_UNSIGNED_SHORT_5_6_5,
  GL_ZERO,
} from './constants.js';
import type {
  GL1BlendEquation,
  GL1BlendFactor,
  GL1BufferUsage,
  GL1CompareFunc,
  GL1CullFace,
  GL1DrawMode,
  GL1FrontFace,
  GL1IndexType,
  GL1StencilOp,
  GL1TextureFilter,
  GL1TextureFormat,
  GL1TextureWrap,
  GL1UniformType,
} from './types.js';

export function blendFactor(value: GL1BlendFactor): number {
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

export function blendEquation(value: GL1BlendEquation): number {
  switch (value) {
    case 'add': return GL_FUNC_ADD;
    case 'subtract': return GL_FUNC_SUBTRACT;
    case 'reverse-subtract': return GL_FUNC_REVERSE_SUBTRACT;
    default: return GL_FUNC_ADD;
  }
}

export function compareFunc(value: GL1CompareFunc): number {
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

export function cullFace(value: GL1CullFace): number {
  switch (value) {
    case 'front': return GL_FRONT;
    case 'back': return GL_BACK;
    case 'front-and-back': return GL_FRONT_AND_BACK;
    default: return GL_BACK;
  }
}

export function frontFace(value: GL1FrontFace): number {
  return value === 'cw' ? GL_CW : GL_CCW;
}

export function stencilOp(value: GL1StencilOp): number {
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

export function drawMode(value: GL1DrawMode): number {
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

export function bufferUsage(value: GL1BufferUsage): number {
  switch (value) {
    case 'static': return GL_STATIC_DRAW;
    case 'dynamic': return GL_DYNAMIC_DRAW;
    case 'stream': return GL_STREAM_DRAW;
    default: return GL_STATIC_DRAW;
  }
}

export function textureFilter(value: GL1TextureFilter): number {
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

export function textureWrap(value: GL1TextureWrap): number {
  switch (value) {
    case 'clamp-to-edge': return GL_CLAMP_TO_EDGE;
    case 'repeat': return GL_REPEAT;
    case 'mirrored-repeat': return GL_MIRRORED_REPEAT;
    default: return GL_CLAMP_TO_EDGE;
  }
}

export function indexType(value: GL1IndexType): number {
  return value === 'uint8' ? GL_UNSIGNED_BYTE : GL_UNSIGNED_SHORT;
}

export interface GL1PixelFormat {
  internalFormat: number;
  format: number;
  type: number;
  bytesPerPixel: number;
}

export function textureFormat(format: GL1TextureFormat): GL1PixelFormat {
  switch (format) {
    case 'rgb8':
      return { internalFormat: GL_RGB, format: GL_RGB, type: GL_UNSIGNED_BYTE, bytesPerPixel: 3 };
    case 'rgba4':
      return { internalFormat: GL_RGBA4, format: GL_RGBA, type: GL_UNSIGNED_SHORT_4_4_4_4, bytesPerPixel: 2 };
    case 'rgb565':
      return { internalFormat: GL_RGB565, format: GL_RGB, type: GL_UNSIGNED_SHORT_5_6_5, bytesPerPixel: 2 };
    case 'rgb5-a1':
      return { internalFormat: GL_RGB5_A1, format: GL_RGBA, type: GL_UNSIGNED_SHORT_5_5_5_1, bytesPerPixel: 2 };
    case 'luminance8':
      return { internalFormat: GL_LUMINANCE, format: GL_LUMINANCE, type: GL_UNSIGNED_BYTE, bytesPerPixel: 1 };
    case 'alpha8':
      return { internalFormat: GL_ALPHA, format: GL_ALPHA, type: GL_UNSIGNED_BYTE, bytesPerPixel: 1 };
    case 'luminance-alpha8':
      return { internalFormat: GL_LUMINANCE_ALPHA, format: GL_LUMINANCE_ALPHA, type: GL_UNSIGNED_BYTE, bytesPerPixel: 2 };
    case 'rgba8':
    default:
      return { internalFormat: GL_RGBA, format: GL_RGBA, type: GL_UNSIGNED_BYTE, bytesPerPixel: 4 };
  }
}

export function uniformTypeFromGL(type: number): GL1UniformType {
  switch (type) {
    case GL_FLOAT: return 'float';
    case GL_INT: return 'int';
    case GL_BOOL: return 'bool';
    case GL_FLOAT_VEC2: return 'vec2';
    case GL_FLOAT_VEC3: return 'vec3';
    case GL_FLOAT_VEC4: return 'vec4';
    case GL_INT_VEC2: return 'ivec2';
    case GL_INT_VEC3: return 'ivec3';
    case GL_INT_VEC4: return 'ivec4';
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
