import { RendererOptions, RendererEvents } from '../../../../../../../src/types/Renderer';
import { EventEmitter } from '../../../../../../../src/events';
import { BoundingRect } from '../../../../../../../src/math/BoundingRect';
export declare abstract class BaseRenderer<Options extends RendererOptions, E extends RendererEvents> extends EventEmitter<E> {
    options: Options;
    domElment: HTMLCanvasElement;
    dpr: number;
    width: number;
    height: number;
    viewport: BoundingRect;
    constructor(options: Options);
    get pixelWidth(): number;
    get pixelHeight(): number;
    setDpr(dpr: number): void;
    setViewport(x: number, y: number, width: number, height: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
}
