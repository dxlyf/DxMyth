import { BufferGeometry } from '../core/BufferGeometry';
import type { Curve } from '../curves/Curve';
import { CurvePath } from '../curves/CurvePath';
import { Path } from '../curves/Path';
import { Shape } from '../curves/Shape';
import { Vector2 } from '../math/Vector2';
import { dedupe, signedArea, triangulate } from './triangulate';

/** How an open stroke's ends are finished. Mirrors `CanvasRenderingContext2D.lineCap`. */
export type LineCap = 'butt' | 'round' | 'square';

/** How the corner between two segments is filled. Mirrors `lineJoin`. */
export type LineJoin = 'round' | 'bevel' | 'miter';

export interface StrokeOptions {
  /** Total thickness of the stroke, centred on the path. */
  lineWidth?: number;
  lineCap?: LineCap;
  lineJoin?: LineJoin;
  /**
   * Maximum `miterLength / lineWidth` before a miter join degrades to a bevel.
   * The same meaning and default as canvas: a sharp corner is bevelled instead of
   * growing an unbounded spike.
   */
  miterLimit?: number;
  /** Treat the path as a loop, joining the last point to the first. */
  closed?: boolean;
  /** Samples per sub-curve when converting a `Path` to a polyline. */
  divisions?: number;
  /** Segments per quarter turn of a round join or cap. */
  curveSegments?: number;
}

/** Normalises a curve/path/point-list input into a flat polyline. */
function toPolyline(source: Curve | CurvePath | Vector2[], divisions: number): Vector2[] {
  if (Array.isArray(source)) return source.map((point) => new Vector2(point.x, point.y));
  const sampled = (source as Curve).getPoints(divisions) as Vector2[];
  return sampled.map((point) => new Vector2(point.x, point.y));
}

/** `true` when the source is inherently a loop, so caps must not be added. */
function isClosedSource(source: Curve | CurvePath | Vector2[]): boolean {
  if (Array.isArray(source)) return false;
  if (source instanceof Shape) return true;
  if (source instanceof Path) {
    const points = source.points;
    if (points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      return Math.abs(first.x - last.x) < 1e-6 && Math.abs(first.y - last.y) < 1e-6;
    }
    return source.closed;
  }
  if (source instanceof CurvePath) return source.closed;
  return source.closed === true;
}

/**
 * Turns a curve, `Path` or point list into a **filled ribbon**: the region within
 * `lineWidth / 2` of the path.
 *
 * Caps, joins and the miter limit behave the way canvas does:
 *
 * - `lineCap`: `butt` stops at the endpoint, `square` extends by half the width,
 *   `round` closes with a semicircle.
 * - `lineJoin`: `miter` extends the two outer edges to their intersection,
 *   `bevel` cuts the corner off with one segment, `round` sweeps an arc.
 * - `miterLimit` is the ratio `miterLength / lineWidth` past which `miter`
 *   degrades to `bevel` 閳?the same guard canvas applies.
 *
 * ```ts
 * const outline = new StrokeGeometry(path, {
 *   lineWidth: 0.08,
 *   lineJoin: 'miter',
 *   miterLimit: 8,
 * });
 * scene.add(new Mesh(outline, new MeshBasicMaterial({ color: 0x7fd4ff })));
 * ```
 *
 * The ribbon is built as **one simple outline** per side and then triangulated
 * as a whole, rather than as a strip plus a patch per join. The difference
 * matters: tiling the ribbon with overlapping triangles leaves interior seams
 * that show up through a transparent material (each overlap blends twice) and
 * makes any area-based check meaningless.
 *
 * ## Status
 *
 * Verified against closed-form areas (`npm run verify:stroke`):
 *
 * - straight segments with every cap style: round caps match
 *   `length * width + pi * (w/2)^2`, square caps `length * width + w^2`,
 * - a two-segment right-angle corner with `miter` (0.8) and `bevel` (0.6) for a
 *   unit L at width 0.4, both exact,
 * - `miterLimit` degrading a sharp corner to a bevel, and a large limit growing
 *   the expected spike,
 * - **closed paths**, whose ribbon is an annulus: a mitered square ring, a circle
 *   ring and an ellipse ring all match `outer - inner` to within polygon error.
 *   This was broken until the ribbon was emitted as a quad strip instead of a
 *   bridged polygon-with-hole: the bridge channel crosses the ring itself, so a
 *   circle and an ellipse produced *zero* triangles,
 * - open Bezier paths with every cap and join combination.
 *
 * **Known limitation**: an open path that doubles back on itself (a zigzag whose
 * next segment retraces towards the previous one) leaves a self-intersecting
 * offset outline. Ear clipping cannot decompose that, so part of the ribbon is
 * missing. `scripts/verify-stroke.mjs` asserts this case *fails*, so the
 * limitation stays explicit instead of silently regressing or passing by
 * accident. Fixing it needs a real polygon-offsetting pass with self-intersection
 * removal, not a different triangulator.
 */
