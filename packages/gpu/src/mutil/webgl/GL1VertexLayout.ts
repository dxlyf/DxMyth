import { GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT } from './constants.js';
import { GL1DisposedError, GL1Error } from './errors.js';
import type { GL1State } from './GL1State.js';
import { indexType } from './mappings.js';
import { hashFNV1a } from '../internal/pure.js';
import type {
  GL1AttributeBinding,
  GL1IndexType,
  GL1ProgramRef,
  GL1Stats,
  GL1VertexArrayRef,
  GL1VertexLayout,
  GL1VertexLayoutOptions,
} from './types.js';
import type { GL1Buffer } from './GL1Buffer.js';

/**
 * Turns an ergonomic attribute description into explicit stride/offset pairs.
 * Interleaved layouts are the default (best cache locality, fewest buffers).
 */
export function defineGL1VertexLayout(options: GL1VertexLayoutOptions): GL1VertexLayout {
  if (options.attributes.length === 0) throw new GL1Error('A vertex layout needs at least one attribute');
  const interleaved = options.interleaved !== false;
  const attributes: GL1AttributeBinding[] = [];
  let offset = 0;
  const parts: string[] = [];
  for (let i = 0; i < options.attributes.length; i++) {
    const spec = options.attributes[i]!;
    if (spec.size < 1 || spec.size > 4) throw new GL1Error(`Attribute "${spec.name}" must have 1..4 components`);
    const bytes = spec.size * 4;
    attributes.push({
      name: spec.name,
      size: spec.size,
      type: 'float',
      normalized: spec.normalized === true,
      divisor: spec.divisor ?? 0,
      stride: 0,
      offset: interleaved ? offset : 0,
      bufferIndex: interleaved ? (spec.bufferIndex ?? 0) : (spec.bufferIndex ?? i),
    });
    if (interleaved) offset += bytes;
    parts.push(`${spec.name}/${spec.size}/${spec.normalized ? 1 : 0}/${spec.divisor ?? 0}`);
  }
  const stride = interleaved ? (options.stride ?? offset) : 0;
  if (interleaved) {
    for (const attribute of attributes) attribute.stride = stride;
  }
  const key = hashFNV1a(`${parts.join(';')}|${stride}|${interleaved ? 1 : 0}`);
  return { attributes, stride, key };
}

export interface GL1VertexArrayOptions {
  layout: GL1VertexLayout;
  /** A single interleaved buffer, or one buffer per attribute (non-interleaved). */
  buffers: GL1Buffer | readonly GL1Buffer[];
  indexBuffer?: GL1Buffer;
  indexType?: GL1IndexType;
}

/**
 * Encapsulates attribute binding. When `OES_vertex_array_object` is available
 * the configuration is baked into a VAO and every later bind is a single call;
 * otherwise the layout is re-applied only when the program or buffers change.
 */
export class GL1VertexArray implements GL1VertexArrayRef {
  readonly layout: GL1VertexLayout;
  readonly buffers: readonly GL1Buffer[];
  readonly indexBuffer: GL1Buffer | null;
  readonly indexType: GL1IndexType;

  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly ext: OES_vertex_array_object | null;
  private readonly instancing: ANGLE_instanced_arrays | null;
  private readonly vaos = new Map<number, WebGLVertexArrayObjectOES>();
  private lastManualSignature = -1;
  private disposedFlag = false;

