export declare class PriorityQueue<T> {
    private heap;
    private compare;
    /**
     * 创建优先队列
     * @param compare 比较函数 (a, b) => 负数表示a应排在b前面
     */
    constructor(compare: (a: T, b: T) => number);
    /**
     * 获取队列元素数量
     */
    get size(): number;
    /**
     * 判断队列是否为空
     */
    isEmpty(): boolean;
    top(): T | null;
    /**
     * 查看队首元素
     */
    peek(): T | null;
    /**
     * 入队
     * @param value 要添加的元素
     */
    enqueue(value: T): void;
    push(value: T): void;
    pop(): T | null;
    /**
     * 出队
     * @returns 队首元素或null（空队列时）
     */
    dequeue(): T | null;
    private siftUp;
    private siftDown;
    private swap;
    /**
     * 清空队列
     */
    clear(): void;
}