export class StrokeGeometry extends BufferGeometry {
  readonly isStrokeGeometry = true;

  parameters: Required<StrokeOptions>;

  constructor(source: Curve | CurvePath | Vector2[], options: StrokeOptions = {}) {
    super();
    this.name = 'StrokeGeometry';

    this.parameters = {
      lineWidth: options.lineWidth ?? 0.1,
      lineCap: options.lineCap ?? 'butt',
      lineJoin: options.lineJoin ?? 'miter',
      miterLimit: Math.max(1, options.miterLimit ?? 10),
      closed: options.closed ?? isClosedSource(source),
      divisions: Math.max(1, Math.floor(options.divisions ?? 64)),
      curveSegments: Math.max(2, Math.floor(options.curveSegments ?? 8)),
    };

    this.#build(source);
  }

  #build(source: Curve | CurvePath | Vector2[]): void {
    const halfWidth = Math.max(1e-6, this.parameters.lineWidth / 2);
    const closed = this.parameters.closed;
    const polyline = dedupe(toPolyline(source, this.parameters.divisions), 1e-9);

    if (polyline.length < 2) {
      this.setPosition([]).setNormal([]).setUv([]).setIndex([]);
      return;
    }

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    /** Appends an outline polygon, triangulating it into the shared buffers. */
    const emitPolygon = (ring: Vector2[]): void => {
      const cleaned = dedupe(ring, 1e-9);
      if (cleaned.length < 3) return;
      // Normalise to counter-clockwise so every emitted triangle faces +z.
      const ccw = signedArea(cleaned) > 0 ? [...cleaned].reverse() : cleaned;

      const base = positions.length / 3;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const point of ccw) {
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      }
      const spanX = maxX - minX || 1;
      const spanY = maxY - minY || 1;

