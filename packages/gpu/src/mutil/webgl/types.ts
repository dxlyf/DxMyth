/**
 * Public type descriptions for the WebGL 1.0 renderer.
 *
 * This file is intentionally self-contained: the WebGL1, WebGL2 and WebGPU
 * wrappers do not share a common resource description. Every backend names and
 * models its own state so that no abstraction leaks between them.
 */

export type GL1BlendFactor =
  | 'zero'
  | 'one'
  | 'src-color'
  | 'one-minus-src-color'
  | 'src-alpha'
  | 'one-minus-src-alpha'
  | 'dst-color'
  | 'one-minus-dst-color'
  | 'dst-alpha'
  | 'one-minus-dst-alpha'
  | 'constant-color'
  | 'one-minus-constant-color'
  | 'constant-alpha'
  | 'one-minus-constant-alpha'
  | 'src-alpha-saturate';

export type GL1BlendEquation = 'add' | 'subtract' | 'reverse-subtract';

export interface GL1BlendState {
  enabled: boolean;
  srcRGB?: GL1BlendFactor;
  dstRGB?: GL1BlendFactor;
  srcAlpha?: GL1BlendFactor;
  dstAlpha?: GL1BlendFactor;
  equationRGB?: GL1BlendEquation;
  equationAlpha?: GL1BlendEquation;
  /** Used by the `constant-*` blend factors. */
  color?: readonly [number, number, number, number];
}

export type GL1CompareFunc =
  | 'never'
  | 'less'
  | 'equal'
  | 'lequal'
  | 'greater'
  | 'notequal'
  | 'gequal'
  | 'always';

export interface GL1DepthState {
  test?: boolean;
  write?: boolean;
  func?: GL1CompareFunc;
  /** Depth range, [0, 1] by default. */
  range?: readonly [number, number];
}

export type GL1CullFace = 'front' | 'back' | 'front-and-back';
export type GL1FrontFace = 'ccw' | 'cw';

export interface GL1CullState {
  enabled?: boolean;
  face?: GL1CullFace;
  frontFace?: GL1FrontFace;
}

export type GL1StencilOp =
  | 'keep'
  | 'zero'
  | 'replace'
  | 'increment'
  | 'increment-wrap'
  | 'decrement'
  | 'decrement-wrap'
  | 'invert';

export interface GL1StencilState {
  enabled: boolean;
  func?: GL1CompareFunc;
  reference?: number;
  readMask?: number;
  writeMask?: number;
  fail?: GL1StencilOp;
  depthFail?: GL1StencilOp;
  pass?: GL1StencilOp;
}

/** Everything that can be bound as immutable-ish pipeline state per draw. */
export interface GL1PipelineState {
  blend?: GL1BlendState;
  depth?: GL1DepthState;
  cull?: GL1CullState;
  stencil?: GL1StencilState;
  colorMask?: readonly [boolean, boolean, boolean, boolean];
  depthMask?: boolean;
  /** Enables gl.polygonOffset(factor, units) for shadow passes. */
  polygonOffset?: readonly [number, number];
}

export type GL1TextureFormat =
  | 'rgba8'
  | 'rgb8'
  | 'rgba4'
  | 'rgb565'
  | 'rgb5-a1'
  | 'luminance8'
  | 'alpha8'
  | 'luminance-alpha8';

export type GL1TextureFilter =
  | 'nearest'
  | 'linear'
  | 'nearest-mipmap-nearest'
  | 'linear-mipmap-nearest'
  | 'nearest-mipmap-linear'
  | 'linear-mipmap-linear';

export type GL1TextureWrap = 'clamp-to-edge' | 'repeat' | 'mirrored-repeat';

export interface GL1TextureOptions {
  format?: GL1TextureFormat;
  minFilter?: GL1TextureFilter;
  magFilter?: GL1TextureFilter;
  wrapS?: GL1TextureWrap;
  wrapT?: GL1TextureWrap;
  generateMipmaps?: boolean;
  /** Only honoured on the first upload of an image source. */
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  unpackAlignment?: 1 | 2 | 4 | 8;
  /** Requires WEBGL_EXT_texture_filter_anisotropic; ignored otherwise. */
  anisotropy?: number;
}

