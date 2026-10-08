import { Vector3 } from '../math/Vector3';
import { Quat } from '../math/Quat';
import { Euler } from '../math/Euler';
import { Matrix4 } from '../math/Matrix4';
import { EventDispatcher } from './EventDispatcher';
import type { Box3 } from '../math/Box3';
import type { Sphere } from '../math/Sphere';
import type { Intersection, Raycaster } from './Raycaster';

export interface Object3DEventMap {
  added: { parent: Object3D };
  removed: { parent: Object3D };
  childadded: { child: Object3D };
  childremoved: { child: Object3D };
  dispose: { target: Object3D };
}

let objectIdCounter = 0;

/**
 * Base scene-graph node: local transform (position/rotation/scale), a world
 * matrix derived from the parent chain, and a child list.
 *
 * Backends consume `matrixWorld`, `visible`, `renderOrder`, `frustumCulled` and
 * `layers`; subclasses add `geometry` / `material`.
 */
export class Object3D extends EventDispatcher<Object3DEventMap> {
  readonly isObject3D = true;
  readonly id: number;
  uuid: string;
  name = '';
  type = 'Object3D';

  // ------------------------------------------------------------- transform --
  readonly position = new Vector3(0, 0, 0);
  readonly rotation = new Euler();
  readonly quaternion = new Quat();
  readonly scale = new Vector3(1, 1, 1);
  readonly up = new Vector3(0, 1, 0);

  readonly matrix = new Matrix4();
  readonly matrixWorld = new Matrix4();
  matrixAutoUpdate = true;
  matrixWorldAutoUpdate = true;
  matrixWorldNeedsUpdate = false;

  /** Optional explicit pivot for tools; ignored by the renderer. */
  readonly pivot = new Vector3(0, 0, 0);

  // --------------------------------------------------------------- graph ----
  parent: Object3D | null = null;
  readonly children: Object3D[] = [];

  // ------------------------------------------------------------ rendering ---
  visible = true;
  castShadow = false;
  receiveShadow = false;
  renderOrder = 0;
  frustumCulled = true;
  /** 32-bit mask; the camera renders objects whose mask intersects its own. */
  readonly layers = { mask: 1, set(channel: number) { this.mask = 1 << channel; return this; }, enable(channel: number) { this.mask |= 1 << channel; return this; }, disable(channel: number) { this.mask &= ~(1 << channel); return this; }, test(layers: { mask: number }) { return (this.mask & layers.mask) !== 0; } };

  userData: Record<string, unknown> = {};

  /** Bounding volumes, filled in by `Mesh`/`Line`/`Points` subclasses. */
  boundingBox: Box3 | null = null;
  boundingSphere: Sphere | null = null;

  private readonly _rotationQuat = new Quat();
  private readonly _rotationEuler = new Euler();
  private _rotationFromQuaternion = true;

  constructor() {
    super();
    this.id = objectIdCounter++;
    this.uuid = generateUuid();
  }

  // ------------------------------------------------------------- hierarchy --

  add(...objects: Object3D[]): this {
    for (const object of objects) {
      if (object === this) {
        throw new Error('mini3d.Object3D.add: an object cannot be added to itself');
      }
      if (object.parent !== null) object.parent.remove(object);
      object.parent = this;
      this.children.push(object);
      object.dispatchEvent('added', { parent: this });
      this.dispatchEvent('childadded', { child: object });
    }
    return this;
  }

  remove(...objects: Object3D[]): this {
    for (const object of objects) {
      const index = this.children.indexOf(object);
      if (index === -1) continue;
      object.parent = null;
      this.children.splice(index, 1);
      object.dispatchEvent('removed', { parent: this });
      this.dispatchEvent('childremoved', { child: object });
    }
    return this;
  }

  removeFromParent(): this {
    this.parent?.remove(this);
    return this;
  }

  clear(): this {
    return this.remove(...this.children.slice());
  }

  /** Depth-first walk; returning `false` from `callback` skips the subtree. */
  traverse(callback: (object: Object3D) => boolean | void): void {
    if (callback(this) === false) return;
    for (const child of this.children) child.traverse(callback);
  }

  traverseVisible(callback: (object: Object3D) => boolean | void): void {
    if (!this.visible) return;
    if (callback(this) === false) return;
    for (const child of this.children) child.traverseVisible(callback);
  }

  traverseAncestors(callback: (object: Object3D) => void): void {
    let parent = this.parent;
    while (parent) {
      callback(parent);
      parent = parent.parent;
    }
  }

  /** All descendants matching a type string, e.g. `getObjectsByType('Mesh')`. */
  getObjectsByType<T extends Object3D = Object3D>(type: string): T[] {
    const result: T[] = [];
    this.traverse((object) => {
      if (object !== this && object.type === type) result.push(object as T);
    });
    return result;
  }

