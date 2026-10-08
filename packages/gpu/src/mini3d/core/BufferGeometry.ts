import { BufferAttribute } from './BufferAttribute';
import { Box3 } from '../math/Box3';
import { Sphere } from '../math/Sphere';
import { Vector3 } from '../math/Vector3';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';
import { EventDispatcher } from './EventDispatcher';

/** Vertex draw modes, mapped to GL primitives / `GPUPrimitiveTopology`. */
export type DrawMode = 'triangles' | 'triangle-strip' | 'lines' | 'line-strip' | 'points';

/** Numeric values match the WebGL `gl.TRIANGLES`-style constants. */
export const DRAW_MODE_VALUES: Record<DrawMode, number> = {
  points: 0,
  lines: 1,
  'line-strip': 3,
  triangles: 4,
  'triangle-strip': 5,
};

/** A contiguous run of indices drawn with a single material. */
export interface GeometryGroup {
  start: number;
  count: number;
  /** Index into the mesh's material array (or 0 for a single material). */
  materialIndex: number;
}

/** CPU-side description of a vertex attribute (used by `BufferGeometry.compute*`). */
export interface GeometryAttributeOptions {
  name?: string;
  usage?: 'static' | 'dynamic' | 'stream';
}

export interface BufferGeometryEventMap {
  dispose: { target: BufferGeometry };
}

/**
 * A drawable mesh's worth of GPU data: named attributes, an optional index
 * buffer, draw groups, and lazily computed bounding volumes.
 *
 * Backends read `attributes`, `index`, `groups`, `drawMode` and the
 * `boundingSphere` when culling; everything else is CPU-side bookkeeping.
 */
export class BufferGeometry extends EventDispatcher<BufferGeometryEventMap> {
  readonly isBufferGeometry = true;
  /** Stable identity so backends can key their GPU cache without WeakMaps. */
  readonly id: number;
  name = '';

  attributes: Record<string, BufferAttribute> = {};
  /** Index buffer; 16- or 32-bit. */
  index: BufferAttribute | null = null;
  groups: GeometryGroup[] = [];
  drawMode: DrawMode = 'triangles';

  boundingBox: Box3 | null = null;
  boundingSphere: Sphere | null = null;

  /** User data for application code; ignored by the renderer. */
  userData: Record<string, unknown> = {};

  /** Bumped whenever the CPU data changes so backends re-upload lazily. */
  version = 0;

  private consecutiveId = 0;
  private static nextId = 1;

  constructor() {
    super();
    this.id = BufferGeometry.nextId++;
  }

  get vertexCount(): number {
    const position = this.attributes.position;
    return position ? position.count : 0;
  }

  get indexCount(): number {
    return this.index ? this.index.count : 0;
  }

  /** Effective element count passed to `drawElements` / `draw`. */
  get drawCount(): number {
    return this.index ? this.index.count : this.vertexCount;
  }

  get isIndexed(): boolean {
    return this.index !== null;
  }

  // ------------------------------------------------------------ attributes --

  setAttribute(name: string, attribute: BufferAttribute): this {
    if (attribute.name === '') attribute.name = name;
    this.attributes[name] = attribute;
    // Replacing the position data changes the bounds (and the attribute's own
    // `version` changes when its array is edited in place, which
    // `updateBounds()` also checks).
    if (name === 'position') this.invalidateBounds();
    return this;
  }

  getAttribute(name: string): BufferAttribute | undefined {
    return this.attributes[name];
  }

  hasAttribute(name: string): boolean {
    return this.attributes[name] !== undefined;
  }

  deleteAttribute(name: string): this {
    delete this.attributes[name];
    if (name === 'position') this.invalidateBounds();
    return this;
  }

  /**
   * Installs (or replaces) the `position` attribute. All generators route
   * through here so the bounding volumes are invalidated consistently.
   */
  setPosition(array: Float32Array | number[]): this {
    const data = array instanceof Float32Array ? array : new Float32Array(array);
    this.setAttribute('position', new BufferAttribute(data, 3, false, { semantic: 'position' }));
    this.invalidateBounds();
    return this;
  }

  setNormal(array: Float32Array | number[]): this {
    const data = array instanceof Float32Array ? array : new Float32Array(array);
    this.setAttribute('normal', new BufferAttribute(data, 3, false, { semantic: 'normal' }));
    return this;
  }

  setUv(array: Float32Array | number[], channel = 0): this {
    const data = array instanceof Float32Array ? array : new Float32Array(array);
    const name = channel === 0 ? 'uv' : `uv${channel + 1}`;
    this.setAttribute(name, new BufferAttribute(data, 2, false, { semantic: channel === 0 ? 'uv' : 'custom' }));
    return this;
  }

