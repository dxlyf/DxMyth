import { BufferGeometry } from '../core/BufferGeometry';
import type { Curve } from '../curves/Curve';
import { Vector2 } from '../math/Vector2';
import type { Vector3 } from '../math/Vector3';

/**
 * A curve sampled into a **line list**: one segment per consecutive sample pair.
 *
 * The library's other generators emit indexed triangle surfaces, which is the
 * wrong shape for drawing a curve. This fills that gap in the same style, so a
 * sampled curve can be handed to `LineSegments` like any other geometry:
 *
 * ```ts
 * const geometry = new SampledCurveGeometry(
 *   new EllipseCurve(0, 0, 1, 0.6, 0, Math.PI * 2, false),
 *   { divisions: 96, closed: true },
 * );
 * scene.add(new LineSegments(geometry, new LineBasicMaterial({ color: 0x4499ff })));
 * ```
 *
 * Positions are unindexed and laid out as `(a, b), (b, c), ...`, matching what
 * the renderers' line path expects. `closed` repeats the first sample at the end
 * so the loop is complete.
 */
export class SampledCurveGeometry extends BufferGeometry {
  readonly isSampledCurveGeometry = true;

  parameters: { divisions: number; closed: boolean };

  constructor(
    source: Curve | Vector2[] | Vector3[],
    options: { divisions?: number; closed?: boolean } = {},
  ) {
    super();
    this.name = 'SampledCurveGeometry';

    const divisions = Math.max(1, Math.floor(options.divisions ?? 64));
    const closed = options.closed ?? (Array.isArray(source) ? false : source.closed);
    this.parameters = { divisions, closed };

    const samples = Array.isArray(source)
      ? source
      : ((source as Curve).getPoints(divisions) as (Vector2 | Vector3)[]);

    const positions: number[] = [];
    const count = samples.length;
    if (count >= 2) {
      const segments = closed ? count : count - 1;
      for (let i = 0; i < segments; i++) {
        const a = samples[i];
        const b = samples[(i + 1) % count];
        positions.push(a.x, a.y, 'z' in a ? (a as Vector3).z : 0);
        positions.push(b.x, b.y, 'z' in b ? (b as Vector3).z : 0);
      }
    }

    this.setPosition(positions);
    this.setDrawMode('lines');
  }
}
