/**
 * WebGL 2.0 enum values used by this module. Declared locally so the cache
 * layer never depends on a live context (and so tests can use a stub).
 */
export const GL_ZERO = 0x0000;
export const GL_ONE = 0x0001;

export const GL_BLEND = 0x0be2;
export const GL_DEPTH_TEST = 0x0b71;
export const GL_CULL_FACE = 0x0b44;
export const GL_SCISSOR_TEST = 0x0c11;
export const GL_STENCIL_TEST = 0x0b90;
export const GL_DITHER = 0x0bd0;
export const GL_POLYGON_OFFSET_FILL = 0x8037;
export const GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809e;
export const GL_RASTERIZER_DISCARD = 0x8c89;

export const GL_SRC_COLOR = 0x0300;
export const GL_ONE_MINUS_SRC_COLOR = 0x0301;
export const GL_SRC_ALPHA = 0x0302;
export const GL_ONE_MINUS_SRC_ALPHA = 0x0303;
export const GL_DST_ALPHA = 0x0304;
export const GL_ONE_MINUS_DST_ALPHA = 0x0305;
export const GL_DST_COLOR = 0x0306;
export const GL_ONE_MINUS_DST_COLOR = 0x0307;
export const GL_SRC_ALPHA_SATURATE = 0x0308;
export const GL_CONSTANT_COLOR = 0x8001;
export const GL_ONE_MINUS_CONSTANT_COLOR = 0x8002;
export const GL_CONSTANT_ALPHA = 0x8003;
export const GL_ONE_MINUS_CONSTANT_ALPHA = 0x8004;

export const GL_FUNC_ADD = 0x8006;
export const GL_FUNC_SUBTRACT = 0x800a;
export const GL_FUNC_REVERSE_SUBTRACT = 0x800b;

export const GL_NEVER = 0x0200;
export const GL_LESS = 0x0201;
export const GL_EQUAL = 0x0202;
export const GL_LEQUAL = 0x0203;
export const GL_GREATER = 0x0204;
export const GL_NOTEQUAL = 0x0205;
export const GL_GEQUAL = 0x0206;
export const GL_ALWAYS = 0x0207;

export const GL_FRONT = 0x0404;
export const GL_BACK = 0x0405;
export const GL_FRONT_AND_BACK = 0x0408;
export const GL_CW = 0x0900;
export const GL_CCW = 0x0901;

export const GL_KEEP = 0x1e00;
export const GL_REPLACE = 0x1e01;
export const GL_INCR = 0x1e02;
export const GL_DECR = 0x1e03;
export const GL_INVERT = 0x150a;
export const GL_INCR_WRAP = 0x8507;
export const GL_DECR_WRAP = 0x8508;

export const GL_ARRAY_BUFFER = 0x8892;
export const GL_ELEMENT_ARRAY_BUFFER = 0x8893;
export const GL_UNIFORM_BUFFER = 0x8a11;
export const GL_COPY_READ_BUFFER = 0x8f36;
export const GL_COPY_WRITE_BUFFER = 0x8f37;

export const GL_STREAM_DRAW = 0x88e0;
export const GL_STATIC_DRAW = 0x88e4;
export const GL_DYNAMIC_DRAW = 0x88e8;
export const GL_STREAM_READ = 0x88e1;
export const GL_STREAM_COPY = 0x88e2;
export const GL_STATIC_READ = 0x88e5;
export const GL_DYNAMIC_COPY = 0x88ea;

export const GL_TEXTURE_2D = 0x0de1;
export const GL_TEXTURE_2D_ARRAY = 0x8c1a;
export const GL_TEXTURE0 = 0x84c0;

export const GL_RGBA = 0x1908;
export const GL_RGB = 0x1907;
export const GL_RED = 0x1903;
export const GL_RG = 0x8227;
export const GL_RGBA8 = 0x8058;
export const GL_RGB8 = 0x8051;
export const GL_R8 = 0x8229;
export const GL_RG8 = 0x822b;
export const GL_SRGB8_ALPHA8 = 0x8c43;
export const GL_RGBA16F = 0x881a;
export const GL_RGBA32F = 0x8814;
export const GL_R16F = 0x822d;
export const GL_DEPTH_COMPONENT = 0x1902;
export const GL_DEPTH_COMPONENT16 = 0x81a5;
export const GL_DEPTH_COMPONENT24 = 0x81a6;
export const GL_DEPTH_COMPONENT32F = 0x8cac;
export const GL_DEPTH_STENCIL = 0x84f9;
export const GL_DEPTH24_STENCIL8 = 0x88f0;

export const GL_UNSIGNED_BYTE = 0x1401;
export const GL_BYTE = 0x1400;
export const GL_SHORT = 0x1402;
export const GL_UNSIGNED_SHORT = 0x1403;
export const GL_INT = 0x1404;
export const GL_UNSIGNED_INT = 0x1405;
export const GL_FLOAT = 0x1406;
export const GL_HALF_FLOAT = 0x140b;
export const GL_UNSIGNED_INT_24_8 = 0x84fa;
export const GL_UNSIGNED_INT_2_10_10_10_REV = 0x8368;

export const GL_TEXTURE_MAG_FILTER = 0x2800;
export const GL_TEXTURE_MIN_FILTER = 0x2801;
export const GL_TEXTURE_WRAP_S = 0x2802;
export const GL_TEXTURE_WRAP_T = 0x2803;
export const GL_TEXTURE_COMPARE_MODE = 0x884c;
export const GL_TEXTURE_COMPARE_FUNC = 0x884d;
export const GL_COMPARE_REF_TO_TEXTURE = 0x884e;
export const GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe;
export const GL_TEXTURE_MAX_LEVEL = 0x813d;

