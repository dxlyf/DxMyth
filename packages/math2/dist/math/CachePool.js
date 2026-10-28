class CachePool {
  static create(options) {
    return new CachePool(options);
  }
  pools;
  /** 待释放区：已获取但尚未释放的对象 */
  actives;
  options;
  constructor(options) {
    this.options = { maxSize: 100, initSize: 0, ...options || {} };
    this.pools = [];
    this.actives = [];
    if (this.options.initSize > 0) {
      this.initPoolSize(this.options.initSize);
    }
  }
  initPoolSize(size) {
    for (let i = 0; i < size; i++) {
      this.pools.push(this.options.create());
    }
  }
  get() {
    let item;
    if (this.pools.length > 0) {
      item = this.pools.pop();
      this.options.init?.(item);
    } else {
      item = this.options.create();
    }
    this.actives.push(item);
    return item;
  }
  release(item) {
    const index = this.actives.indexOf(item);
    if (index !== -1) {
      this.actives.splice(index, 1);
    }
    this.recycle(item);
  }
  /** 一次性释放待释放区中的所有对象 */
  releaseAll() {
    for (let i = 0; i < this.actives.length; i++) {
      this.recycle(this.actives[i]);
    }
    this.actives.length = 0;
  }
  recycle(item) {
    if (this.pools.length < this.options.maxSize) {
      this.options.release?.(item);
      this.pools.push(item);
    }
  }
}
export {
  CachePool
};
