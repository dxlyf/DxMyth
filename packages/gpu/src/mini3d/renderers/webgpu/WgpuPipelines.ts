/**
 * Pipeline + bind-group-layout manager for the WebGPU backend.
 *
 * Everything here is *synchronous to request and asynchronous to build*:
 * `request()` returns the cached `GPURenderPipeline` when it exists, starts a
 * `createRenderPipelineAsync()` when it does not (so the first frame that
 * introduces a new material combination simply skips that draw) and reports the
 * new pipeline back through the `onPipelineReady` callback. `WebGPURenderer.compile()`
 * awaits the same promises so an application can pre-warm every pipeline the
 * scene needs before its first frame.
 *
 * Bind group layouts (frozen contract):
 *
 * - **group 0** 鈥?`FrameUniforms` in a uniform buffer at binding 0, with
 *   `minBindingSize` set so a wrongly sized buffer fails loudly.
 * - **group 1** 鈥?`ObjectUniforms` uniform buffer at binding 0, plus
 *   `t_/s_ diffuse, normal, emissive, ao` at bindings 1..8.
 *
 * `ObjectUniforms` lives in this module (one `GPUBuffer` per material, cached
 * by `material.id` and refreshed when `material.version` changes) so draws can
 * be reordered freely without re-uploading anything.
 */

import { buildMaterialDefines, isBuiltInKind } from '../webgl/GLProgram';
import type { Material } from '../../materials/Material';
import type { Texture } from '../../textures/Texture';
import type { Side } from '../../constants';
import {
  buildWgslShader,
  type WgslShaderName,
  type WgslVariants,
} from '../../shaders/WgslLib';
import { OBJECT_UNIFORM_BYTES, packObjectUniforms, materialView } from './WgpuUniforms';
import { safeWriteBuffer } from './WgpuUploads';
import type { WgpuTextures } from './WgpuTextures';

/** Shader names `WgslLib` provides (mirrors `WgslShaderName`). */
export type WgpuShaderName = WgslShaderName;

/** The WGSL entry point names the library guarantees. */
export const VERTEX_ENTRY_POINT = 'vs_main';
export const FRAGMENT_ENTRY_POINT = 'fs_main';

/** Alpha mode used for the canvas context. */
export type CanvasAlphaMode = GPUCanvasAlphaMode;

/** Description of the WGSL variant a material needs. */
export interface WgpuPipelineRequest {
  material: Material;
  /** Absolute index buffer format, or `null` for a non-indexed draw. */
  indexFormat: GPUIndexFormat | null;
  topology: GPUPrimitiveTopology;
  vertexLayoutKey: string;
  vertexLayouts: GPUVertexBufferLayout[];
}

/** Everything a `GPURenderPipelineDescriptor` needs beyond the shader pair. */
export interface WgpuPipelineState {
  shaderName: WgpuShaderName;
  variants: WgslVariants;
  topology: GPUPrimitiveTopology;
  indexFormat: GPUIndexFormat | null;
  side: Side;
  blending: string;
  depthTest: boolean;
  depthFunc: string;
  depthWrite: boolean;
  colorWrite: boolean;
  vertexLayoutKey: string;
  /** `true` for `ShaderMaterial` / `RawShaderMaterial` (GLSL: not portable). */
  customShader: boolean;
}

/** Canvas + depth formats a pipeline must be written against. */
export interface WgpuPipelineFormats {
  color: GPUTextureFormat;
  depth: GPUTextureFormat;
  sampleCount: number;
}

/** A built (or in-flight) pipeline. */
export interface WgpuPipelineEntry {
  key: string;
  pipeline: GPURenderPipeline | null;
  /** Resolves once `createRenderPipelineAsync()` settles. */
  pending: Promise<GPURenderPipeline | null> | null;
  failed: boolean;
}

/** Per-material `ObjectUniforms` upload slot. */
export interface WgpuMaterialUniform {
  buffer: GPUBuffer;
  data: Float32Array;
  /** `material.version` at the last upload. */
  version: number;
  bindGroup: GPUBindGroup | null;
  /** Texture-slot signature the bind group was built from. */
  textureKey: string;
}

/** Callback invoked when an asynchronously built pipeline becomes available. */
export type PipelineReadyHandler = (key: string, pipeline: GPURenderPipeline) => void;

// ------------------------------------------------------------------- WGSL ---