  constructor(
    gl: WebGLRenderingContext,
    stats: GL1Stats,
    state: GL1State,
    options: GL1VertexArrayOptions,
    extensions?: { vao?: OES_vertex_array_object | null; instancing?: ANGLE_instanced_arrays | null },
  ) {
    if (options.layout.attributes.length === 0) throw new GL1Error('A vertex array needs a layout with attributes');
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.layout = options.layout;
    this.buffers = Array.isArray(options.buffers) ? options.buffers : [options.buffers];
    this.indexBuffer = options.indexBuffer ?? null;
    this.indexType = options.indexType ?? 'uint16';
    this.ext = extensions?.vao ?? gl.getExtension('OES_vertex_array_object');
    this.instancing = extensions?.instancing ?? gl.getExtension('ANGLE_instanced_arrays');
    for (const attribute of this.layout.attributes) {
      if (attribute.bufferIndex >= this.buffers.length) {
        throw new GL1Error(`Attribute "${attribute.name}" references buffer ${attribute.bufferIndex} but only ${this.buffers.length} buffer(s) were supplied`);
      }
    }
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  get vertexCount(): number {
    let min = Number.POSITIVE_INFINITY;
    for (const attribute of this.layout.attributes) {
      const buffer = this.buffers[attribute.bufferIndex];
      if (!buffer) continue;
      const available = buffer.byteLength - attribute.offset;
      const count = attribute.stride > 0
        ? Math.floor(available / attribute.stride)
        : Math.floor(available / (attribute.size * 4));
      if (count < min) min = count;
    }
    return Number.isFinite(min) ? Math.max(0, min) : 0;
  }

  get indexCount(): number {
    if (!this.indexBuffer) return this.vertexCount;
    return Math.floor(this.indexBuffer.byteLength / (this.indexType === 'uint8' ? 1 : 2));
  }

  bind(program: GL1ProgramRef): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1VertexArray');
    const locations: Array<number | undefined> = [];
    for (const attribute of this.layout.attributes) {
      locations.push(program.attributeLocation(attribute.name));
    }
    const signature = this.signature(program, locations);
    if (this.ext) {
      let vao = this.vaos.get(signature);
      if (!vao) {
        vao = this.ext.createVertexArrayOES() ?? undefined;
        if (!vao) throw new GL1Error('Failed to create vertex array object');
        this.ext.bindVertexArrayOES(vao);
        this.configure(locations);
        // Captured by the VAO: no need to rebind it on subsequent binds.
        if (this.indexBuffer) this.state.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.indexBuffer.handle);
        this.vaos.set(signature, vao);
        this.stats.vertexArraysCreated++;
      } else {
        this.ext.bindVertexArrayOES(vao);
        this.stats.stateSkipped++;
      }
      // A VAO carries its own element-array binding, so the global cache is stale.
      this.state.invalidateElementArray();
      return;
    }
    if (signature !== this.lastManualSignature) {
      this.configure(locations);
      this.lastManualSignature = signature;
    } else {
      this.stats.stateSkipped++;
    }
    this.state.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.indexBuffer?.handle ?? null);
  }

  private signature(program: GL1ProgramRef, locations: ReadonlyArray<number | undefined>): number {
    let text = `${this.layout.key}|${program.handle ? programId(program.handle) : 0}`;
    for (let i = 0; i < locations.length; i++) text += `|${locations[i] ?? -1}`;
    for (const buffer of this.buffers) text += `|b${(buffer as GL1Buffer).id}`;
    text += `|i${this.indexBuffer ? (this.indexBuffer as GL1Buffer).id : 0}`;
    return hashFNV1a(text);
  }

  private configure(locations: ReadonlyArray<number | undefined>): void {
    const gl = this.gl;
    for (let i = 0; i < this.layout.attributes.length; i++) {
      const attribute = this.layout.attributes[i]!;
      const location = locations[i];
      if (location === undefined || location < 0) continue;
      const buffer = this.buffers[attribute.bufferIndex];
      if (!buffer) continue;
      this.state.bindBuffer(GL_ARRAY_BUFFER, buffer.handle);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, attribute.size, GL_FLOAT, attribute.normalized, attribute.stride, attribute.offset);
      this.stats.glCalls += 2;
      this.state.setAttributeDivisor(location, attribute.divisor, this.instancing);
    }
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    if (this.ext) {
      for (const vao of this.vaos.values()) {
        this.ext.deleteVertexArrayOES(vao);
        this.stats.glCalls++;
      }
      this.vaos.clear();
    }
  }
}

const programIds = new WeakMap<WebGLProgram, number>();
let nextProgramId = 1;
function programId(program: WebGLProgram): number {
  let id = programIds.get(program);
  if (id === undefined) {
    id = nextProgramId++;
    programIds.set(program, id);
  }
  return id;
}
