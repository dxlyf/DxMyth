/**
 * Guarded GPU uploads for the WebGPU backend.
 *
 * `GPUQueue.writeBuffer` / `writeTexture` reject with an `OperationError` when
 * the write exceeds the destination, and the message ("Number of bytes to write
 * is too large") does not say which resource failed. These wrappers check the
 * bounds first and name the resource, so a mis-sized allocation is identifiable
 * from a single console line instead of a stack trace.
 */

/** Anything the guard can measure: a `GPUBuffer` exposes `size` and `label`. */
interface SizedDestination {
  size: number;
  label?: string;
}

/**
 * Writes `data` into `destination` after checking that it fits.
 *
 * Returns `true` when the write was issued. A rejected write is reported and
 * skipped rather than thrown, so one bad resource cannot abort a frame.
 */
export function safeWriteBuffer(
  queue: GPUQueue,
  destination: SizedDestination,
  bufferOffset: number,
  data: ArrayBufferView,
  dataOffset = 0,
  size?: number,
): boolean {
  const byteLength = size ?? data.byteLength;
  const required = bufferOffset + byteLength;
  if (required > destination.size) {
    console.error(
      `mini3d.webgpu: refusing writeBuffer to "${destination.label ?? 'unnamed'}" — ` +
        `offset ${bufferOffset} + ${byteLength} B = ${required} B exceeds the ${destination.size} B allocation. ` +
        `The buffer must be reallocated for the larger payload.`,
    );
    return false;
  }
  if (dataOffset + byteLength > data.byteLength) {
    console.error(
      `mini3d.webgpu: refusing writeBuffer to "${destination.label ?? 'unnamed'}" — ` +
        `source slice ${dataOffset} + ${byteLength} B exceeds the ${data.byteLength} B source.`,
    );
    return false;
  }
  queue.writeBuffer(
    destination as unknown as GPUBuffer,
    bufferOffset,
    data as unknown as GPUAllowSharedBufferSource,
    dataOffset,
    byteLength,
  );
  return true;
}

/** As `safeWriteBuffer`, for `writeTexture`. */
export function safeWriteTexture(
  queue: GPUQueue,
  destination: GPUTexelCopyTextureInfo,
  label: string,
  data: ArrayBufferView,
  dataLayout: GPUTexelCopyBufferLayout,
  size: GPUExtent3D,
): boolean {
  // `GPUExtent3D` allows a shorthand array form; everything in this backend uses
  // the dictionary form, so the fields are read through a narrow cast.
  const extent = size as GPUExtent3DDict;
  const width = extent.width;
  const height = extent.height ?? 1;
  const bytesPerRow = dataLayout.bytesPerRow ?? 0;
  if (bytesPerRow > 0) {
    const needed = bytesPerRow * height;
    if (needed > data.byteLength) {
      console.error(
        `mini3d.webgpu: refusing writeTexture to "${label}" — ${bytesPerRow} B/row x ${height} rows = ` +
          `${needed} B exceeds the ${data.byteLength} B source.`,
      );
      return false;
    }
  }
  if (width <= 0 || height <= 0) {
    console.error(`mini3d.webgpu: refusing writeTexture to "${label}" — empty extent.`);
    return false;
  }
  queue.writeTexture(
    destination,
    data as unknown as GPUAllowSharedBufferSource,
    dataLayout,
    size,
  );
  return true;
}
