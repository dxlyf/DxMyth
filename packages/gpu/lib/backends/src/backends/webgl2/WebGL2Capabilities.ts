import type { Capabilities, Limits, Supports } from '../../core/Capabilities';
import { BackendKind } from '../../core/enums';
import type { ExtensionRegistry } from '../webgl/extensions/ExtensionRegistry';
import type { WebGLInfo } from '../webgl/WebGLInfo';

/** 根据 WebGL2 参数与扩展构建归一化能力对象。 */
export function createWebGL2Capabilities(
  gl: WebGLRenderingContext,
  extensions: ExtensionRegistry,
  info: WebGLInfo,
): Capabilities {
  const gl2 = gl as WebGL2RenderingContext;

  const limits: Limits = {
    maxTextureSize: gl2.getParameter(gl2.MAX_TEXTURE_SIZE) as number,
    maxTextureLayers: gl2.getParameter(gl2.MAX_ARRAY_TEXTURE_LAYERS) as number,
    maxVertexAttributes: gl2.getParameter(gl2.MAX_VERTEX_ATTRIBS) as number,
    maxVertexBuffers: gl2.getParameter(gl2.MAX_VERTEX_ATTRIBS) as number,
    maxTextureUnits: gl2.getParameter(gl2.MAX_TEXTURE_IMAGE_UNITS) as number,
    maxUniformBufferSize: gl2.getParameter(gl2.MAX_UNIFORM_BLOCK_SIZE) as number,
    maxSamples: gl2.getParameter(gl2.MAX_SAMPLES) as number,
    maxBindGroups: 0,
    maxDrawBuffers: gl2.getParameter(gl2.MAX_DRAW_BUFFERS) as number,
  };

  const supports: Supports = {
    compute: false,
    uniformBuffers: true,
    instancing: true,
    vertexArrays: true,
    floatTextures: true,
    depthTextures: true,
    srgbTextures: true,
    anisotropy: extensions.anisotropicFiltering !== null,
    transformFeedback: true,
    timestampQueries: extensions.has('EXT_disjoint_timer_query_webgl2'),
  };

  return {
    backend: BackendKind.WebGL2,
    limits,
    supports,
    features: new Set(info.extensions),
  };
}
