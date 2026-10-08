import { Curve } from './Curve';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * A straight segment between two points, plus the `LineCurve3` flavour.
 *
 * `LineCurve` is the workhorse of `Path`: `moveTo`/`lineTo` builds a chain of
 * these, and its analytic tangent avoids the central difference the base class
 * would otherwise use.
 */
export class LineCurve extends Curve {
  readonly isLineCurve = true;

  constructor(
    public v1 = new Vector2(),
    public v2 = new Vector2(),
  ) {
    super();
  }

  override getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget as Vector2;
    if (t === 1) return point.copy(this.v2);
    return point.set(
      this.v1.x + (this.v2.x - this.v1.x) * t,
      this.v1.y + (this.v2.y - this.v1.y) * t,
    );
  }

  override getTangent(t: number, optionalTarget = new Vector2()): Vector2 {
    const tangent = optionalTarget as Vector2;
    tangent.set(this.v2.x - this.v1.x, this.v2.y - this.v1.y);
    const lengthSq = tangent.lengthSq();
    // A zero-length segment has no direction; return the degenerate vector.
    return lengthSq === 0 ? tangent : tangent.multiplyScalar(1 / Math.sqrt(lengthSq));
  }

  /**
   * Exactly the endpoint distance.
   *
   * The inherited implementation samples 200 points and sums the chords, which
   * for a straight line accumulates a small but real error (5 becomes 4.975).
   */
  override getLength(): number {
    return this.v1.distanceTo(this.v2);
  }

  /**
   * `1`: a straight line is exactly its two endpoints.
   *
   * More samples only produce points that already lie on the line, so a
   * 200-point polyline of a segment is 199 wasted vertices — and every consumer
   * downstream (stroking, length, vertex count) pays for them.
   */
  override getResolution(): number {
    return 1;
  }

  /** Just the two endpoints, whatever resolution was requested. */
  override getPoints(): Vector2[] {
    return [this.v1.clone(), this.v2.clone()];
  }

  override copy(source: this): this {
    super.copy(source);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    return this;
  }

  override toJSON(): Record<string, unknown> {
    return { ...super.toJSON(), v1: this.v1.toArray(), v2: this.v2.toArray() };
  }
}

/** The 3D counterpart, used by `CatmullRomCurve3` and `CurvePath` in 3D. */
export class LineCurve3 extends Curve {
  readonly isLineCurve3 = true;

  constructor(
    public v1 = new Vector3(),
    public v2 = new Vector3(),
  ) {
    super();
  }

  override getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
    const point = optionalTarget as Vector3;
    if (t === 1) return point.copy(this.v2);
    return point.set(
      this.v1.x + (this.v2.x - this.v1.x) * t,
      this.v1.y + (this.v2.y - this.v1.y) * t,
      this.v1.z + (this.v2.z - this.v1.z) * t,
    );
  }

  /** `1`: a straight line is exactly its two endpoints. */
  override getResolution(): number {
    return 1;
  }

  override getPoints(): Vector3[] {
    return [this.v1.clone(), this.v2.clone()];
  }

  override getLength(): number {
    return this.v1.distanceTo(this.v2);
  }

  override copy(source: this): this {
    super.copy(source);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    return this;
  }
}

/**
 * Quadratic B茅zier through one control point.
 *
 * Evaluated with the Bernstein form rather than de Casteljau: for degree 2 it is
 * both shorter and cheaper.
 */
export class QuadraticBezierCurve extends Curve {
  readonly isQuadraticBezierCurve = true;

  constructor(
    public v0 = new Vector2(),
    public v1 = new Vector2(),
    public v2 = new Vector2(),
  ) {
    super();
  }

  override getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget as Vector2;
    const oneMinusT = 1 - t;
    const a = oneMinusT * oneMinusT;
    const b = 2 * oneMinusT * t;
    const c = t * t;
    return point.set(
      a * this.v0.x + b * this.v1.x + c * this.v2.x,
      a * this.v0.y + b * this.v1.y + c * this.v2.y,
    );
  }

  /**
   * Scales with the requested quality, with a floor of 8.
   *
   * A quadratic is smooth enough that its curvature, not the caller's number,
   * decides how many segments read as a curve; below about 8 the silhouette is
   * visibly faceted.
   */
  override getResolution(divisions = 12): number {
    return Math.max(8, Math.ceil(divisions));
  }

  override copy(source: this): this {
    super.copy(source);
    this.v0.copy(source.v0);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    return this;
  }
}