const BACKGROUND_WGSL = /* wgsl */ `
// Fullscreen background blit: a 2-triangle clip-space quad sampled with
// V-down UVs so an unflipped scene-background texture appears right way up.
struct BackgroundOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@location(0) position: vec2<f32>) -> BackgroundOut {
  var out: BackgroundOut;
  out.position = vec4<f32>(position, 0.0, 1.0);
  out.uv = vec2<f32>(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return out;
}

@group(0) @binding(0) var t_background: texture_2d<f32>;
@group(0) @binding(1) var s_background: sampler;

@fragment
fn fs_main(in: BackgroundOut) -> @location(0) vec4<f32> {
  return textureSample(t_background, s_background, in.uv);
}
`;

/** Number of floats the background quad holds (4 vertices x vec2). */
export const BACKGROUND_QUAD_VERTEX_COUNT = 4;

/** Whether a material kind has a WGSL entry in `WgslLib`. */
export function wgslNameForMaterial(material: Material): WgpuShaderName {
  const kind = material.kind;
  if (isBuiltInKind(kind)) return kind;
  // `shader` / `raw-shader` materials ship GLSL, which WebGPU cannot compile.
  return 'basic';
}

/** True for materials whose GLSL source the WebGPU backend must substitute. */
export function isCustomShaderMaterial(material: Material): boolean {
  const custom = material as Material & { vertexShader?: unknown; fragmentShader?: unknown };
  return typeof custom.vertexShader === 'string' && typeof custom.fragmentShader === 'string';
}

/**
 * Derives the WGSL `WgslVariants` from the material.
 *
 * `buildMaterialDefines` is reused (rather than re-deriving the `USE_*` macros)
 * so both backends agree on which features a material enables; the individual
 * `variants.*` booleans are then read back out of that define record. Texture
 * presence is read from the material itself because a define can be overridden
 * by the user.
 */
export function buildVariants(material: Material): WgslVariants {
  const defines = buildMaterialDefines(material);
  const view = materialView(material);
  const enabled = (key: string): boolean =>
    defines[key] !== undefined && defines[key] !== false && defines[key] !== null;

  return {
    useMap: view.map !== null && view.map !== undefined,
    useAlphaMap: view.alphaMap !== null && view.alphaMap !== undefined,
    useNormalMap: view.normalMap !== null && view.normalMap !== undefined,
    useEmissiveMap: view.emissiveMap !== null && view.emissiveMap !== undefined,
    useSpecularMap: view.specularMap !== null && view.specularMap !== undefined,
    useRoughnessMap: view.roughnessMap !== null && view.roughnessMap !== undefined,
    useMetalnessMap: view.metalnessMap !== null && view.metalnessMap !== undefined,
    useAoMap: view.aoMap !== null && view.aoMap !== undefined,
    vertexColors: enabled('USE_COLOR') || material.vertexColors,
    flatShading: enabled('FLAT_SHADED') || material.flatShading,
    doubleSided: material.side === 'double' || enabled('DOUBLE_SIDED'),
  };
}

/** Stable, ordered serialisation of a variant set for the cache key. */
export function variantKey(variants: WgslVariants): string {
  const flags: (keyof WgslVariants)[] = [
    'useMap',
    'useAlphaMap',
    'useNormalMap',
    'useEmissiveMap',
    'useSpecularMap',
    'useRoughnessMap',
    'useMetalnessMap',
    'useAoMap',
    'vertexColors',
    'flatShading',
    'doubleSided',
  ];
  const parts: string[] = [];
  for (const flag of flags) if (variants[flag]) parts.push(flag);
  return parts.length > 0 ? parts.join('+') : '-';
}

/** `GPUCullMode` mirroring `WebGLState.setSide` (which culls FRONT for 'back'). */
export function cullModeForSide(side: Side): GPUCullMode {
  switch (side) {
    case 'back':
      return 'front';
    case 'double':
      return 'none';
    case 'front':
    default:
      return 'back';
  }
}

/** Maps the library's `DepthFunc` strings onto `GPUCompareFunction`. */
export function compareFunction(depthFunc: string): GPUCompareFunction {
  switch (depthFunc) {
    case 'never':
      return 'never';
    case 'less':
      return 'less';
    case 'equal':
      return 'equal';
    case 'le-Equal':
      return 'less-equal';
    case 'greater':
      return 'greater';
    case 'not-equal':
      return 'not-equal';
    case 'ge-Equal':
      return 'greater-equal';
    case 'always':
    default:
      return 'always';
  }
}

