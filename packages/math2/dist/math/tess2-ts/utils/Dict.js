class DictNode {
  key = null;
  next = null;
  prev = null;
}
class Dict {
  constructor(frame, leq) {
    this.frame = frame;
    this.leq = leq;
    this.head.next = this.head;
    this.head.prev = this.head;
  }
  head = new DictNode();
  min() {
    return this.head.next;
  }
  max() {
    return this.head.prev;
  }
  insert(k) {
    return this.insertBefore(this.head, k);
  }
  search(key) {
    let node = this.head;
    do {
      node = node.next;
    } while (node.key !== null && !this.leq(this.frame, key, node.key));
    return node;
  }
  insertBefore(node, key) {
    do {
      node = node.prev;
    } while (node.key !== null && !this.leq(this.frame, node.key, key));
    const newNode = new DictNode();
    newNode.key = key;
    newNode.next = node.next;
    node.next.prev = newNode;
    newNode.prev = node;
    node.next = newNode;
    return newNode;
  }
  delete(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
  }
}
export {
  Dict,
  DictNode
};
