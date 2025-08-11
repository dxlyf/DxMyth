export declare class Node<K> {
    key: K;
    left: Node<K>;
    right: Node<K>;
    constructor(key: K);
    toString(): string;
}
