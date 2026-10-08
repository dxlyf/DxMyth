import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * Base class for every parametric curve.
 *
 * A curve is defined entirely by `getPoint(t)`: anything else is derived. 1D
 * helpers (`getPoints`, `getSpacedPoints`) and the derivative (`getTangent`) sit
 * here so the curve types only have to describe their own shape.
 *
 * Traversal is the one piece of state: `getPoint` takes an optional
 * `optionalTarget` to avoid allocating in hot loops, and the path-following
 * helpers (`getPointAt`, `moveAlong`) reuse that target.
 */
export abstract class Curve {
  readonly isCurve = true;

  /** Number of divisions used by the 1D sampling helpers. */
  arcLengthDivisions = 200;

  /** Cumulative-length cache; `protected` so `CurvePath` can extend it. */
  protected _cacheArcLengths: number[] = [];
  /** getResolution() the cached table was built for. */
  protected _cacheArcLengthSegments = -1;
  protected _needsUpdate = true;

  /** `true` for curves whose ends meet, so callers can skip caps or seams. */
  get closed(): boolean {
    return false;
  }

  /** A point on the curve for `t` in `[0, 1]`. */
  abstract getPoint(t: number, optionalTarget?: Vector2 | Vector3): Vector2 | Vector3;

  /**
   * A point at `u` measured by **arc length** rather than by parameter.
   *
   * The base implementation builds a cumulative-length table and inverts it, so
   * orbiting a curve at constant speed needs `getPointAt` while sampling the
   * shape needs `getPoint`.
   */
  getPointAt(u: number, optionalTarget?: Vector2 | Vector3): Vector2 | Vector3 {
    const t = this.getUtoTmapping(u);
    return this.getPoint(t, optionalTarget);
  }

  /**
   * How many segments this curve type needs to be drawn smoothly.
   *
   * `divisions` is the caller's quality request; a curve whose shape does not
   * depend on it 鈥?a straight line above all 鈥?returns its own minimum instead.
   * Curves that are dense over part of their range (an arc collapsing to a point,
   * a B茅zier with a tight control polygon) treat `divisions` as a hint rather
   * than a literal count.
   *
   * `getPoints(n)` then produces `getResolution(n) + 1` samples.
   */
  getResolution(divisions = 12): number {
    return Math.max(1, Math.floor(divisions));
  }

  /**
   * `getResolution(divisions) + 1` points sampled uniformly in the parameter `t`.
   *
   * Uniform in `t`, not in arc length: use `getSpacedPoints` for even spacing.
   */
  getPoints(divisions = 12): (Vector2 | Vector3)[] {
    const segments = this.getResolution(divisions);
    const points: (Vector2 | Vector3)[] = [];
    for (let d = 0; d <= segments; d++) {
      points.push(this.getPoint(d / segments));
    }
    return points;
  }

  /** Points spaced uniformly along the curve's length, not in `t`. */
  getSpacedPoints(divisions = 12): (Vector2 | Vector3)[] {
    const segments = this.getResolution(divisions);
    const points: (Vector2 | Vector3)[] = [];
    for (let d = 0; d <= segments; d++) {
      points.push(this.getPointAt(d / segments));
    }
    return points;
  }

  /**
   * Total arc length.
   *
   * Cached: the table is only rebuilt when `updateArcLengths()` is called or the
   * division count changes, because sampling is O(divisions) and callers often
   * ask repeatedly.
   */
  getLength(): number {
    const lengths = this.getLengths();
    return lengths[lengths.length - 1];
  }

  /**
   * Cumulative arc length at each sampled parameter.
   *
   * The sample count comes from `getResolution`, not from `divisions` directly,
   * so the table lines up with `getPoints` 鈥?and a straight line costs two
   * entries instead of two hundred.
   */
  getLengths(divisions = this.arcLengthDivisions): number[] {
    const segments = this.getResolution(divisions);
    if (this._cacheArcLengthSegments === segments && !this._needsUpdate) {
      return this._cacheArcLengths;
    }

    const cache: number[] = [0];
    if (segments < 1) {
      this._cacheArcLengths = cache;
      this._cacheArcLengthSegments = segments;
      this._needsUpdate = false;
      return cache;
    }

    // Seed with the first sample. Starting the loop with `last = null` and adding
    // the delta inside it silently drops the whole curve when `segments === 1` 鈥?    // which is now the normal case for a straight line.
    let last = this.getPoint(0);
    let sum = 0;
    for (let p = 1; p <= segments; p++) {
      const current = this.getPoint(p / segments);
      sum += distanceBetween(current, last);
      cache.push(sum);
      last = current;
    }

    this._cacheArcLengths = cache;
    this._cacheArcLengthSegments = segments;
    this._needsUpdate = false;
    return cache;
  }

  /** Drops the cached arc-length table. */
  updateArcLengths(): void {
    this._needsUpdate = true;
    this.getLengths();
  }

