import { BufferGeometry } from '../core/BufferGeometry';

/** Vertex positions are compared at 4 decimal places (same as three.js). */
const POSITION_PRECISION = 1e4;

/** Rounded position key, so coincident vertices hash to the same edge. */
function vertexKey(x: number, y: number, z: number): string {
  return `${Math.round(x * POSITION_PRECISION)},${Math.round(y * POSITION_PRECISION)},${Math.round(z * POSITION_PRECISION)}`;
}

/**
 * Wireframe topology: a non-indexed line list (pairs of endpoints) holding one
 * segment per unique triangle edge of the source geometry. Unlike
 * `EdgesGeometry` there is no angle threshold and no border test — every edge of
 * every triangle is emitted once, deduplicated through a hash of the sorted
 * rounded vertex-position pair, so shared edges are not drawn twice.
 */
export class WireframeGeometry extends BufferGeometry {
  parameters: {
    geometry: BufferGeometry | null;
  };

  constructor(geometry: BufferGeometry | null = null) {
    super();
    this.name = 'WireframeGeometry';
    this.parameters = { geometry };

    const positions: number[] = [];

    const position = geometry ? geometry.getAttribute('position') : undefined;
    if (geometry && position) {
      const index = geometry.index;
      const indexCount = index ? index.count : position.count;
      const seen = new Set<string>();

      const pushEdge = (
        keyA: string,
        keyB: string,
        ax: number,
        ay: number,
        az: number,
        bx: number,
        by: number,
        bz: number,
      ): void => {
        // Undirected key: the two endpoints are sorted.
        const key = keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
        if (seen.has(key)) return;
        seen.add(key);
        positions.push(ax, ay, az, bx, by, bz);
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

        pushEdge(keyA, keyB, ax, ay, az, bx, by, bz);
        pushEdge(keyB, keyC, bx, by, bz, cx, cy, cz);
        pushEdge(keyC, keyA, cx, cy, cz, ax, ay, az);
      }
    }

    this.setPosition(positions);
    this.setDrawMode('lines');
  }
}
