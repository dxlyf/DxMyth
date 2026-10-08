import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Ray } from '../math/Ray';
import type { Object3D } from './Object3D';
import type { Face, RaycastCamera } from './BufferGeometryTypes';

/** A single raycast hit. */
export interface Intersection {
  /** Distance along the ray. */
  distance: number;
  /** Hit point in world space. */
  point: Vector3;
  /** The object that was hit. */
  object: Object3D;
  /** Index of the first vertex of the hit triangle/segment (when applicable). */
  index?: number;
  /** Face normal in world space. */
  face: Face | null;
  /** Interpolated uv at the hit point (when the geometry has uvs). */
  uv?: Vector2;
  /** Barycentric coordinate of the hit. */
  barycoord?: Vector3;
}

/**
 * CPU raycaster. Takes NDC coordinates, unprojects them through the camera and
 * intersects every `Mesh`/`Line`/`Points` below the given root.
 *
 * ```ts
 * const raycaster = new Raycaster();
 * raycaster.setFromCamera({ x: 0, y: 0 }, camera);
 * const hits = raycaster.intersectObjects(scene.children, true);
 * ```
 */
export class Raycaster {
  ray: Ray;
  near: number;
  far: number;
  /** Thresholds used by `Line`/`Points` intersection tests. */
  params: {
    Line: { threshold: number };
    Points: { threshold: number };
    Mesh: Record<string, never>;
  };
  /** Optional layer mask; objects whose layers do not overlap are skipped. */
  layers: { mask: number; test(layers: { mask: number }): boolean };

  constructor(origin?: Vector3, direction?: Vector3, near = 0, far = Infinity) {
    this.ray = new Ray(origin, direction);
    this.near = near;
    this.far = far;
    this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      Points: { threshold: 1 },
    };
    this.layers = {
      mask: 0xffffffff,
      test(layers: { mask: number }) {
        return (this.mask & layers.mask) !== 0;
      },
    };
  }

  set(origin: Vector3, direction: Vector3): this {
    this.ray.set(origin, direction);
    return this;
  }

  /**
   * Builds the ray from a camera. `coords` are normalised device coordinates
   * with +Y up, matching the WebGL clip-space convention.
   */
  setFromCamera(coords: { x: number; y: number }, camera: RaycastCamera): this {
    if (camera.isPerspectiveCamera) {
      this.ray.origin.copy(camera.getWorldPosition(_origin));
      this.ray.direction
        .set(coords.x, coords.y, 0.5)
        .unproject(camera as never)
        .sub(this.ray.origin)
        .normalize();
    } else if (camera.isOrthographicCamera) {
      this.ray.origin.set(coords.x, coords.y, -1).unproject(camera as never);
      this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
    } else {
      throw new Error('mini3d.Raycaster.setFromCamera: unsupported camera type');
    }
    return this;
  }

  /** Intersects a single object (and its children when `recursive`). */
  intersectObject(object: Object3D, recursive = true, intersects: Intersection[] = []): Intersection[] {
    return this.intersectObjects([object], recursive, intersects);
  }

  /**
   * Intersects a list of roots and returns the hits sorted near-to-far.
   *
   * World matrices are refreshed first: picking must not depend on a render
   * having already happened this frame, so `updateMatrixWorld()` runs on each
   * root before the traversal. It is a no-op for any node whose transform has
   * not changed, so calling this every frame (or several times per frame) stays
   * cheap.
   */
  intersectObjects(
    objects: Object3D[],
    recursive = true,
    intersects: Intersection[] = [],
  ): Intersection[] {
    for (const object of objects) object.updateMatrixWorld();
    for (const object of objects) collectIntersections(object, this, intersects, recursive);
    intersects.sort(ascendingDistance);
    return intersects;
  }
}

function ascendingDistance(a: Intersection, b: Intersection): number {
  return a.distance - b.distance;
}

function collectIntersections(
  object: Object3D,
  raycaster: Raycaster,
  intersects: Intersection[],
  recursive: boolean,
): void {
  if (object.layers.test(raycaster.layers)) object.raycast(raycaster, intersects);
  if (recursive) {
    for (const child of object.children) collectIntersections(child, raycaster, intersects, true);
  }
}

const _origin = new Vector3();
