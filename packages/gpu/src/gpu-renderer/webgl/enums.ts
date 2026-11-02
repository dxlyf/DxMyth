/** A WebGL context of either version. */
export type GL = WebGLRenderingContext | WebGL2RenderingContext;

export const GLENUM = {
  DEPTH_TEST: 0x0b71,
  CULL_FACE: 0x0b44,
  BLEND: 0x0be2,
  SCISSOR_TEST: 0x0c11,
  POLYGON_OFFSET_FILL: 0x8037,
  STENCIL_TEST: 0x0b90,

  COLOR_BUFFER_BIT: 0x4000,
  DEPTH_BUFFER_BIT: 0x0100,
  STENCIL_BUFFER_BIT: 0x0400,

  ARRAY_BUFFER: 0x8892,
  ELEMENT_ARRAY_BUFFER: 0x8893,
  STATIC_DRAW: 0x88e4,
  DYNAMIC_DRAW: 0x88e8,
  STREAM_DRAW: 0x88e0,

  TEXTURE_2D: 0x0de1,
  TEXTURE_CUBE_MAP: 0x8513,
  TEXTURE0: 0x84c0,
  TEXTURE_MIN_FILTER: 0x2801,
  TEXTURE_MAG_FILTER: 0x2800,
  TEXTURE_WRAP_S: 0x2802,
  TEXTURE_WRAP_T: 0x2803,
  TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe,
  MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,

  VERTEX_SHADER: 0x8b31,
  FRAGMENT_SHADER: 0x8b30,
  COMPILE_STATUS: 0x8b81,
  LINK_STATUS: 0x8b82,
  ACTIVE_UNIFORMS: 0x8b86,
  ACTIVE_UNIFORM_BLOCKS: 0x8a36,
  ACTIVE_ATTRIBUTES: 0x8b89,

  MAX_TEXTURE_SIZE: 0x0d33,
  MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
  MAX_VERTEX_ATTRIBS: 0x8869,
  MAX_TEXTURE_IMAGE_UNITS: 0x8872,
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
  MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
  MAX_VARYING_VECTORS: 0x8dfc,
  MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
  MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
  MAX_DRAW_BUFFERS: 0x8824,
  MAX_UNIFORM_BUFFER_BINDINGS: 0x8a2f,
  MAX_UNIFORM_BLOCK_SIZE: 0x8a30,
  UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8a34,
  UNIFORM_BUFFER: 0x8a11,
  UNIFORM_BLOCK_DATA_SIZE: 0x8a40,
  UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8a42,
  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8a43,
  UNIFORM_OFFSET: 0x8a3b,
  UNIFORM_ARRAY_STRIDE: 0x8a3c,
  UNIFORM_MATRIX_STRIDE: 0x8a3d,
  UNIFORM_IS_ROW_MAJOR: 0x8a3e,
  MAX_COLOR_ATTACHMENTS: 0x8cdf,
  MAX_SAMPLES: 0x8d57,
  MAX_RENDERBUFFER_SIZE: 0x84e8,
  MAX_ELEMENT_INDEX: 0x8d6b,

  FRAMEBUFFER: 0x8d40,
  RENDERBUFFER: 0x8d41,
  COLOR_ATTACHMENT0: 0x8ce0,
  DEPTH_ATTACHMENT: 0x8d00,
  FRAMEBUFFER_COMPLETE: 0x8cd5,
  FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7,
  FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9,
  FRAMEBUFFER_UNSUPPORTED: 0x8cdd,
  FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8d56,
  SAMPLES: 0x80a9,
  READ_FRAMEBUFFER: 0x8ca8,
  DRAW_FRAMEBUFFER: 0x8ca9,

  UNPACK_FLIP_Y_WEBGL: 0x9240,
  UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
  UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
  UNPACK_ALIGNMENT: 0x0cf5,
  PACK_ALIGNMENT: 0x0d05,
  NONE: 0,

  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  INT: 0x1404,
  UNSIGNED_INT: 0x1405,
  FLOAT: 0x1406,
  HALF_FLOAT: 0x140b,

  RGBA: 0x1908,
  RGB: 0x1907,
  LUMINANCE: 0x1909,
  LUMINANCE_ALPHA: 0x190a,
  DEPTH_COMPONENT: 0x1902,
  RGBA8: 0x8058,
  RGB8: 0x8051,
  R8: 0x8229,
  RG8: 0x822b,
  RGBA16F: 0x881a,
  RGBA32F: 0x8814,
  SRGB8_ALPHA8: 0x8c43,
  DEPTH_COMPONENT16: 0x81a5,
  DEPTH_COMPONENT24: 0x81a6,
  DEPTH_COMPONENT32F: 0x8cac,
} as const;

