import { PathBuilder } from "../math/PathBuilder.js";
import { generateOutline } from "../math/GenerateOutline.js";
import { dashContours } from "../math/PathDash.js";
import { LineJoin, LineCap } from "../math/PathStroke.js";
import { tesselate } from "../math/tess2-ts/index.js";
import { WINDING } from "../math/tess2-ts/utils/constants.js";
const EMPTY_MESH = { positions: new Float32Array(0), indices: new Uint32Array(0) };
function isEmptyMesh(mesh) {
  return mesh.indices.length === 0;
}
function flattenPath(path, options = {}) {
  const tolerance = Math.max(1e-4, options.tolerance ?? 0.25);
  const builder = new PathBuilder();
  path.visit({
    moveTo: (c) => builder.moveTo(c.x, c.y),
    lineTo: (c) => builder.lineTo(c.x, c.y),
    bezierCurveTo: (c) => builder.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y),
    quadraticCurveTo: (c) => builder.quadraticCurveTo(c.cpx, c.cpy, c.x, c.y),
    closePath: () => builder.closePath(),
    rect: (c) => builder.rect(c.x, c.y, c.w, c.h),
    roundRect: (c) => builder.roundRect(c.x, c.y, c.w, c.h, c.radii),
    arc: (c) => builder.arc(c.x, c.y, c.radius, c.startAngle, c.endAngle, c.counterclockwise),
    arcTo: (c) => builder.arcTo(c.x1, c.y1, c.x2, c.y2, c.radius),
    ellipse: (c) => builder.ellipse(c.x, c.y, c.radiusX, c.radiusY, c.rotation, c.startAngle, c.endAngle, c.counterclockwise)
  });
  return builder.getSubPaths({ tolerance, autoClose: false, skipDegenerate: true }).map((contour) => ({
    points: toFlatPoints(contour.points),
    closed: contour.closed
  }));
}
function tessellateFill(contours, fillRule = "nonzero") {
  const inputs = [];
  for (const contour of contours) {
    if (contour.points.length >= 6) inputs.push(contour.points);
  }
  if (inputs.length === 0) return EMPTY_MESH;
  let result;
  try {
    result = tesselate({
      windingRule: fillRule === "evenodd" ? WINDING.ODD : WINDING.NONZERO,
      polySize: 3,
      vertexSize: 2,
      normal: [0, 0, 1],
      contours: inputs
    });
  } catch {
    return EMPTY_MESH;
  }
  if (!result || result.elementCount === 0) return EMPTY_MESH;
  const positions = new Float32Array(result.vertices);
  const indices = new Uint32Array(result.elements.length);
  let count = 0;
  for (let i = 0; i < result.elements.length; i++) {
    const index = result.elements[i];
    if (index < 0) continue;
    indices[count++] = index;
  }
  return { positions, indices: indices.subarray(0, count) };
}
function tessellateStroke(contours, options) {
  const polygons = buildStrokePolygons(contours, options);
  if (polygons.length === 0) return EMPTY_MESH;
  return tessellateFill(
    polygons.map((points) => ({ points, closed: true })),
    "nonzero"
  );
}
function buildStrokePolygons(contours, options) {
  const dash = options.lineDash && options.lineDash.length > 0 ? { intervals: options.lineDash, phase: options.lineDashOffset ?? 0 } : null;
  const fragments = dashContours(contours.map(toFlattenedContour), dash);
  const outline = generateOutline(fragments, {
    lineWidth: Math.max(1e-4, options.lineWidth ?? 1),
    lineCap: toPathLineCap(options.lineCap),
    lineJoin: toPathLineJoin(options.lineJoin),
    miterLimit: Math.max(1, options.miterLimit ?? 10)
  });
  return outline.map((contour) => makeCcw(toFlatPoints(contour.points)));
}
function toFlattenedContour(contour) {
  const flat = contour.points;
  const count = flat.length >> 1;
  const points = new Array(count);
  for (let i = 0; i < count; i++) {
    points[i] = { x: flat[i * 2], y: flat[i * 2 + 1] };
  }
  return { points, closed: contour.closed };
}
function toFlatPoints(points) {
  const out = new Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    out[i * 2] = points[i].x;
    out[i * 2 + 1] = points[i].y;
  }
  return out;
}
function toPathLineCap(cap) {
  return cap === "round" ? LineCap.Round : cap === "square" ? LineCap.Square : LineCap.Butt;
}
function toPathLineJoin(join) {
  return join === "round" ? LineJoin.Round : join === "bevel" ? LineJoin.Bevel : LineJoin.Miter;
}
function makeCcw(points) {
  if (signedArea(points) < 0) {
    const out = [];
    for (let i = points.length - 2; i >= 0; i -= 2) out.push(points[i], points[i + 1]);
    return out;
  }
  return points;
}
function signedArea(points) {
  let area = 0;
  const n = points.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    area += points[j * 2] * points[i * 2 + 1] - points[i * 2] * points[j * 2 + 1];
  }
  return area / 2;
}
export {
  EMPTY_MESH,
  buildStrokePolygons,
  flattenPath,
  isEmptyMesh,
  tessellateFill,
  tessellateStroke
};
