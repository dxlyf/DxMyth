import { WebGPUError } from './errors.js';
import type { TextureHandle } from './types.js';

const BYTES_PER_PIXEL: Partial<Record<GPUTextureFormat, number>> = {
  r8unorm: 1,
  rg8unorm: 2,
  rgba8unorm: 4,
  'rgba8unorm-srgb': 4,
  bgra8unorm: 4,
  'bgra8unorm-srgb': 4,
  rgba16float: 8,
  rgba32float: 16,
};

export interface ReadRect {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

function align(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

function bytesPerPixel(format: GPUTextureFormat): number {
  const size = BYTES_PER_PIXEL[format];
  if (!size) throw new WebGPUError('webgpu/readback', `readback does not support format "${format}"`);
  return size;
}

/**
 * Copies a texture to a mapped buffer and returns tightly packed pixels
 * (no row padding, top-left origin).
 */
export async function readTexture(
  device: GPUDevice,
  texture: TextureHandle,
  rect: ReadRect = {},
): Promise<Uint8Array> {
  const bpp = bytesPerPixel(texture.format);
  const x = rect.x ?? 0;
  const y = rect.y ?? 0;
  const width = rect.width ?? texture.width - x;
  const height = rect.height ?? texture.height - y;
  const bytesPerRow = align(width * bpp, 256);

  const staging = device.createBuffer({
    label: 'readback',
    size: bytesPerRow * height,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const encoder = device.createCommandEncoder({ label: 'readback' });
  encoder.copyTextureToBuffer(
    { texture: texture.texture, origin: { x, y, z: 0 } },
    { buffer: staging, bytesPerRow, rowsPerImage: height },
    { width, height, depthOrArrayLayers: 1 },
  );
  device.queue.submit([encoder.finish()]);

  await staging.mapAsync(GPUMapMode.READ);
  const mapped = new Uint8Array(staging.getMappedRange());
  const out = new Uint8Array(width * height * bpp);
  const rowBytes = width * bpp;
  for (let row = 0; row < height; row++) {
    out.set(mapped.subarray(row * bytesPerRow, row * bytesPerRow + rowBytes), row * rowBytes);
  }
  staging.unmap();
  staging.destroy();
  return out;
}

export async function readBufferSlice(
  device: GPUDevice,
  buffer: GPUBuffer,
  byteOffset: number,
  byteLength: number,
): Promise<ArrayBuffer> {
  const size = align(byteLength, 4);
  const staging = device.createBuffer({
    label: 'readback',
    size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const encoder = device.createCommandEncoder({ label: 'readback' });
  encoder.copyBufferToBuffer(buffer, byteOffset, staging, 0, size);
  device.queue.submit([encoder.finish()]);
  await staging.mapAsync(GPUMapMode.READ);
  const mapped = staging.getMappedRange();
  const out = mapped.slice(0, byteLength);
  staging.unmap();
  staging.destroy();
  return out;
}
