import { BufferGeometry } from '../core/BufferGeometry';

/**
 * Ring (annulus) topology: `phiSegments + 1` concentric rings of
 * `thetaSegments + 1` shared vertices in the XY plane, facing +z. The
 * duplicated last column closes the angular seam; each quad between two rings
 * is split into two counter-clockwise triangles.
 *
 * UVs use the planar disc mapping of the outer radius:
 * `(x / outerRadius + 1) / 2, (y / outerRadius + 1) / 2`, so the annulus is
 * inscribed in the 0..1 texture square exactly like three.js.
 */
export class RingGeometry extends BufferGeometry {
  parameters: {
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;
    thetaStart: number;
    thetaLength: number;
  };

  constructor(
    innerRadius = 0.5,
    outerRadius = 1,
    thetaSegments = 32,
    phiSegments = 1,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
  ) {
    super();
    this.name = 'RingGeometry';
    this.parameters = {
      innerRadius,
      outerRadius,
      thetaSegments,
      phiSegments,
      thetaStart,
      thetaLength,
    };

    // Clamp degenerate counts so the steps never divide by zero.
    const thetaSeg = Math.max(3, Math.floor(thetaSegments));
    const phiSeg = Math.max(1, Math.floor(phiSegments));

    const radiusStep = (outerRadius - innerRadius) / phiSeg;
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    let radius = innerRadius;
    for (let j = 0; j <= phiSeg; j++) {
      for (let i = 0; i <= thetaSeg; i++) {
        const theta = thetaStart + (i / thetaSeg) * thetaLength;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);

        positions.push(x, y, 0);
        normals.push(0, 0, 1);
        uvs.push((x / outerRadius + 1) / 2, (y / outerRadius + 1) / 2);
      }
      // Rings are generated inside-out.
      radius += radiusStep;
    }

    for (let j = 0; j < phiSeg; j++) {
      const ringOffset = j * (thetaSeg + 1);
      for (let i = 0; i < thetaSeg; i++) {
        const a = ringOffset + i;
        const b = ringOffset + i + thetaSeg + 1;
        const c = ringOffset + i + thetaSeg + 2;
        const d = ringOffset + i + 1;
        indices.push(a, b, d, b, c, d);
      }
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);
  }
}