export const GL_NEAREST = 0x2600;
export const GL_LINEAR = 0x2601;
export const GL_NEAREST_MIPMAP_NEAREST = 0x2700;
export const GL_LINEAR_MIPMAP_NEAREST = 0x2701;
export const GL_NEAREST_MIPMAP_LINEAR = 0x2702;
export const GL_LINEAR_MIPMAP_LINEAR = 0x2703;

export const GL_CLAMP_TO_EDGE = 0x812f;
export const GL_REPEAT = 0x2901;
export const GL_MIRRORED_REPEAT = 0x8370;
export const GL_CLAMP_TO_BORDER = 0x812d;

export const GL_FRAMEBUFFER = 0x8d40;
export const GL_DRAW_FRAMEBUFFER = 0x8ca9;
export const GL_READ_FRAMEBUFFER = 0x8ca8;
export const GL_RENDERBUFFER = 0x8d41;
export const GL_COLOR_ATTACHMENT0 = 0x8ce0;
export const GL_DEPTH_ATTACHMENT = 0x8d00;
export const GL_STENCIL_ATTACHMENT = 0x8d20;
export const GL_DEPTH_STENCIL_ATTACHMENT = 0x821a;
export const GL_FRAMEBUFFER_COMPLETE = 0x8cd5;
export const GL_STENCIL_INDEX8 = 0x8d48;

export const GL_COLOR_BUFFER_BIT = 0x4000;
export const GL_DEPTH_BUFFER_BIT = 0x0100;
export const GL_STENCIL_BUFFER_BIT = 0x0400;

export const GL_VERTEX_SHADER = 0x8b31;
export const GL_FRAGMENT_SHADER = 0x8b30;
export const GL_COMPILE_STATUS = 0x8b81;
export const GL_LINK_STATUS = 0x8b82;
export const GL_ACTIVE_UNIFORMS = 0x8b86;
export const GL_ACTIVE_ATTRIBUTES = 0x8b89;
export const GL_ACTIVE_UNIFORM_BLOCKS = 0x8a36;
export const GL_UNIFORM_TYPE = 0x8a37;
export const GL_UNIFORM_BLOCK_INDEX = 0x8a3a;
export const GL_UNIFORM_OFFSET = 0x8a3b;
export const GL_UNIFORM_ARRAY_STRIDE = 0x8a3c;
export const GL_UNIFORM_MATRIX_STRIDE = 0x8a3d;
export const GL_UNIFORM_IS_ROW_MAJOR = 0x8a3e;
export const GL_UNIFORM_BLOCK_DATA_SIZE = 0x8a40;

export const GL_BOOL = 0x8b56;
export const GL_FLOAT_VEC2 = 0x8b50;
export const GL_FLOAT_VEC3 = 0x8b51;
export const GL_FLOAT_VEC4 = 0x8b52;
export const GL_INT_VEC2 = 0x8b53;
export const GL_INT_VEC3 = 0x8b54;
export const GL_INT_VEC4 = 0x8b55;
export const GL_BOOL_VEC2 = 0x8b57;
export const GL_BOOL_VEC3 = 0x8b58;
export const GL_BOOL_VEC4 = 0x8b59;
export const GL_FLOAT_MAT2 = 0x8b5a;
export const GL_FLOAT_MAT3 = 0x8b5b;
export const GL_FLOAT_MAT4 = 0x8b5c;
export const GL_SAMPLER_2D = 0x8b5e;
export const GL_UNSIGNED_INT_VEC2 = 0x8dc6;
export const GL_UNSIGNED_INT_VEC3 = 0x8dc7;
export const GL_UNSIGNED_INT_VEC4 = 0x8dc8;

export const GL_POINTS = 0x0000;
export const GL_LINES = 0x0001;
export const GL_LINE_LOOP = 0x0002;
export const GL_LINE_STRIP = 0x0003;
export const GL_TRIANGLES = 0x0004;
export const GL_TRIANGLE_STRIP = 0x0005;
export const GL_TRIANGLE_FAN = 0x0006;

export const GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
export const GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
export const GL_UNPACK_ALIGNMENT = 0x0cf5;
export const GL_UNPACK_ROW_LENGTH = 0x0cf2;
export const GL_PACK_ALIGNMENT = 0x0d05;

export const GL_MAX_TEXTURE_SIZE = 0x0d33;
export const GL_MAX_VERTEX_ATTRIBS = 0x8869;
export const GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
export const GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d;
export const GL_MAX_RENDERBUFFER_SIZE = 0x84e8;
export const GL_MAX_VARYING_VECTORS = 0x8dfc;
export const GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8dfb;
export const GL_MAX_UNIFORM_BUFFER_BINDINGS = 0x8a2f;
export const GL_MAX_UNIFORM_BLOCK_SIZE = 0x8a30;
export const GL_MAX_DRAW_BUFFERS = 0x8824;
export const GL_MAX_COLOR_ATTACHMENTS = 0x8cdf;
export const GL_VERSION = 0x1f02;
export const GL_VENDOR = 0x1f00;
export const GL_RENDERER = 0x1f01;

export const GL_FRAMEBUFFER_BINDING = 0x8ca6;
export const GL_DRAW_FRAMEBUFFER_BINDING = 0x8ca6;
export const GL_VERTEX_ARRAY_BINDING = 0x85b5;
export const GL_INVALID_INDEX = 0xffffffff;
