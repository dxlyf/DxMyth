import { clamp } from './MathUtils';
import { Vector3 } from './Vector3';
import type { Euler, EulerOrder } from './Euler';
import type { QuatLike } from './Quat';
import type { Vector4 } from './Vector4';

/**
 * Column-major 4x4 matrix, stored as a flat `elements` array exactly like
 * three.js (and like the layout both GLSL `mat4` and WGSL `mat4x4<f32>`
 * expect for uniform uploads).
 *
 * Element indices:
 * ```
 *  0  4  8 12
 *  1  5  9 13
 *  2  6 10 14
 *  3  7 11 15
 * ```
 */
export class Matrix4 {
  readonly elements: number[];

  constructor() {
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  // ---------------------------------------------------------------- basics --

  set(
    n11: number, n12: number, n13: number, n14: number,
    n21: number, n22: number, n23: number, n24: number,
    n31: number, n32: number, n33: number, n34: number,
    n41: number, n42: number, n43: number, n44: number,
  ): this {
    const te = this.elements;
    te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
    te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
    te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
    te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
    return this;
  }

  identity(): this {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  copy(m: { elements: ArrayLike<number> }): this {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 16; i++) te[i] = me[i];
    return this;
  }

  clone(): Matrix4 {
    return new Matrix4().copy(this);
  }

  // ------------------------------------------------------------ transforms --

  makeTranslation(x: number | Vector3, y?: number, z?: number): this {
    if (typeof x === 'object') return this.makeTranslation(x.x, x.y, x.z);
    return this.set(
      1, 0, 0, x,
      0, 1, 0, y as number,
      0, 0, 1, z as number,
      0, 0, 0, 1,
    );
  }

  makeScale(x: number, y: number, z: number): this {
    return this.set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
    );
  }

  makeRotationX(theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return this.set(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1,
    );
  }

  makeRotationY(theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return this.set(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1,
    );
  }

