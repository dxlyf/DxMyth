import { DEG2RAD, RAD2DEG, clamp } from './MathUtils';

export type EulerOrder = 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY';

/**
 * Euler angles in radians, stored per-axis with an explicit rotation order.
 * The class is intentionally dumb: `Quat.setFromEuler` owns the maths, which
 * mirrors three.js and lets both share one conversion table.
 */
export class Euler {
  x: number;
  y: number;
  z: number;
  order: EulerOrder;

  constructor(x = 0, y = 0, z = 0, order: EulerOrder = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  get isEuler(): true {
    return true;
  }

  set(x: number, y: number, z: number, order: EulerOrder = this.order): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }

  clone(): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  copy(e: Euler): this {
    return this.set(e.x, e.y, e.z, e.order);
  }

  /** Rebuilds `this` from a unit quaternion. */
  setFromQuat(q: { x: number; y: number; z: number; w: number }, order: EulerOrder = this.order): this {
    this.order = order;
    const { x, y, z, w } = q;
    const m11 = 1 - 2 * (y * y + z * z);
    const m12 = 2 * (x * y - z * w);
    const m13 = 2 * (x * z + y * w);
    const m21 = 2 * (x * y + z * w);
    const m22 = 1 - 2 * (x * x + z * z);
    const m23 = 2 * (y * z - x * w);
    const m31 = 2 * (x * z - y * w);
    const m32 = 2 * (y * z + x * w);
    const m33 = 1 - 2 * (x * x + y * y);

    switch (order) {
      case 'XYZ': {
        this.y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this.x = Math.atan2(-m23, m33);
          this.z = Math.atan2(-m12, m11);
        } else {
          this.x = Math.atan2(m12, m22);
          this.z = 0;
        }
        break;
      }
      case 'YXZ': {
        this.x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this.y = Math.atan2(m13, m33);
          this.z = Math.atan2(m12, m22);
        } else {
          this.y = Math.atan2(-m12, m11);
          this.z = 0;
        }
        break;
      }
      case 'ZXY': {
        this.x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this.y = Math.atan2(-m31, m33);
          this.z = Math.atan2(-m12, m22);
        } else {
          this.y = 0;
          this.z = Math.atan2(m21, m11);
        }
        break;
      }
      case 'ZYX': {
        this.y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this.x = Math.atan2(m32, m33);
          this.z = Math.atan2(m21, m11);
        } else {
          this.x = 0;
          this.z = Math.atan2(-m12, m22);
        }
        break;
      }
      case 'YZX': {
        this.z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this.x = Math.atan2(-m23, m22);
          this.y = Math.atan2(-m31, m11);
        } else {
          this.x = 0;
          this.y = Math.atan2(m13, m33);
        }
        break;
      }
      case 'XZY': {
        this.z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this.x = Math.atan2(m32, m22);
          this.y = Math.atan2(m13, m11);
        } else {
          this.x = Math.atan2(-m23, m33);
          this.y = 0;
        }
        break;
      }
      default:
        throw new Error(`mini3d.Euler: unknown order "${order}"`);
    }
    return this;
  }

  /** Convenience: sets the angles from a Matrix4's rotation part. */
  setFromRotationMatrix(m: { elements: ArrayLike<number> }, order: EulerOrder = this.order): this {
    // Recover the unit quaternion from the rotation matrix, then decompose.
    return this.setFromQuat(quatFromRotationMatrix(m), order);
  }

  setFromVector3(v: { x: number; y: number; z: number }): this {
    return this.set(v.x, v.y, v.z, this.order);
  }

  reorder(order: EulerOrder): this {
    // Route through a quaternion so any order can be reached from any order.
    const q = _scratchQuatFromEuler.setFromEuler(this);
    return this.setFromQuat(q, order);
  }

  equals(e: Euler): boolean {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
  }

  fromArray(source: ArrayLike<number>): this {
    this.x = source[0];
    this.y = source[1];
    this.z = source[2];
    const order = source[3];
    if (order !== undefined) this.order = ORDER_LOOKUP[order] ?? this.order;
    return this;
  }

  toArray(target: (number | string)[] = [], offset = 0): (number | string)[] {
    target[offset] = this.x;
    target[offset + 1] = this.y;
    target[offset + 2] = this.z;
    target[offset + 3] = this.order;
    return target;
  }

  toDegrees(): this {
    this.x *= RAD2DEG;
    this.y *= RAD2DEG;
    this.z *= RAD2DEG;
    return this;
  }

  toRadians(): this {
    this.x *= DEG2RAD;
    this.y *= DEG2RAD;
    this.z *= DEG2RAD;
    return this;
  }

  *[Symbol.iterator](): Iterator<number | string> {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.order;
  }

  static DEFAULT_ORDER: EulerOrder = 'XYZ';
}

const ORDER_LOOKUP: Record<number, EulerOrder | undefined> = {
  0: 'XYZ',
  1: 'YXZ',
  2: 'ZXY',
  3: 'ZYX',
  4: 'YZX',
  5: 'XZY',
};

// Imported last: Euler and Quat are mutually recursive (Quat.setFromEuler).
import { Quat } from './Quat';
const _scratchQuatFromEuler = new Quat();

/** Unpacks a unit quaternion from the rotation part of a 4x4 matrix. */
function quatFromRotationMatrix(m: { elements: ArrayLike<number> }): {
  x: number;
  y: number;
  z: number;
  w: number;
} {
  const e = m.elements;
  const trace = e[0] + e[5] + e[10];
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    return {
      w: 0.25 / s,
      x: (e[6] - e[9]) * s,
      y: (e[8] - e[2]) * s,
      z: (e[1] - e[4]) * s,
    };
  }
  if (e[0] > e[5] && e[0] > e[10]) {
    const s = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]);
    return {
      w: (e[6] - e[9]) / s,
      x: 0.25 * s,
      y: (e[4] + e[1]) / s,
      z: (e[8] + e[2]) / s,
    };
  }
  if (e[5] > e[10]) {
    const s = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]);
    return {
      w: (e[8] - e[2]) / s,
      x: (e[4] + e[1]) / s,
      y: 0.25 * s,
      z: (e[9] + e[6]) / s,
    };
  }
  const s = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]);
  return {
    w: (e[1] - e[4]) / s,
    x: (e[8] + e[2]) / s,
    y: (e[9] + e[6]) / s,
    z: 0.25 * s,
  };
}