/** Cubic B茅zier through two control points. */
export class CubicBezierCurve extends Curve {
  readonly isCubicBezierCurve = true;

  constructor(
    public v0 = new Vector2(),
    public v1 = new Vector2(),
    public v2 = new Vector2(),
    public v3 = new Vector2(),
  ) {
    super();
  }

  override getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget as Vector2;
    const oneMinusT = 1 - t;
    const a = oneMinusT * oneMinusT * oneMinusT;
    const b = 3 * oneMinusT * oneMinusT * t;
    const c = 3 * oneMinusT * t * t;
    const d = t * t * t;
    return point.set(
      a * this.v0.x + b * this.v1.x + c * this.v2.x + d * this.v3.x,
      a * this.v0.y + b * this.v1.y + c * this.v2.y + d * this.v3.y,
    );
  }

  /** A cubic turns more than a quadratic, so the floor is higher. */
  override getResolution(divisions = 12): number {
    return Math.max(12, Math.ceil(divisions * 1.5));
  }

  override copy(source: this): this {
    super.copy(source);
    this.v0.copy(source.v0);
    this.v1.copy(source.v1);
    this.v2.copy(source.v2);
    this.v3.copy(source.v3);
    return this;
  }
}

/**
 * A circular or elliptical arc, also used for full ellipses.
 *
 * `clockwise` flips the sweep direction, which matters for hole winding in
 * `Shape` and for the join side in `StrokeGeometry`.
 */
export class EllipseCurve extends Curve {
  readonly isEllipseCurve = true;

  constructor(
    public aX = 0,
    public aY = 0,
    public xRadius = 1,
    public yRadius = 1,
    public aStartAngle = 0,
    public aEndAngle = Math.PI * 2,
    public aClockwise = false,
    public aRotation = 0,
  ) {
    super();
  }

  override getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget as Vector2;
    const twoPi = Math.PI * 2;
    let deltaAngle = this.aEndAngle - this.aStartAngle;
    // Normalise the sweep into [0, 2pi) so the parameter maps to the short way.
    const samePoints = Math.abs(deltaAngle) < Number.EPSILON;

    while (deltaAngle < 0) deltaAngle += twoPi;
    while (deltaAngle > twoPi) deltaAngle -= twoPi;

    if (deltaAngle < Number.EPSILON) {
      deltaAngle = samePoints ? 0 : twoPi;
    }

    // A clockwise sweep is expressed by walking the angle backwards.
    if (this.aClockwise && !samePoints) {
      deltaAngle = deltaAngle === twoPi ? -twoPi : deltaAngle - twoPi;
    }

    const angle = this.aStartAngle + t * deltaAngle;
    const x = this.aX + this.xRadius * Math.cos(angle);
    const y = this.aY + this.yRadius * Math.sin(angle);

    if (this.aRotation === 0) return point.set(x, y);

