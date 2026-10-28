class Option {
  ctx;
  current;
  default;
  options;
  dirty = false;
  version = 0;
  constructor(context, options) {
    this.ctx = context;
    this.options = options;
    this.default = this.options.default ? this.options.default(this.ctx) : null;
    this.current = this.default;
  }
  // 重置状态值为默认值
  setDefault() {
    this.update(this.default);
  }
  getDefault() {
    return this.default;
  }
  markDrity() {
    this.dirty = true;
  }
  refresh() {
    this.update(this.current, true);
  }
  get() {
    return this.current;
  }
  map(value) {
    if (this.options.map) {
      return this.options.map(this.ctx, value);
    }
    return value;
  }
  equals(current, prev) {
    if (this.options.equals) {
      return this.options.equals(this.ctx, current, prev);
    }
    return current === prev;
  }
  update(value, forceUpdate = false) {
    const prevValue = this.current;
    if (forceUpdate || this.dirty || !this.equals(prevValue, value)) {
      this.dirty = false;
      this.version++;
      this.current = value;
      this.options.update?.(this.ctx, this.current, prevValue);
      return true;
    }
    return false;
  }
  set(param) {
    const value = this.map(param);
    return this.update(value);
  }
  copy(source) {
    this.ctx = source.ctx;
    this.current = source.current;
    this.dirty = source.dirty;
    this.version = source.version;
    this.options = { ...source.options };
    return this;
  }
  clone() {
    return new Option(this.ctx, this.options).copy(this);
  }
}
export {
  Option
};
