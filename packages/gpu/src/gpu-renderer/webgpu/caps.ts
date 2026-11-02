export interface GPUBackendCaps {
  readonly features: ReadonlySet<GPUFeatureName>;
  readonly limits: GPUSupportedLimits;
  readonly format: GPUTextureFormat;
  readonly alphaMode: GPUCanvasAlphaMode;
  readonly maxBindGroups: number;
}

export function createCaps(
  device: GPUDevice,
  format: GPUTextureFormat,
  alphaMode: GPUCanvasAlphaMode,
): GPUBackendCaps {
  return {
    features: new Set<GPUFeatureName>(device.features as unknown as Iterable<GPUFeatureName>),
    limits: device.limits,
    format,
    alphaMode,
    maxBindGroups: device.limits.maxBindGroups,
  };
}
