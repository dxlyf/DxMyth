import { EPSILON, clamp } from './MathUtils';
import { Vector3 } from './Vector3';
import type { Euler, EulerOrder } from './Euler';

export interface QuatLike {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface EulerLike {
  x: number;
  y: number;
  z: number;
  order?: EulerOrder;
}

export interface Matrix4Like {
  elements: ArrayLike<number>;
}

/**
 * Unit quaternion. Euler<->Quat conversion lives here because the axis-order
 * formula is shared by both classes and only needs one implementation.
 */
export class Quat {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): Quat {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  copy(q: QuatLike): this {
    return this.set(q.x, q.y, q.z, q.w);
  }

  /** Identity rotation. */
  identity(): this {
    return this.set(0, 0, 0, 1);
  }

  setFromEuler(euler: EulerLike): this {
    const { x, y, z } = euler;
    const order = (euler.order ?? 'XYZ') as EulerOrder;
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);

    switch (order) {
      case 'XYZ':
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'YXZ':
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case 'ZXY':
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'ZYX':
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case 'YZX':
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case 'XZY':
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      default:
        throw new Error(`mini3d.Quat.setFromEuler: unknown order "${order}"`);
    }
    return this;
  }

  setFromAxisAngle(axis: Vector3 | { x: number; y: number; z: number }, angle: number): this {
    const half = angle / 2;
    const s = Math.sin(half);
    return this.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(half));
  }

  setFromRotationMatrix(m: Matrix4Like): this {
    const e = m.elements;
    const trace = e[0] + e[5] + e[10];
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      return this.set((e[6] - e[9]) * s, (e[8] - e[2]) * s, (e[1] - e[4]) * s, 0.25 / s);
    }
    if (e[0] > e[5] && e[0] > e[10]) {
      const s = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]);
      return this.set(0.25 * s, (e[4] + e[1]) / s, (e[8] + e[2]) / s, (e[6] - e[9]) / s);
    }
    if (e[5] > e[10]) {
      const s = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]);
      return this.set((e[4] + e[1]) / s, 0.25 * s, (e[9] + e[6]) / s, (e[8] - e[2]) / s);
    }
    const s = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]);
    return this.set((e[8] + e[2]) / s, (e[9] + e[6]) / s, 0.25 * s, (e[1] - e[4]) / s);
  }

  /** Shortest-arc rotation taking `from` to `to` (both must be unit length). */
  setFromUnitVectors(from: Vector3, to: Vector3): this {
    let r = from.dot(to) + 1;
    if (r < EPSILON) {
      r = 0;
      // Degenerate: pick any axis perpendicular to `from`.
      if (Math.abs(from.x) > Math.abs(from.z)) {
        this.set(-from.y, from.x, 0, r);
      } else {
        this.set(0, -from.z, from.y, r);
      }
    } else {
      this.set(
        from.y * to.z - from.z * to.y,
        from.z * to.x - from.x * to.z,
        from.x * to.y - from.y * to.x,
        r,
      );
    }
    return this.normalize();
  }

  angleTo(q: QuatLike): number {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
  }

  dot(q: QuatLike): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(): this {
    const l = this.length();
    if (l === 0) return this.set(0, 0, 0, 1);
    return this.set(this.x / l, this.y / l, this.z / l, this.w / l);
  }

  invert(): this {
    // Unit quaternions invert by conjugation, but be lenient with drift.
    return this.conjugate().normalize();
  }

  conjugate(): this {
    return this.set(-this.x, -this.y, -this.z, this.w);
  }

  multiply(q: QuatLike): this {
    return this.multiplyQuaternions(this, q);
  }

  premultiply(q: QuatLike): this {
    return this.multiplyQuaternions(q, this);
  }

  multiplyQuaternions(a: QuatLike, b: QuatLike): this {
    const qax = a.x;
    const qay = a.y;
    const qaz = a.z;
    const qaw = a.w;
    const qbx = b.x;
    const qby = b.y;
    const qbz = b.z;
    const qbw = b.w;
    return this.set(
      qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
      qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
      qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
      qaw * qbw - qax * qbx - qay * qby - qaz * qbz,
    );
  }

  /** Spherical linear interpolation; assumes normalised inputs. */
  slerp(qb: QuatLike, t: number): this {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);

    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;

    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
    let bx = qb.x;
    let by = qb.y;
    let bz = qb.z;
    let bw = qb.w;

    if (cosHalfTheta < 0) {
      cosHalfTheta = -cosHalfTheta;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    if (cosHalfTheta >= 1) return this;

    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this.set(s * x + t * bx, s * y + t * by, s * z + t * bz, s * w + t * bw);
      return this.normalize();
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    return this.set(
      x * ratioA + bx * ratioB,
      y * ratioA + by * ratioB,
      z * ratioA + bz * ratioB,
      w * ratioA + bw * ratioB,
    );
  }

  slerpQuaternions(a: QuatLike, b: QuatLike, t: number): this {
    return this.copy(a).slerp(b, t);
  }

  /** Random uniformly distributed rotation. */
  random(rng: () => number = Math.random): this {
    const u1 = rng();
    const u2 = rng() * Math.PI * 2;
    const u3 = rng() * Math.PI * 2;
    const s1 = Math.sqrt(1 - u1);
    const s2 = Math.sqrt(u1);
    return this.set(s1 * Math.sin(u2), s1 * Math.cos(u2), s2 * Math.sin(u3), s2 * Math.cos(u3));
  }

  equals(q: QuatLike): boolean {
    return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    target[offset] = this.x;
    target[offset + 1] = this.y;
    target[offset + 2] = this.z;
    target[offset + 3] = this.w;
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    return this.set(source[offset], source[offset + 1], source[offset + 2], source[offset + 3]);
  }

  /** Mutates `euler` to represent this rotation. */
  toEuler(target: Euler, order?: EulerOrder): Euler {
    return target.setFromQuat(this, order ?? (target.order as EulerOrder));
  }

  /** Rotates a vector in place (allocates one scratch vector only). */
  rotateVector(v: Vector3): Vector3 {
    return v.applyQuaternion(this);
  }

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.w;
  }

  static slerp(a: QuatLike, b: QuatLike, target: Quat, t: number): Quat {
    return target.slerpQuaternions(a, b, t);
  }
}
