import { BufferGeometry } from '../core/BufferGeometry';
import { Path } from '../curves/Path';
import { Shape } from '../curves/Shape';
import { Vector2 } from '../math/Vector2';
import { signedArea, triangulate } from './triangulate';

/**
 * Triangulates a `Shape` (or a closed `Path`) into a filled, flat mesh in the XY
 * plane facing `+z`.
 *
 * Holes are handled by bridging: each hole ring is cut into the outline along the
 * shortest connecting edge, which turns "polygon with holes" into a single
 * simple polygon the ear-clipping pass can consume. This is the same approach
 * `earcut`-based pipelines use, minus the dependency.
 *
 * ```ts
 * const shape = new Shape();
 * shape.absarc(0, 0, 1, 0, Math.PI * 2, false);
 * const geometry = new ShapeGeometry(shape, 64);
 * ```
 */
export class ShapeGeometry extends BufferGeometry {
  readonly isShapeGeometry = true;

  parameters: { divisions: number; curveSegments: number };

  constructor(shape: Shape | Path, curveSegments = 12) {
    super();
    this.name = 'ShapeGeometry';

    const divisions = Math.max(1, Math.floor(curveSegments));
    this.parameters = { divisions, curveSegments: divisions };

    const holes = shape instanceof Shape ? shape.holes : [];
    const outline = shape.getPoints(divisions).map((point) => new Vector2(point.x, point.y));
    const holeRings = holes.map((hole) =>
      hole.getPoints(divisions).map((point) => new Vector2(point.x, point.y)),
    );

    const polygon = holeRings.length > 0 ? bridgeHoles(outline, holeRings) : outline;

    // `triangulate` returns indices into the polygon it was given, so the vertex
    // list has to be that same polygon.
    const indices = triangulate(polygon);
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    // Planar UVs need a bounding box; a zero-extent axis would divide by zero.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const point of polygon) {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
    }
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    for (const point of polygon) {
      positions.push(point.x, point.y, 0);
      normals.push(0, 0, 1);
      uvs.push((point.x - minX) / spanX, (point.y - minY) / spanY);
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(
      polygon.length > 65535 ? new Uint32Array(indices) : new Uint16Array(indices),
    );
  }
}

/**
 * Cuts each hole into the outline so the result is one simple polygon.
 *
 * For every hole, the pair of vertices (one on the outline, one on the hole) with
 * the smallest distance is found and the hole is spliced in there. Splicing
 * duplicates both vertices, which creates the zero-width channel the
 * triangulator then treats as an ordinary concave edge.
 *
 * Exported because `StrokeGeometry` needs the same operation for a closed path:
 * the ribbon there is an annulus (outer offset ring minus inner offset ring), and
 * filling the two rings separately would shade the hole too.
 */
export function bridgeHoles(outline: Vector2[], holes: Vector2[][]): Vector2[] {
  // The outline must be counter-clockwise for the channels to cut inwards.
  let result = ensureCounterClockwise(outline);

  for (const rawHole of holes) {
    // Holes wind the other way, so the channel does not fold back on itself.
    const hole = ensureClockwise(rawHole);
    if (hole.length < 3) continue;

    let bestOutlineIndex = 0;
    let bestHoleIndex = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < hole.length; j++) {
        const dx = result[i].x - hole[j].x;
        const dy = result[i].y - hole[j].y;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestOutlineIndex = i;
          bestHoleIndex = j;
        }
      }
    }

    // Splice: outline up to the bridge point, the hole from the bridge point all
    // the way round back to it, then the outline again.
    const spliced: Vector2[] = [];
    for (let i = 0; i <= bestOutlineIndex; i++) spliced.push(result[i].clone());
    for (let k = 0; k < hole.length; k++) {
      spliced.push(hole[(bestHoleIndex + k) % hole.length].clone());
    }
    spliced.push(hole[bestHoleIndex].clone());
    for (let i = bestOutlineIndex; i < result.length; i++) spliced.push(result[i].clone());
    result = spliced;
  }

  return result;
}

function ensureCounterClockwise(points: Vector2[]): Vector2[] {
  // `signedArea` reports counter-clockwise as negative.
  return signedArea(points) > 0 ? [...points].reverse() : [...points];
}

function ensureClockwise(points: Vector2[]): Vector2[] {
  return signedArea(points) < 0 ? [...points].reverse() : [...points];
}



