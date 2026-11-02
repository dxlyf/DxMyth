import { WebGPUError } from './errors.js';

/**
 * Timestamp query pool. Values are nanoseconds (WebGPU timestamp units are ns).
 * Requires the `timestamp-query` feature.
 */
export class TimestampQuery {
  readonly querySet: GPUQuerySet;

  constructor(
    private readonly device: GPUDevice,
    readonly count: number,
  ) {
    if (!Number.isInteger(count) || count <= 0) {
      throw new WebGPUError('webgpu/timestamp', `invalid timestamp count ${count}`);
    }
    this.querySet = device.createQuerySet({ label: 'timestamps', type: 'timestamp', count });
  }

  /** Pass to `beginPass({ timestampWrites })`. */
  writes(beginningOfPassWriteIndex = 0, endOfPassWriteIndex = 1): GPURenderPassTimestampWrites {
    if (
      beginningOfPassWriteIndex < 0 ||
      beginningOfPassWriteIndex >= this.count ||
      endOfPassWriteIndex < 0 ||
      endOfPassWriteIndex >= this.count
    ) {
      throw new WebGPUError(
        'webgpu/timestamp',
        `timestamp indices must be in [0, ${this.count}), got ${beginningOfPassWriteIndex}, ${endOfPassWriteIndex}`,
      );
    }
    return {
      querySet: this.querySet,
      beginningOfPassWriteIndex,
      endOfPassWriteIndex,
    };
  }

  async read(): Promise<number[]> {
    const byteLength = this.count * 8;
    const resolve = this.device.createBuffer({
      label: 'timestamps:resolve',
      size: byteLength,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    const readback = this.device.createBuffer({
      label: 'timestamps:readback',
      size: byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const encoder = this.device.createCommandEncoder({ label: 'timestamps' });
    encoder.resolveQuerySet(this.querySet, 0, this.count, resolve, 0);
    encoder.copyBufferToBuffer(resolve, 0, readback, 0, byteLength);
    this.device.queue.submit([encoder.finish()]);

    await readback.mapAsync(GPUMapMode.READ);
    const mapped = readback.getMappedRange();
    const values = Array.from(new BigUint64Array(mapped.slice(0)), (value) => Number(value));
    readback.unmap();
    resolve.destroy();
    readback.destroy();
    return values;
  }

  /** Returns the timestamp delta in milliseconds (begin → end). */
  async readDeltaMilliseconds(beginIndex = 0, endIndex = 1): Promise<number> {
    const values = await this.read();
    const begin = values[beginIndex];
    const end = values[endIndex];
    if (begin === undefined || end === undefined) {
      throw new WebGPUError('webgpu/timestamp', `timestamp indices ${beginIndex}/${endIndex} are out of range`);
    }
    return (end - begin) / 1e6;
  }

  destroy(): void {
    this.querySet.destroy();
  }
}
