/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */
export declare class Node<K, V> {
    key: K;
    value: V | undefined;
    left: Node<K, V> | null;
    right: Node<K, V> | null;
    height: number | null;
    /**
     * Creates a new AVL Tree node.
     * @param key The key of the new node.
     * @param value The value of the new node.
     */
    constructor(key: K, value: V | undefined);
    /**
     * Performs a right rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.left is null.
     */
    rotateRight(): Node<K, V>;
    /**
     * Performs a left rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.right is null.
     */
    rotateLeft(): Node<K, V>;
    /**
     * Convenience function to get the height of the left child of the node,
     * returning -1 if the node is null.
     * @return The height of the left child, or -1 if it doesn't exist.
     */
    get leftHeight(): number;
    /**
     * Convenience function to get the height of the right child of the node,
     * returning -1 if the node is null.
     * @return The height of the right child, or -1 if it doesn't exist.
     */
    get rightHeight(): number;
}
