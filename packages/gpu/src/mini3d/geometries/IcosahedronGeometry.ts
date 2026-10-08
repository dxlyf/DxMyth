import { PolyhedronGeometry } from './PolyhedronGeometry';

/** Parameter record of an `IcosahedronGeometry` (three.js parity). */
export interface IcosahedronGeometryParameters {
  radius: number;
  detail: number;
}

/**
 * Icosahedron topology: the 12 vertices are the corners of three mutually
 * orthogonal golden rectangles, paired with the standard 20-triangle index
 * list. The base solid is then handed to `PolyhedronGeometry`, which
 * subdivides every face and projects the result onto the sphere of `radius`.
 */
export class IcosahedronGeometry extends PolyhedronGeometry<IcosahedronGeometryParameters> {
  constructor(radius = 1, detail = 0) {
    const t = (1 + Math.sqrt(5)) / 2;

    // Three orthogonal golden rectangles: the 12 corners of an icosahedron.
    const vertices: number[] = [
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
      0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
      t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1,
    ];

    const indices: number[] = [
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
      1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
      3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
      4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
    ];

    super(vertices, indices, radius, detail);
    this.name = 'IcosahedronGeometry';
    this.parameters = { radius, detail };
  }
}
