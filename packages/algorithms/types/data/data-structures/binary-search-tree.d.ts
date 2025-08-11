import { ICompareFunction } from '../util';
import { Node } from './models/node';
export default class BinarySearchTree<T> {
    protected compareFn: ICompareFunction<T>;
    protected root: Node<T>;
    constructor(compareFn?: ICompareFunction<T>);
    insert(key: T): void;
    protected insertNode(node: Node<T>, key: T): void;
    getRoot(): Node<T>;
    search(key: T): boolean;
    private searchNode;
    inOrderTraverse(callback: Function): void;
    private inOrderTraverseNode;
    preOrderTraverse(callback: Function): void;
    private preOrderTraverseNode;
    postOrderTraverse(callback: Function): void;
    private postOrderTraverseNode;
    min(): Node<T>;
    protected minNode(node: Node<T>): Node<T>;
    max(): Node<T>;
    protected maxNode(node: Node<T>): Node<T>;
    remove(key: T): void;
    protected removeNode(node: Node<T>, key: T): Node<T> | null;
}
