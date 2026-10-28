import { assert } from "./assert.js";
class PQnode {
  handle = null;
}
class PQhandleElem {
  key = null;
  node = 0;
}
class PriorityQ {
  constructor(size, leq) {
    this.leq = leq;
    this.max = size;
    this.nodes = [];
    this.handles = [];
    for (let i = 0; i < size + 1; i++) {
      this.nodes[i] = new PQnode();
      this.handles[i] = new PQhandleElem();
    }
    this.initialized = false;
    this.nodes[1].handle = 1;
    this.handles[1].key = null;
  }
  max = 0;
  nodes = [];
  handles = [];
  initialized = false;
  freeList = 0;
  size = 0;
  floatDown_(curr) {
    var n = this.nodes;
    var h = this.handles;
    var hCurr, hChild;
    var child;
    hCurr = n[curr].handle;
    for (; ; ) {
      child = curr << 1;
      if (child < this.size && this.leq(h[n[child + 1].handle].key, h[n[child].handle].key)) {
        ++child;
      }
      assert(child <= this.max);
      hChild = n[child].handle;
      if (child > this.size || this.leq(h[hCurr].key, h[hChild].key)) {
        n[curr].handle = hCurr;
        h[hCurr].node = curr;
        break;
      }
      n[curr].handle = hChild;
      h[hChild].node = curr;
      curr = child;
    }
  }
  floatUp_(curr) {
    var n = this.nodes;
    var h = this.handles;
    var hCurr, hParent;
    var parent;
    hCurr = n[curr].handle;
    for (; ; ) {
      parent = curr >> 1;
      hParent = n[parent].handle;
      if (parent === 0 || this.leq(h[hParent].key, h[hCurr].key)) {
        n[curr].handle = hCurr;
        h[hCurr].node = curr;
        break;
      }
      n[curr].handle = hParent;
      h[hParent].node = curr;
      curr = parent;
    }
  }
  init() {
    for (let i = this.size; i >= 1; --i) {
      this.floatDown_(i);
    }
    this.initialized = true;
  }
  min() {
    return this.handles[this.nodes[1].handle].key;
  }
  /* really pqHeapInsert */
  /* returns INV_HANDLE iff out of memory */
  //PQhandle pqHeapInsert( TESSalloc* alloc, PriorityQHeap *pq, PQkey keyNew )
  insert(keyNew) {
    var curr;
    var free;
    curr = ++this.size;
    if (curr * 2 > this.max) {
      this.max *= 2;
      var i;
      var s;
      s = this.nodes.length;
      this.nodes.length = this.max + 1;
      for (i = s; i < this.nodes.length; i++)
        this.nodes[i] = new PQnode();
      s = this.handles.length;
      this.handles.length = this.max + 1;
      for (i = s; i < this.handles.length; i++)
        this.handles[i] = new PQhandleElem();
    }
    if (this.freeList === 0) {
      free = curr;
    } else {
      free = this.freeList;
      this.freeList = this.handles[free].node;
    }
    this.nodes[curr].handle = free;
    this.handles[free].node = curr;
    this.handles[free].key = keyNew;
    if (this.initialized) {
      this.floatUp_(curr);
    }
    return free;
  }
  //PQkey pqHeapExtractMin( PriorityQHeap *pq )
  extractMin() {
    var n = this.nodes;
    var h = this.handles;
    var hMin = n[1].handle;
    var min = h[hMin].key;
    if (this.size > 0) {
      n[1].handle = n[this.size].handle;
      h[n[1].handle].node = 1;
      h[hMin].key = null;
      h[hMin].node = this.freeList;
      this.freeList = hMin;
      --this.size;
      if (this.size > 0) {
        this.floatDown_(1);
      }
    }
    return min;
  }
  delete(hCurr) {
    var n = this.nodes;
    var h = this.handles;
    var curr;
    assert(hCurr >= 1 && hCurr <= this.max && h[hCurr].key !== null);
    curr = h[hCurr].node;
    n[curr].handle = n[this.size].handle;
    h[n[curr].handle].node = curr;
    --this.size;
    if (curr <= this.size) {
      if (curr <= 1 || this.leq(h[n[curr >> 1].handle].key, h[n[curr].handle].key)) {
        this.floatDown_(curr);
      } else {
        this.floatUp_(curr);
      }
    }
    h[hCurr].key = null;
    h[hCurr].node = this.freeList;
    this.freeList = hCurr;
  }
}
export {
  PQhandleElem,
  PQnode,
  PriorityQ
};
