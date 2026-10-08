/**
 * Uniforms of a linked GLSL program.
 *
 * The table is a tree with a special root container, built by parsing the
 * hierarchy WebGL encodes in active-uniform names:
 *
 * ```ts
 * const uniforms = new WebGLUniforms(gl, program);
 * uniforms.setValue(ctx, 'diffuse', color);           // by name
 * uniforms.uploadAll(ctx, material.uniforms);         // batched
 * uniforms.seq                                        // every uniform, in order
 * uniforms.map                                        // by name
 * ```
 *
 * Inner nodes carry `.seq` (ordered) and `.map` (by name); every node except the
 * root carries `.setValue(ctx, value, textures)`.
 *
 * Two structural properties matter for performance:
 *
 * 1. Locations are resolved once, in the constructor, and each node keeps its
 *    own `cache` of the values it last uploaded. `uploadAll` on an unchanged
 *    material therefore issues no GL calls at all.
 * 2. `seqWithValue` filters the program's sequence down to the uniforms a given
 *    values record provides, so the batched path never probes the `map` for a
 *    name the material does not have.
 */
import type { GL } from './GLTypes';
import {
  getPureArraySetter,
  getSingularSetter,
  isSamplerType,
  type SetterContext,
  type SetterTarget,
  type UniformSetter,
  type UniformTextureBinder,
} from './WebGLUniformsSetters';

export type { GL };
export type { UniformTextureBinder, UniformSetter, SetterContext };

/** A uniform's value record, as supplied by a material or by the renderer. */
export interface UniformValue {
  value: unknown;
  /**
   * When exactly `false`, `upload` leaves this uniform alone. Anything else
   * (including `undefined`) uploads, so the default is "always consider it".
   */
  needsUpdate?: boolean;
}

/**
 * A record of uniform values keyed by uniform name.
 *
 * All keys the record declares are treated as present; `upload` still tolerates
 * a missing entry, which is what lets a `StructuredUniform` pull optional fields
 * off a partially-populated value object.
 */
export type UniformValues = Record<string, UniformValue>;

/**
 * Every node in the tree exposes `id`, `setValue` and the upload machinery the
 * setters in `WebGLUniformsSetters` expect via `SetterTarget`.
 */
export interface UniformNode extends SetterTarget {
  /** Name, or the array index for a child of a `struct[]` container. */
  id: string | number;
  setValue(ctx: SetterContext, value: unknown, isNormalMap?: boolean): void;
  /** Present on containers only. */
  seq?: UniformNode[];
  /** Present on containers only. */
  map?: Record<string, UniformNode>;
}

/** A non-array uniform: one location, one value. */
export class SingleUniform implements UniformNode {
  readonly id: string | number;
  readonly addr: WebGLUniformLocation;
  readonly cache: number[] = [];
  readonly type: number;
  readonly size = 1;
  private readonly setter: UniformSetter | undefined;

  constructor(
    id: string | number,
    activeInfo: { type: number; size: number },
    addr: WebGLUniformLocation,
  ) {
    this.id = id;
    this.addr = addr;
    this.type = activeInfo.type;
    this.setter = getSingularSetter(activeInfo.type);
  }

  setValue(ctx: SetterContext, value: unknown, isNormalMap = false): void {
    // A type with no setter is ignored rather than fatal, so one unsupported
    // uniform cannot break an otherwise valid material.
    if (this.setter) this.setter.call(this, ctx, value as never, isNormalMap);
  }
}

/** A "pure" array uniform (`vec4[16]`): one location, one whole-array upload. */
export class PureArrayUniform implements UniformNode {
  readonly id: string | number;
  readonly addr: WebGLUniformLocation;
  readonly cache: number[] = [];
  readonly type: number;
  readonly size: number;
  private readonly setter: UniformSetter | undefined;

  constructor(
    id: string | number,
    activeInfo: { type: number; size: number },
    addr: WebGLUniformLocation,
  ) {
    this.id = id;
    this.addr = addr;
    this.type = activeInfo.type;
    this.size = activeInfo.size;
    this.setter = getPureArraySetter(activeInfo.type);
  }

  setValue(ctx: SetterContext, value: unknown, isNormalMap = false): void {
    if (this.setter) this.setter.call(this, ctx, value as never, isNormalMap);
  }
}