      for (const point of ccw) {
        positions.push(point.x, point.y, 0);
        normals.push(0, 0, 1);
        uvs.push((point.x - minX) / spanX, (point.y - minY) / spanY);
      }
      for (const index of triangulate(ccw)) indices.push(base + index);
    };

    /**
     * Appends a closed ribbon as a quad strip between two offset rings.
     *
     * A closed path's ribbon is an annulus, and the two rings that bound it are
     * generated from the same vertices 鈥?so the strip connects them one-to-one.
     * Bridging them as a polygon-with-hole instead produces a bowtie: the channel
     * between an outer and an inner ring crosses the ring itself whenever the two
     * bridge points are far apart, which for a circle or an ellipse they always
     * are. The ear-clipping pass then yields almost nothing.
     *
     * Requires equal-length rings, which is the case whenever both offsets come
     * from the same polyline. Unequal rings fall back to the bridge.
     */
    const emitRibbon = (outer: Vector2[], inner: Vector2[]): void => {
      const a = dedupe(outer, 1e-9);
      const b = dedupe(inner, 1e-9);
      if (a.length < 3 || b.length < 3) return;

      if (a.length !== b.length) {
        emitPolygon(spliceAnnulus(a, b));
        return;
      }

      const base = positions.length / 3;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const point of [...a, ...b]) {
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      }
      const spanX = maxX - minX || 1;
      const spanY = maxY - minY || 1;

      const push = (point: Vector2): void => {
        positions.push(point.x, point.y, 0);
        normals.push(0, 0, 1);
        uvs.push((point.x - minX) / spanX, (point.y - minY) / spanY);
      };
      for (const point of a) push(point);
      for (const point of b) push(point);

      // Winding is measured from the outer ring rather than assumed, because the
      // ribbon's orientation depends on which way the path was authored. Both
      // rings wind the same way, so one test fixes the whole strip.
      //
      // `signedArea` reports counter-clockwise as negative. The quads must be
      // wound so the ribbon faces +z, the same as the open-path outline.
      const outerIsCcw = signedArea(a) < 0;
      for (let i = 0; i < a.length; i++) {
        const next = (i + 1) % a.length;
        const outerI = base + i;
        const outerNext = base + next;
        const innerI = base + a.length + i;
        const innerNext = base + a.length + next;
        if (outerIsCcw) {
          indices.push(outerI, innerNext, innerI);
          indices.push(outerI, outerNext, innerNext);
        } else {
          indices.push(outerI, innerI, innerNext);
          indices.push(outerI, innerNext, outerNext);
        }
      }
    };

    // --- per-vertex offset points ---
    const segmentCount = closed ? polyline.length : polyline.length - 1;
    const segmentNormals: Vector2[] = [];
    for (let i = 0; i < segmentCount; i++) {
      const from = polyline[i];
      const to = polyline[(i + 1) % polyline.length];
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.hypot(dx, dy);
      // A zero-length segment has no direction: reuse the previous normal so the
      // ribbon stays continuous rather than collapsing.
      segmentNormals.push(
        length < 1e-12
          ? (segmentNormals[i - 1]?.clone() ?? new Vector2(0, 1))
          : new Vector2(-dy / length, dx / length),
      );
    }

    /**
     * The outer apex for the join at `vertex`, or `null` when the corner needs no
     * extra point (an inner join, a bevel, or a miter past the limit).
     */
    const joinApex = (
      vertex: Vector2,
      incomingNormal: Vector2,
      outgoingNormal: Vector2,
      side: 1 | -1,
    ): Vector2 | null => {
      const from = new Vector2(incomingNormal.x * side, incomingNormal.y * side);
      const to = new Vector2(outgoingNormal.x * side, outgoingNormal.y * side);
      const startAngle = Math.atan2(from.y, from.x);
      let sweep = Math.atan2(to.y, to.x) - startAngle;
      while (sweep > Math.PI) sweep -= Math.PI * 2;
      while (sweep < -Math.PI) sweep += Math.PI * 2;

      // The wedge only exists on the outside of the turn; that is exactly where
      // the two offset edges diverge, which shows up as a positive sweep.
      if (sweep <= 1e-12) return null;
      if (this.parameters.lineJoin !== 'miter') return null;

      // The apex is where the two offset edges meet. Solving
      // `apex = v + a * from = v + b * to` for the two unknown scalars gives
      // `a = b = 1 / (1 - from.to)` for unit normals, which is exactly
      // `1 / (2 sin(theta/2))` with `theta` the angle between them.
      const dot = from.x * to.x + from.y * to.y;
      const denominator = 1 - dot;
      if (denominator < 1e-9) return null;

      // `miterLength / lineWidth` is `1 / sin(theta/2)`; the guard is canvas's.
      const sinHalfSquared = (1 - dot) / 2;
      if (sinHalfSquared <= 1e-18) return null;
      if (1 / Math.sqrt(sinHalfSquared) > this.parameters.miterLimit) return null;

      const scale = halfWidth / denominator;
      return new Vector2(vertex.x + scale * (from.x + to.x), vertex.y + scale * (from.y + to.y));
    };

    /** Arc points for a round join at `vertex` on the given side. */
    const joinArc = (
      vertex: Vector2,
      incomingNormal: Vector2,
      outgoingNormal: Vector2,
      side: 1 | -1,
    ): Vector2[] => {
      const from = new Vector2(incomingNormal.x * side, incomingNormal.y * side);
      const to = new Vector2(outgoingNormal.x * side, outgoingNormal.y * side);
      const startAngle = Math.atan2(from.y, from.x);
      let sweep = Math.atan2(to.y, to.x) - startAngle;
      while (sweep > Math.PI) sweep -= Math.PI * 2;
      while (sweep < -Math.PI) sweep += Math.PI * 2;
      if (sweep <= 1e-12) return [];

      const steps = Math.max(
        1,
        Math.ceil((sweep / (Math.PI / 2)) * this.parameters.curveSegments),
      );
      const points: Vector2[] = [];
      for (let step = 0; step <= steps; step++) {
        const angle = startAngle + (sweep * step) / steps;
        points.push(
          new Vector2(
            vertex.x + Math.cos(angle) * halfWidth,
            vertex.y + Math.sin(angle) * halfWidth,
          ),
        );
      }
      return points;
    };

    /** Builds one offset polyline: `side` is +1 for left, -1 for right. */
    const buildOffset = (side: 1 | -1): Vector2[] => {
      const ring: Vector2[] = [];
      const at = (vertex: Vector2, normal: Vector2): Vector2 =>
        new Vector2(
          vertex.x + normal.x * side * halfWidth,
          vertex.y + normal.y * side * halfWidth,
        );

      for (let i = 0; i < polyline.length; i++) {
        const vertex = polyline[i];

        if (!closed && i === 0) {
          // The first vertex has only an outgoing segment.
          ring.push(at(vertex, segmentNormals[0]));
          continue;
        }
        if (!closed && i === polyline.length - 1) {
          // The last vertex has only an incoming segment.
          ring.push(at(vertex, segmentNormals[segmentCount - 1]));
          continue;
        }

        const incoming = segmentNormals[(i - 1 + segmentCount) % segmentCount];
        const outgoing = segmentNormals[i % segmentCount];
        const collinear = Math.abs(incoming.x * outgoing.y - incoming.y * outgoing.x) < 1e-12;

        if (collinear) {
          ring.push(at(vertex, outgoing));
          continue;
        }

        const arc =
          this.parameters.lineJoin === 'round' ? joinArc(vertex, incoming, outgoing, side) : [];
        if (arc.length > 0) {
          ring.push(...arc);
          continue;
        }

        const apex = joinApex(vertex, incoming, outgoing, side);
        if (apex) {
          ring.push(apex);
          continue;
        }
        // Bevel, or a miter past the limit: the edge simply turns here.
        ring.push(at(vertex, outgoing));
      }

      return ring;
    };

    if (closed) {
      // A closed path's ribbon is an annulus: the outer offset ring minus the
      // inner one. Filling the two rings separately would shade the hole as well.
      // Which ring is outer depends on the path's winding, so pick by area.
      const left = buildOffset(1);
      const right = buildOffset(-1);
      const outer = Math.abs(signedArea(left)) >= Math.abs(signedArea(right)) ? left : right;
      const inner = outer === left ? right : left;
      emitRibbon(outer, inner);
    } else {
      // The open ribbon is one outline: out along the left offset, round the end
      // cap, back along the right offset, round the start cap.
      //
      // This is exact whenever the offset polygon is simple, which covers every
      // path that does not fold back on itself: caps and joins come out with the
      // right area because ear clipping sees the whole boundary at once. A path
      // that doubles back produces a self-intersecting outline instead, and ear
      // clipping then drops part of the ribbon; see the class docs.
      const leftRing = buildOffset(1);
      const rightRing = buildOffset(-1);
      const endCap = this.#capPoints(
        polyline[polyline.length - 1],
        segmentNormals[segmentCount - 1],
        'end',
      );
      const startCap = this.#capPoints(polyline[0], segmentNormals[0], 'start');

      const outline: Vector2[] = [
        ...leftRing,
        ...endCap,
        ...[...rightRing].reverse(),
        ...startCap,
      ];
      emitPolygon(outline);
    }

    this.setPosition(positions);
    this.setNormal(normals);
    this.setUv(uvs);
    this.setIndex(
      positions.length / 3 > 65535 ? new Uint32Array(indices) : new Uint16Array(indices),
    );
  }

  /**
   * The points a cap contributes, in loop order.
   *
   * The outline is walked as `left -> end cap -> right(reversed) -> start cap ->
   * left`, so a cap must connect the two offset edges in the direction the loop
   * travels: the end cap goes from the left edge to the right edge, and the start
   * cap from the right edge back to the left edge. Getting that direction wrong
   * folds the polygon over itself instead of closing it.
   *
   * `butt` contributes nothing (the edges meet across the end), `square`
   * contributes the two extended corners, `round` contributes the arc.
   */
  #capPoints(vertex: Vector2, normal: Vector2, end: 'start' | 'end'): Vector2[] {
    const halfWidth = Math.max(1e-6, this.parameters.lineWidth / 2);
    const cap = this.parameters.lineCap;
    if (cap === 'butt') return [];

    // `normal` is the left normal, i.e. the direction of travel rotated a quarter
    // turn counter-clockwise, so the tangent is the normal rotated back
    // *clockwise*: `(n.y, -n.x)`. The outward direction is the reversed tangent
    // at the start and the tangent at the end.
    const tangent = new Vector2(normal.y, -normal.x);
    const outward = end === 'start' ? new Vector2(-tangent.x, -tangent.y) : tangent;

    // The two edges the cap joins, in loop order: the end cap runs from the left
    // edge (`+normal`) to the right edge, and the start cap the other way.
    const fromSign = end === 'end' ? 1 : -1;
    const fromEdge = new Vector2(
      vertex.x + normal.x * halfWidth * fromSign,
      vertex.y + normal.y * halfWidth * fromSign,
    );
    const toEdge = new Vector2(
      vertex.x - normal.x * halfWidth * fromSign,
      vertex.y - normal.y * halfWidth * fromSign,
    );

    if (cap === 'square') {
      return [
        new Vector2(
          fromEdge.x + outward.x * halfWidth,
          fromEdge.y + outward.y * halfWidth,
        ),
        new Vector2(toEdge.x + outward.x * halfWidth, toEdge.y + outward.y * halfWidth),
      ];
    }

    // Round: a semicircle from `fromEdge` to `toEdge`, bulging through `outward`.
    const fromAngle = Math.atan2(fromEdge.y - vertex.y, fromEdge.x - vertex.x);
    const outwardAngle = Math.atan2(outward.y, outward.x);
    let sweep = outwardAngle - fromAngle;
    while (sweep > Math.PI) sweep -= Math.PI * 2;
    while (sweep < -Math.PI) sweep += Math.PI * 2;
    sweep = sweep >= 0 ? Math.PI : -Math.PI;

    const steps = Math.max(2, this.parameters.curveSegments * 2);
    const points: Vector2[] = [];
    for (let step = 0; step <= steps; step++) {
      const angle = fromAngle + (sweep * step) / steps;
      points.push(
        new Vector2(
          vertex.x + Math.cos(angle) * halfWidth,
          vertex.y + Math.sin(angle) * halfWidth,
        ),
      );
    }
    return points;
  }
}

