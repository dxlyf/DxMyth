import { GLCapabilityError, GLError, GLResourceError } from './errors.js';
import { GLENUM, vertexFormatInfo, type GL, type GLVertexFormat } from './enums.js';
import type { GLCapabilities } from './caps.js';
import type { GLBuffer } from './buffer.js';
import type { GLProgram } from './program.js';
import { type GLState, type GLVertexArrayHandle } from './state.js';
import type { GLStatsTracker } from './stats.js';

export interface VertexAttribute {
  /** Attribute name; resolved through the program reflection. */
  name?: string;
  /** Explicit location; takes precedence over `name`. */
  location?: number;
  format: GLVertexFormat;
  offset: number;
}

export interface VertexBufferBinding {
  buffer: GLBuffer;
  /** Bytes between consecutive vertices; derived from attributes when omitted. */
  stride?: number;
  /** Instancing divisor (0 = per vertex). */
  divisor?: number;
  attributes: VertexAttribute[];
}

export interface VertexArrayDescriptor {
  label?: string;
  program: GLProgram;
  buffers: VertexBufferBinding[];
}

interface OESVertexArrayObject {
  createVertexArrayOES(): WebGLVertexArrayObjectOES | null;
  deleteVertexArrayOES(array: WebGLVertexArrayObjectOES | null): void;
}

interface ANGLEInstancedArrays {
  vertexAttribDivisorANGLE(index: number, divisor: number): void;
}

const TYPE_BYTES: Record<number, number> = {
  [GLENUM.BYTE]: 1,
  [GLENUM.UNSIGNED_BYTE]: 1,
  [GLENUM.SHORT]: 2,
  [GLENUM.UNSIGNED_SHORT]: 2,
  [GLENUM.INT]: 4,
  [GLENUM.UNSIGNED_INT]: 4,
  [GLENUM.FLOAT]: 4,
  [GLENUM.HALF_FLOAT]: 2,
};

export class GLVertexArray {
  readonly label: string;
  readonly handle: GLVertexArrayHandle | null;

  private readonly gl: GL;
  private readonly caps: GLCapabilities;
  private readonly state: GLState;
  private readonly stats: GLStatsTracker;
  private readonly bindings: VertexBufferBinding[];
  private readonly resolved: number[][];
  private destroyedFlag = false;

  constructor(gl: GL, caps: GLCapabilities, state: GLState, stats: GLStatsTracker, desc: VertexArrayDescriptor) {
    this.gl = gl;
    this.caps = caps;
    this.state = state;
    this.stats = stats;
    this.label = desc.label ?? 'vao';
    this.bindings = desc.buffers;
    this.resolved = [];

    const seen = new Set<number>();
    const maxAttributes = caps.limits.maxVertexAttributes;

    for (const binding of desc.buffers) {
      if (binding.divisor && binding.divisor > 0) {
        caps.require('instancing', 'instanced attributes need ANGLE_instanced_arrays on WebGL1');
      }
      const locations: number[] = [];
      for (const attribute of binding.attributes) {
        const location = this.resolveLocation(desc.program, attribute);
        if (location < 0 || location >= maxAttributes) {
          throw new GLError(
            'webgl/vertex-array',
            `attribute location ${location} is outside [0, ${maxAttributes}) in "${this.label}"`,
          );
        }
        if (seen.has(location)) {
          throw new GLError('webgl/vertex-array', `duplicate attribute location ${location} in "${this.label}"`);
        }
        seen.add(location);
        locations.push(location);
      }
      this.resolved.push(locations);
    }

    if (caps.has('vao')) {
      if (caps.version === 2) {
        this.handle = (gl as WebGL2RenderingContext).createVertexArray();
      } else {
        const ext = caps.extension<OESVertexArrayObject>('OES_vertex_array_object');
        this.handle = ext?.createVertexArrayOES() ?? null;
      }
      if (!this.handle) throw new GLError('webgl/vertex-array', `unable to create VAO "${this.label}"`);
      this.state.bindVertexArray(this.handle);
      this.configure();
    } else {
      this.handle = null;
    }
  }

