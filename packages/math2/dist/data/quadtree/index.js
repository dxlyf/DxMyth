function intersects(a, b) {
  return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
}
class QuadTreeNode {
  x;
  y;
  width;
  height;
  depth;
  /** 当前节点直接持有的元素 */
  objects = [];
  /** 四个子节点：左上、右上、左下、右下；未分裂时为 null */
  children = null;
  constructor(x, y, width, height, depth) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
}
class QuadTree {
  maxObjects;
  maxDepth;
  root;
  _size = 0;
  /**
   * @param bounds  根节点覆盖的矩形范围
   * @param options 分裂阈值与最大深度
   */
  constructor(bounds, options = {}) {
    this.maxObjects = Math.max(1, options.maxObjects ?? 10);
    this.maxDepth = Math.max(0, options.maxDepth ?? 6);
    this.root = new QuadTreeNode(
      bounds.x,
      bounds.y,
      Math.max(0, bounds.width),
      Math.max(0, bounds.height),
      0
    );
  }
  /** 已插入的元素总数 */
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._size === 0;
  }
  /** 根节点覆盖范围 */
  get bounds() {
    return { x: this.root.x, y: this.root.y, width: this.root.width, height: this.root.height };
  }
  /** 清空全部元素，保留根范围 */
  clear() {
    this.root.objects.length = 0;
    this.root.children = null;
    this._size = 0;
    return this;
  }
  /** 插入一个元素 */
  insert(item) {
    this._insert(this.root, item);
    this._size++;
    return this;
  }
  /** 批量插入 */
  insertAll(items) {
    for (const item of items) this.insert(item);
    return this;
  }
  /**
   * 查询与给定矩形相交的全部元素。
   * @param out 可选输出数组，复用以减少分配
   */
  search(bounds, out = []) {
    this._search(this.root, bounds, out);
    return out;
  }
  /** 查询包含给定点的全部元素 */
  searchPoint(x, y, out = []) {
    return this.search({ x, y, width: 0, height: 0 }, out);
  }
  /** 删除一个元素（按引用匹配）；不存在时返回 false */
  remove(item) {
    if (this._remove(this.root, item)) {
      this._size--;
      return true;
    }
    return false;
  }
  /** 深度优先遍历全部元素 */
  forEach(callback) {
    this._forEach(this.root, callback);
  }
  /** 收集全部元素 */
  toArray() {
    const result = [];
    this._forEach(this.root, (item) => result.push(item));
    return result;
  }
  // ---- 内部实现 ----
  /** 元素完全落入的子节点下标；跨子区或无法判定时返回 -1 */
  _childIndex(node, item) {
    const midX = node.x + node.width * 0.5;
    const midY = node.y + node.height * 0.5;
    const left = item.x + item.width <= midX;
    const right = item.x >= midX;
    const top = item.y + item.height <= midY;
    const bottom = item.y >= midY;
    if (left && top) return 0;
    if (right && top) return 1;
    if (left && bottom) return 2;
    if (right && bottom) return 3;
    return -1;
  }
  _insert(node, item) {
    if (node.children) {
      const index = this._childIndex(node, item);
      if (index !== -1) {
        this._insert(node.children[index], item);
        return;
      }
    }
    node.objects.push(item);
    if (!node.children && node.depth < this.maxDepth && node.width > 0 && node.height > 0 && node.objects.length > this.maxObjects) {
      this._split(node);
    }
  }
  /** 把当前节点四等分，并把能完整落入子节点的元素下放 */
  _split(node) {
    const halfWidth = node.width * 0.5;
    const halfHeight = node.height * 0.5;
    const depth = node.depth + 1;
    const children = [
      new QuadTreeNode(node.x, node.y, halfWidth, halfHeight, depth),
      new QuadTreeNode(node.x + halfWidth, node.y, halfWidth, halfHeight, depth),
      new QuadTreeNode(node.x, node.y + halfHeight, halfWidth, halfHeight, depth),
      new QuadTreeNode(node.x + halfWidth, node.y + halfHeight, halfWidth, halfHeight, depth)
    ];
    node.children = children;
    const objects = node.objects;
    node.objects = [];
    for (let i = 0; i < objects.length; i++) {
      const item = objects[i];
      const index = this._childIndex(node, item);
      if (index === -1) node.objects.push(item);
      else children[index].objects.push(item);
    }
  }
  _search(node, bounds, out) {
    const objects = node.objects;
    for (let i = 0; i < objects.length; i++) {
      if (intersects(objects[i], bounds)) out.push(objects[i]);
    }
    const children = node.children;
    if (!children) return;
    for (let i = 0; i < 4; i++) {
      if (intersects(children[i], bounds)) {
        this._search(children[i], bounds, out);
      }
    }
  }
  _remove(node, item) {
    const index = node.objects.indexOf(item);
    if (index !== -1) {
      node.objects.splice(index, 1);
      return true;
    }
    const children = node.children;
    if (children) {
      const childIndex = this._childIndex(node, item);
      if (childIndex !== -1) return this._remove(children[childIndex], item);
    }
    return false;
  }
  _forEach(node, callback) {
    const objects = node.objects;
    for (let i = 0; i < objects.length; i++) callback(objects[i]);
    const children = node.children;
    if (children) {
      for (let i = 0; i < 4; i++) this._forEach(children[i], callback);
    }
  }
}
export {
  QuadTree
};
