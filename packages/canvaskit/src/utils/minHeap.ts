/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

type Heap<T> = Array<T>;
function push<T>(heap: Heap<T>, node: T,compare: (a: T, b: T) => number): void {
    const index = heap.length;
    heap.push(node);
    siftUp(heap, node, index,compare);
}

function peek<T>(heap: Heap<T>): T | null {
    return heap.length === 0 ? null : heap[0];
}

function pop<T>(heap: Heap<T>,compare: (a: T, b: T) => number): T | null {
    if (heap.length === 0) {
        return null;
    }
    const first = heap[0];
    const last = heap.pop();
    if (last !== first) {
        // $FlowFixMe[incompatible-type]
        heap[0] = last;
        // $FlowFixMe[incompatible-call]
        siftDown(heap, last, 0,compare);
    }
    return first;
}

function siftUp<T>(heap: Heap<T>, node: T, i: number,compare: (a: T, b: T) => number): void {
    let index = i;
    while (index > 0) {
        const parentIndex = (index - 1) >>> 1;
        const parent = heap[parentIndex];
        if (compare(parent, node) > 0) {
            // The parent is larger. Swap positions.
            heap[parentIndex] = node;
            heap[index] = parent;
            index = parentIndex;
        } else {
            // The parent is smaller. Exit.
            return;
        }
    }
}

function siftDown<T>(heap: Heap<T>, node: T, i: number,compare: (a: T, b: T) => number): void {
    let index = i;
    const length = heap.length;
    const halfLength = length >>> 1;
    while (index < halfLength) {
        const leftIndex = (index + 1) * 2 - 1;
        const left = heap[leftIndex];
        const rightIndex = leftIndex + 1;
        const right = heap[rightIndex];

        // If the left or right node is smaller, swap with the smaller of those.
        if (compare(left, node) < 0) {
            if (rightIndex < length && compare(right, left) < 0) {
                heap[index] = right;
                heap[rightIndex] = node;
                index = rightIndex;
            } else {
                heap[index] = left;
                heap[leftIndex] = node;
                index = leftIndex;
            }
        } else if (rightIndex < length && compare(right, node) < 0) {
            heap[index] = right;
            heap[rightIndex] = node;
            index = rightIndex;
        } else {
            // Neither child is smaller. Exit.
            return;
        }
    }
}

function createMinHeap<T>(heap: Heap<T>, compare: (a: T, b: T) => number) {
    return {
        heap,
        get length(){
            return heap.length
        },
        isEmpty:()=>heap.length===0,
        forEachSorted: (callback: (node: T, index: number) => void) => {
            const newHeap = [...heap]
            let index=0
            while(newHeap.length){
                const node = pop(newHeap,compare)
                if(node){
                    callback(node,index++)
                }
            }
        },
        push: (node: T) => push<T>(heap, node,compare),
        peek: () => peek<T>(heap),
        pop: () => pop<T>(heap,compare),
    } as const
}
export {
    createMinHeap,
    push,
    peek,
    pop,
}