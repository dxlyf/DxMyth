/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
type Heap<T> = Array<T>;
declare function push<T>(heap: Heap<T>, node: T, compare: (a: T, b: T) => number): void;
declare function peek<T>(heap: Heap<T>): T | null;
declare function pop<T>(heap: Heap<T>, compare: (a: T, b: T) => number): T | null;
declare function createMinHeap<T>(heap: Heap<T>, compare: (a: T, b: T) => number): {
    readonly heap: Heap<T>;
    readonly length: number;
    readonly isEmpty: () => boolean;
    readonly forEachSorted: (callback: (node: T, index: number) => void) => void;
    readonly push: (node: T) => void;
    readonly peek: () => T;
    readonly pop: () => T;
};
export { createMinHeap, push, peek, pop, };