export type GLPrimitive =
  | 'points'
  | 'lines'
  | 'line-strip'
  | 'line-loop'
  | 'triangles'
  | 'triangle-strip'
  | 'triangle-fan';

export type GLIndexType = 'uint16' | 'uint32';

export type GLUniformType =
  | 'f32'
  | 'i32'
  | 'u32'
  | 'vec2f'
  | 'vec3f'
  | 'vec4f'
  | 'vec2i'
  | 'vec3i'
  | 'vec4i'
  | 'vec2u'
  | 'vec3u'
  | 'vec4u'
  | 'mat2'
  | 'mat3'
  | 'mat4'
  | 'sampler2d'
  | 'sampler-cube'
  | 'sampler-2d-array'
  | 'sampler-3d';

export type GLAttributeType =
  | 'f32'
  | 'vec2f'
  | 'vec3f'
  | 'vec4f'
  | 'i32'
  | 'vec2i'
  | 'vec3i'
  | 'vec4i'
  | 'u32'
  | 'vec2u'
  | 'vec3u'
  | 'vec4u'
  | 'mat2'
  | 'mat3'
  | 'mat4';

/** Uniform block members: every uniform type except opaque samplers. */
export type GLBlockFieldType = Exclude<
  GLUniformType,
  'sampler2d' | 'sampler-cube' | 'sampler-2d-array' | 'sampler-3d'
>;

export type GLVertexFormat =
  | 'float32x1'
  | 'float32x2'
  | 'float32x3'
  | 'float32x4'
  | 'uint8x4norm'
  | 'sint8x4norm'
  | 'uint16x2'
  | 'uint16x4'
  | 'sint16x2'
  | 'sint16x4'
  | 'uint32x1'
  | 'uint32x2'
  | 'uint32x3'
  | 'uint32x4'
  | 'sint32x1'
  | 'sint32x2'
  | 'sint32x3'
  | 'sint32x4';

export type GLFilter =
  | 'nearest'
  | 'linear'
  | 'nearest-mipmap-nearest'
  | 'linear-mipmap-nearest'
  | 'nearest-mipmap-linear'
  | 'linear-mipmap-linear';

export type GLWrap = 'repeat' | 'clamp-to-edge' | 'mirrored-repeat';

export type GLBlendFactor =
  | 'zero'
  | 'one'
  | 'src-color'
  | 'one-minus-src-color'
  | 'src-alpha'
  | 'one-minus-src-alpha'
  | 'dst-alpha'
  | 'one-minus-dst-alpha'
  | 'dst-color'
  | 'one-minus-dst-color'
  | 'src-alpha-saturate'
  | 'constant-color'
  | 'one-minus-constant-color'
  | 'constant-alpha'
  | 'one-minus-constant-alpha';

export type GLBlendOp = 'add' | 'subtract' | 'reverse-subtract' | 'min' | 'max';

export type GLCompare = 'never' | 'less' | 'equal' | 'lequal' | 'greater' | 'notequal' | 'gequal' | 'always';

export type GLCullMode = 'none' | 'front' | 'back';
export type GLFrontFace = 'ccw' | 'cw';

export type GLTextureFormat =
  | 'rgba8'
  | 'rgba8-srgb'
  | 'rgb8'
  | 'r8'
  | 'rg8'
  | 'rgba16f'
  | 'rgba32f'
  | 'depth16'
  | 'depth24'
  | 'depth32f';

