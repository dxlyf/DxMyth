/**
 * Public type descriptions for the WebGL 2.0 renderer.
 *
 * Deliberately independent from the WebGL1 and WebGPU modules: WebGL2 has its
 * own state descriptions, vertex formats, texture formats and draw calls.
 */

export type GL2BlendFactor =
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

export type GL2BlendEquation = 'add' | 'subtract' | 'reverse-subtract';

export interface GL2BlendState {
  enabled: boolean;
  srcRGB?: GL2BlendFactor;
  dstRGB?: GL2BlendFactor;
  srcAlpha?: GL2BlendFactor;
  dstAlpha?: GL2BlendFactor;
  equationRGB?: GL2BlendEquation;
  equationAlpha?: GL2BlendEquation;
  color?: readonly [number, number, number, number];
}

export type GL2CompareFunc =
  | 'never'
  | 'less'
  | 'equal'
  | 'lequal'
  | 'greater'
  | 'notequal'
  | 'gequal'
  | 'always';

export interface GL2DepthState {
  test?: boolean;
  write?: boolean;
  func?: GL2CompareFunc;
  range?: readonly [number, number];
}

export type GL2CullFace = 'front' | 'back' | 'front-and-back';
export type GL2FrontFace = 'ccw' | 'cw';

export interface GL2CullState {
  enabled?: boolean;
  face?: GL2CullFace;
  frontFace?: GL2FrontFace;
}

export type GL2StencilOp =
  | 'keep'
  | 'zero'
  | 'replace'
  | 'increment'
  | 'increment-wrap'
  | 'decrement'
  | 'decrement-wrap'
  | 'invert';

/** WebGL2 supports separate front/back stencil state. */
export interface GL2StencilFaceState {
  func?: GL2CompareFunc;
  reference?: number;
  readMask?: number;
  writeMask?: number;
  fail?: GL2StencilOp;
  depthFail?: GL2StencilOp;
  pass?: GL2StencilOp;
}

export interface GL2StencilState {
  enabled: boolean;
  front?: GL2StencilFaceState;
  back?: GL2StencilFaceState;
}

export interface GL2PipelineState {
  blend?: GL2BlendState;
  depth?: GL2DepthState;
  cull?: GL2CullState;
  stencil?: GL2StencilState;
  colorMask?: readonly [boolean, boolean, boolean, boolean];
  depthMask?: boolean;
  polygonOffset?: readonly [number, number];
  sampleAlphaToCoverage?: boolean;
  rasterizerDiscard?: boolean;
}

export type GL2TextureFormat =
  | 'rgba8'
  | 'rgb8'
  | 'r8'
  | 'rg8'
  | 'srgb8-alpha8'
  | 'rgba16f'
  | 'rgba32f'
  | 'r16f'
  | 'depth24'
  | 'depth32f'
  | 'depth24-stencil8';

export type GL2TextureFilter =
  | 'nearest'
  | 'linear'
  | 'nearest-mipmap-nearest'
  | 'linear-mipmap-nearest'
  | 'nearest-mipmap-linear'
  | 'linear-mipmap-linear';

export type GL2TextureWrap = 'clamp-to-edge' | 'repeat' | 'mirrored-repeat';

export interface GL2SamplerOptions {
  minFilter?: GL2TextureFilter;
  magFilter?: GL2TextureFilter;
  wrapS?: GL2TextureWrap;
  wrapT?: GL2TextureWrap;
  /** Enables hardware depth comparison (shadow samplers). */
  compareFunc?: GL2CompareFunc;
  /** Requires EXT_texture_filter_anisotropic. */
  anisotropy?: number;
}