  private resolveLocation(program: GLProgram, attribute: VertexAttribute): number {
    if (attribute.location !== undefined) return attribute.location;
    if (attribute.name !== undefined) {
      const ref = program.reflection.attributes.get(attribute.name);
      if (ref) return ref.location;
      const available = [...program.reflection.attributes.keys()].join(', ') || '(none)';
      throw new GLError(
        'webgl/vertex-array',
        `attribute "${attribute.name}" is not active in program "${program.label}" (available: ${available})`,
      );
    }
    throw new GLError('webgl/vertex-array', 'attribute needs either a location or a name');
  }

  private strideOf(binding: VertexBufferBinding): number {
    if (binding.stride !== undefined) return binding.stride;
    let end = 0;
    for (const attribute of binding.attributes) {
      const info = vertexFormatInfo(attribute.format);
      end = Math.max(end, attribute.offset + info.size * (TYPE_BYTES[info.type] ?? 4));
    }
    return end;
  }

  private configure(): void {
    const gl2 = this.gl as WebGL2RenderingContext;
    for (let b = 0; b < this.bindings.length; b++) {
      const binding = this.bindings[b];
      const locations = this.resolved[b];
      if (!binding || !locations) continue;
      const stride = this.strideOf(binding);
      this.state.bindArrayBuffer(binding.buffer.handle);
      for (let a = 0; a < binding.attributes.length; a++) {
        const attribute = binding.attributes[a];
        const location = locations[a];
        if (!attribute || location === undefined) continue;
        const info = vertexFormatInfo(attribute.format);
        const typeBytes = TYPE_BYTES[info.type] ?? 4;
        if (attribute.offset % typeBytes !== 0) {
          throw new GLError(
            'webgl/vertex-array',
            `attribute offset ${attribute.offset} must be a multiple of ${typeBytes} for ${attribute.format}`,
          );
        }
        this.gl.enableVertexAttribArray(location);
        if (info.integer) {
          if (this.caps.version === 1) {
            throw new GLCapabilityError('integer-vertex-attribute', 'integer vertex attributes need WebGL2');
          }
          gl2.vertexAttribIPointer(location, info.size, info.type, stride, attribute.offset);
        } else {
          this.gl.vertexAttribPointer(location, info.size, info.type, info.normalized, stride, attribute.offset);
        }
        if (binding.divisor && binding.divisor > 0) {
          if (this.caps.version === 2) {
            gl2.vertexAttribDivisor(location, binding.divisor);
          } else {
            this.caps
              .extension<ANGLEInstancedArrays>('ANGLE_instanced_arrays')
              ?.vertexAttribDivisorANGLE(location, binding.divisor);
          }
        }
      }
    }
  }

  bind(): void {
    this.ensureAlive();
    if (this.handle) {
      this.state.bindVertexArray(this.handle);
      return;
    }
    // No VAO on this context: re-apply the layout on every bind.
    this.stats.vaoFallback++;
    for (let i = 0; i < this.caps.limits.maxVertexAttributes; i++) {
      this.gl.disableVertexAttribArray(i);
    }
    this.configure();
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) throw new GLResourceError(this.label, 'destroyed');
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    if (this.handle) {
      if (this.caps.version === 2) {
        (this.gl as WebGL2RenderingContext).deleteVertexArray(this.handle as WebGLVertexArrayObject);
      } else {
        this.caps
          .extension<OESVertexArrayObject>('OES_vertex_array_object')
          ?.deleteVertexArrayOES(this.handle as WebGLVertexArrayObjectOES);
      }
      if (this.state.currentVao === this.handle) this.state.bindVertexArray(null);
    }
    this.destroyedFlag = true;
  }
}
