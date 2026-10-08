type Matrix4Like = { elements: ArrayLike<number> };

/**
 * 3x3 matrix used for normal matrices and texture transforms. Column-major,
 * same indexing convention as `Matrix4`'s upper-left block.
 */
export class Matrix3 {
  readonly elements: number[];

  constructor() {
    this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this {
    const te = this.elements;
    te[0] = n11; te[3] = n12; te[6] = n13;
    te[1] = n21; te[4] = n22; te[7] = n23;
    te[2] = n31; te[5] = n32; te[8] = n33;
    return this;
  }

  identity(): this {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  copy(m: Matrix4Like): this {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 9; i++) te[i] = me[i];
    return this;
  }

  clone(): Matrix3 {
    return new Matrix3().copy(this);
  }

  /** Lifts the upper-left 3x3 out of a `Matrix4`. */
  setFromMatrix4(m: Matrix4Like): this {
    const me = m.elements;
    return this.set(
      me[0], me[4], me[8],
      me[1], me[5], me[9],
      me[2], me[6], me[10],
    );
  }

  multiply(m: Matrix4Like): this {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m: Matrix4Like): this {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a: Matrix4Like, b: Matrix4Like): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];

    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  determinant(): number {
    const te = this.elements;
    const a = te[0], b = te[1], c = te[2];
    const d = te[3], e = te[4], f = te[5];
    const g = te[6], h = te[7], i = te[8];
    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  }

  invert(): this {
    const te = this.elements;
    const n11 = te[0], n21 = te[1], n31 = te[2];
    const n12 = te[3], n22 = te[4], n32 = te[5];
    const n13 = te[6], n23 = te[7], n33 = te[8];
    const t11 = n33 * n22 - n32 * n23;
    const t12 = n32 * n13 - n33 * n12;
    const t13 = n23 * n12 - n22 * n13;
    const det = n11 * t11 + n21 * t12 + n31 * t13;
    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const detInv = 1 / det;
    te[0] = t11 * detInv;
    te[1] = (n31 * n23 - n33 * n21) * detInv;
    te[2] = (n32 * n21 - n31 * n22) * detInv;
    te[3] = t12 * detInv;
    te[4] = (n33 * n11 - n31 * n13) * detInv;
    te[5] = (n31 * n12 - n32 * n11) * detInv;
    te[6] = t13 * detInv;
    te[7] = (n21 * n13 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n21 * n12) * detInv;
    return this;
  }

  transpose(): this {
    const te = this.elements;
    let tmp = te[1]; te[1] = te[3]; te[3] = tmp;
    tmp = te[2]; te[2] = te[6]; te[6] = tmp;
    tmp = te[5]; te[5] = te[7]; te[7] = tmp;
    return this;
  }

  /** Upper-left 3x3 of `inverse(m).transpose()` — the normal matrix. */
  getNormalMatrix(matrix4: Matrix4Like): this {
    return this.setFromMatrix4(matrix4).invert().transpose();
  }

  setUvTransform(
    tx: number,
    ty: number,
    sx: number,
    sy: number,
    rotation: number,
    cx: number,
    cy: number,
  ): this {
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);
    return this.set(
      sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx,
      -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty,
      0, 0, 1,
    );
  }

  equals(m: Matrix4Like): boolean {
    const te = this.elements;
    const me = m.elements;
    for (let i = 0; i < 9; i++) {
      if (te[i] !== me[i]) return false;
    }
    return true;
  }

  toArray(target: number[] | Float32Array = [], offset = 0): number[] | Float32Array {
    const te = this.elements;
    for (let i = 0; i < 9; i++) target[offset + i] = te[i];
    return target;
  }

  fromArray(source: ArrayLike<number>, offset = 0): this {
    const te = this.elements;
    for (let i = 0; i < 9; i++) te[i] = source[offset + i];
    return this;
  }

  toString(): string {
    const te = this.elements;
    return `Matrix3([${te.slice(0, 3).join(', ')}], [${te.slice(3, 6).join(', ')}], [${te.slice(6, 9).join(', ')}])`;
  }
}
