import { CanvasKit } from './export';
export type * as CanvasKit from 'canvaskit-wasm';
declare const _default: {
    getCanvasKit: () => Promise<CanvasKit>;
    readonly ck: CanvasKit;
};
export default _default;
