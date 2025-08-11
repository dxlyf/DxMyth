import { Node } from './node';
export declare enum Colors {
    RED = 0,
    BLACK = 1
}
export declare class RedBlackNode<K> extends Node<K> {
    key: K;
    left: RedBlackNode<K>;
    right: RedBlackNode<K>;
    parent: RedBlackNode<K>;
    color: Colors;
    constructor(key: K);
    isRed(): boolean;
}