/**
 * Joins an outer and an inner ring into one simple polygon by cutting a channel
 * between them.
 *
 * This is what turns a closed path's two offset rings into a filled ribbon. The
 * channel is made at the pair of vertices closest to the ring's own start, which
 * finds the two rings' near-corresponding points without needing them to have
 * matching vertex counts 鈥?a mitered outer ring and a bevelled inner one do not.
 *
 * The two duplicated vertices at the cut create the zero-width channel that the
 * ear-clipping pass then treats as an ordinary concave edge, exactly as
 * `bridgeHoles` does for a `Shape`.
 */
function spliceAnnulus(ringA: Vector2[], ringB: Vector2[]): Vector2[] {
  const a = dedupe(ringA, 1e-9);
  const b = dedupe(ringB, 1e-9);
  if (a.length < 3) return b;
  if (b.length < 3) return a;

  // The outer ring is the one enclosing more area; both wind the same way.
  const outer = Math.abs(signedArea(a)) >= Math.abs(signedArea(b)) ? a : b;
  const inner = outer === a ? b : a;

  // Cut where the two rings come closest, which is the shortest channel and the
  // least likely to cross either ring.
  let outerIndex = 0;
  let innerIndex = 0;
  let best = Infinity;
  for (let i = 0; i < outer.length; i++) {
    for (let j = 0; j < inner.length; j++) {
      const dx = outer[i].x - inner[j].x;
      const dy = outer[i].y - inner[j].y;
      const distance = dx * dx + dy * dy;
      if (distance < best) {
        best = distance;
        outerIndex = i;
        innerIndex = j;
      }
    }
  }

  const channel: Vector2[] = [];
  for (let k = 0; k <= outer.length; k++) {
    channel.push(outer[(outerIndex + k) % outer.length].clone());
  }
  // Enter the inner ring at the cut, walk it completely, and come back out.
  for (let k = 0; k <= inner.length; k++) {
    channel.push(inner[(innerIndex + k) % inner.length].clone());
  }
  return channel;
}
