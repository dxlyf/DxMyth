import { BufferGeometry } from '../core/BufferGeometry';

/**
 * Plane topology: a single flat quad grid lying in the XY plane and facing +z.
 * An `(widthSegments + 1) * (heightSegments + 1)` lattice of shared vertices,
 * stitched into counter-clockwise quads (two triangles each), so the geometry is
 * indexed and only the grid seams are duplicated.
 *
 * UVs follow the three.js convention: `uv.x` grows with the x axis (0 at the
 * left edge) and `uv.y = 1 - iy / heightSegments`, so the first grid row — the
 * one at `+height / 2` — carries `v = 1` (top-left origin).
 */
export class PlaneGeometry extends BufferGeometry {
  parameters: {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
  };

  constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    super();
    this.name = 'PlaneGeometry';
    this.parameters = { width, height, widthSegments, heightSegments };

    // Clamp degenerate counts so the segment sizes never divide by zero.
    const gridX = Math.max(1, Math.floor(widthSegments));
    const gridY = Math.max(1, Math.floor(heightSegments));
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf;
      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf;
        // The grid is laid out top-to-bottom, hence the negated y.
        positions.push(x, -y, 0);
        normals.push(0, 0, 1);
        uvs.push(ix / gridX, 1 - iy / gridY);
      }
    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = ix + 1 + gridX1 * (iy + 1);
        const d = ix + 1 + gridX1 * iy;
        indices.push(a, b, d, b, c, d);
      }
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}
