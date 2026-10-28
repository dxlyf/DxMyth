class Formatter {
  /** 未指定精度时使用的格式化器。 */
  static instance;
  /** 小数位数。 */
  precision;
  /** 缓存 `10 ^ precision`，供 {@link #number} 使用。 */
  multiplier;
  constructor(precision) {
    this.precision = precision !== void 0 ? precision : 5;
    this.multiplier = Math.pow(10, this.precision);
  }
  /**
   * 按本格式化器的精度渲染数字。
   * 不使用 Number#toFixed()，因为它会补零；这里直接四舍五入。
   * 精度 >= 16 时原样返回，因为那已接近数字精度的极限（具体会浮动）。
   */
  number(val) {
    return this.precision < 16 ? Math.round(val * this.multiplier) / this.multiplier : val;
  }
  pair(val1, val2, separator) {
    return this.number(val1) + (separator || ",") + this.number(val2);
  }
  point(val, separator) {
    return this.number(val.x) + (separator || ",") + this.number(val.y);
  }
  size(val, separator) {
    return this.number(val.width) + (separator || ",") + this.number(val.height);
  }
  rectangle(val, separator) {
    return this.point(val, separator) + (separator || ",") + this.size(val, separator);
  }
}
Formatter.instance = new Formatter();
export {
  Formatter
};