  makeRotationZ(theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return this.set(
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  makeRotationAxis(axis: Vector3, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const { x, y, z } = axis;
    return this.set(
      t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0,
      t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0,
      t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0,
      0, 0, 0, 1,
    );
  }

  /** Rotation from a pure shear/skew along `axis` (used for animorphs). */
  makeShear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): this {
    return this.set(
      1, yx, zx, 0,
      xy, 1, zy, 0,
      xz, yz, 1, 0,
      0, 0, 0, 1,
    );
  }

  makeBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this {
    return this.set(
      xAxis.x, yAxis.x, zAxis.x, 0,
      xAxis.y, yAxis.y, zAxis.y, 0,
      xAxis.z, yAxis.z, zAxis.z, 0,
      0, 0, 0, 1,
    );
  }

  makeRotationFromQuaternion(q: QuatLike): this {
    const { x, y, z, w } = q;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    return this.set(
      1 - (yy + zz), xy - wz, xz + wy, 0,
      xy + wz, 1 - (xx + zz), yz - wx, 0,
      xz - wy, yz + wx, 1 - (xx + yy), 0,
      0, 0, 0, 1,
    );
  }

  makeRotationFromEuler(euler: Euler | { x: number; y: number; z: number; order?: EulerOrder }): this {
    const x = euler.x;
    const y = euler.y;
    const z = euler.z;
    const order = (euler.order ?? 'XYZ') as EulerOrder;
    const a = Math.cos(x);
    const b = Math.sin(x);
    const c = Math.cos(y);
    const d = Math.sin(y);
    const e = Math.cos(z);
    const f = Math.sin(z);

    switch (order) {
      case 'XYZ': {
        const ae = a * e;
        const af = a * f;
        const be = b * e;
        const bf = b * f;
        return this.set(
          c * e, -c * f, d, 0,
          af + be * d, ae - bf * d, -b * c, 0,
          bf - ae * d, be + af * d, a * c, 0,
          0, 0, 0, 1,
        );
      }
      case 'YXZ': {
        const ce = c * e;
        const cf = c * f;
        const de = d * e;
        const df = d * f;
        return this.set(
          ce + df * b, de * b - cf, a * d, 0,
          a * f, a * e, -b, 0,
          cf * b - de, df + ce * b, a * c, 0,
          0, 0, 0, 1,
        );
      }
      case 'ZXY': {
        const ce = c * e;
        const cf = c * f;
        const de = d * e;
        const df = d * f;
        return this.set(
          ce - df * b, -a * f, de + cf * b, 0,
          cf + de * b, a * e, df - ce * b, 0,
          -a * d, b, a * c, 0,
          0, 0, 0, 1,
        );
      }
      case 'ZYX': {
        const ae = a * e;
        const af = a * f;
        const be = b * e;
        const bf = b * f;
        return this.set(
          c * e, be * d - af, ae * d + bf, 0,
          c * f, bf * d + ae, af * d - be, 0,
          -d, b * c, a * c, 0,
          0, 0, 0, 1,
        );
      }
      case 'YZX': {
        const ac = a * c;
        const ad = a * d;
        const bc = b * c;
        const bd = b * d;
        return this.set(
          c * e, bd - ac * f, bc * f + ad, 0,
          f, a * e, -b * e, 0,
          -d * e, ad * f + bc, ac - bd * f, 0,
          0, 0, 0, 1,
        );
      }
      case 'XZY': {
        const ac = a * c;
        const ad = a * d;
        const bc = b * c;
        const bd = b * d;
        return this.set(
          c * e, -f, d * e, 0,
          ac * f + bd, a * e, ad * f - bc, 0,
          bc * f - ad, b * e, bd * f + ac, 0,
          0, 0, 0, 1,
        );
      }
      default:
        throw new Error(`mini3d.Matrix4.makeRotationFromEuler: unknown order "${order}"`);
    }
  }

  // ------------------------------------------------------------- compose ----

  /**
   * Builds `T * R * S` in one pass. Hot path for every node's `updateMatrix`,
   * so no intermediate matrices are allocated.
   */
  compose(position: Vector3, quaternion: QuatLike, scale: Vector3): this {
    const te = this.elements;
    const { x, y, z, w } = quaternion;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = scale.x;
    const sy = scale.y;
    const sz = scale.z;

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;
    return this;
  }

  /** Extracts position / rotation / scale from the matrix. */
  decompose(position: Vector3, quaternion: { set(x: number, y: number, z: number, w: number): unknown }, scale: Vector3): this {
    const te = this.elements;
    let sx = Math.hypot(te[0], te[1], te[2]);
    const sy = Math.hypot(te[4], te[5], te[6]);
    const sz = Math.hypot(te[8], te[9], te[10]);
    // A negative determinant means one axis is mirrored; fold it into X.
    if (this.determinant() < 0) sx = -sx;

    position.set(te[12], te[13], te[14]);

    _decomposeMatrix.copy(this);
    const invSX = 1 / (sx || 1);
    const invSY = 1 / (sy || 1);
    const invSZ = 1 / (sz || 1);
    const me = _decomposeMatrix.elements;
    me[0] *= invSX; me[1] *= invSX; me[2] *= invSX;
    me[4] *= invSY; me[5] *= invSY; me[6] *= invSY;
    me[8] *= invSZ; me[9] *= invSZ; me[10] *= invSZ;

    quaternion.set(0, 0, 0, 1);
    quatFromRotationMatrix(me, quaternion as unknown as { x: number; y: number; z: number; w: number });
    scale.set(sx, sy, sz);
    return this;
  }

  // ---------------------------------------------------------- multiplication

  multiply(m: { elements: ArrayLike<number> }): this {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m: { elements: ArrayLike<number> }): this {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a: { elements: ArrayLike<number> }, b: { elements: ArrayLike<number> }): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  multiplyScalar(s: number): this {
    const te = this.elements;
    for (let i = 0; i < 16; i++) te[i] *= s;
    return this;
  }

  // ------------------------------------------------------------ properties --

  determinant(): number {
    const te = this.elements;
    const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

    return (
      n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
      n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
      n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
      n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
    );
  }

  transpose(): this {
    const te = this.elements;
    let tmp: number;
    tmp = te[1]; te[1] = te[4]; te[4] = tmp;
    tmp = te[2]; te[2] = te[8]; te[8] = tmp;
    tmp = te[6]; te[6] = te[9]; te[9] = tmp;
    tmp = te[3]; te[3] = te[12]; te[12] = tmp;
    tmp = te[7]; te[7] = te[13]; te[13] = tmp;
    tmp = te[11]; te[11] = te[14]; te[14] = tmp;
    return this;
  }

  setPosition(x: number | Vector3, y?: number, z?: number): this {
    const te = this.elements;
    if (typeof x === 'object') {
      te[12] = x.x;
      te[13] = x.y;
      te[14] = x.z;
    } else {
      te[12] = x;
      te[13] = y as number;
      te[14] = z as number;
    }
    return this;
  }

  invert(): this {
    const te = this.elements;
    const n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3];
    const n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7];
    const n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11];
    const n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15];

    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0) {
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return this;
  }

  /** Upper-left 3x3 of the inverse-transpose; the normal matrix. */
  getNormalMatrix(matrix4: { elements: ArrayLike<number> }): this {
    const me = matrix4.elements;
    return this.set(
      me[0], me[4], me[8], 0,
      me[1], me[5], me[9], 0,
      me[2], me[6], me[10], 0,
      0, 0, 0, 1,
    ).invert().transpose();
  }

  /** Full inverse then transpose (three.js naming kept for familiarity). */
  copyPosition(m: { elements: ArrayLike<number> }): this {
    const te = this.elements;
    const me = m.elements;
    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];
    return this;
  }

  extractRotation(m: { elements: ArrayLike<number> }): this {
    const te = this.elements;
    const me = m.elements;
    const scaleXInv = 1 / (Math.hypot(me[0], me[1], me[2]) || 1);
    const scaleYInv = 1 / (Math.hypot(me[4], me[5], me[6]) || 1);
    const scaleZInv = 1 / (Math.hypot(me[8], me[9], me[10]) || 1);

    te[0] = me[0] * scaleXInv;
    te[1] = me[1] * scaleXInv;
    te[2] = me[2] * scaleXInv;
    te[3] = 0;

    te[4] = me[4] * scaleYInv;
    te[5] = me[5] * scaleYInv;
    te[6] = me[6] * scaleYInv;
    te[7] = 0;

    te[8] = me[8] * scaleZInv;
    te[9] = me[9] * scaleZInv;
    te[10] = me[10] * scaleZInv;
    te[11] = 0;

    te[15] = 1;
    return this;
  }

  // ------------------------------------------------------------ projections -

  /**
   * Right-handed perspective projection producing clip-space z in `[-1, 1]`,
   * which matches both GL and WebGPU after the depth-range remap in the
   * WebGPU backend.
   */
  makePerspective(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
    coordinateSystem: 'webgl' | 'webgpu' = 'webgl',
  ): this {
    const x = (2 * near) / (right - left);
    const y = (2 * near) / (top - bottom);
    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    const c = -(far + near) / (far - near);
    const d = (-2 * far * near) / (far - near);
    const te = this.elements;
    te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
    te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
    te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
    te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;
    void coordinateSystem;
    return this;
  }

  makeOrthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
    coordinateSystem: 'webgl' | 'webgpu' = 'webgl',
  ): this {
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (far - near);
    const x = (right + left) * w;
    const y = (top + bottom) * h;
    const z = (far + near) * p;
    const te = this.elements;
    te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x;
    te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y;
    te[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z;
    te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
    void coordinateSystem;
    return this;
  }

  /** Builds a view matrix looking from `eye` towards `target`. */
  lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    const te = this.elements;
    _z.subVectors(eye, target);
    if (_z.lengthSq() === 0) _z.z = 1;
    _z.normalize();
    _x.crossVectors(up, _z);
    if (_x.lengthSq() === 0) {
      // `up` is parallel to the view direction: nudge it.
      if (Math.abs(up.z) === 1) _z.x += 0.0001;
      else _z.z += 0.0001;
      _z.normalize();
      _x.crossVectors(up, _z);
    }
    _x.normalize();
    _y.crossVectors(_z, _x);

    te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
    te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
    te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;
    return this;
  }

  // ------------------------------------------------------------------ misc --

  /** Copies the upper-left 3x3 into `this` (as a 4x4 with identity remainder). */
  setFromMatrix3(m: { elements: ArrayLike<number> }): this {
    const me = m.elements;
    return this.set(
      me[0], me[3], me[6], 0,
      me[1], me[4], me[7], 0,
      me[2], me[5], me[8], 0,
      0, 0, 0, 1,
    );
  }

  equals(m: { elements: ArrayLike<number> }): boolean {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i]) return false;
    }
    return true;
  }

  /** Matrix * `[x, y, z, w]` without allocating a Vector4. */
  transformPoint3(x: number, y: number, z: number, target: Vector3): Vector3 {
    const te = this.elements;
    const w = 1 / (te[3] * x + te[7] * y + te[11] * z + te[15] || 1);
    return target.set(
      (te[0] * x + te[4] * y + te[8] * z + te[12]) * w,
      (te[1] * x + te[5] * y + te[9] * z + te[13]) * w,
      (te[2] * x + te[6] * y + te[10] * z + te[14]) * w,
    );
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    const te = this.elements;
    for (let i = 0; i < 16; i++) target[offset + i] = te[i];
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    const te = this.elements;
    for (let i = 0; i < 16; i++) te[i] = source[offset + i];
    return this;
  }

  /** Scales the basis vectors (used when baking a bounding-box transform). */
  scale(v: Vector3): this {
    const te = this.elements;
    te[0] *= v.x; te[4] *= v.y; te[8] *= v.z;
    te[1] *= v.x; te[5] *= v.y; te[9] *= v.z;
    te[2] *= v.x; te[6] *= v.y; te[10] *= v.z;
    return this;
  }

  /** Post-multiplies by a translation (cheaper than building a matrix). */
  translate(v: Vector3): this {
    const te = this.elements;
    te[12] += v.x;
    te[13] += v.y;
    te[14] += v.z;
    return this;
  }

  /** Human readable dump used in test failure output. */
  toString(): string {
    const te = this.elements;
    const rows: string[] = [];
    for (let r = 0; r < 4; r++) {
      rows.push(
        `[${te[r].toFixed(4)} ${te[r + 4].toFixed(4)} ${te[r + 8].toFixed(4)} ${te[r + 12].toFixed(4)}]`,
      );
    }
    return `Matrix4(\n  ${rows.join('\n  ')}\n)`;
  }

  static get identity(): Matrix4 {
    return new Matrix4();
  }
}

