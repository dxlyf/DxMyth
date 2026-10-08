import { BufferGeometry } from '../core/BufferGeometry';
import { DEG2RAD } from '../math/MathUtils';
import { Vector3 } from '../math/Vector3';

/** Vertex positions are compared at 4 decimal places (same as three.js). */
const POSITION_PRECISION = 1e4;

/** Rounded position key, so coincident vertices hash to the same edge. */
function vertexKey(x: number, y: number, z: number): string {
  return `${Math.round(x * POSITION_PRECISION)},${Math.round(y * POSITION_PRECISION)},${Math.round(z * POSITION_PRECISION)}`;
}

/** One undirected edge plus the normals of the faces that share it. */
interface EdgeRecord {
  points: [number, number, number, number, number, number];
  normals: Vector3[];
}

/**
 * Edges topology: a non-indexed line list (pairs of endpoints) holding only the
 * "hard" edges of a source geometry — an edge shared by exactly one triangle
 * (a border), or by two triangles whose face normals differ by more than
 * `thresholdAngle` degrees. Edges shared by more than two triangles are dropped.
 *
 * The edge map is keyed by the sorted, rounded vertex-position pair, so it does
 * not depend on how the source geometry indexes its vertices.
 */
export class EdgesGeometry extends BufferGeometry {
  parameters: {
    geometry: BufferGeometry | null;
    thresholdAngle: number;
  };

  constructor(geometry: BufferGeometry | null = null, thresholdAngle = 1) {
    super();
    this.name = 'EdgesGeometry';
    this.parameters = { geometry, thresholdAngle };

    const positions: number[] = [];

    const position = geometry ? geometry.getAttribute('position') : undefined;
    if (geometry && position) {
      const index = geometry.index;
      const indexCount = index ? index.count : position.count;
      const thresholdDot = Math.cos(DEG2RAD * thresholdAngle);
      const edges = new Map<string, EdgeRecord>();

      const addEdge = (
        keyA: string,
        keyB: string,
        ax: number,
        ay: number,
        az: number,
        bx: number,
        by: number,
        bz: number,
        faceNormal: Vector3,
      ): void => {
        // Undirected key: the two endpoints are sorted.
        const key = keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
        const existing = edges.get(key);
        if (existing) {
          existing.normals.push(faceNormal);
        } else {
          edges.set(key, { points: [ax, ay, az, bx, by, bz], normals: [faceNormal] });
        }
      };

      for (let t = 0; t < indexCount; t += 3) {
        const i0 = index ? index.array[t] : t;
        const i1 = index ? index.array[t + 1] : t + 1;
        const i2 = index ? index.array[t + 2] : t + 2;

        const ax = position.getX(i0);
        const ay = position.getY(i0);
        const az = position.getZ(i0);
        const bx = position.getX(i1);
        const by = position.getY(i1);
        const bz = position.getZ(i1);
        const cx = position.getX(i2);
        const cy = position.getY(i2);
        const cz = position.getZ(i2);

        const keyA = vertexKey(ax, ay, az);
        const keyB = vertexKey(bx, by, bz);
        const keyC = vertexKey(cx, cy, cz);

        // Degenerate triangles (coincident corners) carry no useful normal.
        if (keyA === keyB || keyB === keyC || keyC === keyA) continue;

        // Face normal, same convention as `BufferGeometry.computeVertexNormals`.
        const cbx = cx - bx;
        const cby = cy - by;
        const cbz = cz - bz;
        const abx = ax - bx;
        const aby = ay - by;
        const abz = az - bz;
        const nx = cby * abz - cbz * aby;
        const ny = cbz * abx - cbx * abz;
        const nz = cbx * aby - cby * abx;
        const normalLength = Math.hypot(nx, ny, nz);
        if (normalLength === 0) continue;
        const faceNormal = new Vector3(nx / normalLength, ny / normalLength, nz / normalLength);

        addEdge(keyA, keyB, ax, ay, az, bx, by, bz, faceNormal);
        addEdge(keyB, keyC, bx, by, bz, cx, cy, cz, faceNormal);
        addEdge(keyC, keyA, cx, cy, cz, ax, ay, az, faceNormal);
      }

      // Emit borders and edges whose two faces are angled beyond the threshold.
      for (const edge of edges.values()) {
        const normals = edge.normals;
        let visible = false;
        if (normals.length === 1) {
          visible = true;
        } else if (normals.length === 2) {
          visible = normals[0].dot(normals[1]) < thresholdDot;
        }
        if (visible) positions.push(...edge.points);
      }
    }

    this.setPosition(positions);
    this.setDrawMode('lines');
  }
}
