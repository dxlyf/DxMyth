import { BufferGeometry } from '../core/BufferGeometry';

/**
 * Torus topology: a `(radialSegments + 1) x (tubularSegments + 1)` grid of
 * shared vertices in the XY plane (the torus' axis of revolution is z), stitched
 * into counter-clockwise quads split into two triangles each. The duplicated
 * last row and column close the tube seam and the ring seam respectively.
 *
 * Normals are the direction from the tube centre circle to the vertex, so the
 * surface shades smoothly all the way around. UVs wrap 0..1 in both directions:
 * `u` around the ring (`arc`), `v` around the tube.
 */
export class TorusGeometry extends BufferGeometry {
  parameters: {
    radius: number;
    tube: number;
    radialSegments: number;
    tubularSegments: number;
    arc: number;
  };

  constructor(
    radius = 1,
    tube = 0.4,
    radialSegments = 12,
    tubularSegments = 48,
    arc = Math.PI * 2,
  ) {
    super();
    this.name = 'TorusGeometry';
    this.parameters = { radius, tube, radialSegments, tubularSegments, arc };

    // Clamp degenerate counts so both seams are real loops.
    const radialSeg = Math.max(3, Math.floor(radialSegments));
    const tubularSeg = Math.max(3, Math.floor(tubularSegments));

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let j = 0; j <= radialSeg; j++) {
      for (let i = 0; i <= tubularSeg; i++) {
        const u = (i / tubularSeg) * arc;
        const v = (j / radialSeg) * Math.PI * 2;

        const cosV = Math.cos(v);
        const ringRadius = radius + tube * cosV;
        const x = ringRadius * Math.cos(u);
        const y = ringRadius * Math.sin(u);
        const z = tube * Math.sin(v);
        positions.push(x, y, z);

        // Tube centre for this ring position; the normal points away from it.
        const centerX = radius * Math.cos(u);
        const centerY = radius * Math.sin(u);
        const nx = x - centerX;
        const ny = y - centerY;
        const nz = z;
        const normalLength = Math.hypot(nx, ny, nz) || 1;
        normals.push(nx / normalLength, ny / normalLength, nz / normalLength);

        uvs.push(i / tubularSeg, j / radialSeg);
      }
    }

    for (let j = 1; j <= radialSeg; j++) {
      for (let i = 1; i <= tubularSeg; i++) {
        const a = (tubularSeg + 1) * j + i - 1;
        const b = (tubularSeg + 1) * (j - 1) + i - 1;
        const c = (tubularSeg + 1) * (j - 1) + i;
        const d = (tubularSeg + 1) * j + i;
        indices.push(a, b, d, b, c, d);
      }
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}
