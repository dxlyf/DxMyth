export declare class Node<T> {
    element: T;
    next?: Node<T> | undefined;
    constructor(element: T, next?: Node<T> | undefined);
}
export declare class DoublyNode<T> extends Node<T> {
    element: T;
    next?: DoublyNode<T> | undefined;
    prev?: DoublyNode<T> | undefined;
    constructor(element: T, next?: DoublyNode<T> | undefined, prev?: DoublyNode<T> | undefined);
}
