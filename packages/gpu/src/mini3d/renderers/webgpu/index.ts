/**
 * WebGPU backend barrel.
 *
 * ```ts
 * import { WebGPURenderer } from 'mini3d/renderers/webgpu';
 *
 * if (WebGPURenderer.isAvailable()) {
 *   const renderer = await WebGPURenderer.create({ antialias: true });
 *   await renderer.compile(scene, camera); // pre-create every pipeline
 *   renderer.render(scene, camera);
 * }
 * ```
 */

export { WebGPURenderer, resolveWebGPUParameters } from './WebGPURenderer';
export type { WebGPURendererParameters, ResolvedWebGPUParameters } from './WebGPURenderer';

export {
  FRAME_UNIFORM_BYTES,
  FRAME_UNIFORM_FLOATS,
  OBJECT_UNIFORM_BYTES,
  OBJECT_UNIFORM_FLOATS,
  FRAME_FIELD_OFFSETS,
  OBJECT_FIELD_OFFSETS,
  DIRECTIONAL_LIGHT_VECS,
  POINT_LIGHT_VECS,
  SPOT_LIGHT_VECS,
  CLIP_SPACE_REMAP,
  materialView,
  packFrameUniforms,
  packLightData,
  packObjectUniforms,
  writeClipSpaceRemap,
  writeColor,
  writeFog,
  writeMatrix4,
  writeNormalMatrix,
  writeUvTransform,
  writeViewProjection,
} from './WgpuUniforms';
export type {
  FogLike,
  FrameUniformInput,
  ObjectUniformInput,
  WgpuLightSource,
  WgpuMaterialView,
} from './WgpuUniforms';

export {
  ATTRIBUTE_LOCATIONS,
  PIPELINE_ATTRIBUTES,
  TOPOLOGY_FOR_DRAW_MODE,
  WgpuGeometries,
  allocSize,
  buildStripPairs,
  paddedBytes,
  topologySupportsIndexed,
  vertexBufferLayouts,
  vertexLayoutKey,
} from './WgpuGeometries';
export type {
  WgpuAttributeRecord,
  WgpuGeometryRecord,
  WgpuIndexRecord,
} from './WgpuGeometries';

export {
  WgpuTextures,
  addressMode,
  bytesPerTexel,
  createScratchCanvas,
  filterMode,
  flipRows,
  formatChannels,
  imageDimensions,
  isMipFilter,
  mipLevelCount,
  mipmapFilterMode,
  uploadFormat,
  viewOf,
} from './WgpuTextures';
export type { WgpuTextureRecord, WgpuTextureSlots, WgpuUploadFormat } from './WgpuTextures';

export {
  BACKGROUND_QUAD_VERTEX_COUNT,
  FRAGMENT_ENTRY_POINT,
  VERTEX_ENTRY_POINT,
  WgpuPipelines,
  blendStateForBlending,
  buildVariants,
  compareFunction,
  cullModeForSide,
  isCustomShaderMaterial,
  materialTextureSlots,
  pipelineCacheKey,
  pipelineStateFor,
  textureSlotKey,
  variantKey,
  wgslNameForMaterial,
} from './WgpuPipelines';
export type {
  CanvasAlphaMode,
  MaterialTextureSlots,
  PipelineReadyHandler,
  WgpuMaterialUniform,
  WgpuPipelineEntry,
  WgpuPipelineFormats,
  WgpuPipelineRequest,
  WgpuPipelineState,
  WgpuShaderName,
} from './WgpuPipelines';
