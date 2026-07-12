// types
import type { Mat2, Mat2Like } from './mat2.js';
import type { Mat2d, Mat2dLike } from './mat2d.js';
import type { Mat3, Mat3Like } from './mat3.js';
import type { Mat4, Mat4Like } from './mat4.js';
import type { Quat, QuatLike } from './quat.js';
import type { Quat2, Quat2Like } from './quat2.js';
import type { Vec2, Vec2Like } from './vec2.js';
import type { Vec3, Vec3Like } from './vec3.js';
import type { Vec4, Vec4Like } from './vec4.js';
import type { FloatArray } from './common.js';
import type { EnableSwizzles } from './swizzle.js';

// values
import { mat2 } from './mat2.js';
import { mat2d } from './mat2d.js';
import { mat3 } from './mat3.js';
import { mat4 } from './mat4.js';
import { quat } from './quat.js';
import { quat2 } from './quat2.js';
import { vec2 } from './vec2.js';
import { vec3 } from './vec3.js';
import { vec4 } from './vec4.js';

export type {
  Mat2, Mat2Like,
  Mat2d, Mat2dLike,
  Mat3, Mat3Like,
  Mat4, Mat4Like,
  Quat, QuatLike,
  Quat2, Quat2Like,
  Vec2, Vec2Like,
  Vec3, Vec3Like,
  Vec4, Vec4Like,
  FloatArray,
  EnableSwizzles
};

export {
  mat2, mat2d, mat3, mat4,
  quat, quat2,
  vec2, vec3, vec4
};