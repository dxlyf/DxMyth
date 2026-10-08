import { BufferGeometry } from '../core/BufferGeometry';

/**
 * Sphere topology: a lat/long grid of
 * `(widthSegments + 1) * (heightSegments + 1)` shared vertices (the duplicated
 * last column closes the azimuthal UV seam), stitched into counter-clockwise
 * quads that are split into two triangles each. Poles collapse to a single row
 * of coincident vertices, and the triangles that would be degenerate on a
 * closed pole row are simply not emitted — the `thetaStart` / `thetaLength`
 * test below keeps them when the sphere is an open shell.
 *
 * UVs: `u = azimuth / 2π` (0..1 around the equator) and `v = 1 - polar / π`
 * (1 at the +y pole, 0 at the -y pole). `u` is the plain spherical azimuth, so
 * every UV stays inside 0..1; no half-segment pole offset is applied.
 */
export class SphereGeometry extends BufferGeometry {
  parameters: {
    radius: number;
    widthSegments: number;
    heightSegments: number;
    phiStart: number;
    phiLength: number;
    thetaStart: number;
    thetaLength: number;
  };

  constructor(
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
  ) {
    super();
    this.name = 'SphereGeometry';
    this.parameters = {
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength,
    };

    // Clamp degenerate counts: at least a tetrahedron-ish fan and two rows.
    const widthSeg = Math.max(3, Math.floor(widthSegments));
    const heightSeg = Math.max(2, Math.floor(heightSegments));
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const grid: number[][] = [];

    let vertexIndex = 0;
    for (let iy = 0; iy <= heightSeg; iy++) {
      const row: number[] = [];
      const v = iy / heightSeg;
      const theta = thetaStart + v * thetaLength;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let ix = 0; ix <= widthSeg; ix++) {
        const u = ix / widthSeg;
        const phi = phiStart + u * phiLength;

        // Position on the (possibly partial) sphere.
        positions.push(
          -radius * Math.cos(phi) * sinTheta,
          radius * cosTheta,
          radius * Math.sin(phi) * sinTheta,
        );
        // The unit direction is the normal; it stays valid for radius = 0.
        normals.push(-Math.cos(phi) * sinTheta, cosTheta, Math.sin(phi) * sinTheta);
        uvs.push(u, 1 - v);

        row.push(vertexIndex++);
      }
      grid.push(row);
    }

    for (let iy = 0; iy < heightSeg; iy++) {
      for (let ix = 0; ix < widthSeg; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSeg - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
      }
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}