/**
 * `GPUBlendState` for a library `Blending` value.
 *
 * `'none'` returns `undefined` so the pipeline writes the fragment straight
 * through. Alpha channels follow the same intent as `WebGLState.setBlending`.
 */
export function blendStateForBlending(blending: string): GPUBlendState | undefined {
  switch (blending) {
    case 'additive':
      return blend('src-alpha', 'one', 'src-alpha', 'one');
    case 'subtractive':
      return blend('zero', 'one-minus-src-alpha', 'zero', 'one-minus-src-alpha');
    case 'multiply':
      return blend('zero', 'src-alpha', 'zero', 'src-alpha');
    case 'none':
      return undefined;
    case 'normal':
    default:
      return blend('src-alpha', 'one-minus-src-alpha', 'one', 'one-minus-src-alpha');
  }
}

/**
 * Releases a render pipeline.
 *
 * `GPURenderPipeline.destroy()` was removed from the spec and is absent from the
 * bundled `@webgpu/types`, but older Chromium builds still expose it, so the
 * call is guarded rather than dropped.
 */
function destroyPipeline(pipeline: GPURenderPipeline): void {
  const destroy = (pipeline as unknown as { destroy?: () => void }).destroy;
  if (typeof destroy === 'function') destroy.call(pipeline);
}

/**
 * Both blend operands use the `*-color` variants for the RGB channel; WebGPU
 * expresses "one minus source colour" and "one minus source alpha" as
 * separate factors, hence the small translation table below.
 */
function blend(
  src: GPUBlendFactor,
  dst: GPUBlendFactor,
  srcAlpha: GPUBlendFactor,
  dstAlpha: GPUBlendFactor,
): GPUBlendState {
  return {
    color: { srcFactor: src, dstFactor: dst, operation: 'add' },
    alpha: { srcFactor: srcAlpha, dstFactor: dstAlpha, operation: 'add' },
  };
}

/** The full pipeline cache key. */
export function pipelineCacheKey(state: WgpuPipelineState, formats: WgpuPipelineFormats): string {
  return [
    state.shaderName,
    variantKey(state.variants),
    state.topology,
    state.indexFormat ?? 'none',
    state.side,
    state.blending,
    state.depthTest ? state.depthFunc : 'no-depth-test',
    state.depthTest && state.depthWrite ? 'write' : 'no-write',
    state.colorWrite ? 'color' : 'nocolor',
    state.customShader ? 'custom' : 'builtin',
    state.vertexLayoutKey,
    formats.color,
    formats.depth,
    `s${formats.sampleCount}`,
  ].join('|');
}

/** Snapshot of the render state a pipeline is built from. */
export function pipelineStateFor(
  request: WgpuPipelineRequest,
  material: Material,
): WgpuPipelineState {
  return {
    shaderName: wgslNameForMaterial(material),
    variants: buildVariants(material),
    topology: request.topology,
    indexFormat: request.indexFormat,
    side: material.side,
    blending: material.blending,
    depthTest: material.depthTest,
    depthFunc: material.depthFunc,
    depthWrite: material.depthWrite,
    colorWrite: material.colorWrite,
    vertexLayoutKey: request.vertexLayoutKey,
    customShader: isCustomShaderMaterial(material),
  };
}

// ---------------------------------------------------------------- manager ---

/**
 * Owns the pipeline cache, the two shared bind group layouts, the background
 * blit pipeline and the per-material `ObjectUniforms` buffers.
 */
export class WgpuPipelines {
  readonly device: GPUDevice;
  readonly formats: WgpuPipelineFormats;

  /** Bind group 0 鈥?`FrameUniforms`. */
  readonly frameLayout: GPUBindGroupLayout;
  /** Bind group 1 鈥?`ObjectUniforms` + the four texture/sampler pairs. */
  readonly objectLayout: GPUBindGroupLayout;
  readonly pipelineLayout: GPUPipelineLayout;

  /** Background blit resources. */
  readonly backgroundLayout: GPUBindGroupLayout;
  readonly backgroundPipelineLayout: GPUPipelineLayout;
  readonly backgroundSampler: GPUSampler;
  readonly backgroundBuffer: GPUBuffer;
  backgroundPipeline: GPURenderPipeline | null = null;

