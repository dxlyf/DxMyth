const EMPTY_BBOX = {
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity
};
function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && a.maxX >= b.maxX && a.maxY >= b.maxY;
}
function intersects(a, b) {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}
function expand(a, b) {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY)
  };
}
function area(b) {
  return (b.maxX - b.minX) * (b.maxY - b.minY);
}
function enlargedArea(a, b) {
  const dx = Math.max(a.maxX, b.maxX) - Math.min(a.minX, b.minX);
  const dy = Math.max(a.maxY, b.maxY) - Math.min(a.minY, b.minY);
  return dx * dy - area(a);
}
function pointToBBoxDistSq(x, y, b) {
  let dx = 0, dy = 0;
  if (x < b.minX) dx = b.minX - x;
  else if (x > b.maxX) dx = x - b.maxX;
  if (y < b.minY) dy = b.minY - y;
  else if (y > b.maxY) dy = y - b.maxY;
  return dx * dx + dy * dy;
}
function unionBBox(bboxes) {
  let result = { ...EMPTY_BBOX };
  for (const b of bboxes) result = expand(result, b);
  return result;
}
function isLeaf(node) {
  return node.height === 0;
}
function createLeafNode(items) {
  return {
    bbox: unionBBox(items.map((i) => i.bbox)),
    children: null,
    items,
    height: 0
  };
}
function createInternalNode(children, height) {
  return {
    bbox: unionBBox(children.map((c) => c.bbox)),
    children,
    items: null,
    height
  };
}
function recalcBBox(node) {
  if (isLeaf(node) && node.items) {
    node.bbox = unionBBox(node.items.map((i) => i.bbox));
  } else if (node.children) {
    node.bbox = unionBBox(node.children.map((c) => c.bbox));
  }
}
function quadraticSplit(entries, minEntries) {
  let worstWaste = -Infinity;
  let seed1 = 0, seed2 = 0;
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const combined = expand(entries[i].bbox, entries[j].bbox);
      const waste = area(combined) - area(entries[i].bbox) - area(entries[j].bbox);
      if (waste > worstWaste) {
        worstWaste = waste;
        seed1 = i;
        seed2 = j;
      }
    }
  }
  const group1 = [entries[seed1]], group2 = [entries[seed2]];
  let bbox1 = entries[seed1].bbox, bbox2 = entries[seed2].bbox;
  const remaining = entries.filter((_, i) => i !== seed1 && i !== seed2);
  while (remaining.length > 0) {
    if (group1.length + remaining.length === minEntries) {
      for (const e of remaining) {
        group1.push(e);
        bbox1 = expand(bbox1, e.bbox);
      }
      break;
    }
    if (group2.length + remaining.length === minEntries) {
      for (const e of remaining) {
        group2.push(e);
        bbox2 = expand(bbox2, e.bbox);
      }
      break;
    }
    let maxDiff = -Infinity, bestIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const d12 = enlargedArea(bbox1, remaining[i].bbox);
      const d22 = enlargedArea(bbox2, remaining[i].bbox);
      const diff = Math.abs(d12 - d22);
      if (diff > maxDiff) {
        maxDiff = diff;
        bestIdx = i;
      }
    }
    const entry = remaining.splice(bestIdx, 1)[0];
    const d1 = enlargedArea(bbox1, entry.bbox);
    const d2 = enlargedArea(bbox2, entry.bbox);
    if (d1 < d2 || d1 === d2 && group1.length <= group2.length) {
      group1.push(entry);
      bbox1 = expand(bbox1, entry.bbox);
    } else {
      group2.push(entry);
      bbox2 = expand(bbox2, entry.bbox);
    }
  }
  return [group1, group2];
}
function chooseSubtree(node, bbox) {
  let bestIdx = 0;
  let bestEnl = Infinity, bestArea = Infinity;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const enl = enlargedArea(child.bbox, bbox);
    const ar = area(child.bbox);
    if (enl < bestEnl || enl === bestEnl && ar < bestArea) {
      bestEnl = enl;
      bestArea = ar;
      bestIdx = i;
    }
  }
  return bestIdx;
}
function splitAndInsert(path, newNode, maxEntries, minEntries) {
  while (path.length > 1) {
    path.pop();
    const parent = path[path.length - 1];
    parent.children.push(newNode);
    recalcBBox(parent);
    if (parent.children.length <= maxEntries) {
      for (let i = path.length - 2; i >= 0; i--) {
        recalcBBox(path[i]);
      }
      return null;
    }
    const entries = parent.children.map((c) => ({ bbox: c.bbox, node: c }));
    const [g1, g2] = quadraticSplit(entries, minEntries);
    parent.children = g1.map((e) => e.node);
    newNode = createInternalNode(g2.map((e) => e.node), parent.height);
    newNode.bbox = unionBBox(newNode.children.map((c) => c.bbox));
  }
  const root = path[0];
  const newRoot = createInternalNode([root, newNode], root.height + 1);
  newRoot.bbox = unionBBox([root.bbox, newNode.bbox]);
  return newRoot;
}
function insertRecursive(node, bbox, data, maxEntries, minEntries, path) {
  path.push(node);
  if (isLeaf(node)) {
    const item = { bbox, data };
    node.items.push(item);
    node.bbox = expand(node.bbox, bbox);
    if (node.items.length <= maxEntries) return null;
    const entries = node.items.map((it) => ({ bbox: it.bbox, item: it }));
    const [g1, g2] = quadraticSplit(entries, minEntries);
    node.items = g1.map((e) => e.item);
    const newNode = createLeafNode(g2.map((e) => e.item));
    node.bbox = unionBBox(node.items.map((i) => i.bbox));
    return splitAndInsert(path, newNode, maxEntries, minEntries);
  }
  const idx = chooseSubtree(node, bbox);
  const newRoot = insertRecursive(node.children[idx], bbox, data, maxEntries, minEntries, path);
  if (newRoot) return newRoot;
  recalcBBox(node);
  return null;
}
function removeRecursive(node, predicate, path, pathIndices) {
  if (isLeaf(node)) {
    const idx = node.items.findIndex(predicate);
    if (idx === -1) return false;
    node.items.splice(idx, 1);
    recalcBBox(node);
    return true;
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    path.push(node);
    pathIndices.push(i);
    if (removeRecursive(child, predicate, path, pathIndices)) {
      return true;
    }
    path.pop();
    pathIndices.pop();
  }
  return false;
}
function condenseTree(root, path, pathIndices, minEntries, maxEntries) {
  const orphans = [];
  for (let i = path.length - 1; i >= 0; i--) {
    const parent = path[i];
    pathIndices[i];
    if (isLeaf(parent)) {
      if (parent.items.length < minEntries) {
        orphans.push(...parent.items);
        if (i === 0) {
          return createLeafNode([]);
        }
        path[i - 1].children.splice(pathIndices[i - 1], 1);
      } else {
        recalcBBox(parent);
      }
    } else {
      if (parent.children.length < minEntries) {
        orphans.push(...parent.children);
        if (i === 0) {
          if (parent.children.length === 0) return createLeafNode([]);
          if (parent.children.length === 1) return parent.children[0];
          recalcBBox(parent);
          return parent;
        }
        path[i - 1].children.splice(pathIndices[i - 1], 1);
      } else {
        recalcBBox(parent);
      }
    }
  }
  for (const orphan of orphans) {
    if ("height" in orphan && orphan.children) {
      const items = [];
      collectItems(orphan, items);
      for (const item of items) {
        root = insertItem(root, item.bbox, item.data, maxEntries, minEntries);
      }
    } else {
      const item = orphan;
      root = insertItem(root, item.bbox, item.data, maxEntries, minEntries);
    }
  }
  while (root.children && root.children.length === 1 && !isLeaf(root)) {
    root = root.children[0];
  }
  return root;
}
function collectItems(node, out) {
  if (isLeaf(node)) {
    if (node.items) out.push(...node.items);
  } else if (node.children) {
    for (const child of node.children) collectItems(child, out);
  }
}
function insertItem(root, bbox, data, maxEntries, minEntries) {
  const path = [];
  const newRoot = insertRecursive(root, bbox, data, maxEntries, minEntries, path);
  return newRoot ?? root;
}
function strPack(items, maxEntries) {
  if (items.length === 0) return createLeafNode([]);
  const n = items.length;
  const leafCount = Math.ceil(n / maxEntries);
  if (leafCount === 1) return createLeafNode(items);
  const sliceSize = Math.ceil(Math.sqrt(leafCount));
  items.sort((a, b) => {
    const ca = (a.bbox.minX + a.bbox.maxX) / 2;
    const cb = (b.bbox.minX + b.bbox.maxX) / 2;
    return ca - cb;
  });
  const slices = [];
  for (let i = 0; i < n; i += sliceSize * maxEntries) {
    slices.push(items.slice(i, i + sliceSize * maxEntries));
  }
  const leaves = [];
  for (const slice of slices) {
    slice.sort((a, b) => {
      const ca = (a.bbox.minY + a.bbox.maxY) / 2;
      const cb = (b.bbox.minY + b.bbox.maxY) / 2;
      return ca - cb;
    });
    for (let i = 0; i < slice.length; i += maxEntries) {
      const chunk = slice.slice(i, i + maxEntries);
      leaves.push(createLeafNode(chunk));
    }
  }
  return strPackNodes(leaves, maxEntries);
}
function strPackNodes(nodes, maxEntries) {
  if (nodes.length === 0) return createLeafNode([]);
  if (nodes.length === 1) return nodes[0];
  const packed = [];
  for (let i = 0; i < nodes.length; i += maxEntries) {
    const chunk = nodes.slice(i, i + maxEntries);
    packed.push(createInternalNode(chunk, chunk[0].height + 1));
  }
  return strPackNodes(packed, maxEntries);
}
class MinHeap {
  constructor(compare) {
    this.compare = compare;
  }
  heap = [];
  get size() {
    return this.heap.length;
  }
  push(item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 0) return void 0;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  peek() {
    return this.heap[0];
  }
  siftUp(idx) {
    while (idx > 0) {
      const parent = idx - 1 >> 1;
      if (this.compare(this.heap[idx], this.heap[parent]) >= 0) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }
  siftDown(idx) {
    const n = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1, right = 2 * idx + 2;
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}
class RTree {
  root;
  _maxEntries;
  _minEntries;
  _size = 0;
  constructor(options = {}) {
    this._maxEntries = Math.max(4, options.maxEntries ?? 9);
    this._minEntries = Math.max(2, Math.floor(this._maxEntries * 0.4));
    this.root = createLeafNode([]);
  }
  // ── 基本信息 ──
  /** 树中元素总数 */
  get size() {
    return this._size;
  }
  /** 整棵树的包围盒（所有元素的 MBR） */
  get bbox() {
    return this.root.bbox;
  }
  /** 清空树 */
  clear() {
    this.root = createLeafNode([]);
    this._size = 0;
  }
  // ── 插入 ──
  /**
   * 插入单个元素。
   * 复杂度 O(log n)。
   */
  insert(item) {
    const path = [];
    const newRoot = insertRecursive(
      this.root,
      item.bbox,
      item.data,
      this._maxEntries,
      this._minEntries,
      path
    );
    if (newRoot) this.root = newRoot;
    this._size++;
  }
  /**
   * 批量插入（STR 策略）。
   * 比逐个 insert 高效 ~10x，适合初始加载。
   *
   * @param items - 要插入的全部元素
   */
  bulkInsert(items) {
    if (items.length === 0) return;
    const allItems = this.all();
    allItems.push(...items);
    this.root = strPack(allItems, this._maxEntries);
    this._size = allItems.length;
  }
  // ── 删除 ──
  /**
   * 删除一个元素（引用相等判断）。
   * 复杂度 O(log n)，可能触发重新平衡。
   *
   * @returns 是否成功删除
   */
  remove(item) {
    const path = [];
    const indices = [];
    const found = removeRecursive(this.root, (i) => i === item, path, indices);
    if (!found) return false;
    this._size--;
    this.root = condenseTree(this.root, path, indices, this._minEntries, this._maxEntries);
    return true;
  }
  /**
   * 按谓词删除元素。
   *
   * @returns 删除的元素数量
   */
  removeBy(predicate) {
    let count = 0;
    const toRemove = this.search(this.bbox).filter((r) => predicate(r.item));
    for (const { item } of toRemove) {
      if (this.remove(item)) count++;
    }
    return count;
  }
  // ── 查询 ──
  /**
   * 范围查询：返回所有与 query 相交的元素。
   * 复杂度 O(log n + k)，k 为结果数。
   */
  search(query) {
    const results = [];
    if (!intersects(this.root.bbox, query)) return results;
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!intersects(node.bbox, query)) continue;
      if (isLeaf(node)) {
        for (const item of node.items) {
          if (intersects(item.bbox, query)) {
            results.push({ item });
          }
        }
      } else {
        for (const child of node.children) {
          stack.push(child);
        }
      }
    }
    return results;
  }
  /**
   * 点查询：返回所有包含点 (px, py) 的元素。
   */
  searchPoint(px, py) {
    const query = { minX: px, minY: py, maxX: px, maxY: py };
    return this.search(query);
  }
  /**
   * 判断是否存在与 query 相交的元素。
   * 比 search().length > 0 更高效（无结果收集开销）。
   */
  collides(query) {
    if (!intersects(this.root.bbox, query)) return false;
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!intersects(node.bbox, query)) continue;
      if (isLeaf(node)) {
        for (const item of node.items) {
          if (intersects(item.bbox, query)) return true;
        }
      } else {
        for (const child of node.children) {
          stack.push(child);
        }
      }
    }
    return false;
  }
  /**
   * k 近邻搜索（kNN）。
   *
   * 使用优先级队列 + 最佳优先策略（BFS）。
   *
   * @param k - 返回前 k 个最近元素
   * @param maxDist - 最大搜索半径（Infinity = 不限）
   * @returns 按距离升序排列的最近元素列表
   */
  nearest(px, py, k = 1, maxDist = Infinity) {
    const results = [];
    const maxDistSq = maxDist * maxDist;
    const heap = new MinHeap((a, b) => a.dist - b.dist);
    heap.push({ node: this.root, dist: pointToBBoxDistSq(px, py, this.root.bbox) });
    while (heap.size > 0) {
      const entry = heap.pop();
      if (results.length >= k && entry.dist > results[results.length - 1].distSq) break;
      if (isLeaf(entry.node)) {
        for (const item of entry.node.items) {
          const dSq = pointToBBoxDistSq(px, py, item.bbox);
          if (dSq > maxDistSq) continue;
          let insertAt = 0;
          while (insertAt < results.length && results[insertAt].distSq < dSq) insertAt++;
          if (insertAt === k) continue;
          results.splice(insertAt, 0, { item, distSq: dSq });
          if (results.length > k) results.pop();
        }
      } else {
        for (const child of entry.node.children) {
          const dSq = pointToBBoxDistSq(px, py, child.bbox);
          if (dSq > maxDistSq) continue;
          heap.push({ node: child, dist: dSq });
        }
      }
    }
    return results;
  }
  /**
   * 查找距离点 (px, py) 最近的单个元素。
   * 比 nearest(px, py, 1) 更快（提前剪枝）。
   */
  nearestOne(px, py, maxDist = Infinity) {
    const results = this.nearest(px, py, 1, maxDist);
    return results.length > 0 ? results[0] : null;
  }
  // ── 包含判断 ──
  /**
   * 查找所有完全包含 query 的元素。
   */
  searchContaining(query) {
    const results = [];
    if (!intersects(this.root.bbox, query)) return results;
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!intersects(node.bbox, query)) continue;
      if (isLeaf(node)) {
        for (const item of node.items) {
          if (contains(item.bbox, query)) {
            results.push({ item });
          }
        }
      } else {
        for (const child of node.children) {
          stack.push(child);
        }
      }
    }
    return results;
  }
  // ── 遍历 ──
  /** 获取所有元素 */
  all() {
    const results = [];
    this._collect(this.root, results);
    return results;
  }
  /** 遍历所有元素 */
  forEach(fn) {
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (isLeaf(node)) {
        for (const item of node.items) fn(item);
      } else {
        for (const child of node.children) stack.push(child);
      }
    }
  }
  // ── 内部 ──
  _collect(node, out) {
    if (isLeaf(node)) {
      if (node.items) out.push(...node.items);
    } else if (node.children) {
      for (const child of node.children) this._collect(child, out);
    }
  }
  // ── 诊断 / 调试 ──
  /**
   * 树的高度。
   */
  get height() {
    return this.root.height;
  }
  /**
   * 树中所有节点的总包围盒面积（衡量空间利用率）。
   * 值越大表示重叠越多、查询效率越差。
   */
  totalNodeArea() {
    let total = 0;
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      total += area(node.bbox);
      if (node.children) {
        for (const child of node.children) stack.push(child);
      }
    }
    return total;
  }
  /**
   * 验证树结构完整性（用于调试）。
   * 返回 null 表示验证通过，否则返回错误描述。
   */
  validate() {
    return this._validateNode(this.root);
  }
  _validateNode(node) {
    if (isLeaf(node)) {
      if (!node.items) return "叶子节点 items 为 null";
      if (node.items.length > this._maxEntries) return "叶子节点元素数超 maxEntries";
      if (node.height !== 0) return "叶子节点 height 不为 0";
      for (const item of node.items) {
        if (!contains(node.bbox, item.bbox)) return "元素的 bbox 不在节点 bbox 内";
      }
    } else {
      if (!node.children) return "内部节点 children 为 null";
      if (node.children.length < this._minEntries && node !== this.root) {
        return "内部节点子节点数 < minEntries";
      }
      if (node.children.length > this._maxEntries) return "内部节点子节点数 > maxEntries";
      for (const child of node.children) {
        if (child.height >= node.height) return "子节点 height 不递减";
        if (!contains(node.bbox, child.bbox)) return "子节点 bbox 不在父节点 bbox 内";
        const err = this._validateNode(child);
        if (err) return err;
      }
    }
    return null;
  }
}
export {
  RTree
};