export interface GL1TextureData {
  width: number;
  height: number;
  /** `null`/omitted allocates storage without uploading pixels. */
  data?: ArrayBufferView | null;
}

export type GL1TextureSource = TexImageSource | GL1TextureData;

export type GL1UniformType =
  | 'float'
  | 'int'
  | 'bool'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'ivec2'
  | 'ivec3'
  | 'ivec4'
  | 'bvec2'
  | 'bvec3'
  | 'bvec4'
  | 'mat2'
  | 'mat3'
  | 'mat4'
  | 'sampler2d'
  | 'unknown';

export type GL1UniformValue =
  | number
  | boolean
  | readonly number[]
  | Float32Array
  | Int32Array
  | Uint32Array;

export type GL1Uniforms = Record<string, GL1UniformValue>;

export interface GL1UniformInfo {
  name: string;
  type: GL1UniformType;
  size: number;
  /** Resolved lazily on first use. */
  location: WebGLUniformLocation | null;
  /** Sampler units are assigned deterministically from program reflection. */
  textureUnit: number;
}

export interface GL1AttributeInfo {
  name: string;
  type: GL1UniformType;
  size: number;
  location: number;
}

export type GL1AttributeType = 'float';

export interface GL1AttributeSpec {
  name: string;
  size: 1 | 2 | 3 | 4;
  type?: GL1AttributeType;
  normalized?: boolean;
  divisor?: number;
  /** Overrides the derived array buffer index (non-interleaved layouts). */
  bufferIndex?: number;
}

export interface GL1VertexLayoutOptions {
  attributes: readonly GL1AttributeSpec[];
  /**
   * Interleaved (default) packs every attribute into buffer 0. When false each
   * attribute is expected in its own buffer at offset 0 with stride 0.
   */
  interleaved?: boolean;
  /** Explicit interleaved stride; defaults to the sum of attribute sizes. */
  stride?: number;
}

export interface GL1AttributeBinding {
  name: string;
  size: 1 | 2 | 3 | 4;
  type: GL1AttributeType;
  normalized: boolean;
  divisor: number;
  stride: number;
  offset: number;
  bufferIndex: number;
}

export interface GL1VertexLayout {
  attributes: readonly GL1AttributeBinding[];
  stride: number;
  /** Stable cache key for the layout. */
  key: number;
}

export type GL1DrawMode =
  | 'points'
  | 'lines'
  | 'line-strip'
  | 'line-loop'
  | 'triangles'
  | 'triangle-strip'
  | 'triangle-fan';

export type GL1IndexType = 'uint8' | 'uint16';

export type GL1BufferUsage = 'static' | 'dynamic' | 'stream';

export interface GL1TextureBinding {
  /** Explicit texture unit. */
  unit: number;
  texture: GL1TextureRef | null;
  target?: '2d';
}

export interface GL1TextureRef {
  readonly width: number;
  readonly height: number;
  readonly handle: WebGLTexture | null;
  readonly disposed: boolean;
}

export interface GL1ProgramRef {
  readonly handle: WebGLProgram | null;
  readonly disposed: boolean;
  use(): void;
  setUniform(name: string, value: GL1UniformValue): void;
  setUniforms(uniforms: GL1Uniforms): void;
  textureUnit(name: string): number | undefined;
  /** -1/undefined when the attribute was optimised out of the program. */
  attributeLocation(name: string): number | undefined;
}

export interface GL1VertexArrayRef {
  bind(program: GL1ProgramRef): void;
  readonly indexBuffer: GL1BufferRef | null;
  readonly indexType: GL1IndexType;
  readonly vertexCount: number;
  readonly disposed: boolean;
}

export interface GL1BufferRef {
  readonly byteLength: number;
  readonly target: number;
  readonly disposed: boolean;
}