    const cos = Math.cos(this.aRotation);
    const sin = Math.sin(this.aRotation);
    const dx = x - this.aX;
    const dy = y - this.aY;
    return point.set(this.aX + dx * cos - dy * sin, this.aY + dx * sin + dy * cos);
  }

  /** Narrowed to 2D: an ellipse curve is planar, so callers need not narrow. */
  override getPoints(divisions = 12): Vector2[] {
    return super.getPoints(divisions) as Vector2[];
  }

  override getSpacedPoints(divisions = 12): Vector2[] {
    return super.getSpacedPoints(divisions) as Vector2[];
  }

  /**
   * Segments needed to keep the chord error under a budget derived from
   * `divisions`.
   *
   * An arc's faceting depends on its radius: the chord sagitta over a step of
   * `theta` is `r * (1 - cos(theta/2))`, so the step that keeps it under
   * `tolerance` is `2 * acos(1 - tolerance / r)`. One low-poly circle and one
   * huge one therefore need very different counts, which is what a fixed
   * `divisions` cannot express.
   */
  override getResolution(divisions = 12): number {
    const safeDivisions = Math.max(1, divisions);
    // Smaller tolerance for a higher requested quality.
    const tolerance = 0.5 / safeDivisions;
    const radius = Math.max(Math.abs(this.xRadius), Math.abs(this.yRadius), 1e-6);

    let deltaAngle = this.aEndAngle - this.aStartAngle;
    const samePoints = Math.abs(deltaAngle) < Number.EPSILON;
    while (deltaAngle < 0) deltaAngle += Math.PI * 2;
    while (deltaAngle > Math.PI * 2) deltaAngle -= Math.PI * 2;
    if (deltaAngle < Number.EPSILON) deltaAngle = samePoints ? 0 : Math.PI * 2;

    if (deltaAngle === 0) return 1;

    const ratio = 1 - tolerance / radius;
    // A radius smaller than the tolerance needs no faceting at all.
    if (ratio <= -1) return 1;
    const step = 2 * Math.acos(Math.max(-1, Math.min(1, ratio)));
    if (step <= 0) return 1;
    // No floor: a very short or very small arc legitimately needs one segment, and
    // a floor would also break the proportionality between a partial arc and a
    // full circle.
    return Math.max(1, Math.ceil(deltaAngle / step));
  }

  override copy(source: this): this {
    super.copy(source);
    Object.assign(this, {
      aX: source.aX,
      aY: source.aY,
      xRadius: source.xRadius,
      yRadius: source.yRadius,
      aStartAngle: source.aStartAngle,
      aEndAngle: source.aEndAngle,
      aClockwise: source.aClockwise,
      aRotation: source.aRotation,
    });
    return this;
  }
}

/**
 * A smooth curve through a list of 2D points.
 *
 * The default `centripetal` parameterisation avoids the cusps and self
 * intersections that the uniform version produces on unevenly spaced points.
 */
export class SplineCurve extends Curve {
  readonly isSplineCurve = true;
  readonly isCatmullRom = true;

  curveType: 'centripetal' | 'chordal' | 'catmullrom' = 'centripetal';
  tension = 0.5;

  constructor(public points: Vector2[] = []) {
    super();
  }

  /**
   * Scales with the number of spans.
   *
   * A spline through `n` points has `n - 1` spans, and the caller's `divisions`
   * is a budget for the whole curve rather than for each span — so the per-span
   * count is that budget divided across them.
   */
  override getResolution(divisions = 12): number {
    const spans = Math.max(1, this.points.length - 1);
    return Math.max(spans * 2, Math.ceil((divisions * 1.5) / spans) * spans);
  }

  override getPoint(t: number, optionalTarget = new Vector2()): Vector2 {
    const point = optionalTarget as Vector2;
    const points = this.points;
    const count = points.length;

    if (count === 0) return point.set(0, 0);
    if (count === 1) return point.copy(points[0]);

    // `p = (count - 1) * t` puts p in [0, count-1] and `intPoint` picks the span.
    const p = (count - 1) * t;
    const intPoint = Math.floor(p);
    const step = p - intPoint;

    const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
    const p1 = points[intPoint];
    const p2 = points[intPoint > count - 2 ? count - 1 : intPoint + 1];
    const p3 = points[intPoint > count - 3 ? count - 1 : intPoint + 2];

    const { dt0, dt1, dt2 } = this.parameterDeltas(p0, p1, p2, p3);
    const t1 = step;
    const t2 = t1 * t1;
    const t3 = t2 * t1;

    // Non-uniform Catmull-Rom basis (Barry-Goldman), which reduces to the
    // uniform one when the deltas are all equal.
    const b0 = -t3 * dt1 + t2 * 2 * dt1 - t1 * dt1;
    const b1 = (dt1 + 2 * dt0) * t3 - (dt1 + 3 * dt0) * t2 + dt0 * t1 + dt0 * 2 + dt1 * 2;
    const b2 = (dt0 + 2 * dt1) * t3 - (dt0 * 2 + dt1 * 3) * t2 + dt0 * t1 + dt0 + dt1 * 2;
    const b3 = -t3 * dt0 + t2 * dt0;

    const inverse = 1 / (dt0 + dt1 * 2 + dt2);
    return point.set(
      (p0.x * b0 + p1.x * b1 + p2.x * b2 + p3.x * b3) * inverse,
      (p0.y * b0 + p1.y * b1 + p2.y * b2 + p3.y * b3) * inverse,
    );
  }

