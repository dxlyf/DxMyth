type ElementResizeOptions = {
    element: Element;
    resizeTo?: ResizeTo;
    enableWindowResize?: boolean;
    enableElementResize?: boolean;
    debounceDelay?: number;
    onResize: (width: number, height: number) => void;
};
declare const useElementResize: (options: ElementResizeOptions) => () => void;
export { useElementResize };
