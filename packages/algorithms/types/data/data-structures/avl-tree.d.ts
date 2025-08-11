import { ICompareFunction } from '../util';
import { default as BinarySearchTree } from './binary-search-tree';
import { Node } from './models/node';
export default class AVLTree<T> extends BinarySearchTree<T> {
    protected compareFn: ICompareFunction<T>;
    constructor(compareFn?: ICompareFunction<T>);
    private getNodeHeight;
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
    /**
     * Left right case: rotate left then right
     * @param node Node<T>
     */
    private rotationLR;
    /**
     * Right left case: rotate right then left
     * @param node Node<T>
     */
    private rotationRL;
    private getBalanceFactor;
    insert(key: T): void;
    protected insertNode(node: Node<T>, key: T): Node<T>;
    protected removeNode(node: Node<T>, key: T): Node<T>;
}
