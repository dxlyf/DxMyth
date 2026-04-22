import { IRenderer } from '../../interface/IRenderer';
import { SvgRendererOptions, SvgRendererEventMap } from '../../interface/renderer/ISvgRenderer';
import { EventEmitter } from '../../utils/EventEmitter';
export declare class SvgRenderer extends EventEmitter<SvgRendererEventMap> implements IRenderer {
    type: string;
    domElement: SVGElement;
    options: SvgRendererOptions;
    constructor(options: SvgRendererOptions);
    createDomElement(): void;
    setSize(width: number, height: number): void;
    dispose(): void;
}
