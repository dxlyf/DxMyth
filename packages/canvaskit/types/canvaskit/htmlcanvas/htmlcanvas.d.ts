import { CanvasKit } from '../canvaskit';
import { CanvasRenderingContext2D } from './canvas2dcontext';
import { HTMLImage } from './htmlimage';
import { Path2D } from './path2d';
export declare const MakeCanvas: (width: number, height: number) => HTMLCanvas;
declare class HTMLCanvas {
    _surface: CanvasKit.Surface;
    _context: CanvasRenderingContext2D;
    _toCleanup: any[];
    constructor(skSurface: CanvasKit.Surface);
    decodeImage(data: any): HTMLImage;
    loadFont(buffer: any, descriptors: any): any;
    makePath2D(path: any): Path2D;
    getContext(type: string): CanvasRenderingContext2D;
    toDataURL(codec: any, quality: number): string;
    dispose(): void;
}
export {};
