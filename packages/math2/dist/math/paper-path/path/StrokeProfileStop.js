class StrokeProfileStop {
  /** 该停靠点所属的路径，可能为空。 */
  _path;
  /** 停靠点之前那一段的索引，见 `Path#_getOffsetAtIndex`。 */
  _index;
  /** 停靠点不在路径上时使用的偏移。 */
  _offset;
  /** 停靠点没有设置的值为 null。 */
  _width;
  _aspect;
  _angle;
  _smooth;
  constructor(props = {}) {
    this._path = null;
    this._index = props.index != null ? props.index : null;
    this._offset = props.offset || 0;
    this._width = props.width != null ? props.width : null;
    this._aspect = props.aspect != null ? props.aspect : null;
    this._angle = props.angle != null ? props.angle : null;
    this._smooth = props.smooth !== false;
  }
  /** 返回停靠点的副本，不带路径。 */
  clone() {
    return new StrokeProfileStop({
      offset: this.offset,
      width: this._width,
      aspect: this._aspect,
      angle: this._angle,
      smooth: this._smooth
    });
  }
  _changed() {
    if (this._path)
      this._path._changed();
  }
  /** 该停靠点所属的路径。 */
  get path() {
    return this._path;
  }
  /**
   * 停靠点沿路径的偏移，与 `Path#getPointAt(offset)` 一致。
   * 它是长度而不是比例。段移动时停靠点仍停留在相同的段之间，因此偏移会
   * 随它之前那些曲线的长度变化。
   */
  get offset() {
    const path = this._path;
    return path ? path._getOffsetAtIndex(this._index) : this._offset;
  }
  set offset(offset) {
    const path = this._path;
    if (path) {
      this._index = path._getIndexAt(offset);
      path._sortStrokeProfile();
      this._changed();
    } else {
      this._offset = offset;
    }
  }
  /**
   * 停靠点处笔触的宽度，作为描边宽度的倍数:
   * `1` 表示与描边同宽，`2` 表示两倍宽。
   */
  get width() {
    return this._width;
  }
  set width(width) {
    this._width = width;
    this._changed();
  }
  /**
   * 停靠点处笔触的纵横比:高度相对宽度的倍数，
   * `1` 表示圆头，更小表示扁头。
   */
  get aspect() {
    return this._aspect;
  }
  set aspect(aspect) {
    this._aspect = aspect;
    this._changed();
  }
  /** 停靠点处笔触的角度，单位为度，使用路径坐标系。 */
  get angle() {
    return this._angle;
  }
  set angle(angle) {
    this._angle = angle;
    this._changed();
  }
  /** 数值是否在停靠点处平滑地进入和离开。 */
  get smooth() {
    return this._smooth;
  }
  set smooth(smooth) {
    this._smooth = !!smooth;
    this._changed();
  }
  /** 判断与传入的停靠点是否相等。 */
  equals(stop) {
    return stop === this || stop instanceof StrokeProfileStop && this._width === stop._width && this._aspect === stop._aspect && this._angle === stop._angle && this._smooth === stop._smooth && (this._path ? this._index === stop._index : this._offset === stop._offset) || false;
  }
}
export {
  StrokeProfileStop
};