export interface GL1FramebufferRef {
  readonly width: number;
  readonly height: number;
  readonly texture: GL1TextureRef;
  readonly disposed: boolean;
  bind(): void;
}

export interface GL1DrawCall {
  program: GL1ProgramRef;
  vertexArray: GL1VertexArrayRef;
  mode?: GL1DrawMode;
  /** Vertex count (index count when the vertex array has an index buffer). */
  count: number;
  /** First vertex / first index. */
  offset?: number;
  /** Instance count; requires ANGLE_instanced_arrays on WebGL1. */
  instances?: number;
  uniforms?: GL1Uniforms;
  /** Name -> texture, bound to the sampler units resolved by the program. */
  textures?: Readonly<Record<string, GL1TextureRef | null>>;
  /** Advanced form: bind explicit units, no sampler uniforms are touched. */
  textureBindings?: readonly GL1TextureBinding[];
  state?: GL1PipelineState;
}

export interface GL1ClearOptions {
  color?: readonly [number, number, number, number];
  depth?: number;
  stencil?: number;
  mask?: {
    color?: boolean;
    depth?: boolean;
    stencil?: boolean;
  };
}

export interface GL1FramebufferOptions {
  width: number;
  height: number;
  colorFormat?: 'rgba8' | 'rgb8' | 'rgba4' | 'rgb565' | 'rgb5-a1';
  depth?: boolean;
  stencil?: boolean;
  /** Sample textures with linear filtering (default true). */
  linear?: boolean;
}

export interface GL1RendererOptions {
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  /** Use an existing context instead of creating one from `canvas`. */
  gl?: WebGLRenderingContext;
  width?: number;
  height?: number;
  alpha?: boolean;
  antialias?: boolean;
  depth?: boolean;
  stencil?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
  bufferPool?: GL1BufferPoolOptions;
  texturePool?: GL1TexturePoolOptions;
}

export interface GL1Limits {
  maxTextureSize: number;
  maxVertexAttributes: number;
  maxTextureUnits: number;
  maxCombinedTextureUnits: number;
  maxRenderbufferSize: number;
  maxVaryingVectors: number;
  maxVertexUniformVectors: number;
  maxAnisotropy: number;
  hasInstancing: boolean;
  hasVertexArrayObject: boolean;
}

/**
 * Instrumentation counters. They exist to make the cache behaviour measurable
 * (tests assert on them) and are reset per frame by `beginFrame()`.
 */
export interface GL1Stats {
  /** Every GL command issued by the wrapper. */
  glCalls: number;
  /** State mutations requested through the cached state object. */
  stateCalls: number;
  /** Individual GL state commands elided because the value was unchanged. */
  stateSkipped: number;
  drawCalls: number;
  programsCreated: number;
  programsReused: number;
  shaderCompiles: number;
  /** gl.createBuffer calls (new GPU resources). */
  buffersCreated: number;
  buffersReused: number;
  bufferReallocations: number;
  bufferUploadBytes: number;
  /** gl.createTexture calls (new GPU resources). */
  texturesCreated: number;
  texturesReused: number;
  textureUploads: number;
  textureUploadBytes: number;
  textureUploadSkipped: number;
  textureMipmapGenerations: number;
  framebuffersCreated: number;
  framebufferResizes: number;
  vertexArraysCreated: number;
  /** Uniform writes that reached the driver. */
  uniformWrites: number;
  /** Uniform writes skipped because the value/unit was unchanged or inactive. */
  uniformSkipped: number;
}

export interface GL1FrameStats extends GL1Stats {
  /** Frames completed via `endFrame()`. */
  frame: number;
}

export interface GL1TexturePoolOptions {
  /** Upper bound of retained released textures. Defaults to 32. */
  maxFreeTextures?: number;
}

export interface GL1BufferPoolOptions {
  /** Retained released buffers per target. Defaults to 16. */
  maxFreePerTarget?: number;
}