  getObjectById(id: number): Object3D | undefined {
    let found: Object3D | undefined;
    this.traverse((object) => {
      if (found) return false;
      if (object.id === id) found = object;
      return undefined;
    });
    return found;
  }

  getObjectByName(name: string): Object3D | undefined {
    let found: Object3D | undefined;
    this.traverse((object) => {
      if (found) return false;
      if (object.name === name) found = object;
      return undefined;
    });
    return found;
  }

  // ------------------------------------------------------------- transform --

  /** Applies a 4x4 matrix and decomposes it into the local transform. */
  applyMatrix4(matrix: Matrix4): this {
    if (this.matrixAutoUpdate) {
      if (this.parent === null) this.matrix.copy(matrix);
      else this.matrix.premultiply(this.parent.matrixWorld);
      this.matrix.decompose(this.position, this.quaternion, this.scale);
      this._rotationFromQuaternion = true;
    }
    return this;
  }

  applyQuaternion(q: Quat): this {
    this.quaternion.premultiply(q);
    return this;
  }

  setRotationFromEuler(euler: Euler): this {
    this._rotationEuler.copy(euler);
    this.quaternion.setFromEuler(euler);
    this._rotationFromQuaternion = true;
    return this;
  }

  setRotationFromQuaternion(q: Quat): this {
    this.quaternion.copy(q);
    this._rotationFromQuaternion = true;
    return this;
  }

  setRotationFromMatrix(m: Matrix4): this {
    this.quaternion.setFromRotationMatrix(m);
    this._rotationFromQuaternion = true;
    return this;
  }

  /** Rotates about an arbitrary axis in object space. */
  rotateOnAxis(axis: Vector3, angle: number): this {
    _q1.setFromAxisAngle(axis, angle);
    this.quaternion.multiply(_q1);
    return this;
  }

  /** Rotates about an arbitrary axis in world space. */
  rotateOnWorldAxis(axis: Vector3, angle: number): this {
    _q1.setFromAxisAngle(axis, angle);
    this.quaternion.premultiply(_q1);
    return this;
  }

  rotateX(angle: number): this {
    return this.rotateOnAxis(_xAxis, angle);
  }

  rotateY(angle: number): this {
    return this.rotateOnAxis(_yAxis, angle);
  }

  rotateZ(angle: number): this {
    return this.rotateOnAxis(_zAxis, angle);
  }

  translateOnAxis(axis: Vector3, distance: number): this {
    _v1.copy(axis).applyQuaternion(this.quaternion);
    this.position.add(_v1.multiplyScalar(distance));
    return this;
  }

  translateX(distance: number): this {
    return this.translateOnAxis(_xAxis, distance);
  }

  translateY(distance: number): this {
    return this.translateOnAxis(_yAxis, distance);
  }

  translateZ(distance: number): this {
    return this.translateOnAxis(_zAxis, distance);
  }

  localToWorld(vector: Vector3): Vector3 {
    return vector.applyMatrix4(this.matrixWorld);
  }