  /** Knot spacing for the chosen parameterisation. */
  private parameterDeltas(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2): {
    dt0: number;
    dt1: number;
    dt2: number;
  } {
    if (this.curveType === 'catmullrom') {
      return { dt0: 1, dt1: 1, dt2: 1 };
    }
    const pow = this.curveType === 'chordal' ? 0.5 : 0.25;
    // Centripetal (0.25) shrinks long spans hardest, which is what removes the
    // overshoot around a tight cluster of points.
    return {
      dt0: Math.pow(p0.distanceTo(p1), pow),
      dt1: Math.pow(p1.distanceTo(p2), pow),
      dt2: Math.pow(p2.distanceTo(p3), pow),
    };
  }

  override copy(source: this): this {
    super.copy(source);
    this.points = source.points.map((point) => point.clone());
    this.curveType = source.curveType;
    this.tension = source.tension;
    return this;
  }
}

/** Catmull-Rom through 3D points. */
export class CatmullRomCurve3 extends Curve {
  readonly isCatmullRomCurve3 = true;

  curveType: 'centripetal' | 'chordal' | 'catmullrom' = 'centripetal';
  tension = 0.5;
  private _closed = false;

  constructor(public points: Vector3[] = []) {
    super();
  }

  override get closed(): boolean {
    return this._closed;
  }

  /** Scales with the number of spans; see `SplineCurve.getResolution`. */
  override getResolution(divisions = 12): number {
    const spans = Math.max(1, this.points.length - (this._closed ? 0 : 1));
    return Math.max(spans * 2, Math.ceil((divisions * 1.5) / spans) * spans);
  }

  setClosed(value: boolean): this {
    this._closed = value;
    return this;
  }

  override getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
    const point = optionalTarget as Vector3;
    const points = this.points;
    const count = points.length;
    if (count === 0) return point.set(0, 0, 0);
    if (count === 1) return point.copy(points[0]);

    const p = (count - (this._closed ? 0 : 1)) * t;
    let intPoint = Math.floor(p);
    const weight = p - intPoint;

    const last = count - 1;
    let i0: number;
    let i1: number;
    let i2: number;
    let i3: number;

    if (this._closed) {
      intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / count) + 1) * count;
      i0 = (intPoint - 1) % count;
      i1 = intPoint % count;
      i2 = (intPoint + 1) % count;
      i3 = (intPoint + 2) % count;
    } else {
      i0 = intPoint === 0 ? intPoint : intPoint - 1;
      i1 = Math.min(intPoint, last);
      i2 = intPoint > last - 2 ? last : intPoint + 1;
      i3 = intPoint > last - 3 ? last : intPoint + 2;
    }

    const p0 = points[i0];
    const p1 = points[i1];
    const p2 = points[i2];
    const p3 = points[i3];

    const pow = this.curveType === 'catmullrom' ? 0 : this.curveType === 'chordal' ? 0.5 : 0.25;
    const dt0 = pow === 0 ? 1 : Math.pow(p0.distanceTo(p1), pow);
    const dt1 = pow === 0 ? 1 : Math.pow(p1.distanceTo(p2), pow);
    const dt2 = pow === 0 ? 1 : Math.pow(p2.distanceTo(p3), pow);
    const dt3 = dt1;

    const t1 = weight;
    const t2 = t1 * t1;
    const t3 = t2 * t1;

    const b0 = -dt1 * t3 + 2 * dt1 * t2 - dt1 * t;
    const b1 = (2 * dt0 + dt1) * t3 - (3 * dt0 + dt1) * t2 + dt0 * t + dt0 * 2 + dt1 * 2;
    const b2 = (dt0 + 2 * dt1) * t3 - (2 * dt0 + 3 * dt1) * t2 + dt0 * t + dt0 + dt1 * 2;
    const b3 = -dt0 * t3 + dt0 * t2;
    const inverse = 1 / (dt0 + dt1 * 2 + dt2);

    return point.set(
      (p0.x * b0 + p1.x * b1 + p2.x * b2 + p3.x * b3) * inverse,
      (p0.y * b0 + p1.y * b1 + p2.y * b2 + p3.y * b3) * inverse,
      (p0.z * b0 + p1.z * b1 + p2.z * b2 + p3.z * b3) * inverse,
    );
  }

  override copy(source: this): this {
    super.copy(source);
    this.points = source.points.map((point) => point.clone());
    this.curveType = source.curveType;
    this.tension = source.tension;
    this._closed = source._closed;
    return this;
  }
}

