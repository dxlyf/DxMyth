import { Tesselator } from "./Tesselator.js";
import { WINDING, ELEMENT } from "./utils/constants.js";
function tesselate({
  windingRule = WINDING.ODD,
  elementType = ELEMENT.POLYGONS,
  polySize = 3,
  vertexSize = 2,
  normal = [0, 0, 1],
  contours = [],
  strict = true,
  debug = false
}) {
  if (!contours && strict) {
    throw new Error("Contours can't be empty");
  }
  if (!contours) {
    return void 0;
  }
  const tess = new Tesselator();
  for (let i = 0; i < contours.length; i++) {
    tess.addContour(vertexSize || 2, contours[i]);
  }
  tess.tesselate(
    windingRule,
    elementType,
    polySize,
    vertexSize,
    normal,
    strict
  );
  return {
    vertices: tess.vertices,
    vertexIndices: tess.vertexIndices,
    vertexCount: tess.vertexCount,
    elements: tess.elements,
    elementCount: tess.elementCount,
    mesh: debug ? tess.mesh : void 0
  };
}
const WINDING_ODD = WINDING.ODD;
const WINDING_NONZERO = WINDING.NONZERO;
const WINDING_POSITIVE = WINDING.POSITIVE;
const WINDING_NEGATIVE = WINDING.NEGATIVE;
const WINDING_ABS_GEQ_TWO = WINDING.ABS_GEQ_TWO;
const POLYGONS = ELEMENT.POLYGONS;
const CONNECTED_POLYGONS = ELEMENT.CONNECTED_POLYGONS;
const BOUNDARY_CONTOURS = ELEMENT.BOUNDARY_CONTOURS;
export {
  BOUNDARY_CONTOURS,
  CONNECTED_POLYGONS,
  ELEMENT,
  POLYGONS,
  Tesselator,
  WINDING,
  WINDING_ABS_GEQ_TWO,
  WINDING_NEGATIVE,
  WINDING_NONZERO,
  WINDING_ODD,
  WINDING_POSITIVE,
  tesselate
};
