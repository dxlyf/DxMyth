import { BufferGeometry } from '../core/BufferGeometry';

/** Parameter record of a plain `CylinderGeometry` (three.js parity). */
export interface CylinderGeometryParameters {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  thetaStart: number;
  thetaLength: number;
}

/**
 * Cylinder topology: a lathe with `heightSegments + 1` rings of
 * `radialSegments + 1` vertices (the duplicated last column closes the
 * azimuthal UV seam), stitched into counter-clockwise quads that are split into
 * two triangles each. Side normals carry the wall slope so tapered cylinders
 * shade correctly. Optional flat caps are triangle fans with one centre vertex
 * per segment, which is what lets the planar disc UV vary per cap triangle. The
 * cap triangles that would coincide with the ring of a zero-radius end are
 * skipped (that is how a cone gets its apex).
 *
 * Groups: 0 = side, 1 = top cap, 2 = bottom cap, matching three.js's material
 * layout.
 *
 * The parameter record is generic so that `ConeGeometry` — this same topology
 * with `radiusTop = 0` — can publish its own cone-shaped record.
 */
export class CylinderGeometry<
  P extends object = CylinderGeometryParameters,
> extends BufferGeometry {
  parameters: P;

  constructor(
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    radialSegments = 32,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
  ) {
    super();
    this.name = 'CylinderGeometry';

    // Clamp degenerate counts so every division below stays finite.
    const radialSeg = Math.max(3, Math.floor(radialSegments));
    const heightSeg = Math.max(1, Math.floor(heightSegments));
    const halfHeight = height / 2;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let vertexIndex = 0;

    // ---------------------------------------------------------------- torso --
    // Wall slope used to tilt the normals of a tapered cylinder.
    const slope = height !== 0 ? (radiusBottom - radiusTop) / height : 0;
    const grid: number[][] = [];

    for (let y = 0; y <= heightSeg; y++) {
      const row: number[] = [];
      const v = y / heightSeg;
      const radius = v * (radiusBottom - radiusTop) + radiusTop;

      for (let x = 0; x <= radialSeg; x++) {
        const u = x / radialSeg;
        const theta = u * thetaLength + thetaStart;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        positions.push(radius * sinTheta, -v * height + halfHeight, radius * cosTheta);

        const normalLength = Math.hypot(sinTheta, slope, cosTheta) || 1;
        normals.push(sinTheta / normalLength, slope / normalLength, cosTheta / normalLength);

        uvs.push(u, 1 - v);
        row.push(vertexIndex++);
      }
      grid.push(row);
    }

    let torsoCount = 0;
    for (let x = 0; x < radialSeg; x++) {
      for (let y = 0; y < heightSeg; y++) {
        const a = grid[y][x + 1];
        const b = grid[y][x];
        const c = grid[y + 1][x];
        const d = grid[y + 1][x + 1];

        // Skip the collapsed ring at a zero-radius end (cone apex).
        if (radiusTop > 0 || y !== 0) {
          indices.push(a, b, d);
          torsoCount += 3;
        }
        if (radiusBottom > 0 || y !== heightSeg - 1) {
          indices.push(b, c, d);
          torsoCount += 3;
        }
      }
    }
    this.addGroup(0, torsoCount, 0);

    // ----------------------------------------------------------------- caps --
    /** Builds a flat cap and returns how many indices it contributed. */
    const generateCap = (top: boolean): number => {
      const radius = top ? radiusTop : radiusBottom;
      const sign = top ? 1 : -1;

      // One centre vertex per segment: the planar disc UV differs per triangle.
      const centerIndexStart = vertexIndex;
      for (let x = 1; x <= radialSeg; x++) {
        positions.push(0, halfHeight * sign, 0);
        normals.push(0, sign, 0);
        uvs.push(0.5, 0.5);
        vertexIndex++;
      }
      const centerIndexEnd = vertexIndex;

      for (let x = 0; x <= radialSeg; x++) {
        const u = x / radialSeg;
        const theta = u * thetaLength + thetaStart;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        positions.push(radius * sinTheta, halfHeight * sign, radius * cosTheta);
        normals.push(0, sign, 0);
        uvs.push(cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5);
        vertexIndex++;
      }

      let count = 0;
      for (let x = 0; x < radialSeg; x++) {
        const c = centerIndexStart + x;
        const i = centerIndexEnd + x;
        if (top) {
          indices.push(i, i + 1, c);
        } else {
          indices.push(i + 1, i, c);
        }
        count += 3;
      }
      return count;
    };

    let groupStart = torsoCount;
    if (!openEnded && radiusTop > 0) {
      const topCount = generateCap(true);
      this.addGroup(groupStart, topCount, 1);
      groupStart += topCount;
    }
    if (!openEnded && radiusBottom > 0) {
      const bottomCount = generateCap(false);
      this.addGroup(groupStart, bottomCount, 2);
      groupStart += bottomCount;
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(indices);

    // `P` is `CylinderGeometryParameters` for a plain cylinder; `ConeGeometry`
    // narrows the very same field and overwrites it right after `super(...)`.
    this.parameters = {
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    } as P;
  }
}
