import type {
  GLBlendFactor,
  GLBlendOp,
  GLCompare,
  GLCullMode,
  GLFrontFace,
} from './enums.js';

export interface BlendState {
  srcFactor?: GLBlendFactor;
  dstFactor?: GLBlendFactor;
  srcAlphaFactor?: GLBlendFactor;
  dstAlphaFactor?: GLBlendFactor;
  equation?: GLBlendOp;
  alphaEquation?: GLBlendOp;
  color?: readonly [number, number, number, number];
}

export interface DepthState {
  test?: boolean;
  write?: boolean;
  compare?: GLCompare;
  range?: readonly [number, number];
}

/** Per-draw fixed-function state. Omitted fields keep their previous value. */
export interface DrawState {
  blend?: false | BlendState;
  depth?: false | DepthState;
  cull?: GLCullMode;
  frontFace?: GLFrontFace;
  colorMask?: readonly [boolean, boolean, boolean, boolean];
  polygonOffset?: false | readonly [number, number];
}