export interface GL2TextureOptions extends GL2SamplerOptions {
  format?: GL2TextureFormat;
  /**
   * Use `texStorage2D` (immutable, cheaper validation). Enabled by default.
   * Disable when you need format conversions on re-upload.
   */
  immutable?: boolean;
  generateMipmaps?: boolean;
  /** Number of mip levels for immutable storage. Defaults to a full chain. */
  mipLevels?: number;
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  unpackAlignment?: 1 | 2 | 4 | 8;
  unpackRowLength?: number;
}

export interface GL2TextureData {
  width: number;
  height: number;
  data?: ArrayBufferView | null;
}

export type GL2TextureSource = TexImageSource | GL2TextureData;

export type GL2UniformType =
  | 'float'
  | 'int'
  | 'uint'
  | 'bool'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'ivec2'
  | 'ivec3'
  | 'ivec4'
  | 'uvec2'
  | 'uvec3'
  | 'uvec4'
  | 'bvec2'
  | 'bvec3'
  | 'bvec4'
  | 'mat2'
  | 'mat3'
  | 'mat4'
  | 'sampler2d'
  | 'unknown';

export type GL2UniformValue =
  | number
  | boolean
  | readonly number[]
  | Float32Array
  | Int32Array
  | Uint32Array;

export type GL2Uniforms = Record<string, GL2UniformValue>;

export interface GL2UniformInfo {
  name: string;
  type: GL2UniformType;
  size: number;
  location: WebGLUniformLocation | null;
  /** Assigned unit for samplers, -1 otherwise. */
  textureUnit: number;
  /** -1 when the uniform is not part of a uniform block. */
  blockIndex: number;
}

export interface GL2UniformBlockMember {
  name: string;
  offset: number;
  /** `null` for non-array uniforms. */
  arrayStride: number | null;
  matrixStride: number | null;
  rowMajor: boolean;
  type: GL2UniformType;
  size: number;
}

export interface GL2UniformBlockInfo {
  name: string;
  index: number;
  binding: number;
  dataSize: number;
  members: readonly GL2UniformBlockMember[];
}

export interface GL2AttributeInfoLike {
  name: string;
  location: number;
  type: GL2UniformType;
  size: number;
}

export type GL2AttributeType = 'float32' | 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32';

export interface GL2AttributeSpec {
  name: string;
  size: 1 | 2 | 3 | 4;
  type?: GL2AttributeType;
  normalized?: boolean;
  divisor?: number;
  bufferIndex?: number;
}

export interface GL2VertexLayoutOptions {
  attributes: readonly GL2AttributeSpec[];
  interleaved?: boolean;
  stride?: number;
}

export interface GL2AttributeBinding {
  name: string;
  size: 1 | 2 | 3 | 4;
  type: GL2AttributeType;
  /** Integer attributes use `vertexAttribIPointer` in WebGL2. */
  integer: boolean;
  normalized: boolean;
  divisor: number;
  componentBytes: number;
  stride: number;
  offset: number;
  bufferIndex: number;
}

export interface GL2VertexLayout {
  attributes: readonly GL2AttributeBinding[];
  stride: number;
  key: number;
}

export type GL2DrawMode =
  | 'points'
  | 'lines'
  | 'line-strip'
  | 'line-loop'
  | 'triangles'
  | 'triangle-strip'
  | 'triangle-fan';

export type GL2IndexType = 'uint8' | 'uint16' | 'uint32';
export type GL2BufferUsage = 'static' | 'dynamic' | 'stream';

export interface GL2ProgramRef {
  readonly handle: WebGLProgram | null;
  readonly disposed: boolean;
  use(): void;
  setUniform(name: string, value: GL2UniformValue): void;
  setUniforms(uniforms: GL2Uniforms): void;
  textureUnit(name: string): number | undefined;
  attributeLocation(name: string): number | undefined;
  bindUniformBlock(name: string, binding: number): boolean;
}

export interface GL2BufferRef {
  readonly handle: WebGLBuffer | null;
  readonly byteLength: number;
  readonly target: number;
  readonly disposed: boolean;
}

