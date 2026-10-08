import { Curve } from './Curve';
import { LineCurve } from './Curves';
import { Vector2 } from '../math/Vector2';
import type { Vector3 } from '../math/Vector3';

/**
 * A sequence of curves treated as one.
 *
 * `getPoint(t)` maps `t` onto the curves by *curve index*, not by length, so a
 * long segment and a short one each own an equal share of `t`. Use
 * `getPointAt`/`getSpacedPoints` when even spacing matters.
 */
export class CurvePath<T extends Vector2 | Vector3 = Vector2> extends Curve {
  readonly isCurvePath = true;

  curves: Curve[] = [];
  /** Points the path was built from, when it was built from points. */
  points: T[] = [];

  private _closed = false;

  override get closed(): boolean {
    return this._closed;
  }

  /** Treats the last point as connected to the first. */
  setClosed(value: boolean): this {
    this._closed = value;
    return this;
  }

  /** Appends a curve. Its `closed` flag is not changed. */
  add(curve: Curve): this {
    this.curves.push(curve);
    return this;
  }

  /** Appends a straight segment from `from` to `to`. */
  addLine(from: T, to: T): this {
    this.curves.push(
      new LineCurve(
        (from as unknown as Vector2).clone(),
        (to as unknown as Vector2).clone(),
      ) as unknown as Curve,
    );
    this.points.push(to);
    return this;
  }

  override getPoint(t: number, optionalTarget?: Vector2 | Vector3): Vector2 | Vector3 {
    const count = this.curves.length;
    const target = optionalTarget ?? new Vector2();
    if (count === 0) return target;

    // `point` is the index of the curve plus the fraction along it.
    let point = t * count;
    let index = Math.floor(point);
    // `t === 1` lands exactly on `count`, which is off the end.
    if (index === count) {
      index = count - 1;
      point = 1;
    } else {
      point = point - index;
    }

    const curve = this.curves[index];
    return (curve as Curve).getPoint(point, target);
  }

  /** Snaps the first point onto the last one, appending a closing segment. */
  closePath(): this {
    const first = this.points[0];
    const last = this.points[this.points.length - 1];
    if (first === undefined || last === undefined) return this;

    // An existing closing segment (same start and end) must not be duplicated.
    const alreadyClosed =
      first.x === last.x &&
      first.y === last.y &&
      (('z' in first ? (first as Vector3).z : 0) ===
        ('z' in last ? (last as Vector3).z : 0));

    if (alreadyClosed) return this;

    this.curves.push(
      new LineCurve(
        (last as unknown as Vector2).clone(),
        (first as unknown as Vector2).clone(),
      ) as unknown as Curve,
    );
    this._closed = true;
    return this;
  }

  /**
   * Total length.
   *
   * Each sub-curve is measured with two samples (`divisions = 1`) rather than
   * the full table: a path is made of many short curves, and the chord is a good
   * enough approximation that three.js makes the same trade.
   */
  /**
   * Total length.
   *
   * Each sub-curve measures itself, so a `LineCurve` contributes its exact
   * endpoint distance while an arc is approximated by chord samples.
   */
  override getLength(): number {
    let sum = 0;
    for (const curve of this.curves) {
      sum += curve.getLength();
    }
    return sum;
  }

  /**
   * The sum of the sub-curves' own resolutions.
   *
   * A path has no single shape to subdivide, so it defers to its parts: a
   * rectangle made of four `lineTo` calls reports 4, not the caller's 64. The
   * base implementation's `max(1, divisions)` would be wrong here, since it would
   * claim a segment count the path does not actually produce.
   */
  override getResolution(divisions = 12): number {
    let segments = 0;
    for (const curve of this.curves) segments += curve.getResolution(divisions);
    return segments;
  }

