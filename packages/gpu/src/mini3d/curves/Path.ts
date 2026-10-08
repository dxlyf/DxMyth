import { CurvePath } from './CurvePath';
import {
  CubicBezierCurve,
  EllipseCurve,
  LineCurve,
  QuadraticBezierCurve,
  SplineCurve,
} from './Curves';
import { Vector2 } from '../math/Vector2';

/**
 * A 2D path built the way a canvas path is: `moveTo`, `lineTo`, the curve
 * commands, and `arc`.
 *
 * The current point is `points[points.length - 1]`, so a path is exactly its
 * command list plus the points those commands produced. Nothing is drawn until a
 * geometry generator consumes it — `ShapeGeometry` fills it, `StrokeGeometry`
 * outlines it.
 *
 * ```ts
 * const path = new Path();
 * path.moveTo(0, 0);
 * path.lineTo(1, 0);
 * path.quadraticCurveTo(1.5, 0.5, 1, 1);
 * path.closePath();
 * ```
 */
export class Path extends CurvePath<Vector2> {
  readonly isPath = true;

  /** Latest command, three.js-style; handy when replaying a path. */
  currentPoint = new Vector2();

  /** Curve resolution. Higher values give smoother arcs and Béziers. */
  constructor(points: Vector2[] = []) {
    super();
    if (points.length > 0) this.setFromPoints(points);
  }

  /** Starts a new subpath at `x, y`. */
  moveTo(x: number, y: number): this {
    this.currentPoint.set(x, y);
    // A fresh subpath begins; the previous one is not implicitly joined.
    this.points.push(new Vector2(x, y));
    return this;
  }

  /** Straight segment from the current point to `x, y`. */
  lineTo(x: number, y: number): this {
    const from = this.currentPoint.clone();
    const to = new Vector2(x, y);
    this.curves.push(new LineCurve(from, to));
    this.currentPoint.copy(to);
    this.points.push(to);
    return this;
  }

  /** Quadratic Bézier with control point `aX, aY` to `x, y`. */
  quadraticCurveTo(aX: number, aY: number, x: number, y: number): this {
    const from = this.currentPoint.clone();
    const control = new Vector2(aX, aY);
    const to = new Vector2(x, y);
    this.curves.push(new QuadraticBezierCurve(from, control, to));
    this.currentPoint.copy(to);
    this.points.push(to);
    return this;
  }

  /** Cubic Bézier with two control points to `x, y`. */
  bezierCurveTo(aX: number, aY: number, bX: number, bY: number, x: number, y: number): this {
    const from = this.currentPoint.clone();
    const control1 = new Vector2(aX, aY);
    const control2 = new Vector2(bX, bY);
    const to = new Vector2(x, y);
    this.curves.push(new CubicBezierCurve(from, control1, control2, to));
    this.currentPoint.copy(to);
    this.points.push(to);
    return this;
  }

  /** Smooth curve through `points`, starting from the current point. */
  splineThru(points: Vector2[]): this {
    const from = this.currentPoint.clone();
    const all = [from, ...points.map((point) => point.clone())];
    this.curves.push(new SplineCurve(all));
    const last = all[all.length - 1];
    this.currentPoint.copy(last);
    for (const point of points) this.points.push(point.clone());
    return this;
  }

  /**
   * Elliptical arc.
   *
   * `clockwise` selects the sweep direction, which is also what decides the
   * interior of a `Shape` with holes.
   */
  absellipse(
    aX: number,
    aY: number,
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation = 0,
  ): this {
    const curve = new EllipseCurve(
      aX,
      aY,
      xRadius,
      yRadius,
      aStartAngle,
      aEndAngle,
      aClockwise,
      aRotation,
    );
    if (this.curves.length > 0) {
      // Join the arc to the current point so the subpath stays continuous.
      const first = curve.getPoint(0) as Vector2;
      if (!first.equals(this.currentPoint)) {
        this.curves.push(new LineCurve(this.currentPoint.clone(), first.clone()));
      }
    }
    this.curves.push(curve);
    const last = curve.getPoint(1) as Vector2;
    this.currentPoint.copy(last);
    this.points.push(last);
    return this;
  }

  /** Elliptical arc, positioned at the current point. */
  ellipse(
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation = 0,
  ): this {
    return this.absellipse(
      this.currentPoint.x,
      this.currentPoint.y,
      xRadius,
      yRadius,
      aStartAngle,
      aEndAngle,
      aClockwise,
      aRotation,
    );
  }

  /** Circular arc, positioned at the current point. */
  arc(
    aRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
  ): this {
    return this.absarc(
      this.currentPoint.x,
      this.currentPoint.y,
      aRadius,
      aStartAngle,
      aEndAngle,
      aClockwise,
    );
  }

  /** Circular arc at an absolute centre. */
  absarc(
    aX: number,
    aY: number,
    aRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
  ): this {
    return this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise, 0);
  }

  /** Replaces the path with straight segments through `points`. */
  setFromPoints(points: Vector2[]): this {
    this.curves = [];
    this.points = [];
    if (points.length === 0) return this;

    this.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i].x, points[i].y);
    }
    return this;
  }

  /**
   * Samples the path into 2D points.
   *
   * Narrowed from the base class, which has to allow `Vector3` for the
   * three-dimensional curve types. A `Path` is planar by definition, so callers
   * should not have to narrow the result themselves.
   */
  override getPoints(divisions = 12): Vector2[] {
    return super.getPoints(divisions) as Vector2[];
  }

  /** Arc-length-spaced samples, likewise narrowed to 2D. */
  override getSpacedPoints(divisions = 12): Vector2[] {
    return super.getSpacedPoints(divisions) as Vector2[];
  }

  override copy(source: this): this {
    super.copy(source);
    this.currentPoint.copy(source.currentPoint);
    return this;
  }
}