/**
 * An inner node: a struct, or an array of structs (`lights[0].position`).
 * Uploading it walks the children and pulls each field off the value object.
 */
export class StructuredUniform implements UniformNode {
  readonly id: string | number;
  readonly seq: UniformNode[] = [];
  readonly map: Record<string, UniformNode> = {};

  // A container has no location of its own; these exist to satisfy the node
  // shape the leaf setters share.
  readonly addr = null as unknown as WebGLUniformLocation;
  readonly cache: number[] = [];
  readonly size = 0;
  readonly type = 0;

  constructor(id: string | number) {
    this.id = id;
  }

  setValue(ctx: SetterContext, value: unknown, isNormalMap = false): void {
    const source = value as Record<string, unknown> | null | undefined;
    if (source === null || source === undefined) return;
    for (const child of this.seq) {
      const childValue = source[child.id as string];
      if (childValue === undefined) continue;
      child.setValue(ctx, childValue, isNormalMap);
    }
  }
}

/** Parses `name[0].field` into nested containers. */
const RePathPart = /(\w+)(\])?(\[|\.)?/g;

function addUniform(container: StructuredUniform, uniform: UniformNode): void {
  container.seq.push(uniform);
  container.map[String(uniform.id)] = uniform;
}

function parseUniform(
  activeInfo: { name: string; type: number; size: number },
  addr: WebGLUniformLocation,
  container: StructuredUniform,
): void {
  const path = activeInfo.name;
  const pathLength = path.length;

  // The regex is stateful, so it is reset before each parse.
  RePathPart.lastIndex = 0;

  for (;;) {
    const match = RePathPart.exec(path);
    if (!match) break;
    const matchEnd = RePathPart.lastIndex;

    const rawId = match[1];
    const idIsIndex = match[2] === ']';
    const subscript = match[3];

    if (subscript === undefined || (subscript === '[' && matchEnd + 2 === pathLength)) {
      // A bare name, or the `[0]` suffix GL reports for a whole array.
      addUniform(
        container,
        subscript === undefined
          ? new SingleUniform(rawId, activeInfo, addr)
          : new PureArrayUniform(rawId, activeInfo, addr),
      );
      break;
    }

    // Step into an inner node, creating it when absent. `struct[]` elements are
    // keyed by their numeric index so `value[index]` resolves.
    const id = idIsIndex ? Number(rawId) : rawId;
    let next = container.map[String(id)] as StructuredUniform | undefined;
    if (next === undefined) {
      next = new StructuredUniform(id);
      addUniform(container, next);
    }
    container = next;
  }
}

/**
 * The uniform table of one program.
 *
 * Locations are resolved once at construction; uploads then go through the
 * per-node setters, which skip GL calls whose value did not change. Because the
 * cache is per node, re-drawing an unchanged material costs no GL calls at all.
 */
export class WebGLUniforms extends StructuredUniform {
  /** Every top-level uniform, in program order. */
  declare readonly seq: UniformNode[];
  /** Top-level uniforms by name. */
  declare readonly map: Record<string, UniformNode>;

  readonly program: WebGLProgram;
  /** Attribute names reported by the linker. */
  readonly attributes: Set<string> = new Set();

  private readonly gl: GL;
  /** Number of sampler uniforms, i.e. texture units this program consumes. */
  samplerCount = 0;
  private readonly samplerNames = new Set<string>();

  constructor(gl: GL, program: WebGLProgram) {
    super(0);
    this.gl = gl;
    this.program = program;
    this.seq = [];
    this.map = {};
    this.reflect();
  }

  /**
   * Walks the active uniform and attribute lists.
   *
   * Array uploads use the `[0]`-suffixed location, which WebGL guarantees
   * addresses the whole array, so per-element locations are not needed.
   */
  private reflect(): void {
    const gl = this.gl;
    const program = this.program;
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;

    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const addr = gl.getUniformLocation(program, info.name);
      if (!addr) continue;
      parseUniform(info, addr, this);
      if (isSamplerType(info.type)) {
        this.samplerNames.add(stripArraySuffix(info.name));
        this.samplerCount++;
      }
    }

    const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
    for (let i = 0; i < attributeCount; i++) {
      const info = gl.getActiveAttrib(program, i);
      if (!info) continue;
      this.attributes.add(info.name);
    }
  }

  /** `true` when the program declares a top-level uniform with this name. */
  has(name: string): boolean {
    return this.map[name] !== undefined;
  }

  /** The node for `name`, or `undefined` when it is not active. */
  entry(name: string): UniformNode | undefined {
    return this.map[name];
  }

  /** `gl.getUniformLocation()` result for `name`, or `null`. */
  location(name: string): WebGLUniformLocation | null {
    const node = this.map[name];
    return node && node.addr ? node.addr : null;
  }

  /** Every active uniform name (top level only). */
  get names(): string[] {
    return this.seq.map((node) => String(node.id));
  }

  /** Number of sampler uniforms, i.e. the texture units this program needs. */
  get unitsRequired(): number {
    return this.samplerCount;
  }

  /** Names of every sampler uniform, for diagnostics and tests. */
  get samplerUniformNames(): string[] {
    return [...this.samplerNames];
  }

  /** Uploads by name; a no-op when the program does not declare `name`. */
  override setValue(ctx: SetterContext, name: unknown, value: unknown, isNormalMap = false): void {
    const node = this.map[String(name)];
    if (node === undefined) return;
    node.setValue(ctx, value, isNormalMap);
  }

  /**
   * Binds `texture` to this sampler's own unit and points the sampler at it.
   *
   * Used by the background-texture path, which binds a texture directly rather
   * than through a material's uniform record.
   */
  setTexture(name: string, texture: unknown, binder: UniformTextureBinder, isNormalMap = false): void {
    const node = this.map[name];
    if (node === undefined) return;
    const unit = binder.allocateTextureUnit();
    this.gl.uniform1i(node.addr, unit);
    node.cache[0] = unit;
    binder.bind(texture, unit, '2d', isNormalMap);
  }

  /** Uploads `object[name]` when the program declares it and it is defined. */
  setOptional(ctx: SetterContext, object: Record<string, unknown>, name: string): void {
    const value = object[name];
    if (value !== undefined) this.setValue(ctx, name, value);
  }

  /**
   * Uploads every entry of `values` that this program declares, in program
   * order. This is the batched path: one loop, and no per-name map lookups in
   * the renderer.
   */
  uploadAll(ctx: SetterContext, values: UniformValues): void {
    WebGLUniforms.upload(ctx, WebGLUniforms.seqWithValue(this.seq, values), values);
  }

  /**
   * Drops every cached value, forcing the next upload to reach GL.
   *
   * Needed when GL uniform state was changed behind the cache's back — a context
   * loss, or a second renderer sharing this table.
   */
  invalidateCache(): void {
    for (const node of this.seq) invalidateNode(node);
  }

  /** Uploads `values[id].value` for each node in `seq`. */
  static upload(ctx: SetterContext, seq: UniformNode[], values: UniformValues): void {
    for (let i = 0, n = seq.length; i !== n; i++) {
      const node = seq[i];
      const key = String(node.id);
      const entry = values[key] as UniformValue | undefined;
      if (entry === undefined) continue;
      // `needsUpdate: false` means "this value is already on the GPU".
      if (entry.needsUpdate === false) continue;
      node.setValue(ctx, entry.value, key === 'normalMap');
    }
  }

  /** The subset of `seq` that `values` actually provides, preserving order. */
  static seqWithValue(seq: UniformNode[], values: UniformValues): UniformNode[] {
    const filtered: UniformNode[] = [];
    for (let i = 0, n = seq.length; i !== n; i++) {
      const node = seq[i];
      if (String(node.id) in values) filtered.push(node);
    }
    return filtered;
  }

  /** Releases the reflection table; the program itself is owned by `GLProgram`. */
  dispose(): void {
    invalidateNode(this);
    this.seq.length = 0;
    for (const key of Object.keys(this.map)) delete this.map[key];
    this.attributes.clear();
    this.samplerNames.clear();
    this.samplerCount = 0;
  }
}

function invalidateNode(node: UniformNode): void {
  node.cache.length = 0;
  if (node.seq) for (const child of node.seq) invalidateNode(child);
}

function stripArraySuffix(name: string): string {
  return name.replace(/\[0\]$/, '');
}
