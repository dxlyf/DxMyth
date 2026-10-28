import { buildUvs, buildSimpleUvs } from "./buildUvs.js";
import { transformVertices } from "./transformVertices.js";
import { GraphicsPath } from "../path/GraphicsPath.js";
import { shapeBuilders } from "./buildContextBatches.js";
function buildGeometryFromPath(options) {
  if (options instanceof GraphicsPath) {
    options = {
      path: options,
      textureMatrix: null,
      out: null
    };
  }
  const vertices = [];
  const uvs = [];
  const indices = [];
  const shapePath = options.path.shapePath;
  const textureMatrix = options.textureMatrix;
  shapePath.shapePrimitives.forEach(({ shape, transform: matrix }) => {
    const indexOffset = indices.length;
    const vertOffset = vertices.length / 2;
    const points = [];
    const build = shapeBuilders[shape.type];
    build.build(shape, points);
    if (matrix) {
      transformVertices(points, matrix);
    }
    build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
    const uvsOffset = uvs.length / 2;
    if (textureMatrix) {
      if (matrix) {
        textureMatrix.append(matrix.clone().invert());
      }
      buildUvs(vertices, 2, vertOffset, uvs, uvsOffset, 2, vertices.length / 2 - vertOffset, textureMatrix);
    } else {
      buildSimpleUvs(uvs, uvsOffset, 2, vertices.length / 2 - vertOffset);
    }
  });
  const out = options.out;
  if (out) {
    out.vertices = vertices;
    out.uvs = uvs;
    out.indices = indices;
    return out;
  }
  return {
    vertices,
    uvs,
    indices
  };
}
export {
  buildGeometryFromPath
};
