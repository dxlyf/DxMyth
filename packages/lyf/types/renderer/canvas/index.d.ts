import { IRenderer } from '../../interface/IRenderer';
import { CanvasRendererOptions, CanvasRendererEventMap } from '../../interface/renderer/ICanvasRenderer';
import { EventEmitter } from '../../utils/EventEmitter';
export declare class CanvasRenderer extends EventEmitter<CanvasRendererEventMap> implements IRenderer {
    type: string;
    domElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: CanvasRendererOptions;
    constructor(options: CanvasRendererOptions);
    createDomElement(): void;
    setSize(width: number, height: number): void;
    dispose(): void;
}
