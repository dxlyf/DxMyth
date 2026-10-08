import { CylinderGeometry } from './CylinderGeometry';

/** Parameter record of a `ConeGeometry` (three.js parity). */
export interface ConeGeometryParameters {
  radius: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  thetaStart: number;
  thetaLength: number;
}

/**
 * Cone topology: exactly the `CylinderGeometry` topology built with
 * `radiusTop = 0`. The top ring therefore collapses onto the apex (its
 * degenerate triangles are skipped by the cylinder builder) and the top cap is
 * never generated; the base keeps the cylinder's bottom-cap fan with planar
 * disc UVs, and the side keeps the wrapping `u` plus the slope-tilted normals
 * that make a cone shade like a smooth lateral surface.
 */
export class ConeGeometry extends CylinderGeometry<ConeGeometryParameters> {
  constructor(
    radius = 1,
    height = 1,
    radialSegments = 32,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
  ) {
    super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    this.name = 'ConeGeometry';
    // A cone is described by a single radius, so it publishes its own record
    // rather than the cylinder's `radiusTop` / `radiusBottom` pair.
    this.parameters = {
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    };
  }
}
