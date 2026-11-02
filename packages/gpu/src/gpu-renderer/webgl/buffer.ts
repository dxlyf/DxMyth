import { GLError, GLResourceError } from './errors.js';
import { GLENUM, type GL } from './enums.js';
import type { GLState } from './state.js';
import type { GLStatsTracker } from './stats.js';

export interface BufferDescriptor {
  label?: string;
  /** WebGL buffers belong to a binding point; declare it explicitly. */
  target: 'vertex' | 'index';
  data?: ArrayBufferView;
  byteLength?: number;
  usage?: 'static' | 'dynamic' | 'stream';
}

const USAGE = {
  static: GLENUM.STATIC_DRAW,
  dynamic: GLENUM.DYNAMIC_DRAW,
  stream: GLENUM.STREAM_DRAW,
} as const;

export class GLBuffer {
  readonly label: string;
  readonly handle: WebGLBuffer;
  readonly target: number;
  readonly byteLength: number;

  private readonly gl: GL;
  private readonly state: GLState;
  private readonly stats: GLStatsTracker;
  private destroyedFlag = false;

  constructor(gl: GL, state: GLState, stats: GLStatsTracker, desc: BufferDescriptor) {
    this.gl = gl;
    this.state = state;
    this.stats = stats;
    this.label = desc.label ?? `${desc.target}-buffer`;

    const handle = gl.createBuffer();
    if (!handle) throw new GLError('webgl/buffer', `unable to create buffer "${this.label}"`);
    this.handle = handle;
    this.target = desc.target === 'index' ? GLENUM.ELEMENT_ARRAY_BUFFER : GLENUM.ARRAY_BUFFER;
    this.byteLength = desc.byteLength ?? desc.data?.byteLength ?? 0;

    this.bind();
    const usage = USAGE[desc.usage ?? 'static'];
    if (desc.data) {
      gl.bufferData(this.target, desc.data, usage);
    } else {
      gl.bufferData(this.target, this.byteLength, usage);
    }
    this.stats.bufferUploads += this.byteLength;
  }

  private bind(): void {
    if (this.target === GLENUM.ELEMENT_ARRAY_BUFFER) {
      this.state.bindElementBuffer(this.handle);
    } else {
      this.state.bindArrayBuffer(this.handle);
    }
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) throw new GLResourceError(this.label, 'destroyed');
  }

  update(data: ArrayBufferView, byteOffset = 0): void {
    this.ensureAlive();
    if (byteOffset < 0 || byteOffset + data.byteLength > this.byteLength) {
      throw new GLError(
        'webgl/buffer',
        `update of "${this.label}" out of range: ${byteOffset} + ${data.byteLength} > ${this.byteLength}`,
      );
    }
    this.bind();
    this.gl.bufferSubData(this.target, byteOffset, data);
    this.stats.bufferUploads += data.byteLength;
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    if (this.target === GLENUM.ELEMENT_ARRAY_BUFFER) {
      if (this.state.currentElementBuffer === this.handle) this.state.bindElementBuffer(null);
    } else if (this.state.currentArrayBuffer === this.handle) {
      this.state.bindArrayBuffer(null);
    }
    this.gl.deleteBuffer(this.handle);
    this.destroyedFlag = true;
  }
}
