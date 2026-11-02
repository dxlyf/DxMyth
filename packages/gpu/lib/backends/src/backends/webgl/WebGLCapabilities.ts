import type { Capabilities, Limits, Supports } from '../../core/Capabilities';
import { BackendKind } from '../../core/enums';
import type { ExtensionRegistry } from './extensions/ExtensionRegistry';
import type { WebGLInfo } from './WebGLInfo';

/** 根据 WebGL 参数与扩展构建归一化能力对象。 */
export function createWebGLCapabilities(
  gl: WebGLRenderingContext,
  extensions: ExtensionRegistry,
  info: WebGLInfo,
): Capabilities {
  const limits: Limits = {
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
    maxTextureLayers: 1,
    maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number,
    maxVertexBuffers: gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number,
    maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) as number,
    maxUniformBufferSize: 0,
    maxSamples: 0,
    maxBindGroups: 0,
    maxDrawBuffers: 1,
  };

  const supports: Supports = {
    compute: false,
    uniformBuffers: false,
    instancing: extensions.instancedArrays !== null,
    vertexArrays: extensions.vertexArrayObject !== null,
    floatTextures: extensions.textureFloat !== null,
    depthTextures: extensions.depthTexture !== null,
    srgbTextures: extensions.has('EXT_sRGB'),
    anisotropy: extensions.anisotropicFiltering !== null,
    transformFeedback: false,
    timestampQueries: extensions.has('EXT_disjoint_timer_query'),
  };

  return {
    backend: BackendKind.WebGL,
    limits,
    supports,
    features: new Set(info.extensions),
  };
}
