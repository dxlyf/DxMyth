declare function observerElementSize(element: HTMLElement, callback: (width: number, height: number) => void): () => void;
type NamespaceURI = 'http://www.w3.org/1999/xhtml' | 'http://www.w3.org/2000/svg';
declare function createElementNS<T extends Element>(namespaceURI: NamespaceURI, qualifiedName: string): T;
export { observerElementSize, createElementNS };
