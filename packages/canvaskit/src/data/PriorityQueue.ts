type Comparator<T> = (a: T, b: T) => number;

export class PriorityQueue<T> {
    private heap: T[] = [];
    private compare: Comparator<T>;

    constructor(compare?: Comparator<T>) {
        // 默认最小堆
        this.compare = compare || ((a, b) => (a as any) - (b as any));
    }

    size(): number {
        return this.heap.length;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    peek(): T | undefined {
        return this.heap[0];
    }

    push(value: T): void {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;

        const top = this.heap[0];
        const last = this.heap.pop()!;

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }

        return top;
    }

    private heapifyUp(index: number): void {
        let i = index;

        while (i > 0) {
            const parent = (i - 1) >> 1;

            if (this.compare(this.heap[i], this.heap[parent]) >= 0) break;

            this.swap(i, parent);
            i = parent;
        }
    }

    private heapifyDown(index: number): void {
        let i = index;
        const n = this.heap.length;

        while (true) {
            const left = i * 2 + 1;
            const right = i * 2 + 2;

            let smallest = i;

            if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
                smallest = left;
            }
            if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
                smallest = right;
            }

            if (smallest === i) break;

            this.swap(i, smallest);
            i = smallest;
        }
    }

    private swap(i: number, j: number): void {
        const tmp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = tmp;
    }
    clear(): void {
        this.heap.length = 0;
    }
    toSortedArray(): T[] {
        const copy = [...this.heap];
        const tmp = new PriorityQueue<T>(this.compare);
        tmp.heap = copy;
        const result: T[] = [];
        while (!tmp.isEmpty()) {
            result.push(tmp.pop()!);
        }
        return result;
    }
    forEachSorted(fn: (item: T, index: number) => void) {
        const copy = [...this.heap];
        const tmp = new PriorityQueue<T>(this.compare);
        tmp.heap = copy;
        let index = 0
        while (!tmp.isEmpty()) {
            fn(tmp.pop()!, index++);
        }
    }

}
