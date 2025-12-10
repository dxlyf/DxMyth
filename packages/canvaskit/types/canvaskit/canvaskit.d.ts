import { CanvasKit as CanvasKitImp } from 'canvaskit-wasm';
export type * as CanvasKit from 'canvaskit-wasm';
export declare let CK: CanvasKitImp | null;
export declare const getCanvasKit: () => Promise<CanvasKitImp>;
