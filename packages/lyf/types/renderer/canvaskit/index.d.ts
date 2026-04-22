import { IRenderer } from '../../interface/IRenderer';
export declare class CanvasKitRenderer implements IRenderer {
    type: string;
    domElement: HTMLElement;
    constructor(options: any);
    dispose(): void;
}
