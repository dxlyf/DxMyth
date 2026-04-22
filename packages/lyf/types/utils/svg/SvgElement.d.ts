export declare class SvgElement {
    element: SVGElement;
    constructor(tagName: string);
    get children(): HTMLCollection;
    get childrenArray(): SVGElement[];
    addChild(child: SVGElement): void;
    removeChild(child: SVGElement): void;
    removeAllChildren(): void;
    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string;
    removeAttribute(name: string): void;
    use(href: string): void;
    useMask(href: string): void;
    remove(): void;
}
