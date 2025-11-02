import { Path2D } from 'skia-path2d';
import { BaseRenderer } from '../../../../../../../../../src/core/BaseRenderer';
import { BaseRendererOptions, RenderOptions } from '../../../../../../../../../src/types/core/BaseRenderer';
import { IPaint } from '../../../../../../../../../src/types/core/Paint';
export declare class WebglRenderer extends BaseRenderer<WebGL2RenderingContext> {
    renderMode: string;
    constructor(options: Partial<BaseRendererOptions>);
    initProgram(): void;
    createContext(): WebGL2RenderingContext;
    drawPath(path: Path2D): void;
    drawRect(x: number, y: number, w: number, h: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawPaint(paint: IPaint): void;
    applyPaint(paint: IPaint): void;
    render(renderOptions: RenderOptions): void;
}
