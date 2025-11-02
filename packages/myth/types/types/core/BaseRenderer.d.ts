import { Path2D } from 'skia-path2d';
import { IViewport } from './Viewport';
import { ColorValue } from '../../../../../../../../../src/image/Color';
import { IPaint, RenderObject } from './Paint';
import { EventEmitter } from '../../../../../../../../../src/events';
export interface BaseRendererOptions {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    dpr?: number;
    backgroundColor?: ColorValue;
}
export interface IBaseRenderer<Context = any> extends EventEmitter<BaseRendereEvents>, Renderer2DContext {
    ctx: Context;
    viewport: IViewport;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(renderOptions: RenderOptions): void;
}
export interface RenderOptions {
    renderObjects: RenderObject[];
}
export type BaseRendereEvents = {
    resize: [width: number, height: number];
};
export interface Renderer2DContext {
    canvas: HTMLCanvasElement;
    renderMode: string;
    width: number;
    height: number;
    dpr: number;
    readonly pixelWidth: number;
    readonly pixelHeight: number;
    drawRect(x: number, y: number, w: number, h: number): void;
    drawCircle(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw: boolean): void;
    drawEllipse(x: number, y: number, rx: number, ry: number, xRotation: number, startAngle: number, endAngle: number, ccw: boolean): void;
    drawPath(path: Path2D): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawPaint(paint: IPaint): void;
    applyPaint(paint: IPaint): void;
}
