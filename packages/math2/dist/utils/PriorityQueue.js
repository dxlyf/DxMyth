class PriorityQueue {
  heap;
  compare;
  /**
   * 创建优先队列
   * @param compare 比较函数 (a, b) => 负数表示a应排在b前面
   */
  constructor(compare) {
    this.heap = [];
    this.compare = compare;
  }
  /**
   * 获取队列元素数量
   */
  get size() {
    return this.heap.length;
  }
  /**
   * 判断队列是否为空
   */
  isEmpty() {
    return this.size === 0;
  }
  top() {
    return this.peek();
  }
  /**
   * 查看队首元素
   */
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }
  /**
   * 入队
   * @param value 要添加的元素
   */
  enqueue(value) {
    this.heap.push(value);
    this.siftUp(this.size - 1);
  }
  push(value) {
    this.enqueue(value);
  }
  pop() {
    return this.dequeue();
  }
  /**
   * 出队
   * @returns 队首元素或null（空队列时）
   */
  dequeue() {
    if (this.isEmpty()) return null;
    const removedValue = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return removedValue;
  }
  // 上浮操作
  siftUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }
  // 下沉操作
  siftDown(index) {
    const size = this.size;
    while (index < size) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let minIndex = index;
      if (left < size && this.compare(this.heap[left], this.heap[minIndex]) < 0) {
        minIndex = left;
      }
      if (right < size && this.compare(this.heap[right], this.heap[minIndex]) < 0) {
        minIndex = right;
      }
      if (minIndex === index) break;
      this.swap(index, minIndex);
      index = minIndex;
    }
  }
  // 交换元素
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  /**
   * 清空队列
   */
  clear() {
    this.heap = [];
  }
}
export {
  PriorityQueue
};