const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _decomposeMatrix = new Matrix4();

/** Writes a unit quaternion decoded from a 4x4 rotation part. */
function quatFromRotationMatrix(
  e: ArrayLike<number>,
  target: { x: number; y: number; z: number; w: number },
): void {
  const trace = e[0] + e[5] + e[10];
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    target.x = (e[6] - e[9]) * s;
    target.y = (e[8] - e[2]) * s;
    target.z = (e[1] - e[4]) * s;
    target.w = 0.25 / s;
    return;
  }
  if (e[0] > e[5] && e[0] > e[10]) {
    const s = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]);
    target.x = 0.25 * s;
    target.y = (e[4] + e[1]) / s;
    target.z = (e[8] + e[2]) / s;
    target.w = (e[6] - e[9]) / s;
    return;
  }
  if (e[5] > e[10]) {
    const s = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]);
    target.x = (e[4] + e[1]) / s;
    target.y = 0.25 * s;
    target.z = (e[9] + e[6]) / s;
    target.w = (e[8] - e[2]) / s;
    return;
  }
  const s = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]);
  target.x = (e[8] + e[2]) / s;
  target.y = (e[9] + e[6]) / s;
  target.z = 0.25 * s;
  target.w = (e[1] - e[4]) / s;
}

/** Re-exported for consumers that only want the type. */
export type { Vector4 };
