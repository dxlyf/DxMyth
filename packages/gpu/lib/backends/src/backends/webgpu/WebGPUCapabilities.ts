import type { Capabilities, Limits, Supports } from '../../core/Capabilities';
import { BackendKind } from '../../core/enums';

/** 根据 GPUDevice 的限制与特性构建归一化能力对象。 */
export function createWebGPUCapabilities(device: GPUDevice): Capabilities {
  const limits: Limits = {
    maxTextureSize: device.limits.maxTextureDimension2D,
    maxTextureLayers: device.limits.maxTextureArrayLayers,
    maxVertexAttributes: device.limits.maxVertexAttributes,
    maxVertexBuffers: device.limits.maxVertexBuffers,
    maxTextureUnits: device.limits.maxSamplersPerShaderStage,
    maxUniformBufferSize: device.limits.maxUniformBufferBindingSize,
    maxSamples: 4,
    maxBindGroups: device.limits.maxBindGroups,
    maxDrawBuffers: device.limits.maxColorAttachments,
  };

  const supports: Supports = {
    compute: true,
    uniformBuffers: true,
    instancing: true,
    vertexArrays: true,
    floatTextures: true,
    depthTextures: true,
    srgbTextures: true,
    anisotropy: true,
    transformFeedback: false,
    timestampQueries: device.features.has('timestamp-query'),
  };

  return {
    backend: BackendKind.WebGPU,
    limits,
    supports,
    features: new Set(device.features.values()),
  };
}