  /** Called from an async continuation when a pipeline becomes available. */
  onPipelineReady: PipelineReadyHandler | null = null;

  private readonly cache = new Map<string, WgpuPipelineEntry>();
  private readonly modules = new Map<string, GPUShaderModule>();
  private readonly materials = new Map<number, WgpuMaterialUniform>();
  private readonly ready = new Map<string, GPURenderPipeline>();
  private disposed = false;

  constructor(device: GPUDevice, formats: WgpuPipelineFormats) {
    this.device = device;
    this.formats = formats;

    this.frameLayout = device.createBindGroupLayout({
      label: 'mini3d.frame',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform', minBindingSize: 0 },
        },
      ],
    });

    this.objectLayout = device.createBindGroupLayout({
      label: 'mini3d.object',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform', minBindingSize: OBJECT_UNIFORM_BYTES },
        },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 8, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    this.pipelineLayout = device.createPipelineLayout({
      label: 'mini3d.pipeline',
      bindGroupLayouts: [this.frameLayout, this.objectLayout],
    });

    this.backgroundLayout = device.createBindGroupLayout({
      label: 'mini3d.background',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    this.backgroundPipelineLayout = device.createPipelineLayout({
      label: 'mini3d.background',
      bindGroupLayouts: [this.backgroundLayout],
    });
    this.backgroundSampler = device.createSampler({
      label: 'mini3d.background',
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });
    this.backgroundBuffer = device.createBuffer({
      label: 'mini3d.background.quad',
      size: 4 * 2 * 4,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    // A fullscreen triangle pair: 4 vertices in clip space.
    safeWriteBuffer(
      device.queue,
      this.backgroundBuffer,
      0,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    );
    void this.createBackgroundPipeline();
  }

  // --------------------------------------------------------------- shaders --

  /** Cached `GPUShaderModule` for one WGSL source string. */
  private moduleFor(key: string, code: string, label: string): GPUShaderModule {
    const cached = this.modules.get(key);
    if (cached) return cached;
    const module = this.device.createShaderModule({ label, code });
    this.modules.set(key, module);
    return module;
  }

  /** Builds the WGSL pair for a material (falling back to `WgslLib`). */
  buildShaderSource(state: WgpuPipelineState): { vertexShader: string; fragmentShader: string } {
    const entry = buildWgslShader(state.shaderName, state.variants);
    if (!entry || typeof entry.vertexShader !== 'string' || typeof entry.fragmentShader !== 'string') {
      throw new Error(
        `mini3d.WebGPURenderer: buildWgslShader('${state.shaderName}') returned an invalid entry`,
      );
    }
    return { vertexShader: entry.vertexShader, fragmentShader: entry.fragmentShader };
  }

  // ------------------------------------------------------------- pipelines --

  /** Returns the pipeline for `request`, or `null` while it is being built. */
  request(request: WgpuPipelineRequest): GPURenderPipeline | null {
    if (this.disposed) return null;
    const state = pipelineStateFor(request, request.material);
    const key = pipelineCacheKey(state, this.formats);

    const entry = this.cache.get(key);
    if (entry) return entry.pipeline;

    const record: WgpuPipelineEntry = { key, pipeline: null, pending: null, failed: false };
    this.cache.set(key, record);
    record.pending = this.createPipeline(state, request.vertexLayouts, record);
    const settled = this.ready.get(key);
    return settled ?? null;
  }

  /** Looks up an already-built pipeline without starting new work. */
  get(key: string): GPURenderPipeline | null {
    return this.ready.get(key) ?? null;
  }

  /** Key for a request, so callers can poll `get()` on later frames. */
  keyFor(request: WgpuPipelineRequest): string {
    return pipelineCacheKey(pipelineStateFor(request, request.material), this.formats);
  }

  private async createPipeline(
    state: WgpuPipelineState,
    vertexLayouts: GPUVertexBufferLayout[],
    record: WgpuPipelineEntry,
  ): Promise<GPURenderPipeline | null> {
    let source: { vertexShader: string; fragmentShader: string };
    try {
      source = this.buildShaderSource(state);
    } catch (error) {
      record.failed = true;
      console.error('mini3d.WebGPURenderer: WGSL source unavailable', error);
      return null;
    }

    const vertexModule = this.moduleFor(
      `v:${state.shaderName}:${variantKey(state.variants)}`,
      source.vertexShader,
      `mini3d.${state.shaderName}.vertex`,
    );
    const fragmentModule = this.moduleFor(
      `f:${state.shaderName}:${variantKey(state.variants)}`,
      source.fragmentShader,
      `mini3d.${state.shaderName}.fragment`,
    );

    const descriptor = this.describePipeline(state, vertexLayouts, vertexModule, fragmentModule);
    try {
      const pipeline = await this.device.createRenderPipelineAsync(descriptor);
      if (this.disposed) {
        destroyPipeline(pipeline);
        return null;
      }
      record.pipeline = pipeline;
      this.ready.set(record.key, pipeline);
      this.onPipelineReady?.(record.key, pipeline);
      return pipeline;
    } catch (error) {
      record.failed = true;
      this.cache.delete(record.key);
      console.error(
        `mini3d.WebGPURenderer: createRenderPipelineAsync() failed for ${record.key}`,
        error,
      );
      return null;
    }
  }

  /** Builds the `GPURenderPipelineDescriptor` for one state. */
  private describePipeline(
    state: WgpuPipelineState,
    vertexLayouts: GPUVertexBufferLayout[],
    vertexModule: GPUShaderModule,
    fragmentModule: GPUShaderModule,
  ): GPURenderPipelineDescriptor {
    // `polygonOffset` has no WebGPU equivalent and is intentionally ignored:
    // WebGPU exposes no depth bias outside of shadow passes.
    const depthStencil: GPUDepthStencilState = {
      format: this.formats.depth,
      depthWriteEnabled: state.depthTest && state.depthWrite,
      depthCompare: state.depthTest ? compareFunction(state.depthFunc) : 'always',
    };

    return {
      label: `mini3d.pipeline.${state.shaderName}`,
      layout: this.pipelineLayout,
      vertex: {
        module: vertexModule,
        entryPoint: VERTEX_ENTRY_POINT,
        buffers: vertexLayouts,
      },
      fragment: {
        module: fragmentModule,
        entryPoint: FRAGMENT_ENTRY_POINT,
        targets: [
          {
            format: this.formats.color,
            blend: blendStateForBlending(state.blending),
            writeMask: state.colorWrite ? GPUColorWrite.ALL : 0,
          },
        ],
      },
      primitive: {
        topology: state.topology,
        frontFace: 'ccw',
        cullMode: cullModeForSide(state.side),
        // WebGPU strips cannot be restarted with an index; mini3d geometries
        // never rely on primitive restart.
        stripIndexFormat: undefined,
      },
      depthStencil,
      multisample: {
        count: this.formats.sampleCount,
        mask: 0xffffffff,
        alphaToCoverageEnabled: false,
      },
    };
  }

  /** Builds the fullscreen background blit pipeline. */
  private async createBackgroundPipeline(): Promise<GPURenderPipeline | null> {
    const module = this.moduleFor('background', BACKGROUND_WGSL, 'mini3d.background');
    try {
      const pipeline = await this.device.createRenderPipelineAsync({
        label: 'mini3d.background',
        layout: this.backgroundPipelineLayout,
        vertex: {
          module,
          entryPoint: VERTEX_ENTRY_POINT,
          buffers: [{ arrayStride: 8, stepMode: 'vertex', attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] }],
        },
        fragment: {
          module,
          entryPoint: FRAGMENT_ENTRY_POINT,
          targets: [{ format: this.formats.color }],
        },
        primitive: { topology: 'triangle-strip', frontFace: 'ccw', cullMode: 'none' },
        depthStencil: {
          format: this.formats.depth,
          depthWriteEnabled: false,
          depthCompare: 'always',
        },
        multisample: { count: this.formats.sampleCount },
      });
      if (this.disposed) {
        destroyPipeline(pipeline);
        return null;
      }
      this.backgroundPipeline = pipeline;
      return pipeline;
    } catch (error) {
      console.error('mini3d.WebGPURenderer: background pipeline creation failed', error);
      return null;
    }
  }

  /** Textures the background blit samples. */
  backgroundBindGroup(texture: GPUTextureView): GPUBindGroup {
    return this.device.createBindGroup({
      label: 'mini3d.background',
      layout: this.backgroundLayout,
      entries: [
        { binding: 0, resource: texture },
        { binding: 1, resource: this.backgroundSampler },
      ],
    });
  }

  // ----------------------------------------------------- object uniforms ----

  /** The `ObjectUniforms` slot for `material`, creating it on demand. */
  materialUniform(material: Material): WgpuMaterialUniform {
    let entry = this.materials.get(material.id);
    if (!entry) {
      entry = {
        buffer: this.device.createBuffer({
          label: `mini3d.object.${material.kind}`,
          size: OBJECT_UNIFORM_BYTES,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        }),
        data: new Float32Array(OBJECT_UNIFORM_BYTES / 4),
        version: -1,
        bindGroup: null,
        textureKey: '',
      };
      this.materials.set(material.id, entry);
    }
    return entry;
  }

  /**
   * Uploads `ObjectUniforms` for one draw and (re)binds the material's texture
   * set. The uniform buffer is refreshed only when `material.version` changes;
   * the bind group only when a sampled texture (or its version) changes.
   */
  uploadObjectUniforms(
    material: Material,
    object: Parameters<typeof packObjectUniforms>[1]['object'],
    textures: WgpuTextures,
  ): WgpuMaterialUniform {
    const entry = this.materialUniform(material);

    const textureKey = textureSlotKey(material);
    if (entry.bindGroup === null || entry.textureKey !== textureKey) {
      const slots = materialTextureSlots(material);
      entry.bindGroup = textures.bindGroup(
        {
          diffuse: slots.map,
          normal: slots.normalMap,
          emissive: slots.emissiveMap,
          ao: slots.aoMap,
          normalFallback: slots.normalMap === null,
        },
        textureKey,
      );
      entry.textureKey = textureKey;
    }

    if (entry.version !== material.version) {
      packObjectUniforms(entry.data, { object, material });
      safeWriteBuffer(this.device.queue, entry.buffer, 0, entry.data);
      entry.version = material.version;
    }
    return entry;
  }

  /** Live `ObjectUniforms` buffers (used for `info.memory.programs`). */
  get materialCount(): number {
    return this.materials.size;
  }

  /** Every pipeline key currently in the cache. */
  get pendingCount(): number {
    let pending = 0;
    for (const entry of this.cache.values()) if (!entry.pipeline) pending++;
    return pending;
  }

  get size(): number {
    return this.cache.size;
  }

  /**
   * Resolves once every pipeline that has been requested so far has settled.
   * Used by `WebGPURenderer.compile()`.
   */
  async settle(): Promise<void> {
    const pending = Array.from(this.cache.values())
      .map((entry) => entry.pending)
      .filter((promise): promise is Promise<GPURenderPipeline | null> => promise !== null);
    await Promise.all(pending);
    // Pipelines can cascade (a second request after the first settles), so
    // keep draining until nothing new is in flight.
    const stillPending = Array.from(this.cache.values()).some(
      (entry) => !entry.pipeline && !entry.failed,
    );
    if (stillPending) await this.settle();
  }

  /** Drops a cached pipeline (e.g. after a `device.lost`). */
  invalidate(): void {
    this.cache.clear();
    this.ready.clear();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cache.clear();
    this.ready.clear();
    this.modules.clear();
    for (const entry of this.materials.values()) entry.buffer.destroy();
    this.materials.clear();
    this.backgroundBuffer.destroy();
    this.backgroundPipeline = null;
    this.onPipelineReady = null;
  }
}

/** Convenience: the texture slots a material exposes (shared with the renderer). */
export interface MaterialTextureSlots {
  map: Texture | null;
  normalMap: Texture | null;
  emissiveMap: Texture | null;
  aoMap: Texture | null;
}

/** Reads the four sampled slots the frozen bind group layout declares. */
export function materialTextureSlots(material: Material): MaterialTextureSlots {
  const view = materialView(material);
  return {
    map: view.map ?? null,
    normalMap: view.normalMap ?? null,
    emissiveMap: view.emissiveMap ?? null,
    aoMap: view.aoMap ?? null,
  };
}

/** Texture-slot cache key; includes every field that affects the bind group. */
export function textureSlotKey(material: Material): string {
  const slots = materialTextureSlots(material);
  const part = (texture: Texture | null): string => {
    if (!texture) return '-';
    return `${texture.id}v${texture.version}`;
  };
  return `${part(slots.map)}/${part(slots.normalMap)}/${part(slots.emissiveMap)}/${part(slots.aoMap)}`;
}
