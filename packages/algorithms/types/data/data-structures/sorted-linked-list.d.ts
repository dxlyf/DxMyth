import { ICompareFunction, IEqualsFunction } from '../util';
import { default as LinkedList } from './linked-list';
export default class SortedLinkedList<T> extends LinkedList<T> {
    protected equalsFn: IEqualsFunction<T>;
    protected compareFn: ICompareFunction<T>;
    constructor(equalsFn?: IEqualsFunction<T>, compareFn?: ICompareFunction<T>);
    push(element: T): void;
    insert(element: T, index?: number): boolean;
    private getIndexNextSortedElement;
}
