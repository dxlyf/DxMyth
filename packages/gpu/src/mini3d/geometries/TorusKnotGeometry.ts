import { BufferGeometry } from '../core/BufferGeometry';
import { Vector3 } from '../math/Vector3';

/**
 * Torus knot topology: a tube swept along the `(p, q)` torus-knot curve. For
 * every one of the `tubularSegments + 1` positions along the curve the sweep
 * frame is rebuilt from two nearby curve points (tangent plus the summed
 * position gives the bitangent/normal pair), then `radialSegments + 1` tube
 * vertices are placed on that frame. The duplicated last row and column close
 * the tube and the curve seam, and the grid is stitched into counter-clockwise
 * quads split into two triangles each.
 *
 * Normals point radially away from the curve; UVs wrap 0..1 along the curve
 * (`u`) and around the tube (`v`).
 */
export class TorusKnotGeometry extends BufferGeometry {
  parameters: {
    radius: number;
    tube: number;
    tubularSegments: number;
    radialSegments: number;
    p: number;
    q: number;
  };

  constructor(
    radius = 1,
    tube = 0.4,
    tubularSegments = 64,
    radialSegments = 8,
    p = 2,
    q = 3,
  ) {
    super();
    this.name = 'TorusKnotGeometry';
    this.parameters = { radius, tube, tubularSegments, radialSegments, p, q };

    // Clamp degenerate counts: a knot needs a real tube and a real loop.
    const tubularSeg = Math.max(3, Math.floor(tubularSegments));
    const radialSeg = Math.max(3, Math.floor(radialSegments));
    const knotP = p !== 0 ? p : 1;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const p1 = new Vector3();
    const p2 = new Vector3();
    const tangent = new Vector3();
    const bitangent = new Vector3();
    // Frame normal of the curve; kept separate from the vertex normal below,
    // otherwise the second tube vertex of a ring would corrupt the frame.
    const frameNormal = new Vector3();
    const vertexNormal = new Vector3();
    const vertex = new Vector3();

    for (let i = 0; i <= tubularSeg; i++) {
      // Parameter along the knot curve.
      const u = (i / tubularSeg) * knotP * Math.PI * 2;

      pointOnCurve(u, knotP, q, radius, p1);
      pointOnCurve(u + 0.01, knotP, q, radius, p2);

      // Orthonormal frame of the curve at `p1`.
      tangent.subVectors(p2, p1);
      frameNormal.addVectors(p2, p1);
      bitangent.crossVectors(tangent, frameNormal);
      frameNormal.crossVectors(bitangent, tangent);
      bitangent.normalize();
      frameNormal.normalize();

      for (let j = 0; j <= radialSeg; j++) {
        const v = (j / radialSeg) * Math.PI * 2;
        // Negated cos so the tube faces outwards.
        const cx = -tube * Math.cos(v);
        const cy = tube * Math.sin(v);

        vertex.set(
          p1.x + cx * frameNormal.x + cy * bitangent.x,
          p1.y + cx * frameNormal.y + cy * bitangent.y,
          p1.z + cx * frameNormal.z + cy * bitangent.z,
        );
        positions.push(vertex.x, vertex.y, vertex.z);

        vertexNormal.subVectors(vertex, p1).normalize();
        normals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);

        uvs.push(i / tubularSeg, j / radialSeg);
      }
    }

    for (let j = 1; j <= tubularSeg; j++) {
      for (let i = 1; i <= radialSeg; i++) {
        const a = (radialSeg + 1) * (j - 1) + (i - 1);
        const b = (radialSeg + 1) * j + (i - 1);
        const c = (radialSeg + 1) * j + i;
        const d = (radialSeg + 1) * (j - 1) + i;
        indices.push(a, b, d, b, c, d);
      }
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}

/**
 * Position on the torus knot curve at parameter `u`, written into `target`
 * (the standard `(2 + cos(q/p * u)) / 2` construction).
 */
function pointOnCurve(u: number, p: number, q: number, radius: number, target: Vector3): Vector3 {
  const cosU = Math.cos(u);
  const sinU = Math.sin(u);
  const qOverP = (q / p) * u;
  const cosQ = Math.cos(qOverP);

  target.x = radius * (2 + cosQ) * 0.5 * cosU;
  target.y = radius * (2 + cosQ) * sinU * 0.5;
  target.z = radius * Math.sin(qOverP) * 0.5;
  return target;
}
