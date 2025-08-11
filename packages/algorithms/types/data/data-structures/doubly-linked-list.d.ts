import { IEqualsFunction } from '../util';
import { default as LinkedList } from './linked-list';
import { DoublyNode } from './models/linked-list-models';
export default class DoublyLinkedList<T> extends LinkedList<T> {
    protected equalsFn: IEqualsFunction<T>;
    protected head: DoublyNode<T> | undefined;
    protected tail: DoublyNode<T> | undefined;
    constructor(equalsFn?: IEqualsFunction<T>);
    push(element: T): void;
    insert(element: T, index: number): boolean;
    removeAt(index: number): T | undefined;
    indexOf(element: T): number;
    getHead(): DoublyNode<T> | undefined;
    getTail(): DoublyNode<T> | undefined;
    clear(): void;
    toString(): string;
    inverseToString(): string;
}
