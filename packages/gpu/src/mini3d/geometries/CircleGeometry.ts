import { BufferGeometry } from '../core/BufferGeometry';

/**
 * Circle topology: a disc in the XY plane facing +z, built as a triangle fan.
 * One centre vertex plus `segments + 1` rim vertices (the duplicated last rim
 * vertex closes the arc seam) are shared by all fan triangles, so the geometry
 * is indexed.
 *
 * UVs are the planar disc mapping: the centre is `(0.5, 0.5)` and a rim vertex
 * maps to `(x / radius + 1) / 2, (y / radius + 1) / 2`, i.e. the unit disc
 * inscribed in the 0..1 texture square.
 */
export class CircleGeometry extends BufferGeometry {
  parameters: {
    radius: number;
    segments: number;
    thetaStart: number;
    thetaLength: number;
  };

  constructor(radius = 1, segments = 32, thetaStart = 0, thetaLength = Math.PI * 2) {
    super();
    this.name = 'CircleGeometry';
    this.parameters = { radius, segments, thetaStart, thetaLength };

    // Clamp degenerate counts so the angular step never divides by zero.
    const seg = Math.max(3, Math.floor(segments));

    const positions: number[] = [0, 0, 0];
    const normals: number[] = [0, 0, 1];
    const uvs: number[] = [0.5, 0.5];
    const indices: number[] = [];

    for (let s = 0; s <= seg; s++) {
      const theta = thetaStart + (s / seg) * thetaLength;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      positions.push(x, y, 0);
      normals.push(0, 0, 1);
      uvs.push((x / radius + 1) / 2, (y / radius + 1) / 2);
    }

    // Counter-clockwise fan: rim vertex `i`, the next rim vertex, then centre.
    for (let i = 1; i <= seg; i++) {
      indices.push(i, i + 1, 0);
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}
