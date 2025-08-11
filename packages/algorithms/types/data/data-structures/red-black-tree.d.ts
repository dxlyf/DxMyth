import { ICompareFunction } from '../util';
import { default as BinarySearchTree } from './binary-search-tree';
import { RedBlackNode } from './models/red-black-node';
export default class RedBlackTree<T> extends BinarySearchTree<T> {
    protected compareFn: ICompareFunction<T>;
    protected root: RedBlackNode<T>;
    constructor(compareFn?: ICompareFunction<T>);
    /**
     * Left left case: rotate right
     *
     *       b                           a
     *      / \                         / \
     *     a   e -> rotationLL(b) ->   c   b
     *    / \                             / \
     *   c   d                           d   e
     *
     * @param node Node<T>
     */
    private rotationLL;
    /**
     * Right right case: rotate left
     *
     *     a                              b
     *    / \                            / \
     *   c   b   -> rotationRR(a) ->    a   e
     *      / \                        / \
     *     d   e                      c   d
     *
     * @param node Node<T>
     */
    private rotationRR;
    insert(key: T): void;
    protected insertNode(node: RedBlackNode<T>, key: T): RedBlackNode<T>;
    private fixTreeProperties;
    getRoot(): RedBlackNode<T>;
}