  /**
   * Maps an arc-length fraction `u` onto the parameter `t`.
   *
   * `optionalTarget` is not used; it exists to match the three.js signature so
   * ported call sites keep working.
   */
  getUtoTmapping(u: number, distance?: number, _optionalTarget?: unknown): number {
    const arcLengths = this.getLengths();
    const total = arcLengths[arcLengths.length - 1];
    let targetDistance = distance ?? u * total;

    // Degenerate curve: any t is as good as any other.
    if (total === 0) return 0;

    let low = 0;
    let high = arcLengths.length - 1;
    let mid = 0;

    // Binary search for the bracketing sample.
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      if (arcLengths[mid] === targetDistance) return mid / (arcLengths.length - 1);
      if (arcLengths[mid] < targetDistance) low = mid + 1;
      else high = mid - 1;
    }
    mid = Math.max(1, low);

    const lengthBefore = arcLengths[mid - 1];
    const lengthAfter = arcLengths[mid];
    const segmentLength = lengthAfter - lengthBefore;
    // Guard a zero-length span, which happens on a curve with duplicate points.
    const segmentFraction = segmentLength > 0 ? (targetDistance - lengthBefore) / segmentLength : 0;
    // Interpolate over the *parameter*: `mid` is a sample index, so it corresponds
    // to `t = mid / (arcLengths.length - 1)`. Dividing the whole expression by the
    // interval count instead would collapse `t` to 0 whenever the table has only
    // two entries, which is now the normal case for a straight line.
    return (mid - 1 + segmentFraction) / (arcLengths.length - 1);
  }

  /**
   * Unit tangent at `t`, by central difference.
   *
   * Works for any curve, including the ones with no analytic derivative, at the
   * cost of two `getPoint` calls.
   */
  getTangent(t: number, optionalTarget?: Vector2 | Vector3): Vector2 | Vector3 {
    const delta = 0.0001;
    const t1 = t - delta;
    const t2 = t + delta;

    // Sampling outside [0, 1] is not allowed, so clamp the window.
    const point1 = this.getPoint(t1 < 0 ? 0 : t1);
    const point2 = this.getPoint(t2 > 1 ? 1 : t2);
    const tangent = optionalTarget ?? (point1 as Vector2).clone();

    if ('z' in tangent) {
      (tangent as Vector3).set(
        (point2 as Vector3).x - (point1 as Vector3).x,
        (point2 as Vector3).y - (point1 as Vector3).y,
        (point2 as Vector3).z - (point1 as Vector3).z,
      );
    } else {
      (tangent as Vector2).set(
        (point2 as Vector2).x - (point1 as Vector2).x,
        (point2 as Vector2).y - (point1 as Vector2).y,
      );
    }
    return normalize(tangent);
  }

  /** Tangent at an arc-length fraction. */
  getTangentAt(u: number, optionalTarget?: Vector2 | Vector3): Vector2 | Vector3 {
    return this.getTangent(this.getUtoTmapping(u), optionalTarget);
  }

  /**
   * `divisions` evenly spaced frames along the curve: position, tangent and a
   * normalised in-plane normal. Feeds `StrokeGeometry`, which offsets by it.
   */
  computeFrenetFrames(
    segments: number,
    _closed = false,
  ): { tangents: Vector3[]; normals: Vector3[]; binormals: Vector3[] } {
    const tangents: Vector3[] = [];
    const normals: Vector3[] = [];
    const binormals: Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const tangent = this.getTangent(i / segments) as Vector3;
      tangents.push(new Vector3(tangent.x, tangent.y, tangent.z ?? 0));

      // The 2D normal is the tangent rotated 90 degrees in the XY plane.
      const normal = new Vector3(-tangent.y, tangent.x, 0);
      if (normal.lengthSq() === 0) normal.set(1, 0, 0);
      normal.normalize();
      normals.push(normal);
      binormals.push(new Vector3(0, 0, 1));
    }

    return { tangents, normals, binormals };
  }

  /** A polyline through this curve's sampled points. */
  toPolyline(divisions = 64): Vector2[] {
    return this.getPoints(divisions).map((point) => new Vector2(point.x, point.y));
  }

  /** Deep copy. Subclasses override to bring their control points along. */
  copy(_source: this): this {
    return this;
  }

  /** `copy` plus a fresh instance, so a curve can be used as a template. */
  clone(): this {
    return new (this.constructor as new () => this)().copy(this);
  }

  /** Human-readable parameter dump; subclasses override. */
  toJSON(): Record<string, unknown> {
    return { type: this.constructor.name, arcLengthDivisions: this.arcLengthDivisions };
  }
}

/** Distance in whichever dimension the two points share. */
function distanceBetween(a: Vector2 | Vector3, b: Vector2 | Vector3): number {
  const dz = ('z' in a ? (a as Vector3).z : 0) - ('z' in b ? (b as Vector3).z : 0);
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Normalises in place, tolerating a zero-length vector. */
function normalize(v: Vector2 | Vector3): Vector2 | Vector3 {
  const lengthSq = v.x * v.x + v.y * v.y + ('z' in v ? (v as Vector3).z * (v as Vector3).z : 0);
  if (lengthSq === 0) return v;
  const inverse = 1 / Math.sqrt(lengthSq);
  v.x *= inverse;
  v.y *= inverse;
  if ('z' in v) (v as Vector3).z *= inverse;
  return v;
}

