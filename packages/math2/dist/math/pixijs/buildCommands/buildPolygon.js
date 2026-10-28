import { triangulateWithHoles } from "../utils/triangulateWithHoles.js";
const emptyArray = [];
const buildPolygon = {
  extension: {
    name: "polygon"
  },
  build(shape, points) {
    for (let i = 0; i < shape.points.length; i++) {
      points[i] = shape.points[i];
    }
    return true;
  },
  triangulate(points, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
    triangulateWithHoles(points, emptyArray, vertices, verticesStride, verticesOffset, indices, indicesOffset);
  }
};
export {
  buildPolygon
};
