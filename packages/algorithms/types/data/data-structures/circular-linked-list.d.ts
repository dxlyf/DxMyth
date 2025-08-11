import { IEqualsFunction } from '../util';
import { default as LinkedList } from './linked-list';
export default class CircularLinkedList<T> extends LinkedList<T> {
    protected equalsFn: IEqualsFunction<T>;
    constructor(equalsFn?: IEqualsFunction<T>);
    push(element: T): void;
    insert(element: T, index: number): boolean;
    removeAt(index: number): T | undefined;
}
