import { Vector2 } from '../math/Vector2';

/**
 * Signed area of a polygon.
 *
 * Follows the shoelace convention: **negative is counter-clockwise**. That is the
 * opposite sign to the usual maths-textbook statement of the formula because the
 * sum here is written as `(x_j + x_i)(y_j - y_i)`, the same form three.js uses,
 * and it is the convention the ear-clipping pass below depends on.
 */
export function signedArea(points: Vector2[]): number {
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  return area / 2;
}

/** Drops consecutive duplicates, which ear clipping cannot tolerate. */
export function dedupe(points: Vector2[], epsilon = 1e-9): Vector2[] {
  const out: Vector2[] = [];
  for (const point of points) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - point.x) < epsilon && Math.abs(last.y - point.y) < epsilon) {
      continue;
    }
    out.push(point);
  }
  // A closed ring often repeats its first point at the end.
  while (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.abs(first.x - last.x) < epsilon && Math.abs(first.y - last.y) < epsilon) out.pop();
    else break;
  }
  return out;
}

/** `true` when `p` is inside the triangle `a, b, c` (inclusive of edges). */
function pointInTriangle(p: Vector2, a: Vector2, b: Vector2, c: Vector2): boolean {
  const d1 = (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
  const d2 = (p.x - c.x) * (b.y - c.y) - (b.x - c.x) * (p.y - c.y);
  const d3 = (p.x - a.x) * (c.y - a.y) - (c.x - a.x) * (p.y - a.y);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;
  // All on the same side (or on an edge) means inside.
  return !(hasNegative && hasPositive);
}

/**
 * Ear-clipping triangulation of a simple polygon.
 *
 * Deliberately dependency-free and O(n^2): the paths a 2D `Shape` produces are
 * tens to low hundreds of points, and the alternative is a sweep-line algorithm
 * that costs far more code than it saves here.
 *
 * Winding is normalised to counter-clockwise first, so callers can pass a
 * clockwise outline (the usual result of drawing in screen coordinates) without
 * getting inside-out triangles.
 */
export function triangulate(points: Vector2[]): number[] {
  const ring = dedupe(points);
  if (ring.length < 3) return [];
  // Ear clipping below assumes counter-clockwise winding, which `signedArea`
  // reports as negative.
  if (signedArea(ring) > 0) ring.reverse();

  // Indices into `ring`, consumed as ears are clipped.
  const remaining = ring.map((_, index) => index);
  const indices: number[] = [];
  let guard = remaining.length * remaining.length;

  while (remaining.length > 3 && guard-- > 0) {
    let clipped = false;

    for (let i = 0; i < remaining.length; i++) {
      const i0 = remaining[(i + remaining.length - 1) % remaining.length];
      const i1 = remaining[i];
      const i2 = remaining[(i + 1) % remaining.length];
      const a = ring[i0];
      const b = ring[i1];
      const c = ring[i2];

      // Convex corner? Cross product > 0 for counter-clockwise winding.
      const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      if (cross <= 0) continue;

      // An ear is only valid when no other vertex lies inside it.
      let containsOther = false;
      for (const index of remaining) {
        if (index === i0 || index === i1 || index === i2) continue;
        if (pointInTriangle(ring[index], a, b, c)) {
          containsOther = true;
          break;
        }
      }
      if (containsOther) continue;

      indices.push(i0, i1, i2);
      remaining.splice(i, 1);
      clipped = true;
      break;
    }

    // No ear found: the polygon is self-intersecting or degenerate. Stop rather
    // than loop forever; the caller still gets a partial mesh.
    if (!clipped) break;
  }

  if (remaining.length === 3) {
    indices.push(remaining[0], remaining[1], remaining[2]);
  }
  return indices;
}

/** Linearly interpolates between two points by `amount`. */
export function lerpPoint(a: Vector2, b: Vector2, amount: number, target = new Vector2()): Vector2 {
  return target.set(a.x + (b.x - a.x) * amount, a.y + (b.y - a.y) * amount);
}

/**
 * Removes points that are collinear with their neighbours.
 *
 * Offsetting a straight run of a path produces many redundant vertices at the
 * same join angle, and every one of them costs a join evaluation and triangles.
 */
export function simplifyCollinear(points: Vector2[], epsilon = 1e-6): Vector2[] {
  const ring = dedupe(points);
  if (ring.length < 3) return ring;

  const out: Vector2[] = [];
  for (let i = 0; i < ring.length; i++) {
    const previous = ring[(i + ring.length - 1) % ring.length];
    const current = ring[i];
    const next = ring[(i + 1) % ring.length];
    const cross =
      (current.x - previous.x) * (next.y - previous.y) -
      (current.y - previous.y) * (next.x - previous.x);
    if (Math.abs(cross) > epsilon) out.push(current);
  }
  return out.length >= 3 ? out : ring;
}