const PRIMITIVES: Record<GLPrimitive, number> = {
  points: 0x0000,
  lines: 0x0001,
  'line-strip': 0x0003,
  'line-loop': 0x0002,
  triangles: 0x0004,
  'triangle-strip': 0x0005,
  'triangle-fan': 0x0006,
};

export function primitiveToGL(mode: GLPrimitive): number {
  return PRIMITIVES[mode];
}

const BLEND_FACTORS: Record<GLBlendFactor, number> = {
  zero: 0x0000,
  one: 0x0001,
  'src-color': 0x0300,
  'one-minus-src-color': 0x0301,
  'src-alpha': 0x0302,
  'one-minus-src-alpha': 0x0303,
  'dst-alpha': 0x0304,
  'one-minus-dst-alpha': 0x0305,
  'dst-color': 0x0306,
  'one-minus-dst-color': 0x0307,
  'src-alpha-saturate': 0x0308,
  'constant-color': 0x8001,
  'one-minus-constant-color': 0x8002,
  'constant-alpha': 0x8003,
  'one-minus-constant-alpha': 0x8004,
};

export function blendFactorToGL(factor: GLBlendFactor): number {
  return BLEND_FACTORS[factor];
}

const BLEND_OPS: Record<GLBlendOp, number> = {
  add: 0x8006,
  subtract: 0x800a,
  'reverse-subtract': 0x800b,
  min: 0x8007,
  max: 0x8008,
};

export function blendOpToGL(op: GLBlendOp): number {
  return BLEND_OPS[op];
}

const COMPARE: Record<GLCompare, number> = {
  never: 0x0200,
  less: 0x0201,
  equal: 0x0202,
  lequal: 0x0203,
  greater: 0x0204,
  notequal: 0x0205,
  gequal: 0x0206,
  always: 0x0207,
};

export function compareToGL(compare: GLCompare): number {
  return COMPARE[compare];
}

const FILTERS: Record<GLFilter, number> = {
  nearest: 0x2600,
  linear: 0x2601,
  'nearest-mipmap-nearest': 0x2700,
  'linear-mipmap-nearest': 0x2701,
  'nearest-mipmap-linear': 0x2702,
  'linear-mipmap-linear': 0x2703,
};

export function filterToGL(filter: GLFilter): number {
  return FILTERS[filter];
}

const WRAPS: Record<GLWrap, number> = {
  repeat: 0x2901,
  'clamp-to-edge': 0x812f,
  'mirrored-repeat': 0x8370,
};

export function wrapToGL(wrap: GLWrap): number {
  return WRAPS[wrap];
}

const CULL_MODES: Record<GLCullMode, number> = {
  none: 0,
  front: 0x0404,
  back: 0x0405,
};

export function cullModeToGL(mode: GLCullMode): number {
  return CULL_MODES[mode];
}

export function frontFaceToGL(face: GLFrontFace): number {
  return face === 'ccw' ? 0x0901 : 0x0900;
}

const VERTEX_FORMATS: Record<
  GLVertexFormat,
  { size: number; type: number; normalized: boolean; integer: boolean }