export interface GL2TextureRef {
  readonly handle: WebGLTexture | null;
  readonly width: number;
  readonly height: number;
  /** Sampler object describing filtering/wrapping for this texture. */
  readonly samplerHandle: WebGLSampler;
  readonly disposed: boolean;
}

export interface GL2VertexArrayRef {
  readonly disposed: boolean;
  readonly indexBuffer: GL2BufferRef | null;
  readonly indexType: GL2IndexType;
  readonly vertexCount: number;
  readonly indexCount: number;
  bind(program: GL2ProgramRef): void;
}

export interface GL2FramebufferRef {
  readonly width: number;
  readonly height: number;
  readonly textures: readonly GL2TextureRef[];
  readonly depthTexture: GL2TextureRef | null;
  readonly disposed: boolean;
  bind(): void;
}

export interface GL2DrawCall {
  program: GL2ProgramRef;
  vertexArray: GL2VertexArrayRef;
  mode?: GL2DrawMode;
  count: number;
  offset?: number;
  instances?: number;
  uniforms?: GL2Uniforms;
  /** name -> texture. Sampler units are resolved from program reflection. */
  textures?: Readonly<Record<string, GL2TextureRef | null>>;
  /** Advanced: bind units explicitly, no sampler uniform is written. */
  textureBindings?: readonly { unit: number; texture: GL2TextureRef | null }[];
  /** Bind uniform blocks by name. */
  uniformBlocks?: Readonly<Record<string, number>>;
  state?: GL2PipelineState;
}

export interface GL2ClearOptions {
  color?: readonly [number, number, number, number];
  depth?: number;
  stencil?: number;
  mask?: { color?: boolean; depth?: boolean; stencil?: boolean };
}

export interface GL2ColorAttachment {
  format?: GL2TextureFormat;
  linear?: boolean;
}

export interface GL2FramebufferOptions {
  width: number;
  height: number;
  /** Multiple render targets (defaults to a single rgba8 attachment). */
  colorAttachments?: readonly GL2ColorAttachment[];
  depth?: boolean;
  /** Sampleable depth texture instead of a renderbuffer. */
  depthTexture?: boolean;
  stencil?: boolean;
}

export interface GL2RendererOptions {
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  gl?: WebGL2RenderingContext;
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
  bufferPool?: GL2BufferPoolOptions;
  texturePool?: GL2TexturePoolOptions;
}

export interface GL2Limits {
  maxTextureSize: number;
  maxVertexAttributes: number;
  maxTextureUnits: number;
  maxCombinedTextureUnits: number;
  maxRenderbufferSize: number;
  maxVaryingVectors: number;
  maxVertexUniformVectors: number;
  maxUniformBufferBindings: number;
  maxUniformBlockSize: number;
  maxDrawBuffers: number;
  maxColorAttachments: number;
  maxAnisotropy: number;
}

export interface GL2Stats {
  glCalls: number;
  stateCalls: number;
  stateSkipped: number;
  drawCalls: number;
  programsCreated: number;
  programsReused: number;
  shaderCompiles: number;
  buffersCreated: number;
  buffersReused: number;
  bufferReallocations: number;
  bufferUploadBytes: number;
  texturesCreated: number;
  texturesReused: number;
  textureUploads: number;
  textureUploadBytes: number;
  textureUploadSkipped: number;
  mipmapGenerations: number;
  samplersCreated: number;
  samplerCacheHits: number;
  framebuffersCreated: number;
  framebufferResizes: number;
  vertexArraysCreated: number;
  vertexArrayBinds: number;
  uniformWrites: number;
  uniformSkipped: number;
  uniformBlockBindings: number;
  uniformBlockSkipped: number;
}

export interface GL2FrameStats extends GL2Stats {
  frame: number;
}

export interface GL2BufferPoolOptions {
  maxFreePerTarget?: number;
}

export interface GL2TexturePoolOptions {
  maxFreeTextures?: number;
}