  worldToLocal(vector: Vector3): Vector3 {
    return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert());
  }

  /** Unit-length object-space X axis expressed in world space. */
  /** Unit-length object-space X axis expressed in world space. */
  getWorldPosition(target: Vector3 = new Vector3()): Vector3 {
    this.updateWorldMatrix(true, false);
    return target.setFromMatrixPosition(this.matrixWorld);
  }

  getWorldQuaternion(target: Quat = new Quat()): Quat {
    this.updateWorldMatrix(true, false);
    this.matrixWorld.decompose(_v1, target, _v2);
    return target;
  }

  getWorldScale(target: Vector3 = new Vector3()): Vector3 {
    this.updateWorldMatrix(true, false);
    this.matrixWorld.decompose(_v1, _q1, target);
    return target;
  }

  getWorldDirection(target: Vector3 = new Vector3()): Vector3 {
    this.updateWorldMatrix(true, false);
    const e = this.matrixWorld.elements;
    return target.set(e[8], e[9], e[10]).normalize();
  }

  /** Local-space direction (the -Z axis of the object by default). */
  getDirection(target: Vector3 = new Vector3()): Vector3 {
    return target.set(0, 0, -1).applyQuaternion(this.quaternion);
  }

  /** Forces a world-matrix refresh for this node and its ancestors. */
  updateWorldMatrix(updateParents = false, updateChildren = false): void {
    if (updateParents && this.parent) {
      this.parent.updateWorldMatrix(true, false);
    }
    if (this.matrixAutoUpdate) this.updateMatrix();
    if (this.parent === null) {
      this.matrixWorld.copy(this.matrix);
    } else {
      this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
    }
    this.matrixWorldNeedsUpdate = false;
    if (updateChildren) {
      for (const child of this.children) child.updateWorldMatrix(false, true);
    }
    this.boundingSphere = this.boundingSphere ?? null;
  }

  updateMatrix(): void {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrixWorldNeedsUpdate = true;
  }

  updateMatrixWorld(force = false): void {
    if (this.matrixAutoUpdate) this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix);
      } else {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
      }
      this.matrixWorldNeedsUpdate = false;
      force = true;
    }
    for (const child of this.children) child.updateMatrixWorld(force);
  }

  /** Keeps `rotation` and `quaternion` in sync before rendering. */
  syncRotation(): void {
    const e = this.rotation;
    const q = this.quaternion;
    if (
      e.x !== this._rotationEuler.x ||
      e.y !== this._rotationEuler.y ||
      e.z !== this._rotationEuler.z ||
      e.order !== this._rotationEuler.order
    ) {
      q.setFromEuler(e);
      this._rotationEuler.copy(e);
      this._rotationFromQuaternion = true;
    } else if (this._rotationFromQuaternion) {
      e.setFromQuat(q, e.order);
      this._rotationEuler.copy(e);
      this._rotationFromQuaternion = false;
    }
    void this._rotationQuat;
  }

  lookAt(x: number | Vector3, y?: number, z?: number): this {
    const target = typeof x === 'number' ? _v2.set(x, y ?? 0, z ?? 0) : _v2.copy(x);
    this.updateWorldMatrix(true, false);
    _v1.setFromMatrixPosition(this.matrixWorld);
    const isLookTarget = (this as unknown as { isCamera?: boolean; isLight?: boolean }).isCamera === true ||
      (this as unknown as { isLight?: boolean }).isLight === true;
    if (isLookTarget) {
      _m1.lookAt(_v1, target, this.up);
    } else {
      _m1.lookAt(target, _v1, this.up);
    }
    this.quaternion.setFromRotationMatrix(_m1);
    this._rotationFromQuaternion = true;
    if (this.parent) {
      _m1.extractRotation(this.parent.matrixWorld);
      _q1.setFromRotationMatrix(_m1);
      this.quaternion.premultiply(_q1.invert());
    }
    return this;
  }

  // ------------------------------------------------------------------ misc --

  clone(recursive = true): this {
    const clone = new (this.constructor as new () => this)();
    clone.copy(this, recursive);
    return clone;
  }

  copy(source: Object3D, recursive = true): this {
    this.name = source.name;
    this.up.copy(source.up);
    this.position.copy(source.position);
    this.quaternion.copy(source.quaternion);
    this.rotation.copy(source.rotation);
    this.scale.copy(source.scale);
    this.matrix.copy(source.matrix);
    this.matrixWorld.copy(source.matrixWorld);
    this.matrixAutoUpdate = source.matrixAutoUpdate;
    this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate;
    this.visible = source.visible;
    this.castShadow = source.castShadow;
    this.receiveShadow = source.receiveShadow;
    this.renderOrder = source.renderOrder;
    this.frustumCulled = source.frustumCulled;
    this.layers.mask = source.layers.mask;
    this.userData = JSON.parse(JSON.stringify(source.userData)) as Record<string, unknown>;
    if (recursive) {
      for (const child of source.children) this.add(child.clone(true));
    }
    return this;
  }

  /** Recomputes the local transform from `position`/`quaternion`/`scale`. */
  setMatrixFromTransform(): this {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    return this;
  }

  dispose(): void {
    this.dispatchEvent('dispose', { target: this });
  }

  /** Overridden by `Mesh`, `Line`, `Points` and `Sprite`. */
  raycast(_raycaster: Raycaster, _intersects: Intersection[]): void {
    /* no-op for transform-only nodes */
  }

  toJSON(): Record<string, unknown> {
    return {
      metadata: { generator: 'mini3d.Object3D', version: 1 },
      type: this.type,
      uuid: this.uuid,
      name: this.name,
      position: this.position.toArray([]),
      quaternion: this.quaternion.toArray([]),
      scale: this.scale.toArray([]),
      visible: this.visible,
      children: this.children.map((c) => c.toJSON()),
    };
  }
}

/** Cheap RFC4122-ish id; only needs to be unique within a page. */
export function generateUuid(): string {
  const hex = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) out += '-';
    else if (i === 14) out += '4';
    else out += hex[(Math.random() * 16) | 0];
  }
  return out;
}

const _v1 = new Vector3();
const _v2 = new Vector3();
const _q1 = new Quat();
const _m1 = new Matrix4();
const _xAxis = new Vector3(1, 0, 0);
const _yAxis = new Vector3(0, 1, 0);
const _zAxis = new Vector3(0, 0, 1);
