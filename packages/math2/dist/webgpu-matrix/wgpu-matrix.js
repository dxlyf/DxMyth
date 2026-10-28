import { ZeroArray } from "./types.js";
import { getAPI as getAPI$5 } from "./mat3-impl.js";
import { getAPI as getAPI$4 } from "./mat4-impl.js";
import { getAPI as getAPI$3 } from "./quat-impl.js";
import { getAPI as getAPI$2 } from "./vec2-impl.js";
import { getAPI as getAPI$1 } from "./vec3-impl.js";
import { getAPI } from "./vec4-impl.js";
import * as utils from "./utils.js";
function wgpuMatrixAPI(Mat3Ctor, Mat4Ctor, QuatCtor, Vec2Ctor, Vec3Ctor, Vec4Ctor) {
  return {
    /** @namespace mat3 */
    mat3: getAPI$5(Mat3Ctor),
    /** @namespace mat4 */
    mat4: getAPI$4(Mat4Ctor),
    /** @namespace quat */
    quat: getAPI$3(QuatCtor),
    /** @namespace vec2 */
    vec2: getAPI$2(Vec2Ctor),
    /** @namespace vec3 */
    vec3: getAPI$1(Vec3Ctor),
    /** @namespace vec4 */
    vec4: getAPI(Vec4Ctor)
  };
}
const {
  /**
   * 3x3 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat3,
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4,
  /**
   * Quaternion functions that default to returning `Float32Array`
   * @namespace
   */
  quat,
  /**
   * Vec2 functions that default to returning `Float32Array`
   * @namespace
   */
  vec2,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec4
} = wgpuMatrixAPI(
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array,
  Float32Array
);
const {
  /**
   * 3x3 Matrix functions that default to returning `Float64Array`
   * @namespace
   */
  mat3: mat3d,
  /**
   * 4x4 Matrix functions that default to returning `Float64Array`
   * @namespace
   */
  mat4: mat4d,
  /**
   * Quaternion functions that default to returning `Float64Array`
   * @namespace
   */
  quat: quatd,
  /**
   * Vec2 functions that default to returning `Float64Array`
   * @namespace
   */
  vec2: vec2d,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec3: vec3d,
  /**
   * Vec3 functions that default to returning `Float64Array`
   * @namespace
   */
  vec4: vec4d
} = wgpuMatrixAPI(
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array,
  Float64Array
);
const {
  /**
   * 3x3 Matrix functions that default to returning `number[]`
   * @namespace
   */
  mat3: mat3n,
  /**
   * 4x4 Matrix functions that default to returning `number[]`
   * @namespace
   */
  mat4: mat4n,
  /**
   * Quaternion functions that default to returning `number[]`
   * @namespace
   */
  quat: quatn,
  /**
   * Vec2 functions that default to returning `number[]`
   * @namespace
   */
  vec2: vec2n,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec3: vec3n,
  /**
   * Vec3 functions that default to returning `number[]`
   * @namespace
   */
  vec4: vec4n
} = wgpuMatrixAPI(
  ZeroArray,
  Array,
  Array,
  Array,
  Array,
  Array
);
export {
  mat3,
  mat3d,
  mat3n,
  mat4,
  mat4d,
  mat4n,
  quat,
  quatd,
  quatn,
  utils,
  vec2,
  vec2d,
  vec2n,
  vec3,
  vec3d,
  vec3n,
  vec4,
  vec4d,
  vec4n
};
