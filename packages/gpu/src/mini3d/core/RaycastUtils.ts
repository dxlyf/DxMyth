import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Triangle } from '../math/Triangle';
import type { Raycaster, Intersection } from './Raycaster';
import type { BufferAttribute } from './BufferAttribute';
import type { BufferGeometry } from './BufferGeometry';

/**
 * Ray/geometry kernels shared by `Mesh`, `Line` and `Points`.
 *
 * All of them work in object space against the geometry's attribute arrays and
 * transform the resulting point into world space, which keeps the triangle
 * maths allocation free.
 */

/** Fresh hit point in world space for the current candidate. */
export function makeHit(
  raycaster: Raycaster,
  worldPoint: Vector3,
  object: Intersection['object'],
  index: number,
): Intersection {
  const point = worldPoint.clone();
  return {
    distance: raycaster.ray.origin.distanceTo(point),
    point,
    object,
    index,
    face: null,
  };
}

/** Interpolates a vec2 attribute with barycentric weights. */
export function interpolateUv(
  attribute: BufferAttribute | undefined,
  a: number,
  b: number,
  c: number,
  bary: Vector3,
): Vector2 | undefined {
  if (!attribute) return undefined;
  const size = attribute.itemSize;
  const array = attribute.array;
  return new Vector2(
    array[a * size] * bary.x + array[b * size] * bary.y + array[c * size] * bary.z,
    array[a * size + 1] * bary.x + array[b * size + 1] * bary.y + array[c * size + 1] * bary.z,
  );
}

/**
 * Möller–Trumbore against one triangle, in **world space**.
 *
 * The geometry's vertices are transformed into world space before the test, so
 * the world-space ray can be used unchanged. Testing in object space instead
 * would require transforming the ray (and its direction, under non-uniform
 * scale) into object space, and it silently breaks for any object that is not at
 * the origin.
 *
 * Returns the barycentric coordinate on success, `null` on a miss.
 */
export function triangleHit(
  raycaster: Raycaster,
  geometry: BufferGeometry,
  ia: number,
  ib: number,
  ic: number,
  worldMatrix: { elements: ArrayLike<number> },
  localPoint: Vector3,
  bary: Vector3,
): boolean {
  const position = geometry.attributes.position;
  if (!position) return false;
  const positions = position.array;
  _a.fromArray(positions, ia * position.itemSize).applyMatrix4(worldMatrix as never);
  _b.fromArray(positions, ib * position.itemSize).applyMatrix4(worldMatrix as never);
  _c.fromArray(positions, ic * position.itemSize).applyMatrix4(worldMatrix as never);

  const origin = raycaster.ray.origin;
  const direction = raycaster.ray.direction;

  _edge1.subVectors(_b, _a);
  _edge2.subVectors(_c, _a);
  _pv.crossVectors(direction, _edge2);
  const det = _edge1.dot(_pv);
  if (Math.abs(det) < 1e-10) return false;
  const invDet = 1 / det;

  _tv.subVectors(origin, _a);
  const u = _tv.dot(_pv) * invDet;
  if (u < 0 || u > 1) return false;

  _qv.crossVectors(_tv, _edge1);
  const v = direction.dot(_qv) * invDet;
  if (v < 0 || u + v > 1) return false;

  const t = _edge2.dot(_qv) * invDet;
  if (t < raycaster.near || t > raycaster.far) return false;

  // The hit point is already in world space.
  localPoint.copy(direction).multiplyScalar(t).add(origin);
  bary.set(1 - u - v, u, v);
  return true;
}

/** Distance from the ray to a point, used by point/line threshold tests. */
export function rayDistanceToPoint(
  raycaster: Raycaster,
  localPoint: Vector3,
  worldMatrix: { elements: ArrayLike<number> },
): { distance: number; point: Vector3 } {
  const world = localPoint.clone().applyMatrix4(worldMatrix as never);
  const distance = Math.sqrt(raycaster.ray.distanceSqToPoint(world));
  return { distance, point: world };
}

/**
 * Builds the `Face` record for a triangle hit.
 *
 * `triangleHit` works in world space, so the vertices and normals arrive there
 * too and no further transform is applied here. A rotation affects the face
 * normal but not the object-space vertex normals, which are reported as authored
 * (matching three.js).
 */
export function buildFace(
  geometry: BufferGeometry,
  ia: number,
  ib: number,
  ic: number,
  bary: Vector3,
): Intersection['face'] {
  const normalAttribute = geometry.attributes.normal;
  const normal = Triangle.getNormal(_a, _b, _c, new Vector3());
  if (!normalAttribute) {
    return { a: ia, b: ib, c: ic, normal, vertexNormals: [] };
  }
  const size = normalAttribute.itemSize;
  const array = normalAttribute.array;
  _na.fromArray(array, ia * size);
  _nb.fromArray(array, ib * size);
  _nc.fromArray(array, ic * size);
  // Barycentric weights are (1-u-v, u, v) in the same order as the vertices.
  const vertexNormals = [_na.clone(), _nb.clone(), _nc.clone()];
  return { a: ia, b: ib, c: ic, normal, vertexNormals };
}

const _a = new Vector3();
const _b = new Vector3();
const _c = new Vector3();
const _edge1 = new Vector3();
const _edge2 = new Vector3();
const _pv = new Vector3();
const _qv = new Vector3();
const _tv = new Vector3();
const _na = new Vector3();
const _nb = new Vector3();
const _nc = new Vector3();
