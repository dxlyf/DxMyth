import { ILyf } from '../interface/ILyf';
import { CanvasKit } from '../canvaskit';
declare module '../interface/ILyf' {
    interface ILyf {
        ck: CanvasKit.CanvasKit;
    }
}
declare module '../Lyf' {
    interface Lyf {
        ck: CanvasKit.CanvasKit;
    }
}
declare const _default: (lyf: ILyf) => void;
export default _default;
