import type { Box3 } from './Box3';
import type { Matrix4 } from './Matrix4';
import { Plane } from './Plane';
import type { Sphere } from './Sphere';
import { Vector3 } from './Vector3';

/**
 * View frustum represented by six normalized planes.
 * Plane order: left, right, bottom, top, near, far.
 */
export class Frustum {
  readonly planes: readonly Plane[];

  constructor() {
    this.planes = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
  }

  /** Extract planes from a view-projection matrix (Gribb-Hartmann method). */
  setFromProjectionMatrix(m: Readonly<Matrix4>): this {
    const e = m;
    const m0 = e[0]!, m1 = e[1]!, m2 = e[2]!, m3 = e[3]!;
    const m4 = e[4]!, m5 = e[5]!, m6 = e[6]!, m7 = e[7]!;
    const m8 = e[8]!, m9 = e[9]!, m10 = e[10]!, m11 = e[11]!;
    const m12 = e[12]!, m13 = e[13]!, m14 = e[14]!, m15 = e[15]!;

    const planes = this.planes;
    // Left = row3 + row0
    planes[0]!.setComponents(m3 + m0, m7 + m4, m11 + m8, m15 + m12).normalize();
    // Right = row3 - row0
    planes[1]!.setComponents(m3 - m0, m7 - m4, m11 - m8, m15 - m12).normalize();
    // Bottom = row3 + row1
    planes[2]!.setComponents(m3 + m1, m7 + m5, m11 + m9, m15 + m13).normalize();
    // Top = row3 - row1
    planes[3]!.setComponents(m3 - m1, m7 - m5, m11 - m9, m15 - m13).normalize();
    // Near = row3 + row2
    planes[4]!.setComponents(m3 + m2, m7 + m6, m11 + m10, m15 + m14).normalize();
    // Far = row3 - row2
    planes[5]!.setComponents(m3 - m2, m7 - m6, m11 - m10, m15 - m14).normalize();
    return this;
  }

  containsPoint(p: Readonly<Vector3>): boolean {
    for (const plane of this.planes) {
      if (plane.distanceToPoint(p) < 0) return false;
    }
    return true;
  }

  intersectsSphere(sphere: Readonly<Sphere>): boolean {
    for (const plane of this.planes) {
      if (plane.distanceToPoint(sphere.center) < -sphere.radius) return false;
    }
    return true;
  }

  /** Conservative axis-aligned box test using the plane's positive vertex. */
  intersectsBox(box: Readonly<Box3>): boolean {
    for (const plane of this.planes) {
      const n = plane.normal;
      const x = n.x > 0 ? box.max.x : box.min.x;
      const y = n.y > 0 ? box.max.y : box.min.y;
      const z = n.z > 0 ? box.max.z : box.min.z;
      if (n.x * x + n.y * y + n.z * z + plane.constant < 0) return false;
    }
    return true;
  }

  copy(frustum: Readonly<Frustum>): this {
    for (let i = 0; i < 6; i++) this.planes[i]!.copy(frustum.planes[i]!);
    return this;
  }
}
