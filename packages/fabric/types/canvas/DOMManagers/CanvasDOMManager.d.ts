import { TSize } from '../../typedefs';
import { CSSDimensions } from './util';
import { CanvasItem, StaticCanvasDOMManager } from './StaticCanvasDOMManager';
export declare class CanvasDOMManager extends StaticCanvasDOMManager {
    upper: CanvasItem;
    container: HTMLDivElement;
    constructor(arg0?: string | HTMLCanvasElement, { allowTouchScrolling, containerClass, }?: {
        allowTouchScrolling?: boolean;
        /**
         * @deprecated here only for backward compatibility
         */
        containerClass?: string;
    });
    protected createUpperCanvas(): HTMLCanvasElement;
    protected createContainerElement(): HTMLDivElement;
    /**
     * @private
     * @param {HTMLCanvasElement} element canvas element to apply styles on
     */
    protected applyCanvasStyle(element: HTMLCanvasElement, options: {
        allowTouchScrolling?: boolean;
        styles?: Record<string, string>;
    }): void;
    setDimensions(size: TSize, retinaScaling: number): void;
    setCSSDimensions(size: Partial<CSSDimensions>): void;
    cleanupDOM(size: TSize): void;
    dispose(): void;
}
