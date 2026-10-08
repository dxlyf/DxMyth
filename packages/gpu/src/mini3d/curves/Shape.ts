import { Path } from './Path';
import { Vector2 } from '../math/Vector2';

/**
 * A `Path` that can contain holes.
 *
 * The enclosed area is the outer path minus every hole. `ShapeGeometry` walks
 * `extractPoints()` for the triangulation, so winding order is what distinguishes
 * material from hole: a hole should wind opposite to the outline.
 *
 * ```ts
 * const shape = new Shape();
 * shape.moveTo(-1, -1);
 * shape.lineTo(1, -1);
 * shape.lineTo(1, 1);
 * shape.lineTo(-1, 1);
 * shape.closePath();
 *
 * const hole = new Path();
 * hole.absarc(0, 0, 0.4, 0, Math.PI * 2, true);
 * shape.holes.push(hole);
 * ```
 */
export class Shape extends Path {
  readonly isShape = true;

  /** Sub-paths subtracted from the enclosed area. */
  holes: Path[] = [];

  constructor(points: Vector2[] = []) {
    super(points);
  }

  /**
   * Samples the outline and every hole.
   *
   * `divisions` is the number of samples per sub-curve, so a straight-edged
   * shape needs only 1 while arcs want more.
   */
  extractPoints(divisions = 12): { shape: Vector2[]; holes: Vector2[][] } {
    return {
      shape: this.getPoints(divisions).map((point) => new Vector2(point.x, point.y)),
      holes: this.holes.map((hole) =>
        hole.getPoints(divisions).map((point) => new Vector2(point.x, point.y)),
      ),
    };
  }

  /** Signed area of the outline, by the shoelace formula. */
  getArea(): number {
    const outline = this.getPoints(12);
    let area = 0;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      area += (outline[j].x + outline[i].x) * (outline[j].y - outline[i].y);
    }
    return area / 2;
  }

  override copy(source: this): this {
    super.copy(source);
    this.holes = source.holes.map((hole) => hole.clone() as Path);
    return this;
  }
}
