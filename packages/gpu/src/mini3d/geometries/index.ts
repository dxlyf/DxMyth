/**
 * Procedural geometry generators. Every class extends `BufferGeometry`, is
 * constructed with the three.js-compatible argument list, and records those
 * arguments in its `parameters` object. All generators emit `position`,
 * `normal` and `uv` attributes and index their triangles counter-clockwise when
 * seen from outside the surface (`EdgesGeometry` and `WireframeGeometry` are
 * line geometries and therefore carry positions only).
 */
export { BoxGeometry } from './BoxGeometry';
export { PlaneGeometry } from './PlaneGeometry';
export { SphereGeometry } from './SphereGeometry';
export { CylinderGeometry, type CylinderGeometryParameters } from './CylinderGeometry';
export { ConeGeometry, type ConeGeometryParameters } from './ConeGeometry';
export { TorusGeometry } from './TorusGeometry';
export { TorusKnotGeometry } from './TorusKnotGeometry';
export { CircleGeometry } from './CircleGeometry';
export { RingGeometry } from './RingGeometry';
export {
  PolyhedronGeometry,
  type PolyhedronGeometryParameters,
} from './PolyhedronGeometry';
export { IcosahedronGeometry, type IcosahedronGeometryParameters } from './IcosahedronGeometry';
export { EdgesGeometry } from './EdgesGeometry';
export { WireframeGeometry } from './WireframeGeometry';
export { ShapeGeometry } from './ShapeGeometry';
export { SampledCurveGeometry } from './SampledCurveGeometry';
export {
  StrokeGeometry,
  type LineCap,
  type LineJoin,
  type StrokeOptions,
} from './StrokeGeometry';
export { triangulate, signedArea, dedupe, simplifyCollinear } from './triangulate';
