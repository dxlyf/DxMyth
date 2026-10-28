import { earcut } from "../earcut.js";
class ShapeUtils {
  static addShapes(shapes, curveSegments = 12) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    function addShape(shape, curveSegments2 = 12) {
      const indexOffset = vertices.length / 3;
      const points = shape.extractPoints(curveSegments2);
      let shapeVertices = points.shape;
      const shapeHoles = points.holes;
      if (ShapeUtils.isClockWise(shapeVertices) === false) {
        shapeVertices = shapeVertices.reverse();
      }
      for (let i = 0, l = shapeHoles.length; i < l; i++) {
        const shapeHole = shapeHoles[i];
        if (ShapeUtils.isClockWise(shapeHole) === true) {
          shapeHoles[i] = shapeHole.reverse();
        }
      }
      const faces = ShapeUtils.triangulateShape(shapeVertices, shapeHoles);
      for (let i = 0, l = shapeHoles.length; i < l; i++) {
        const shapeHole = shapeHoles[i];
        shapeVertices = shapeVertices.concat(shapeHole);
      }
      for (let i = 0, l = shapeVertices.length; i < l; i++) {
        const vertex = shapeVertices[i];
        vertices.push(vertex.x, vertex.y, 0);
        normals.push(0, 0, 1);
        uvs.push(vertex.x, vertex.y);
      }
      for (let i = 0, l = faces.length; i < l; i++) {
        const face = faces[i];
        const a = face[0] + indexOffset;
        const b = face[1] + indexOffset;
        const c = face[2] + indexOffset;
        indices.push(a, b, c);
      }
    }
    shapes.forEach((shape) => {
      addShape(shape, curveSegments);
    });
    return {
      vertices,
      normals,
      uvs,
      indices
    };
  }
  /**
   * 计算 2D 轮廓多边形面积（鞋带公式）。
   * @param contour 2D 点数组
   */
  static area(contour) {
    const n = contour.length;
    let a = 0;
    for (let p = n - 1, q = 0; q < n; p = q++) {
      a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
    }
    return a * 0.5;
  }
  /**
   * 判断轮廓是否为顺时针绕向。
   * @param pts 定义多边形的 2D 点数组
   */
  static isClockWise(pts) {
    return ShapeUtils.area(pts) < 0;
  }
  /**
   * 三角化形状定义（外轮廓 + 孔洞）。
   * @param contour 外轮廓点数组
   * @param holes 孔洞点数组的数组
   * @return 每个面为三个顶点的索引数组
   */
  static triangulateShape(contour, holes) {
    const vertices = [];
    const holeIndices = [];
    const faces = [];
    removeDupEndPts(contour);
    addContour(vertices, contour);
    let holeIndex = contour.length;
    holes.forEach(removeDupEndPts);
    for (let i = 0; i < holes.length; i++) {
      holeIndices.push(holeIndex);
      holeIndex += holes[i].length;
      addContour(vertices, holes[i]);
    }
    const triangles = earcut(vertices, holeIndices);
    for (let i = 0; i < triangles.length; i += 3) {
      faces.push(triangles.slice(i, i + 3));
    }
    return faces;
  }
}
function removeDupEndPts(points) {
  const l = points.length;
  if (l > 2 && points[l - 1].x === points[0].x && points[l - 1].y === points[0].y) {
    points.pop();
  }
}
function addContour(vertices, contour) {
  for (let i = 0; i < contour.length; i++) {
    vertices.push(contour[i].x);
    vertices.push(contour[i].y);
  }
}
export {
  ShapeUtils
};
