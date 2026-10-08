import { BufferGeometry } from '../core/BufferGeometry';
import { clamp } from '../math/MathUtils';

/** Parameter record of a plain `PolyhedronGeometry` (three.js parity). */
export interface PolyhedronGeometryParameters {
  vertices: number[];
  indices: number[];
  radius: number;
  detail: number;
}

/** A single point of the temporary subdivision grid. */
type Point3 = [number, number, number];

/**
 * Polyhedron topology: the base polyhedron is given as a shared vertex list
 * plus a triangle index list. Every base triangle is subdivided on a uniform
 * triangular grid — `detail` rounds of midpoint splitting, which is exactly the
 * `(detail + 1) x (detail + 1)` grid built below — and every generated point is
 * then re-projected onto the sphere of the requested radius. The result is
 * deliberately non-indexed (each sub-triangle owns its three vertices), which
 * is what three.js does for polyhedra.
 *
 * Normals are the normalised positions, so the polyhedron approximates a smooth
 * sphere. UVs come from the spherical direction of each vertex:
 * `u = azimuth / 2π + 0.5` and `v = polar / π`.
 *
 * The parameter record is generic so `IcosahedronGeometry` can publish its own
 * `{ radius, detail }` record.
 */
export class PolyhedronGeometry<
  P extends object = PolyhedronGeometryParameters,
> extends BufferGeometry {
  parameters: P;

  constructor(vertices: number[] = [], indices: number[] = [], radius = 1, detail = 0) {
    super();
    this.name = 'PolyhedronGeometry';

    const detailLevel = Math.max(0, Math.floor(detail));
    const cols = detailLevel + 1;

    const positions: number[] = [];

    for (let i = 0; i + 2 < indices.length; i += 3) {
      const a = baseVertex(vertices, indices[i]);
      const b = baseVertex(vertices, indices[i + 1]);
      const c = baseVertex(vertices, indices[i + 2]);
      subdivideFace(a, b, c, cols, positions);
    }

    // Project the subdivided points onto the sphere of the given radius.
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const scale = radius / (Math.hypot(x, y, z) || 1);
      positions[i] = x * scale;
      positions[i + 1] = y * scale;
      positions[i + 2] = z * scale;
    }

    const normals: number[] = [];
    const uvs: number[] = [];
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const length = Math.hypot(x, y, z) || 1;
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;

      normals.push(nx, ny, nz);

      // Angle around the +y axis, counter-clockwise seen from above.
      const azimuth = Math.atan2(nz, -nx);
      // Angle away from the +y pole.
      const polar = Math.acos(clamp(ny, -1, 1));
      uvs.push(azimuth / (2 * Math.PI) + 0.5, polar / Math.PI);
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);

    // `P` is `PolyhedronGeometryParameters` for a raw polyhedron;
    // `IcosahedronGeometry` narrows the same field right after `super(...)`.
    this.parameters = { vertices, indices, radius, detail } as P;
  }
}

/** Reads the `index`-th vertex out of the flat `[x, y, z, ...]` list. */
function baseVertex(vertices: number[], index: number): Point3 {
  const offset = index * 3;
  return [vertices[offset], vertices[offset + 1], vertices[offset + 2]];
}

/** Linear interpolation between two points. */
function lerpPoint(a: Point3, b: Point3, t: number): Point3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function pushPoint(positions: number[], point: Point3): void {
  positions.push(point[0], point[1], point[2]);
}

/**
 * Splits one triangle into `cols * cols` sub-triangles. Row `i` runs along the
 * `a -> c` edge and the row shrinks towards `b`, which is the uniform
 * (midpoint) triangular subdivision. Triangle winding is inherited from the
 * base triangle.
 */
function subdivideFace(a: Point3, b: Point3, c: Point3, cols: number, positions: number[]): void {
  const grid: Point3[][] = [];

  for (let i = 0; i <= cols; i++) {
    const t = i / cols;
    const rowA = lerpPoint(a, c, t);
    const rowB = lerpPoint(b, c, t);
    const rows = cols - i;

    const row: Point3[] = [];
    for (let j = 0; j <= rows; j++) {
      // `rows === 0` only happens for the single tip of the last row.
      row.push(j === 0 && i === cols ? rowA : lerpPoint(rowA, rowB, j / rows));
    }
    grid.push(row);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < 2 * (cols - i) - 1; j++) {
      const k = Math.floor(j / 2);
      if (j % 2 === 0) {
        pushPoint(positions, grid[i][k + 1]);
        pushPoint(positions, grid[i + 1][k]);
        pushPoint(positions, grid[i][k]);
      } else {
        pushPoint(positions, grid[i][k + 1]);
        pushPoint(positions, grid[i + 1][k + 1]);
        pushPoint(positions, grid[i + 1][k]);
      }
    }
  }
}
