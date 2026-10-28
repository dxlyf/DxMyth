import { GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER } from './constants.js';
import { GL2DisposedError, GL2Error } from './errors.js';
import type { GL2State } from './GL2State.js';
import { attributeFormat, indexBytes } from './mappings.js';
import { hashFNV1a } from '../internal/pure.js';
import type {
  GL2AttributeBinding,
  GL2AttributeSpec,
  GL2IndexType,
  GL2ProgramRef,
  GL2Stats,
  GL2VertexArrayRef,
  GL2VertexLayout,
  GL2VertexLayoutOptions,
} from './types.js';
import type { GL2Buffer } from './GL2Buffer.js';

export function defineGL2VertexLayout(options: GL2VertexLayoutOptions): GL2VertexLayout {
  if (options.attributes.length === 0) throw new GL2Error('A vertex layout needs at least one attribute');
  const interleaved = options.interleaved !== false;
  const bindings: GL2AttributeBinding[] = [];
  const parts: string[] = [];
  let offset = 0;
  for (let i = 0; i < options.attributes.length; i++) {
    const spec: GL2AttributeSpec = options.attributes[i]!;
    if (spec.size < 1 || spec.size > 4) throw new GL2Error(`Attribute "${spec.name}" must have 1..4 components`);
    const type = spec.type ?? 'float32';
    const format = attributeFormat(type);
    const bytes = spec.size * format.componentBytes;
    bindings.push({
      name: spec.name,
      size: spec.size,
      type,
      integer: format.integer,
      normalized: spec.normalized === true,
      divisor: spec.divisor ?? 0,
      componentBytes: format.componentBytes,
      stride: 0,
      offset: interleaved ? offset : 0,
      bufferIndex: interleaved ? (spec.bufferIndex ?? 0) : (spec.bufferIndex ?? i),
    });
    if (interleaved) offset += bytes;
    parts.push(`${spec.name}/${spec.size}/${type}/${spec.normalized ? 1 : 0}/${spec.divisor ?? 0}`);
  }
  const stride = interleaved ? (options.stride ?? offset) : 0;
  if (interleaved) {
    for (const binding of bindings) binding.stride = stride;
  }
  return {
    attributes: bindings,
    stride,
    key: hashFNV1a(`${parts.join(';')}|${stride}|${interleaved ? 1 : 0}`),
  };
}

export interface GL2VertexArrayOptions {
  layout: GL2VertexLayout;
  buffers: GL2Buffer | readonly GL2Buffer[];
  indexBuffer?: GL2Buffer;
  indexType?: GL2IndexType;
}

/**
 * WebGL2 always has vertex array objects. The VAO is created lazily per
 * (layout, attribute-location mapping, buffers) combination and reused, so a
 * steady-state draw costs exactly one `bindVertexArray`.
 */
export class GL2VertexArray implements GL2VertexArrayRef {
  readonly layout: GL2VertexLayout;
  readonly buffers: readonly GL2Buffer[];
  readonly indexBuffer: GL2Buffer | null;
  readonly indexType: GL2IndexType;

  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly vaos = new Map<number, WebGLVertexArrayObject>();
  private disposedFlag = false;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, options: GL2VertexArrayOptions) {
    if (options.layout.attributes.length === 0) throw new GL2Error('A vertex array needs a layout with attributes');
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.layout = options.layout;
    this.buffers = Array.isArray(options.buffers) ? options.buffers : [options.buffers];
    this.indexBuffer = options.indexBuffer ?? null;
    this.indexType = options.indexType ?? 'uint16';
    for (const attribute of this.layout.attributes) {
      if (attribute.bufferIndex >= this.buffers.length) {
        throw new GL2Error(`Attribute "${attribute.name}" references buffer ${attribute.bufferIndex} but only ${this.buffers.length} buffer(s) were supplied`);
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
        : Math.floor(available / (attribute.size * attribute.componentBytes));
      if (count < min) min = count;
    }
    return Number.isFinite(min) ? Math.max(0, min) : 0;
  }

  get indexCount(): number {
    if (!this.indexBuffer) return this.vertexCount;
    return Math.floor(this.indexBuffer.byteLength / indexBytes(this.indexType));
  }

  bind(program: GL2ProgramRef): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2VertexArray');
    const locations: Array<number | undefined> = [];
    for (const attribute of this.layout.attributes) locations.push(program.attributeLocation(attribute.name));
    const signature = this.signature(program, locations);
    let vao = this.vaos.get(signature);
    if (!vao) {
      vao = this.gl.createVertexArray() ?? undefined;
      if (!vao) throw new GL2Error('Failed to create WebGL2 vertex array object');
      this.stats.vertexArraysCreated++;
      this.stats.glCalls++;
      this.state.bindVertexArray(vao);
      this.configure(locations);
      if (this.indexBuffer) this.state.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.indexBuffer.handle);
      this.vaos.set(signature, vao);
    } else {
      this.state.bindVertexArray(vao);
    }
    this.stats.vertexArrayBinds++;
  }

  private signature(program: GL2ProgramRef, locations: ReadonlyArray<number | undefined>): number {
    let text = `${this.layout.key}|${program.handle ? programKey(program.handle) : 0}`;
    for (const location of locations) text += `|${location ?? -1}`;
    for (const buffer of this.buffers) text += `|b${buffer.id}`;
    text += `|i${this.indexBuffer ? this.indexBuffer.id : 0}|${this.indexType}`;
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
      const format = attributeFormat(attribute.type);
      gl.enableVertexAttribArray(location);
      if (format.integer) {
        gl.vertexAttribIPointer(location, attribute.size, format.glType, attribute.stride, attribute.offset);
      } else {
        gl.vertexAttribPointer(location, attribute.size, format.glType, attribute.normalized, attribute.stride, attribute.offset);
      }
      gl.vertexAttribDivisor(location, attribute.divisor);
      this.stats.glCalls += 3;
    }
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const vao of this.vaos.values()) {
      this.gl.deleteVertexArray(vao);
      this.stats.glCalls++;
    }
    this.vaos.clear();
  }
}

const programKeys = new WeakMap<WebGLProgram, number>();
let nextProgramKey = 1;
function programKey(program: WebGLProgram): number {
  let key = programKeys.get(program);
  if (key === undefined) {
    key = nextProgramKey++;
    programKeys.set(program, key);
  }
  return key;
}
