import { Formatter } from "../util/Formatter.js";
import { Numerical } from "../util/Numerical.js";
function toSize(value) {
  return typeof value === "number" ? new Size(value, value) : value;
}
class Size {
  width;
  height;
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }
  /** 同时设置两个维度。 */
  _set(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
  equals(size) {
    return this === size || !!size && this.width === size.width && this.height === size.height;
  }
  clone() {
    return new Size(this.width, this.height);
  }
  toString() {
    const f = Formatter.instance;
    return "{ width: " + f.number(this.width) + ", height: " + f.number(this.height) + " }";
  }
  /** 尺寸的维度数组，`[width, height]`。 */
  get values() {
    return [this.width, this.height];
  }
  add(value) {
    const size = toSize(value);
    return new Size(this.width + size.width, this.height + size.height);
  }
  subtract(value) {
    const size = toSize(value);
    return new Size(this.width - size.width, this.height - size.height);
  }
  multiply(value) {
    const size = toSize(value);
    return new Size(this.width * size.width, this.height * size.height);
  }
  divide(value) {
    const size = toSize(value);
    return new Size(this.width / size.width, this.height / size.height);
  }
  modulo(value) {
    const size = toSize(value);
    return new Size(this.width % size.width, this.height % size.height);
  }
  /** 两个维度都取负的新尺寸。 */
  negate() {
    return new Size(-this.width, -this.height);
  }
  /** 两个维度是否都在 1e-12 容差内为 0。 */
  isZero() {
    const isZero = Numerical.isZero;
    return isZero(this.width) && isZero(this.height);
  }
  /** 是否有一个维度是 NaN。 */
  isNaN() {
    return isNaN(this.width) || isNaN(this.height);
  }
  round() {
    return new Size(Math.round(this.width), Math.round(this.height));
  }
  ceil() {
    return new Size(Math.ceil(this.width), Math.ceil(this.height));
  }
  floor() {
    return new Size(Math.floor(this.width), Math.floor(this.height));
  }
  abs() {
    return new Size(Math.abs(this.width), Math.abs(this.height));
  }
  /** 取两个尺寸中宽高各自最小的新尺寸。 */
  static min(size1, size2) {
    return new Size(
      Math.min(size1.width, size2.width),
      Math.min(size1.height, size2.height)
    );
  }
  /** 取两个尺寸中宽高各自最大的新尺寸。 */
  static max(size1, size2) {
    return new Size(
      Math.max(size1.width, size2.width),
      Math.max(size1.height, size2.height)
    );
  }
  /** 宽高为 0 到 1 之间随机值的尺寸。 */
  static random() {
    return new Size(Math.random(), Math.random());
  }
}
export {
  Size
};
