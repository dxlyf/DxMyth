type Listener = (element: Element, rect: DOMRect) => void;
export declare class ElementResizeObserver {
    element: HTMLElement;
    observer: ResizeObserver;
    listeners: Listener[];
    constructor(element: HTMLElement);
    subscribe(cb: Listener): () => void;
    observe(): void;
    unobserve(): void;
    dispose(): void;
}
export {};
