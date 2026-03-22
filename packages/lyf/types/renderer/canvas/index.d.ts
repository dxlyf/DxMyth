import { IRenderer } from '../../interface/IRenderer';
export type CanvasRendererOptions = {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    dpr?: number;
};
export declare class CanvasRenderer implements IRenderer {
    type: string;
    domElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(options: CanvasRendererOptions);
}