  setColor(array: Float32Array | number[]): this {
    const data = array instanceof Float32Array ? array : new Float32Array(array);
    this.setAttribute('color', new BufferAttribute(data, 3, false, { semantic: 'color' }));
    return this;
  }

  setIndex(array: Uint16Array | Uint32Array | number[]): this {
    let data: Uint16Array | Uint32Array;
    if (array instanceof Uint16Array || array instanceof Uint32Array) {
      data = array;
    } else {
      // Auto-select 16-bit indices whenever the vertex range allows it: smaller
      // uploads and WebGL1-friendly (OES_element_index_uint is optional there).
      const max = array.length ? Math.max(...array) : 0;
      data = max > 65535 ? new Uint32Array(array) : new Uint16Array(array);
    }
    this.index = new BufferAttribute(data, 1, false, { name: 'index', semantic: 'custom' });
    this.version++;
    return this;
  }

  setDrawMode(mode: DrawMode): this {
    this.drawMode = mode;
    this.version++;
    return this;
  }

  // ---------------------------------------------------------------- groups --

  addGroup(start: number, count: number, materialIndex = 0): this {
    this.groups.push({ start, count, materialIndex });
    return this;
  }

  clearGroups(): this {
    this.groups.length = 0;
    return this;
  }

  /** Generates one group per vertex, handy for `Points` with a custom shader. */
  setDrawRange(start: number, count: number): this {
    this.drawRange = { start, count };
    return this;
  }

  drawRange: { start: number; count: number } = { start: 0, count: Infinity };

  // ---------------------------------------------------------------- bounds --

  invalidateBounds(): this {
    this.boundingBox = null;
    this.boundingSphere = null;
    this._boundsVersion = -1;
    return this;
  }

  /** `position.version` at the last bounds computation. */
  private _boundsVersion = -1;
  private _boundsBoxVersion = -1;

  /**
   * Refreshes the cached bounds only when the position data changed.
   *
   * `computeBoundingSphere()` is an O(vertices) pass and the raycaster needs a
   * bounding sphere for every candidate, so calling it per pick (as a naive
   * implementation does) adds a full vertex traversal to every frame. This runs
   * the computation at most once per position edit instead.
   */
  updateBounds(): this {
    const position = this.attributes.position;
    if (!position) {
      this.boundingBox = null;
      this.boundingSphere = null;
      return this;
    }
    if (this._boundsVersion === position.version && this.boundingBox && this.boundingSphere) {
      return this;
    }
    this.computeBoundingBox();
    this.computeBoundingSphere();
    this._boundsVersion = position.version;
    this._boundsBoxVersion = position.version;
    return this;
  }

  /** Cached bounding sphere, computed on first use. */
  getBoundingSphere(): Sphere {
    this.updateBounds();
    if (!this.boundingSphere) this.computeBoundingSphere();
    return this.boundingSphere as Sphere;
  }

  /** Cached bounding box, computed on first use. */
  getBoundingBox(): Box3 {
    this.updateBounds();
    if (!this.boundingBox) this.computeBoundingBox();
    return this.boundingBox as Box3;
  }

  computeBoundingBox(): Box3 {
    const position = this.attributes.position;
    if (!position) {
      this.boundingBox = new Box3().makeEmpty();
      return this.boundingBox;
    }
    if (!this.boundingBox) this.boundingBox = new Box3();
    const box = this.boundingBox;
    box.makeEmpty();
    const array = position.array;
    for (let i = 0; i < array.length; i += position.itemSize) {
      box.expandByPoint(_v.fromArray(array, i));
    }
    if (box.isEmpty()) box.set(new Vector3(), new Vector3());
    this._boundsBoxVersion = position.version;
    return box;
  }

  computeBoundingSphere(): Sphere {
    const position = this.attributes.position;
    if (!position) {
      this.boundingSphere = new Sphere();
      return this.boundingSphere;
    }
    if (!this.boundingSphere) this.boundingSphere = new Sphere();
    const sphere = this.boundingSphere;
    const array = position.array;
    const stride = position.itemSize;
    const count = position.count;

    // Centroid first — a decent centre estimate for the average mesh.
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let i = 0; i < count; i++) {
      const o = i * stride;
      cx += array[o];
      cy += array[o + 1];
      cz += array[o + 2];
    }
    cx /= count || 1;
    cy /= count || 1;
    cz /= count || 1;
    sphere.center.set(cx, cy, cz);