> = {
  float32x1: { size: 1, type: GLENUM.FLOAT, normalized: false, integer: false },
  float32x2: { size: 2, type: GLENUM.FLOAT, normalized: false, integer: false },
  float32x3: { size: 3, type: GLENUM.FLOAT, normalized: false, integer: false },
  float32x4: { size: 4, type: GLENUM.FLOAT, normalized: false, integer: false },
  uint8x4norm: { size: 4, type: GLENUM.UNSIGNED_BYTE, normalized: true, integer: false },
  sint8x4norm: { size: 4, type: GLENUM.BYTE, normalized: true, integer: false },
  uint16x2: { size: 2, type: GLENUM.UNSIGNED_SHORT, normalized: false, integer: true },
  uint16x4: { size: 4, type: GLENUM.UNSIGNED_SHORT, normalized: false, integer: true },
  sint16x2: { size: 2, type: GLENUM.SHORT, normalized: false, integer: true },
  sint16x4: { size: 4, type: GLENUM.SHORT, normalized: false, integer: true },
  uint32x1: { size: 1, type: GLENUM.UNSIGNED_INT, normalized: false, integer: true },
  uint32x2: { size: 2, type: GLENUM.UNSIGNED_INT, normalized: false, integer: true },
  uint32x3: { size: 3, type: GLENUM.UNSIGNED_INT, normalized: false, integer: true },
  uint32x4: { size: 4, type: GLENUM.UNSIGNED_INT, normalized: false, integer: true },
  sint32x1: { size: 1, type: GLENUM.INT, normalized: false, integer: true },
  sint32x2: { size: 2, type: GLENUM.INT, normalized: false, integer: true },
  sint32x3: { size: 3, type: GLENUM.INT, normalized: false, integer: true },
  sint32x4: { size: 4, type: GLENUM.INT, normalized: false, integer: true },
};

export function vertexFormatInfo(format: GLVertexFormat): {
  size: number;
  type: number;
  normalized: boolean;
  integer: boolean;
} {
  return VERTEX_FORMATS[format];
}

/** Maps a GL uniform/attribute type enum to our normalized type. */
export function glTypeToUniformType(type: number): GLUniformType | null {
  switch (type) {
    case GLENUM.FLOAT:
      return 'f32';
    case GLENUM.INT:
      return 'i32';
    case GLENUM.UNSIGNED_INT:
      return 'u32';
    case 0x8b50:
      return 'vec2f';
    case 0x8b51:
      return 'vec3f';
    case 0x8b52:
      return 'vec4f';
    case 0x8b53:
      return 'vec2i';
    case 0x8b54:
      return 'vec3i';
    case 0x8b55:
      return 'vec4i';
    case 0x8dc6:
      return 'vec2u';
    case 0x8dc7:
      return 'vec3u';
    case 0x8dc8:
      return 'vec4u';
    case 0x8b5a:
      return 'mat2';
    case 0x8b5b:
      return 'mat3';
    case 0x8b5c:
      return 'mat4';
    case 0x8b5e:
      return 'sampler2d';
    case 0x8b60:
      return 'sampler-cube';
    case 0x8dc1:
      return 'sampler-2d-array';
    case 0x8b5f:
      return 'sampler-3d';
    default:
      return null;
  }
}

export function glTypeToAttributeType(type: number): GLAttributeType {
  switch (type) {
    case GLENUM.FLOAT:
      return 'f32';
    case 0x8b50:
      return 'vec2f';
    case 0x8b51:
      return 'vec3f';
    case 0x8b52:
      return 'vec4f';
    case GLENUM.INT:
      return 'i32';
    case 0x8b53:
      return 'vec2i';
    case 0x8b54:
      return 'vec3i';
    case 0x8b55:
      return 'vec4i';
    case GLENUM.UNSIGNED_INT:
      return 'u32';
    case 0x8dc6:
      return 'vec2u';
    case 0x8dc7:
      return 'vec3u';
    case 0x8dc8:
      return 'vec4u';
    case 0x8b5a:
      return 'mat2';
    case 0x8b5b:
      return 'mat3';
    case 0x8b5c:
      return 'mat4';
    default:
      return 'f32';
  }
}

export function isSamplerType(type: GLUniformType): boolean {
  return type.startsWith('sampler');
}

export function uniformComponents(type: GLUniformType): number {
  switch (type) {
    case 'f32':
    case 'i32':
    case 'u32':
      return 1;
    case 'vec2f':
    case 'vec2i':
    case 'vec2u':
      return 2;
    case 'vec3f':
    case 'vec3i':
    case 'vec3u':
      return 3;
    case 'vec4f':
    case 'vec4i':
    case 'vec4u':
      return 4;
    case 'mat2':
      return 4;
    case 'mat3':
      return 9;
    case 'mat4':
      return 16;
    default:
      return 1;
  }
}
