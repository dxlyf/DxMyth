export type SvgRendererOptions = {
    canvas: SVGElement;
    width?: number;
    height?: number;
    dpr?: number;
    resizeTo?: ResizeTo;
};
export declare const SVG_RENDERER_EVENTS: {
    readonly RESIZE: "resize";
    readonly DISPOSE: "dispose";
};
export type SvgRendererEventMap = {
    [SVG_RENDERER_EVENTS.RESIZE]: [width: number, height: number];
    [SVG_RENDERER_EVENTS.DISPOSE]: [];
};
