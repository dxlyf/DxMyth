import { WebGPUError } from './errors.js';

export interface VertexLayoutLike {
  readonly stride: number;
  readonly attributes: readonly {
    readonly name: string;
    readonly format: string;
    readonly offset: number;
  }[];
}

const GPU_FORMATS: Record<string, GPUVertexFormat> = {
  float32x1: 'float32',
  float32x2: 'float32x2',
  float32x3: 'float32x3',
  float32x4: 'float32x4',
  uint32x1: 'uint32',
  uint32x2: 'uint32x2',
  uint32x3: 'uint32x3',
  uint32x4: 'uint32x4',
  sint32x1: 'sint32',
  sint32x2: 'sint32x2',
  sint32x3: 'sint32x3',
  sint32x4: 'sint32x4',
  uint16x2: 'uint16x2',
  uint16x4: 'uint16x4',
  sint16x2: 'sint16x2',
  sint16x4: 'sint16x4',
  uint8x4norm: 'unorm8x4',
  sint8x4norm: 'snorm8x4',
};

/**
 * Converts a neutral interleaved layout (from `InterleavedBuffer`) into a
 * WebGPU vertex buffer layout. Pass `device.limits.maxVertexAttributes` when
 * creating non-default devices.
 */
export function toWebGPULayout(
  layout: VertexLayoutLike,
  locations: Readonly<Record<string, number>>,
  maxAttributes = 16,
): GPUVertexBufferLayout {
  const seen = new Set<number>();
  const attributes: GPUVertexAttribute[] = [];

  for (const attribute of layout.attributes) {
    const format = GPU_FORMATS[attribute.format];
    if (!format) {
      throw new WebGPUError('webgpu/layout', `attribute "${attribute.name}" has unsupported format "${attribute.format}"`);
    }
    const shaderLocation = locations[attribute.name];
    if (shaderLocation === undefined) {
      throw new WebGPUError('webgpu/layout', `missing shader location for "${attribute.name}"`);
    }
    if (!Number.isInteger(shaderLocation) || shaderLocation < 0 || shaderLocation >= maxAttributes) {
      throw new WebGPUError(
        'webgpu/layout',
        `shader location ${shaderLocation} for "${attribute.name}" is outside [0, ${maxAttributes})`,
      );
    }
    if (seen.has(shaderLocation)) {
      throw new WebGPUError('webgpu/layout', `duplicate shader location ${shaderLocation}`);
    }
    seen.add(shaderLocation);
    attributes.push({
      shaderLocation,
      offset: attribute.offset,
      format,
    });
  }

  return { arrayStride: layout.stride, attributes };
}