  /**
   * Samples every sub-curve and concatenates the results.
   *
   * Each sub-curve contributes its own `getResolution(divisions)`, so a straight
   * `lineTo` costs one segment while an `arc` in the same path gets as many as its
   * radius needs. A uniform sample count across the whole path would either
   * over-tessellate the lines or facet the arcs.
   *
   * Coincident consecutive points are dropped, so a closed path does not end on a
   * duplicate of its first point.
   */
  override getPoints(divisions = 12): (Vector2 | Vector3)[] {
    const points: (Vector2 | Vector3)[] = [];

    for (const curve of this.curves) {
      for (const point of curve.getPoints(divisions)) {
        const last = points[points.length - 1];
        if (last && areCoincident(last, point)) continue;
        points.push(point);
      }
    }

    // Points pushed by a command that added no curve (a trailing `moveTo`) still
    // belong to the path.
    for (let i = this.curves.length; i < this.points.length; i++) {
      const point = this.points[i];
      const last = points[points.length - 1];
      if (last && areCoincident(last, point)) continue;
      points.push(point.clone());
    }

    return points;
  }

  /**
   * Maps an arc-length fraction `u` onto the global parameter `t`.
   *
   * Built from each sub-curve's own length table instead of one global table.
   * A global table of `N` divisions spends only `N / curves` of them on each
   * curve, so a two-curve path resolves each curve's interior at half the
   * accuracy 鈥?enough to put the arc-length midpoint of a simple L in the wrong
   * place by a whole percent.
   *
   * `getPoint(t)` distributes `t` uniformly over the curves, so within curve `c`
   * the local parameter is `t * count - c` and the global inverse is
   * `(c + localT) / count`.
   */
  override getUtoTmapping(u: number, distance?: number, _optionalTarget?: unknown): number {
    const count = this.curves.length;
    if (count === 0) return 0;

    const lengths = this.curves.map((curve) => curve.getLength());
    const total = lengths.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return 0;

    const target = Math.min(Math.max(distance ?? u * total, 0), total);

    // Which curve the target distance falls in.
    let cumulative = 0;
    let index = count - 1;
    for (let i = 0; i < count; i++) {
      if (target <= cumulative + lengths[i]) {
        index = i;
        break;
      }
      cumulative += lengths[i];
    }

    const localDistance = target - cumulative;
    const curve = this.curves[index];
    const localLength = lengths[index];
    // A zero-length sub-curve contributes nothing; treat it as its own start.
    const localT = localLength > 0 ? curve.getUtoTmapping(localDistance / localLength) : 0;
    return (index + localT) / count;
  }

  /**
   * Cumulative arc length sampled at `divisions + 1` parameters.
   *
   * Indexed by the *parameter* `t`, because `getUtoTmapping` inverts it 鈥?but note
   * that within a sub-curve, arc length is not linear in `t`, so a table built
   * this way is only approximate. `getUtoTmapping` above is the accurate path.
   */
  override getLengths(divisions = this.arcLengthDivisions): number[] {
    if (this._cacheLengths && this._arcLengthDivisions === divisions) return this._cacheLengths;

    const lengths: number[] = [];
    let sum = 0;
    let last: Vector2 | Vector3 | null = null;

    lengths.push(0);
    for (let p = 1; p <= divisions; p++) {
      const current = this.getPoint(p / divisions);
      if (last) sum += distanceBetweenPoints(last, current);
      lengths.push(sum);
      last = current;
    }

    this._cacheLengths = lengths;
    this._arcLengthDivisions = divisions;
    return lengths;
  }

  private _cacheLengths: number[] | null = null;
  private _arcLengthDivisions = -1;

  /** Drops the cached arc-length table; call after mutating the curve list. */
  override updateArcLengths(): void {
    this._cacheLengths = null;
    super.updateArcLengths();
  }

  override copy(source: this): this {
    super.copy(source);
    this.curves = source.curves.map((curve) => curve.clone());
    this.points = source.points.map((point) => point.clone() as T);
    this._closed = source._closed;
    return this;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      curves: this.curves.map((curve) => curve.toJSON()),
      points: this.points.map((point) => point.toArray()),
      closed: this._closed,
    };
  }
}

/** Distance between two points in whichever dimensions they share. */
function distanceBetweenPoints(a: Vector2 | Vector3, b: Vector2 | Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = ('z' in a ? (a as Vector3).z : 0) - ('z' in b ? (b as Vector3).z : 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** `true` when two samples are the same point to within float noise. */
function areCoincident(a: Vector2 | Vector3, b: Vector2 | Vector3): boolean {
  return distanceBetweenPoints(a, b) < 1e-9;
}

