export type CanvasRendererOptions = {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    dpr?: number;
    resizeTo?: ResizeTo;
};
export declare const CANVAS_RENDERER_EVENTS: {
    readonly RESIZE: "resize";
    readonly DISPOSE: "dispose";
};
export type CanvasRendererEventMap = {
    [CANVAS_RENDERER_EVENTS.RESIZE]: [width: number, height: number];
    [CANVAS_RENDERER_EVENTS.DISPOSE]: [];
};
