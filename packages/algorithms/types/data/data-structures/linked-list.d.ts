import { IEqualsFunction } from '../util';
import { Node } from './models/linked-list-models';
export default class LinkedList<T> {
    protected equalsFn: IEqualsFunction<T>;
    protected count: number;
    protected head: Node<T> | undefined;
    constructor(equalsFn?: IEqualsFunction<T>);
    push(element: T): void;
    getElementAt(index: number): Node<T> | undefined;
    insert(element: T, index: number): boolean;
    removeAt(index: number): T | undefined;
    remove(element: T): T | undefined;
    indexOf(element: T): number;
    isEmpty(): boolean;
    size(): number;
    getHead(): Node<T> | undefined;
    clear(): void;
    toString(): string;
}
