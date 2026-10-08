import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';

/** A triangle's vertex normals (and optionally colours) used by raycast hits. */
export interface Face {
  a: number;
  b: number;
  c: number;
  normal: Vector3;
  vertexNormals: Vector3[];
  materialIndex?: number;
}

/** Camera surface the raycaster needs; avoids a circular type import. */
export interface RaycastCamera {
  isPerspectiveCamera?: boolean;
  isOrthographicCamera?: boolean;
  matrixWorld: { elements: ArrayLike<number> };
  unproject(vector: Vector3, target?: Vector3): Vector3;
  getWorldPosition(target?: Vector3): Vector3;
  getWorldDirection(target?: Vector3): Vector3;
}

/** Re-exported so geometry code can build hits without importing the raycaster. */
export interface RaycastHit {
  distance: number;
  point: Vector3;
  index?: number;
  face: Face | null;
  uv?: Vector2;
  barycoord?: Vector3;
}