    // Farthest point from the centroid...
    let maxRadiusSq = 0;
    for (let i = 0; i < count; i++) {
      const o = i * stride;
      const dx = array[o] - cx;
      const dy = array[o + 1] - cy;
      const dz = array[o + 2] - cz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d > maxRadiusSq) maxRadiusSq = d;
    }
    sphere.radius = Math.sqrt(maxRadiusSq);

    // ...then grow so every point is enclosed (cheap two-pass refinement).
    for (let i = 0; i < count; i++) {
      const o = i * stride;
      _v.fromArray(array, o);
      const d = _v.distanceTo(sphere.center);
      if (d > sphere.radius) {
        const t = (d - sphere.radius) / (2 * d);
        sphere.center.addScaledVector(_v.sub(sphere.center), t);
        sphere.radius = (d + sphere.radius) / 2;
      }
    }
    this._boundsVersion = position.version;
    return sphere;
  }

  /** Recomputes vertex normals from triangle winding. */
  computeVertexNormals(): this {
    const position = this.attributes.position;
    if (!position) return this;
    const count = position.count;
    if (!this.attributes.normal || this.attributes.normal.count !== count) {
      this.setNormal(new Float32Array(count * 3));
    }
    const normal = this.attributes.normal;
    const nArr = normal.array as Float32Array;
    nArr.fill(0);

    const pArr = position.array;
    const index = this.index;
    const triCount = index ? index.count / 3 : count / 3;
    const iArr = index ? index.array : null;

    const pA = new Vector3();
    const pB = new Vector3();
    const pC = new Vector3();
    const cb = new Vector3();
    const ab = new Vector3();

    for (let t = 0; t < triCount; t++) {
      const i0 = iArr ? iArr[t * 3] : t * 3;
      const i1 = iArr ? iArr[t * 3 + 1] : t * 3 + 1;
      const i2 = iArr ? iArr[t * 3 + 2] : t * 3 + 2;
      pA.fromArray(pArr, i0 * 3);
      pB.fromArray(pArr, i1 * 3);
      pC.fromArray(pArr, i2 * 3);
      cb.subVectors(pC, pB);
      ab.subVectors(pA, pB);
      cb.cross(ab);
      nArr[i0 * 3] += cb.x; nArr[i0 * 3 + 1] += cb.y; nArr[i0 * 3 + 2] += cb.z;
      nArr[i1 * 3] += cb.x; nArr[i1 * 3 + 1] += cb.y; nArr[i1 * 3 + 2] += cb.z;
      nArr[i2 * 3] += cb.x; nArr[i2 * 3 + 1] += cb.y; nArr[i2 * 3 + 2] += cb.z;
    }

    // Normalise, falling back to +Y for degenerate vertices.
    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const x = nArr[o];
      const y = nArr[o + 1];
      const z = nArr[o + 2];
      const l = Math.hypot(x, y, z);
      if (l > 1e-8) {
        nArr[o] = x / l;
        nArr[o + 1] = y / l;
        nArr[o + 2] = z / l;
      } else {
        nArr[o] = 0;
        nArr[o + 1] = 1;
        nArr[o + 2] = 0;
      }
    }
    normal.markNeedsUpdate();
    this.version++;
    return this;
  }

  // ------------------------------------------------------------- utilities --

  /** Duplicates the geometry and all of its attributes. */
  clone(): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.name = this.name;
    geometry.drawMode = this.drawMode;
    geometry.drawRange = { ...this.drawRange };
    for (const [name, attribute] of Object.entries(this.attributes)) {
      geometry.setAttribute(name, attribute.clone());
    }
    if (this.index) geometry.index = this.index.clone();
    geometry.groups = this.groups.map((g) => ({ ...g }));
    geometry.userData = { ...this.userData };
    return geometry;
  }

  /** Merges `others` into a single non-indexed geometry. */
  merge(...others: BufferGeometry[]): BufferGeometry {
    const result = new BufferGeometry();
    result.name = this.name;

    const names = new Set<string>();
    for (const g of [this, ...others]) {
      for (const name of Object.keys(g.attributes)) names.add(name);
    }

    let vertexOffset = 0;
    const merged: Record<string, Float32Array> = {};
    const totals: Record<string, number> = {};

    for (const name of names) {
      let total = 0;
      for (const g of [this, ...others]) {
        const a = g.attributes[name];
        if (a) total += a.count * a.itemSize;
      }
      totals[name] = total;
      merged[name] = new Float32Array(total);
    }

    const offsets: Record<string, number> = {};
    for (const name of names) offsets[name] = 0;

    for (const g of [this, ...others]) {
      const index = g.index;
      const count = g.vertexCount;
      const order: number[] = [];
      if (index) {
        for (let i = 0; i < index.count; i++) order.push(index.array[i]);
      } else {
        for (let i = 0; i < count; i++) order.push(i);
      }
      for (const name of names) {
        const attribute = g.attributes[name];
        if (!attribute) continue;
        const dst = merged[name];
        let o = offsets[name];
        for (const vi of order) {
          const src = vi * attribute.itemSize;
          for (let c = 0; c < attribute.itemSize; c++) dst[o++] = attribute.array[src + c];
        }
        offsets[name] = o;
      }
      vertexOffset += order.length;
    }

    void vertexOffset;
    for (const name of names) {
      const itemSize = findItemSize(name, this, others);
      result.setAttribute(
        name,
        new BufferAttribute(merged[name] as Float32Array, itemSize, false, { name }),
      );
    }
    result.groups = [{ start: 0, count: merged.position ? merged.position.length / 3 : 0, materialIndex: 0 }];
    return result;
  }

  /** Recentres the geometry on its bounding sphere and returns the offset. */
  center(): this {
    if (!this.boundingBox) this.computeBoundingBox();
    const box = this.boundingBox as Box3;
    if (box.isEmpty()) return this;
    box.getCenter(_v);
    this.translate(-_v.x, -_v.y, -_v.z);
    return this;
  }

  /** Applies a translation to the `position` attribute. */
  translate(x: number, y: number, z: number): this {
    const position = this.attributes.position;
    if (!position) return this;
    const array = position.array;
    for (let i = 0; i < array.length; i += position.itemSize) {
      array[i] += x;
      array[i + 1] += y;
      array[i + 2] += z;
    }
    position.markNeedsUpdate();
    this.invalidateBounds();
    this.version++;
    return this;
  }

  scale(x: number, y: number, z: number): this {
    const position = this.attributes.position;
    if (!position) return this;
    const array = position.array;
    for (let i = 0; i < array.length; i += position.itemSize) {
      array[i] *= x;
      array[i + 1] *= y;
      array[i + 2] *= z;
    }
    position.markNeedsUpdate();
    this.invalidateBounds();
    this.version++;
    return this;
  }

  rotateX(angle: number): this {
    return this.applyMatrix4(_rot.makeRotationX(angle), false);
  }

  rotateY(angle: number): this {
    return this.applyMatrix4(_rot.makeRotationY(angle), false);
  }

  rotateZ(angle: number): this {
    return this.applyMatrix4(_rot.makeRotationZ(angle), false);
  }

  /** Transforms `position` (and `normal` when `updateNormals` is true). */
  applyMatrix4(matrix: { elements: ArrayLike<number> }, updateNormals = true): this {
    const position = this.attributes.position;
    if (!position) return this;
    const array = position.array;
    for (let i = 0; i < array.length; i += 3) {
      _v.fromArray(array, i).applyMatrix4(matrix);
      array[i] = _v.x;
      array[i + 1] = _v.y;
      array[i + 2] = _v.z;
    }
    position.markNeedsUpdate();
    if (updateNormals && this.attributes.normal) {
      _normalMatrix.getNormalMatrix(matrix);
      const normal = this.attributes.normal;
      const nArr = normal.array;
      for (let i = 0; i < nArr.length; i += 3) {
        _v.fromArray(nArr, i).applyMatrix3(_normalMatrix).normalize();
        nArr[i] = _v.x;
        nArr[i + 1] = _v.y;
        nArr[i + 2] = _v.z;
      }
      normal.markNeedsUpdate();
    }
    this.invalidateBounds();
    this.version++;
    return this;
  }

  dispose(): void {
    this.dispatchEvent('dispose', { target: this });
  }

  toJSON(): Record<string, unknown> {
    const attributes: Record<string, unknown> = {};
    for (const [name, attribute] of Object.entries(this.attributes)) {
      attributes[name] = attribute.toJSON();
    }
    return {
      metadata: { generator: 'mini3d.BufferGeometry', version: 1 },
      name: this.name,
      drawMode: this.drawMode,
      attributes,
      index: this.index ? Array.from(this.index.array) : null,
      groups: this.groups,
    };
  }
}

const _v = new Vector3();
const _rot = new Matrix4();
const _normalMatrix = new Matrix3();

function findItemSize(name: string, first: BufferGeometry, rest: BufferGeometry[]): number {
  for (const g of [first, ...rest]) {
    const a = g.attributes[name];
    if (a) return a.itemSize;
  }
  return 3;
}
