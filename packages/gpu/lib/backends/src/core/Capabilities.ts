import type { BackendKind } from './enums';

/** 后端上报的硬性限制。 */
export interface Limits {
  maxTextureSize: number;
  maxTextureLayers: number;
  maxVertexAttributes: number;
  maxVertexBuffers: number;
  maxTextureUnits: number;
  maxUniformBufferSize: number;
  maxSamples: number;
  maxBindGroups: number;
  maxDrawBuffers: number;
}

/** 供统一层判断能力的粗粒度开关。 */
export interface Supports {
  compute: boolean;
  uniformBuffers: boolean;
  instancing: boolean;
  vertexArrays: boolean;
  floatTextures: boolean;
  depthTextures: boolean;
  srgbTextures: boolean;
  anisotropy: boolean;
  transformFeedback: boolean;
  timestampQueries: boolean;
}

/** 单个上下文归一化后的能力。 */
export interface Capabilities {
  readonly backend: BackendKind;
  readonly limits: Readonly<Limits>;
  readonly supports: Readonly<Supports>;
  /** 后端暴露的原始特性 / 扩展名集合。 */
  readonly features: ReadonlySet<string>;
}
