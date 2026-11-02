import { GLCapabilityError } from './errors.js';
import { GLENUM, type GL } from './enums.js';

export type GLFeature =
  | 'vao'
  | 'instancing'
  | 'uint32-index'
  | 'depth-texture'
  | 'mrt'
  | 'sampler-object'
  | 'srgb'
  | 'float-texture'
  | 'half-float-texture'
  | 'anisotropy'
  | 'blend-minmax'
  | 'timer-query'
  | 'debug-label'
  | 'texture-3d'
  | 'texture-array'
  | 'integer-vertex-attribute'
  | 'uniform-buffer'
  | 'msaa';

export interface GLLimits {
  maxTextureSize: number;
  maxCubeMapSize: number;
  maxVertexAttributes: number;
  maxTextureUnits: number;
  maxVertexTextureUnits: number;
  maxCombinedTextureUnits: number;
  maxVaryingVectors: number;
  maxVertexUniformVectors: number;
  maxFragmentUniformVectors: number;
  maxDrawBuffers: number;
  maxColorAttachments: number;
  maxSamples: number;
  maxRenderbufferSize: number;
  maxUniformBufferBindings: number;
  maxUniformBlockSize: number;
  uniformBufferOffsetAlignment: number;
}

const KNOWN_EXTENSIONS = [
  'OES_vertex_array_object',
  'ANGLE_instanced_arrays',
  'OES_element_index_uint',
  'WEBGL_depth_texture',
  'EXT_sRGB',
  'EXT_blend_minmax',
  'OES_texture_float',
  'OES_texture_half_float',
  'OES_texture_float_linear',
  'OES_texture_half_float_linear',
  'EXT_texture_filter_anisotropic',
  'EXT_disjoint_timer_query',
  'EXT_disjoint_timer_query_webgl2',
  'EXT_debug_label',
  'EXT_debug_marker',
  'WEBGL_debug_renderer_info',
  'WEBGL_lose_context',
  'EXT_color_buffer_float',
  'EXT_color_buffer_half_float',
] as const;

function numberParam(gl: GL, name: number, fallback: number): number {
  const value = gl.getParameter(name);
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export class GLCapabilities {
  readonly version: 1 | 2;
  readonly features: ReadonlySet<GLFeature>;
  readonly extensions: ReadonlyMap<string, unknown>;
  readonly limits: GLLimits;

  constructor(gl: GL, version: 1 | 2, requiredExtensions: readonly string[] = []) {
    this.version = version;

    const extensions = new Map<string, unknown>();
    for (const name of KNOWN_EXTENSIONS) {
      const ext = gl.getExtension(name);
      if (ext) extensions.set(name, ext);
    }
    for (const name of requiredExtensions) {
      if (extensions.has(name)) continue;
      const ext = gl.getExtension(name);
      if (ext) {
        extensions.set(name, ext);
      } else {
        throw new GLCapabilityError(name, `required WebGL extension "${name}" is not available`);
      }
    }
    this.extensions = extensions;

    const has = (name: string): boolean => extensions.has(name);
    const features = new Set<GLFeature>();
    if (version === 2) {
      for (const feature of [
        'vao',
        'instancing',
        'uint32-index',
        'depth-texture',
        'mrt',
        'sampler-object',
        'srgb',
        'float-texture',
        'half-float-texture',
        'texture-3d',
        'texture-array',
        'integer-vertex-attribute',
        'uniform-buffer',
        'msaa',
      ] as const) {
        features.add(feature);
      }
    } else {
      if (has('OES_vertex_array_object')) features.add('vao');
      if (has('ANGLE_instanced_arrays')) features.add('instancing');
      if (has('OES_element_index_uint')) features.add('uint32-index');
      if (has('WEBGL_depth_texture')) features.add('depth-texture');
      if (has('EXT_sRGB')) features.add('srgb');
      if (has('OES_texture_float')) features.add('float-texture');
      if (has('OES_texture_half_float')) features.add('half-float-texture');
    }
    if (has('EXT_texture_filter_anisotropic')) features.add('anisotropy');
    if (version === 2 || has('EXT_blend_minmax')) features.add('blend-minmax');
    if (has('EXT_disjoint_timer_query_webgl2') || has('EXT_disjoint_timer_query')) features.add('timer-query');
    if (has('EXT_debug_label') || has('EXT_debug_marker')) features.add('debug-label');
    this.features = features;

    const maxDrawBuffers = version === 2 ? numberParam(gl, GLENUM.MAX_DRAW_BUFFERS, 1) : 1;
    this.limits = {
      maxTextureSize: numberParam(gl, GLENUM.MAX_TEXTURE_SIZE, 2048),
      maxCubeMapSize: numberParam(gl, GLENUM.MAX_CUBE_MAP_TEXTURE_SIZE, 2048),
      maxVertexAttributes: numberParam(gl, GLENUM.MAX_VERTEX_ATTRIBS, 8),
      maxTextureUnits: numberParam(gl, GLENUM.MAX_TEXTURE_IMAGE_UNITS, 8),
      maxVertexTextureUnits: numberParam(gl, GLENUM.MAX_VERTEX_TEXTURE_IMAGE_UNITS, 0),
      maxCombinedTextureUnits: numberParam(gl, GLENUM.MAX_COMBINED_TEXTURE_IMAGE_UNITS, 8),
      maxVaryingVectors: numberParam(gl, GLENUM.MAX_VARYING_VECTORS, 8),
      maxVertexUniformVectors: numberParam(gl, GLENUM.MAX_VERTEX_UNIFORM_VECTORS, 128),
      maxFragmentUniformVectors: numberParam(gl, GLENUM.MAX_FRAGMENT_UNIFORM_VECTORS, 16),
      maxDrawBuffers,
      maxColorAttachments: version === 2 ? numberParam(gl, GLENUM.MAX_COLOR_ATTACHMENTS, 1) : 1,
      maxSamples: version === 2 ? numberParam(gl, GLENUM.MAX_SAMPLES, 0) : 0,
      maxRenderbufferSize: numberParam(gl, GLENUM.MAX_RENDERBUFFER_SIZE, 2048),
      maxUniformBufferBindings: version === 2 ? numberParam(gl, GLENUM.MAX_UNIFORM_BUFFER_BINDINGS, 0) : 0,
      maxUniformBlockSize: version === 2 ? numberParam(gl, GLENUM.MAX_UNIFORM_BLOCK_SIZE, 0) : 0,
      uniformBufferOffsetAlignment: version === 2
        ? numberParam(gl, GLENUM.UNIFORM_BUFFER_OFFSET_ALIGNMENT, 256)
        : 0,
    };
  }

  has(feature: GLFeature): boolean {
    return this.features.has(feature);
  }

  require(feature: GLFeature, detail?: string): void {
    if (!this.features.has(feature)) {
      throw new GLCapabilityError(feature, detail ?? `WebGL feature "${feature}" is not available`);
    }
  }

  extension<T>(name: string): T | null {
    const ext = this.extensions.get(name);
    return ext ? (ext as T) : null;
  }
}
